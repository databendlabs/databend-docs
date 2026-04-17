---
title: RENAME DICTIONARY
sidebar_position: 1
---

重命名一个字典。

## 语法

```sql
RENAME DICTIONARY [ IF EXISTS ]
    [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
    TO [ <new_catalog_name>. ][ <new_database_name>. ]<new_dictionary_name>
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `IF EXISTS` | 可选。如果源字典不存在，则忽略错误。 |
| `<dictionary_name>` | 当前字典名称。 |
| `<new_dictionary_name>` | 新的字典名称。 |

## 示例

```sql
RENAME DICTIONARY user_info TO user_profile;
```

```sql
RENAME DICTIONARY IF EXISTS default.user_info TO analytics.user_profile;
```
