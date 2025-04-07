---
title: CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

使用指定的源创建字典。

## 语法

```sql
CREATE [ OR REPLACE ] DICTIONARY [ IF NOT EXISTS ] <dictionary_name>
(
    <column_name1> <data_type1> [ DEFAULT <default-value-1> ],
    <column_name2> <data_type2> [ DEFAULT <default-value-2> ],
    ...
)
PRIMARY KEY <primary_key_column>
SOURCE(<source_type>(<source_parameters>))
```

| 参数              | 描述                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------|
| `<dictionary_name>`    | 字典的名称。                                                                                                                |
| `<column_name>`        | 字典中列的名称。                                                                                                    |
| `<data_type>`          | 存储在列中的数据类型。                                                                                                     |
| `<default-value>`      | 指定列的默认值，以便在从源填充字典时未提供值的情况下使用。 |
| `<primary_key_column>` | 用于快速查找的主键列。此键应对应于字典中每个条目的唯一值。               |
| `<source_type>`        | 指定数据源的类型，`MYSQL` 或 `REDIS`。 |
| `<source_parameters>`  | 定义指定源类型所需的配置参数。 |

### MySQL 参数

下表列出了配置 MySQL 数据源所需的和可选的参数：

| 参数 | 是否必需？ | 描述                                                                      |
|-----------|-----------|----------------------------------------------------------------------------------|
| host      | 是       | MySQL 服务器的 IP 地址或主机名。                                  |
| port      | 是       | MySQL 服务器正在侦听的端口。                                 |
| username  | 是       | 用于连接到 MySQL 服务器的用户名。                                |
| password  | 是       | 与用户名关联的用于访问 MySQL 服务器的密码。            |
| db        | 是       | 要从中提取数据的 MySQL 服务器上的数据库的名称。 |
| table     | 是       | 数据库中数据所在的表的名称。                    |

### Redis 参数

下表列出了配置 Redis 数据源所需的和可选的参数：

| 参数 | 是否必需？ | 描述                                                                                                                                 |
|-----------|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| host      | 是       | Redis 服务器的主机名或 IP 地址。                                                                                             |
| port      | 是       | Redis 服务器的端口号。                                                                                                        |
| username  | 否        | 如果 Redis 服务器需要用户身份验证，则为用户名。                                                                                  |
| password  | 否        | 用于用户身份验证的密码。                                                                                                       |
| db_index  | 否        | 指定 Redis 数据库索引，默认为 0。索引范围为 0 到 15，因为 Redis 支持从 0 到 15 索引的 16 个数据库。 |

## 示例

以下示例使用来自 MySQL 数据库的数据创建一个名为 `courses_dict` 的字典：

```sql
CREATE DICTIONARY courses_dict
(
    course_id INT,
    course_name STRING
)
PRIMARY KEY course_id
SOURCE(MYSQL(
    host='localhost'
    port='3306'
    username='root'
    password='123456'
    db='test'
    table='courses'
));
```

以下示例使用来自 Redis 数据源的数据创建一个名为 `student_name_dict` 的字典：

```sql
CREATE DICTIONARY student_name_dict
(
    student_id STRING,
    student_name STRING
)
PRIMARY KEY student_id
SOURCE(REDIS(
    host='127.0.0.1'
    port='6379'
));
```