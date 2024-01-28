---
title: 字符串
description: 基本字符串数据类型。
---

## 字符串数据类型

在 Databend 中，字符串可以存储在 `VARCHAR` 字段中，存储大小是可变的。

| 名称    | 别名    | 存储大小 |
|---------|---------|----------|
| VARCHAR | STRING  | 可变     |

## 函数

参见 [字符串函数](/sql/sql-functions/string-functions)。


## 示例

```sql
CREATE TABLE string_table(text VARCHAR);
```

```
DESC string_table;
```
结果:
```
┌──────────────────────────────────────────────┐
│  字段 │   类型  │  空值  │ 默认值 │  额外信息 │
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
结果:
```
┌──────────────────┐
│       text       │
├──────────────────┤
│ databend         │
└──────────────────┘
```