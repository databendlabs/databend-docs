---
title: Masking Policy
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.956"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

Masking policies transform column values at query time. Authorized roles see real data; others see redacted values. Stored data never changes.

To hide entire rows instead of redacting columns, use a [Row Access Policy](/guides/security/data-protection/row-access-policy).

## When to Use

- Customer support — agents see orders, IDs show as `3201**********1234`
- Analytics — email shows as `***@***.com` without breaking aggregates
- VARIANT logs — hide JSON keys like `secret_key` / `token` from non-admins
- Partial redaction — show last 4 digits of a card for verification

## Quick Start

```sql
CREATE TABLE user_info (id INT, email STRING NOT NULL);

CREATE MASKING POLICY email_mask
AS (val STRING)
RETURNS STRING ->
CASE
  WHEN is_role_in_session('managers') THEN val
  ELSE '*********'
END;

ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

INSERT INTO user_info VALUES (1, 'user@example.com');
SELECT * FROM user_info;
```

```
id | email
---|----------
 1 | *********
```

**How it works**

- Query-time only — `SELECT` is masked; `INSERT` / `UPDATE` / `DELETE` use true values
- Column-scoped — one policy per column; reusable across tables
- Prefer `is_role_in_session()` over `current_role()` so users cannot bypass with `SET ROLE`

## Examples

### Conditional masking (`USING`)

Mask based on another column:

```sql
CREATE MASKING POLICY vip_mask
AS (val STRING, is_vip BOOLEAN)
RETURNS STRING ->
CASE
  WHEN is_vip = true THEN val
  ELSE '*********'
END;

ALTER TABLE user_info
MODIFY COLUMN email SET MASKING POLICY vip_mask USING (email, is_vip);

INSERT INTO user_info (id, email, is_vip) VALUES
  (1, 'vip@example.com', true),
  (2, 'normal@example.com', false);

SELECT * FROM user_info;
```

```
id | email           | is_vip
---|-----------------|-------
 1 | vip@example.com | true
 2 | *********       | false
```

Only add columns to `USING` when the policy body needs them.

### VARIANT sub-field masking

Hide specific JSON keys with `object_delete`. All access paths honor the mask (subscript, path functions, cast, `json_object_keys`).

```sql
CREATE TABLE events (id INT, data VARIANT);

INSERT INTO events VALUES
  (1, parse_json('{"name":"alice","content":"secret data","secret_key":"sk_123","age":30}')),
  (2, parse_json('{"name":"bob","content":"private info","secret_key":"sk_456","age":25}'));

CREATE ROLE data_admin;
CREATE ROLE data_reader;

CREATE MASKING POLICY mask_variant_sensitive
AS (val VARIANT) RETURNS VARIANT ->
CASE
  WHEN is_role_in_session('data_admin') OR is_role_in_session('account_admin') THEN val
  ELSE object_delete(val, 'content', 'secret_key')
END;

ALTER TABLE events MODIFY COLUMN data SET MASKING POLICY mask_variant_sensitive;

GRANT SELECT ON default.events TO ROLE data_admin;
GRANT SELECT ON default.events TO ROLE data_reader;
```

| As `data_admin` | As `data_reader` |
|-----------------|------------------|
| full JSON | `content` / `secret_key` removed |

```sql
SET ROLE data_reader;

SELECT data FROM events;
-- {"age":30,"name":"alice"}

SELECT data['content'] FROM events;                 -- NULL
SELECT data['name'] FROM events;                    -- "alice"
SELECT json_path_query_first(data, '$.content');    -- NULL
SELECT data::STRING FROM events;                    -- {"age":30,"name":"alice"}
SELECT json_object_keys(data) FROM events;          -- ["age","name"]
SELECT * FROM events WHERE data['content'] IS NOT NULL;
-- empty
```

Nested keys:

```sql
ELSE delete_by_keypath(val, 'nested:secret')
```

## Filter on Original Values in SELECT WHERE

Since v1.2.956, a column's masking-policy binding can allow `SELECT WHERE` to use original values. The result still shows masked values. The option is `where_use_unmasked_value`, and its default is `false`.

:::caution[This option exposes information about original values]
This is a persistent authorization on the column binding, not a session setting or a per-role bypass. Every reader of that binding can test original values in an eligible `SELECT WHERE`. Row counts and matching row IDs can reveal sensitive information. Enable it only when that disclosure is acceptable.
:::

The following example removes `secret` from the returned JSON. Filtering on that key first returns no rows. After enabling the option, the filter finds a row, but the selected key remains `NULL`.

```sql
CREATE TABLE mask_lookup (id INT, data VARIANT);

INSERT INTO mask_lookup VALUES
  (1, parse_json('{"secret":"alice","public":1}')),
  (2, parse_json('{"secret":"bob","public":2}'));

CREATE MASKING POLICY lookup_mask
AS (val VARIANT) RETURNS VARIANT -> object_delete(val, 'secret');

ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask;

SELECT count(*) FROM mask_lookup WHERE data['secret']::STRING = 'alice';
-- 0

ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask
OPTIONS (where_use_unmasked_value = true);

SELECT id, data['secret']::STRING, data['public']::INT
FROM mask_lookup
WHERE data['secret']::STRING = 'alice';
-- 1 | NULL | 1
```

### Scope and Reset

- The exception applies to authorized base-column references in the current `SELECT WHERE`. It also applies to SELECT-list aliases that resolve to those references.
- The SELECT list, `JOIN ON`, `GROUP BY`, `HAVING`, and `ORDER BY` keep masked values. An outer WHERE over a subquery or CTE's masked output does not recover the original value.
- The option belongs to one column binding. Other columns using the same policy do not inherit it.
- To change only this option, repeat `SET MASKING POLICY` with the same policy. Keep the same `USING` columns, if any. Put `OPTIONS` after `USING`. To replace the policy or its argument columns, first use `UNSET MASKING POLICY`.
- Setting the option to `false`, repeating `SET MASKING POLICY` without `OPTIONS`, or unsetting the policy clears this authorization.
- Changing the option requires the same table and policy privileges as attaching the policy. It does not grant additional write privileges.

```sql
ALTER TABLE mask_lookup MODIFY COLUMN data SET MASKING POLICY lookup_mask
OPTIONS (where_use_unmasked_value = false);

SELECT count(*) FROM mask_lookup WHERE data['secret']::STRING = 'alice';
-- 0
```

### Mixed-Version Deployments

Older query nodes ignore this metadata and use masked WHERE values. If an older node rewrites the table metadata, it can remove the option. After an upgrade or downgrade, verify the binding before relying on original-value filtering. Do not assume consistent filter results across nodes that do not all support this option.

## Read / Write Behavior

| Operation | Effect |
|-----------|--------|
| `SELECT` | Masked values, except authorized original-value filtering in `WHERE` |
| `INSERT` / `UPDATE` / `DELETE` | True values (writes are not masked) |

```sql
INSERT INTO user_info VALUES (2, 'admin@example.com');  -- stores real email
SELECT * FROM user_info WHERE id = 2;                   -- returns *********
```

## Manage Policies

```sql
DESCRIBE MASKING POLICY email_mask;

ALTER TABLE user_info MODIFY COLUMN email UNSET MASKING POLICY;
DROP MASKING POLICY IF EXISTS email_mask;
```

Unbind every column before `DROP MASKING POLICY`. Find bindings with `POLICY_REFERENCES(POLICY_NAME => 'email_mask')`.

## Masking vs Row Access

| | Masking Policy | Row Access Policy |
|---|---|---|
| Scope | Column values | Entire rows |
| Return type | Must match column type | Always BOOLEAN |
| Per table | One per column | One per table |
| Affects | `SELECT` | `SELECT`, `UPDATE`, `DELETE`, `MERGE` |

A column cannot have both policies at once. Mask when the row should stay visible; use row access when the row should disappear.

## Limits

- One masking policy per column
- Return type must match the column type
- Unset policy before altering or dropping the column
- Cannot drop a policy still referenced by any table
- No `CREATE OR REPLACE MASKING POLICY` — drop and recreate
- Not supported on temporary tables, views, or streams
- Policy names are globally unique across masking and row access policies
- Policy argument names are lowercased at create time

## Best Practices

1. Prefer `is_role_in_session()` over `current_role()`.
2. Keep `USING` minimal — only columns the body needs.
3. Return type-consistent placeholders (`***@***.com` for emails) if apps call `LENGTH` / `LIKE`.
4. For VARIANT, use `object_delete` / `delete_by_keypath` instead of masking the whole value.
5. Unbind before drop; verify with a restricted role after attach.

## Privileges & References

- `CREATE MASKING POLICY` on `*.*` to create policies (creator gets OWNERSHIP)
- Global `APPLY MASKING POLICY` or `APPLY ON MASKING POLICY <name>` to attach/detach
- Audit: `SHOW GRANTS ON MASKING POLICY <name>`

Also see:

- [User & Role](/sql/sql-commands/ddl/user)
- [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#column-operations)
- [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy)
- [Row Access Policy](/guides/security/data-protection/row-access-policy)
