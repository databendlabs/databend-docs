---
title: Addax
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入: v1.1.70"/>

[Addax](https://github.com/wgzhao/Addax) 最初源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)，是一个多功能的开源 ETL（提取、转换、加载）工具。它在不同 RDBMS（关系数据库管理系统）和 NoSQL 数据库之间无缝传输数据，是高效数据迁移的最佳解决方案。

有关 Addax 的系统要求、下载和部署步骤的信息，请参阅 Addax 的 [入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了详细的设置和使用说明。

另请参阅: [DataX](datax.md)

## DatabendReader & DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的集成插件，允许与 Databend 无缝集成。

DatabendReader 插件支持从 Databend 读取数据。Databend 提供了与 MySQL 客户端协议的兼容性，因此您也可以使用 [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) 插件从 Databend 检索数据。有关 DatabendReader 的更多信息，请参阅 https://wgzhao.github.io/Addax/develop/reader/databendreader/

## 教程: 从 MySQL 加载数据

在本教程中，您将使用 Addax 将数据从 MySQL 加载到 Databend。在开始之前，请确保您已成功在环境中设置 Databend、MySQL 和 Addax。

1. 在 MySQL 中，创建一个用于数据加载的 SQL 用户，然后创建一个表并填充示例数据。

```sql title='在 MySQL 中:'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在 Databend 中，创建相应的目标表。

```sql title='在 Databend 中:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, col1 String null);
```

3. 复制并粘贴以下代码到一个文件中，并将文件命名为 *mysql_demo.json*:

:::note
有关可用参数及其描述，请参阅以下链接提供的文档: https://wgzhao.github.io/Addax/develop/writer/databendwriter/#_2
:::

```json title='mysql_demo.json'
{
  "job": {
    "setting": {
      "speed": {
        "channel": 4
      }
    },
    "content": {
      "writer": {
        "name": "databendwriter",
        "parameter": {
          "preSql": [
            "truncate table @table"
          ],
          "postSql": [
          ],
          "username": "u1",
          "password": "123",
          "database": "migrate_db",
          "table": "tb01",
          "jdbcUrl": "jdbc:mysql://127.0.0.1:3307/migrated_db",
          "loadUrl": ["127.0.0.1:8000","127.0.0.1:8000"],
          "fieldDelimiter": "\\x01",
          "lineDelimiter": "\\x02",
          "column": ["*"],
          "format": "csv"
        }
      },
      "reader": {
        "name": "mysqlreader",
        "parameter": {
          "username": "mysqlu1",
          "password": "123",
          "column": [
            "*"
          ],
          "connection": [
            {
              "jdbcUrl": [
                "jdbc:mysql://127.0.0.1:3306/db"
              ],
              "driver": "com.mysql.jdbc.Driver",
              "table": [
              "tb01"
              ]
            }
          ]
        }
      }
    }
  }
}
```

4. 运行 Addax:

```shell
cd {YOUR_ADDAX_DIR_BIN}
./addax.sh -L debug ./mysql_demo.json 
```

您已完成所有设置！要验证数据加载，请在 Databend 中执行查询:

```sql
databend> select * from migrated_db.tb01;
+------+-------+
| id   | col1  |
+------+-------+
|    1 | test1 |
|    2 | test2 |
|    3 | test3 |
+------+-------+
```