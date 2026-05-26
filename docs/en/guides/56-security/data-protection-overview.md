---
title: Data Protection Policies
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='DATA PROTECTION POLICIES'/>

Databend provides two complementary policy types that protect sensitive data without changing stored values:

- **Masking Policy** — transforms column values at query time so unauthorized users see redacted data.
- **Row Access Policy** — filters entire rows at query time so unauthorized users never see them.

Both policies are transparent to applications: no code changes, no extra views, no data duplication.

## Choosing the Right Policy

Consider an `orders` table with customer phone numbers, order amounts, and regions. Three roles query it:

- **Support agents** need phone numbers (to contact customers) but should only see orders in their own region.
- **Analysts** need all regions for reporting but phone numbers must be redacted.
- **Admins** see everything.

This single requirement splits into two policies:

| Requirement | Policy Type |
|---|---|
| Support agents only see their region's rows | Row Access Policy |
| Analysts see `138****1234` instead of real phone numbers | Masking Policy |

## When to Use Each

| Scenario | Use |
|----------|-----|
| Users should not see certain rows at all | Row Access Policy |
| All users see the row, but a sensitive column is redacted | Masking Policy |
| Different roles see different precision of the same column | Masking Policy |
| Multi-tenant isolation — tenants only see their own data | Row Access Policy |
| Restrict queryable time range by role | Row Access Policy |
| Hide specific keys inside a JSON/VARIANT column | Masking Policy |
| Row-level isolation + column-level redaction together | Both (but the same column cannot have both) |

## How They Work Together

```
Query
  → Row Access Policy filters rows (rows that fail the predicate disappear)
  → Masking Policy transforms column values (sensitive fields are replaced)
  → Result returned to user
```

Row filtering happens first. Masking applies only to the surviving rows.

## Quick Comparison

| | Masking Policy | Row Access Policy |
|---|---|---|
| Protection granularity | Column (values replaced) | Row (entire row hidden) |
| Return type | Must match column type | Always BOOLEAN |
| Limit per table | One policy per column | One policy per table |
| Affected operations | SELECT | SELECT, UPDATE, DELETE, MERGE |
| Stored data changed? | No | No |
| INSERT affected? | No | No |

## Combining Both Policies

You can attach a masking policy to one column and a row access policy to the same table — they compose naturally. The only constraint is that a single column cannot be referenced in both a masking policy binding and a row access policy binding simultaneously.

**Example**: a `customers` table where:
- Row access policy on `region` ensures each sales rep only sees their territory
- Masking policy on `ssn` ensures non-HR roles see `***-**-****`

```sql
-- Row-level: filter by region
CREATE ROW ACCESS POLICY rap_region
AS (r STRING) RETURNS BOOLEAN ->
  CASE
    WHEN is_role_in_session('admin') THEN true
    ELSE is_role_in_session(r)
  END;

ALTER TABLE customers ADD ROW ACCESS POLICY rap_region ON (region);

-- Column-level: mask SSN
CREATE MASKING POLICY mask_ssn
AS (val STRING) RETURNS STRING ->
  CASE
    WHEN is_role_in_session('hr') THEN val
    ELSE '***-**-****'
  END;

ALTER TABLE customers MODIFY COLUMN ssn SET MASKING POLICY mask_ssn;
```

## Next Steps

- [Masking Policy](/guides/security/masking-policy) — full syntax, conditional masking, VARIANT sub-field masking
- [Row Access Policy](/guides/security/row-access-policy) — full syntax, DML behavior, multi-argument policies, time-range examples
