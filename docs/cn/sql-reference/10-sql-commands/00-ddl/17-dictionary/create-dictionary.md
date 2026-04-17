---
title: CREATE DICTIONARY
sidebar_position: 1
---

创建一个外部字典。

## 语法

```sql
CREATE [ OR REPLACE ] DICTIONARY [ IF NOT EXISTS ] [ <catalog_name>. ][ <database_name>. ]<dictionary_name>
(
    <column_name> <data_type> [ , <column_name> <data_type> , ... ]
)
PRIMARY KEY <column_name> [ , <column_name> , ... ]
SOURCE(
    <source_name>(
        <source_option> = '<value>' [ <source_option> = '<value>' ... ]
    )
)
[ COMMENT '<comment>' ]
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `OR REPLACE` | 如果同名字典已存在，则替换它。 |
| `IF NOT EXISTS` | 如果字典已存在，则成功返回但不做修改。 |
| `<dictionary_name>` | 字典名称。可以带上 catalog 和 database 限定。 |
| `(<column_name> <data_type>, ...)` | 定义字典的列结构。 |
| `PRIMARY KEY` | 定义一个或多个用于字典查找的主键列。 |
| `SOURCE(...)` | 定义数据源连接器名称及其键值参数。 |
| `COMMENT` | 可选的字典备注。 |

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
COMMENT '来自 MySQL 的用户字典';
```
