---
title: String
description: Basic String data type.
---

## String Data Types

在 Databend 中，字符串可以存储在 `VARCHAR` 字段中，存储大小是可变的。

| Name    | Aliases | Storage Size |
|---------|---------|--------------|
| VARCHAR | STRING  | variable     |

## Functions

请参考 [String Functions](/sql/sql-functions/string-functions)。


## Example

```sql
CREATE TABLE string_table(text VARCHAR);
```

```
DESC string_table;
```
Result:
```
┌──────────────────────────────────────────────┐
│  Field │   Type  │  Null  │ Default │  Extra │
├────────┼─────────┼────────┼─────────┼────────┤
│ text   │ VARCHAR │ YES    │ NULL    │        │
└──────────────────────────────────────────────┘
```

```sql
INSERT INTO string_table VALUES('databend');
```

```
SELECT * FROM string_table;
```
Result:
```
┌──────────────────┐
│       text       │
├──────────────────┤
│ databend         │
└──────────────────┘
```