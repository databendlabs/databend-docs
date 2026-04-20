---
title: DROP DICTIONARY
sidebar_position: 2
---

删除一个字典。

## 语法

```sql
DROP DICTIONARY [ IF EXISTS ] [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `IF EXISTS` | 可选。如果字典不存在，则忽略错误。 |
| `<dictionary_name>` | 字典名称。可以带上 catalog 和 database 限定。 |

## 示例

```sql
DROP DICTIONARY user_info;
```

```sql
DROP DICTIONARY IF EXISTS default.user_info;
```
