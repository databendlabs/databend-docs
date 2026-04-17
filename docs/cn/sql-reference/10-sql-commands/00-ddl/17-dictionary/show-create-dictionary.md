---
title: SHOW CREATE DICTIONARY
sidebar_position: 1
---

显示用于创建字典的 SQL 语句。

## 语法

```sql
SHOW CREATE DICTIONARY [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `<dictionary_name>` | 字典名称。可以带上 catalog 和 database 限定。 |

## 输出

结果会返回字典名称以及重建后的 `CREATE DICTIONARY` 语句。

像 `password` 这样的敏感 source 选项会在返回的 SQL 中被掩盖。

## 示例

```sql
SHOW CREATE DICTIONARY user_info;
```
