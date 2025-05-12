---
title: String
description: Basic String data type.
---

## String 数据类型

在 Databend 中，字符串可以存储在 `VARCHAR` 字段中，存储大小是可变的。

| 名称    | 别名  | 存储大小 |
|---------|---------|--------------|
| VARCHAR | STRING  | variable     |

## 函数

请参考 [字符串函数](/sql/sql-functions/string-functions)。


## 示例

```sql
CREATE TABLE string_table(text VARCHAR);
```

```
DESC string_table;
```
结果：
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
结果：
```
┌──────────────────┐
│       text       │
├──────────────────┤
│ databend         │
└──────────────────┘
```