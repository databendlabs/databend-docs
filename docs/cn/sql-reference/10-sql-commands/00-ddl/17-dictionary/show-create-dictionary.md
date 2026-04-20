---
title: SHOW CREATE DICTIONARY
sidebar_position: 4
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
CREATE DICTIONARY user_info
(
    user_id UInt64,
    user_name String,
    user_email String
)
PRIMARY KEY user_id
SOURCE(
    mysql(
        host = '127.0.0.1'
        port = '3306'
        username = 'root'
        password = 'root'
        db = 'app'
        table = 'users'
    )
)
COMMENT 'User dictionary from MySQL';

SHOW CREATE DICTIONARY user_info;

*************************** 1. row ***************************
       Dictionary: user_info
Create Dictionary: CREATE DICTIONARY user_info
(
  user_id BIGINT UNSIGNED NULL,
  user_name VARCHAR NULL,
  user_email VARCHAR NULL
)
PRIMARY KEY user_id
SOURCE(mysql(db='app' host='127.0.0.1' password='[HIDDEN]' port='3306' table='users' username='root'))
COMMENT 'User dictionary from MySQL'
```
