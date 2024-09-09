---
title: DataX
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入: v1.1.70"/>

[DataX](https://github.com/alibaba/DataX) 是由阿里巴巴开发的开源数据集成工具。它旨在高效可靠地在各种数据存储系统和平台之间传输数据，如关系数据库、大数据平台和云存储服务。DataX 支持多种数据源和数据目标，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现已增加对 Databend 作为数据源的支持。这一增强功能使您能够利用 DolphinScheduler 管理 DataX 任务，并轻松地将数据从 MySQL 加载到 Databend。
:::

有关 DataX 的系统要求、下载和部署步骤的信息，请参阅 DataX 的[快速入门指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了详细的设置和使用 DataX 的说明和指南。

另请参阅: [Addax](addax.md)

## DatabendWriter

DatabendWriter 是 DataX 的集成插件，这意味着它已预先安装，无需手动安装。它作为一个无缝连接器，使数据能够轻松地从其他数据库传输到 Databend。通过 DatabendWriter，您可以利用 DataX 的功能，高效地将各种数据库中的数据加载到 Databend 中。

DatabendWriter 支持两种操作模式：INSERT（默认）和 REPLACE。在 INSERT 模式下，新数据被添加，同时防止与现有记录的冲突以保持数据完整性。另一方面，REPLACE 模式优先考虑数据一致性，在发生冲突时用新数据替换现有记录。

如果您需要更多关于 DatabendWriter 及其功能的信息，可以参考以下文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md

## 教程：从 MySQL 加载数据

在本教程中，您将使用 DataX 将数据从 MySQL 加载到 Databend。在开始之前，请确保您已成功在环境中设置 Databend、MySQL 和 DataX。

1. 在 MySQL 中，创建一个用于数据加载的 SQL 用户，然后创建一个表并填充示例数据。

```sql title='在 MySQL 中:'
mysql> create user 'mysqlu1'@'%' identified by 'databend';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, d double, t TIMESTAMP,  col1 varchar(10));
mysql> insert into db.tb01 values(1, 3.1,now(), 'test1'), (1, 4.1,now(), 'test2'), (1, 4.1,now(), 'test2');
```

2. 在 Databend 中，创建相应的目标表。

:::note
DataX 数据类型在加载到 Databend 时可以转换为 Databend 的数据类型。有关 DataX 数据类型与 Databend 数据类型之间的具体对应关系，请参阅以下链接提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#33-type-convert
:::

```sql title='在 Databend 中:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

3. 将以下代码复制并粘贴到一个文件中，并将文件命名为 *mysql_demo.json*。有关可用参数及其描述，请参阅以下链接提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#32-configuration-description

```json title='mysql_demo.json'
{
  "job": {
    "content": [
      {
        "reader": {
          "name": "mysqlreader",
          "parameter": {
            "username": "mysqlu1",
            "password": "databend",
            "column": [
              "id", "d", "t", "col1"
            ],
            "connection": [
              {
                "jdbcUrl": [
                  "jdbc:mysql://127.0.0.1:3307/db"
                ],
                "driver": "com.mysql.jdbc.Driver",
                "table": [
                  "tb01"
                ]
              }
            ]
          }
        },
        "writer": {
          "name": "databendwriter",
          "parameter": {
            "username": "databend",
            "password": "databend",
            "column": [
              "id", "d", "t", "col1"
            ],
            "preSql": [
            ],
            "postSql": [
            ],
            "connection": [
              {
                "jdbcUrl": "jdbc:databend://localhost:8000/migrated_db",
                "table": [
                  "tb01"
                ]
              }
            ]
          }
        }
      }
    ],
    "setting": {
      "speed": {
        "channel": 1
       }
    }
  }
}
```

:::tip
上述代码配置 DatabendWriter 以 INSERT 模式运行。要切换到 REPLACE 模式，您必须包含 writeMode 和 onConflictColumn 参数。例如：

```json title='mysql_demo.json'
...
"writer": {
          "name": "databendwriter",
          "parameter": {
            "writeMode": "replace",
            "onConflictColumn":["id"],
            "username": ...
```
:::

4. 运行 DataX：

```shell
cd {YOUR_DATAX_DIR_BIN}
python datax.py ./mysql_demo.json 
```

一切就绪！要验证数据加载，请在 Databend 中执行查询：

```sql
databend> select * from migrated_db.tb01;
+------+------+----------------------------+-------+
| id   | d    | t                          | col1  |
+------+------+----------------------------+-------+
|    1 |  3.1 | 2023-02-01 07:11:08.500000 | test1 |
|    1 |  4.1 | 2023-02-01 07:11:08.501000 | test2 |
|    1 |  4.1 | 2023-02-01 07:11:08.501000 | test2 |
+------+------+----------------------------+-------+
```