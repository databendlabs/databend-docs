---
title: CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

创建一个字典，支持从外部源实时访问数据。字典允许 Databend 直接从 MySQL 和 Redis 等外部系统查询数据，而无需传统的 ETL 流程，从而确保数据一致性并提高查询性能。

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

创建字典时，Databend 会建立与指定外部数据源的连接。然后可以使用 `dict_get()` 函数查询字典，以在查询时直接从源检索数据。

| 参数                    | 描述                                                                                                                                    |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `<dictionary_name>`     | 字典的名称，在查询中被引用。                                                                                                               |
| `<column_name>`         | 字典中列的名称。这些列定义了可以从外部源检索的数据的结构。                                                                                       |
| `<data_type>`           | 每列的数据类型。对于 MySQL 源，Databend 支持 boolean、string 和 numeric 类型（包括 int、bigint、float32、float64）。对于 Redis 源，仅支持 string 类型。 |
| `<default-value>`       | 当在外部源中找不到值时，列的可选默认值。这确保了即使缺少数据，查询也能返回有意义的结果。                                                                             |
| `<primary_key_column>`  | 查询字典时用作查找键的列。这应对应于外部数据源中的唯一标识符。                                                                                       |
| `<source_type>`         | 外部数据源的类型。当前支持：`MYSQL` 或 `REDIS`。未来版本将支持其他源。                                                                                     |
| `<source_parameters>`   | 特定于所选源类型的连接和配置参数。                                                                                                               |

### MySQL 参数

下表列出了配置 MySQL 数据源所需的和可选的参数：

| 参数       | 是否必需 | 描述                                                                          |
|------------|----------|-----------------------------------------------------------------------------|
| host       | 是        | MySQL 服务器的 IP 地址或主机名。                                                  |
| port       | 是        | MySQL 服务器正在监听的端口。                                                      |
| username   | 是        | 用于连接到 MySQL 服务器的用户名。                                                 |
| password   | 是        | 与用户名关联的用于访问 MySQL 服务器的密码。                                             |
| db         | 是        | 将从中提取数据的 MySQL 服务器上的数据库的名称。                                          |
| table      | 是        | 数据库中数据所在的表的名称。                                                        |

### Redis 参数

下表列出了配置 Redis 数据源所需的和可选的参数：

| 参数       | 是否必需 | 描述                                                                                                                                     |
|------------|----------|------------------------------------------------------------------------------------------------------------------------------------------|
| host       | 是        | Redis 服务器的主机名或 IP 地址。                                                                                                          |
| port       | 是        | Redis 服务器的端口号。                                                                                                                     |
| username   | 否        | 如果 Redis 服务器需要用户身份验证，则为用户名。                                                                                              |
| password   | 否        | 用于用户身份验证的密码。                                                                                                                   |
| db_index  | 否        | 指定 Redis 数据库索引，默认为 0。索引范围从 0 到 15，因为 Redis 支持从 0 到 15 索引的 16 个数据库。 |

## 示例

### MySQL 字典示例

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

### Redis 字典示例

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

## 与 dict_get() 一起使用

创建字典后，可以使用 `dict_get()` 函数查询它：

```sql
-- 使用字典查询学生信息
SELECT 
    student_id,
    dict_get(student_name_dict, 'student_name', to_string(student_id)) as student_name,
    course_id,
    dict_get(courses_dict, 'course_name', course_id) as course_name
FROM student_scores;
```

这种方法支持跨多个源的实时数据集成，而无需复杂的 ETL 流程。
