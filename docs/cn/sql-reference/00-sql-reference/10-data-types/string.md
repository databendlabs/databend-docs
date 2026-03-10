---
title: String
description: 基本字符串数据类型。
sidebar_position: 3
---

## 字符串类型

在 Databend 中，字符串存储在 `VARCHAR` 字段中，其存储大小是可变的。

| 名称    | 别名   | 存储大小 |
|---------|--------|----------|
| VARCHAR | STRING | 可变     |

## 函数

请参阅 [String Functions](/sql/sql-functions/string-functions)。

## 示例

```sql
CREATE TABLE string_table(text VARCHAR);
```

```sql
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

```sql
SELECT * FROM string_table;
```

结果：
```
┌──────────────────┐
│       text       │
├──────────────────┤
└──────────────────┘
```
