---
title: LIKE
---

Checks whether a string matches an SQL pattern. The comparison is case-sensitive and must cover the whole string. Returns `true` on a match, `false` otherwise. Use `ILIKE` for case-insensitive matching and [REGEXP](regexp.md) for regular expressions.

## Syntax

```sql
<expr> [ NOT ] LIKE <pattern> [ ESCAPE <escape> ]

<expr> [ NOT ] ILIKE <pattern> [ ESCAPE <escape> ]

<expr> LIKE ANY ( <pattern> [ , <pattern> ... ] ) [ ESCAPE <escape> ]
```

`NOT LIKE ANY` is not supported. To negate the result, write `NOT ( <expr> LIKE ANY ( ... ) )`.

| Argument    | Description |
|-------------|-------------|
| `<expr>`    | The string to test. |
| `<pattern>` | The SQL pattern. `%` and `_` are wildcards; every other character matches itself. |
| `<escape>`  | Optional. A single character placed before `%`, `_`, or itself in `<pattern>` to match that character literally. Defaults to backslash (`\`). |

## Return Value

`BOOLEAN`. `NULL` if `<expr>` or `<pattern>` is `NULL`.

| Form       | Returns `true` when |
|------------|---------------------|
| `LIKE`     | the string matches the pattern. |
| `NOT LIKE` | the string does not match the pattern. |
| `ILIKE`    | the string matches the pattern ignoring case. |
| `LIKE ANY` | the string matches at least one of the patterns. |

## Pattern Rules

### Wildcards

| Wildcard | Matches |
|----------|---------|
| `%`      | Zero or more characters of any kind, including newlines. |
| `_`      | Exactly one character of any kind. |

The pattern is anchored at both ends. `'db%'` matches `db01` but not `mydb01`; to find a substring anywhere, wrap it in `%`:

```sql
SELECT 'mydb01' LIKE 'db%', 'mydb01' LIKE '%db%';
-- false, true
```

### Default escape character

To match `%` or `_` as ordinary characters, prefix them with the escape character. The default is backslash (`\`).

Backslash is also the escape character inside SQL string literals, so it has to be doubled in the literal. The table below shows the SQL you type, the pattern the server receives, and what it matches:

| SQL literal  | Pattern  | Matches |
|--------------|----------|---------|
| `'50%'`      | `50%`    | Anything starting with `50`: `50% off`, `500 items`, ... |
| `'50\\%%'`   | `50\%%`  | Anything starting with `50%`. |
| `'db\\_01'`  | `db\_01` | Only `db_01`. |
| `'D:\\\\%'`  | `D:\\%`  | Anything starting with `D:\`. |

Only `%`, `_`, and `\` have a meaning after the escape character; other characters never need escaping.

### Custom escape character

`ESCAPE <escape>` replaces the default escape character for that comparison:

- `<escape>` followed by `%` or `_` matches that character literally.
- `<escape>` followed by `<escape>` matches the escape character itself.
- Backslash becomes an ordinary character. `'D:\\%' ESCAPE '#'` is the pattern `D:\%`, where `\` is matched literally.

```sql
SELECT '50%'   LIKE '50#%'  ESCAPE '#',  -- true
       '#'     LIKE '##'    ESCAPE '#',  -- true
       'a\\b'  LIKE 'a\\b'  ESCAPE '#';  -- true
```

If `<escape>` is longer than one character, only its first character is used.

### NULL

`NULL` on either side yields `NULL`, so `NULL` never matches, not even `NULL LIKE NULL`. Rows with a `NULL` value are excluded by both `LIKE` and `NOT LIKE` in a `WHERE` clause.

```sql
SELECT NULL LIKE 'a%', 'abc' LIKE NULL;
-- NULL, NULL
```

## Examples

```sql
CREATE OR REPLACE TABLE tags(tag VARCHAR);
INSERT INTO tags VALUES
  ('db_01'), ('db-01'), ('dbx01'), ('db01'),
  ('50% off'), ('500 items'),
  ('D:\\logs'), ('Daily'),
  (''), (NULL);
```

### Prefix match and its negation

```sql
SELECT tag FROM tags WHERE tag LIKE 'db%' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db-01 │
│ db01  │
│ db_01 │
│ dbx01 │
╰───────╯

SELECT tag FROM tags WHERE tag NOT LIKE 'db%' ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│           │
│ 50% off   │
│ 500 items │
│ D:\logs   │
│ Daily     │
╰───────────╯
```

The empty string is returned by `NOT LIKE`; the `NULL` row is returned by neither query.

### Single-character wildcard

`_` matches any one character, so `db_01` also matches `db-01` and `dbx01`:

```sql
SELECT tag FROM tags WHERE tag LIKE 'db_01' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db-01 │
│ db_01 │
│ dbx01 │
╰───────╯
```

### Escaping `%` and `_`

Unescaped, `50%` matches every string starting with `50`:

```sql
SELECT tag FROM tags WHERE tag LIKE '50%' ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│ 50% off   │
│ 500 items │
╰───────────╯
```

Escaped, only a literal percent sign matches:

```sql
SELECT tag FROM tags WHERE tag LIKE '50\\%%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ 50% off │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE 'db\\_01' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db_01 │
╰───────╯
```

### Matching a backslash

A literal backslash is escaped with another backslash, which means four backslashes in the SQL literal:

```sql
SELECT tag FROM tags WHERE tag LIKE 'D:\\\\%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
╰─────────╯
```

### ESCAPE clause

```sql
SELECT tag FROM tags WHERE tag LIKE '50#%%' ESCAPE '#' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ 50% off │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE 'db#_01' ESCAPE '#' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db_01 │
╰───────╯
```

With a custom escape character the backslash is ordinary, so one `\\` in the literal is enough:

```sql
SELECT tag FROM tags WHERE tag LIKE 'D:\\%' ESCAPE '#' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
╰─────────╯
```

### ILIKE and LIKE ANY

```sql
SELECT tag FROM tags WHERE tag ILIKE 'd%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
│ Daily   │
│ db-01   │
│ db01    │
│ db_01   │
│ dbx01   │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE ANY ('db-%', '%items') ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│ 500 items │
│ db-01     │
╰───────────╯
```

## See Also

- [NOT LIKE](not-like.md)
- [REGEXP](regexp.md)
- [REGEXP_LIKE](regexp-like.md)
