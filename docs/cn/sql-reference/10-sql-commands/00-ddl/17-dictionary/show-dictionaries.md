---
title: SHOW DICTIONARIES
sidebar_position: 1
---

列出当前数据库或指定数据库中的字典。

## 语法

```sql
SHOW DICTIONARIES [ FROM <database_name> | IN <database_name> ]
    [ LIMIT <limit> ]
    [ LIKE '<pattern>' | WHERE <expr> ]
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `FROM <database_name>` / `IN <database_name>` | 可选。列出指定数据库中的字典。 |
| `LIMIT <limit>` | 可选。限制返回的行数。 |
| `LIKE '<pattern>'` | 可选。按模式过滤字典名称。 |
| `WHERE <expr>` | 可选。使用表达式过滤结果集。 |

## 示例

```sql
SHOW DICTIONARIES;
```

```sql
SHOW DICTIONARIES FROM default LIKE 'user%';
```
