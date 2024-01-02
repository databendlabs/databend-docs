---
title: DataX
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.70"/>

[DataX](https://github.com/alibaba/DataX) 是阿里巴巴开发的一个开源数据集成工具。它旨在高效、可靠地在各种数据存储系统和平台之间传输数据，如关系数据库、大数据平台和云存储服务。DataX 支持广泛的数据源和数据接收器，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现在已经增加了对 Databend 作为数据源的支持。这一增强功能使您能够利用 DolphinScheduler 管理 DataX 任务，并轻松地将数据从 MySQL 加载到 Databend。
:::

有关 DataX 的系统要求、下载和部署步骤的信息，请参考 DataX 的[快速开始指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了详细的说明和指导，用于设置和使用 DataX。

另见：[Addax](addax.md)

## DatabendWriter

DatabendWriter 是 DataX 的一个集成插件，这意味着它预先安装好了，不需要任何手动安装。它作为一个无缝连接器，使得从其他数据库到 Databend 的数据传输变得轻而易举。通过 DatabendWriter，您可以利用 DataX 的能力，高效地将各种数据库中的数据加载到 Databend。

DatabendWriter 支持两种操作模式：INSERT（默认）和 REPLACE。在 INSERT 模式下，会添加新数据，同时防止与现有记录冲突以维护数据完整性。另一方面，REPLACE 模式通过在冲突情况下用新数据替换现有记录，优先保证数据一致性。

如果您需要更多关于 DatabendWriter 及其功能的信息，可以参考 https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md 上提供的文档。

## 教程：从 MySQL 加载数据

在本教程中，您将使用 DataX 从 MySQL 加载数据到 Databend。在开始之前，请确保您已经在您的环境中成功设置了 Databend、MySQL 和 DataX。

1. 在 MySQL 中，创建一个将用于数据加载的 SQL 用户，然后创建一个表并用示例数据填充它。

```sql title='在 MySQL 中:'
mysql> create user 'mysqlu1'@'%' identified by 'databend';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, d double, t TIMESTAMP,  col1 varchar(10));
mysql> insert into db.tb01 values(1, 3.1,now(), 'test1'), (1, 4.1,now(), 'test2'), (1, 4.1,now(), 'test2');
```

2. 在 Databend 中，创建一个对应的目标表。

:::note
在加载到 Databend 时，DataX 数据类型可以转换为 Databend 的数据类型。有关 DataX 数据类型与 Databend 数据类型之间的具体对应关系，请参考以下链接提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#33-type-convert
:::

```sql title='在 Databend 中:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

3. 复制并粘贴以下代码到一个文件中，并将该文件命名为 *mysql_demo.json*。有关可用参数及其描述，请参考以下链接提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#32-configuration-description

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
上面提供的代码配置了 DatabendWriter 以 INSERT 模式运行。要切换到 REPLACE 模式，您必须包括 writeMode 和 onConflictColumn 参数。例如：

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

```bash
python datax.py path_to_mysql_demo.json
```

此命令将启动从 MySQL 到 Databend 的数据加载过程，使用 *mysql_demo.json* 中指定的配置。

按照这些步骤，您可以利用 DataX 的强大数据集成能力，高效地将数据从 MySQL 转移到 Databend。

```shell
cd {YOUR_DATAX_DIR_BIN}
python datax.py ./mysql_demo.json 
```

配置完成！要验证数据加载，请在Databend中执行以下查询：

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