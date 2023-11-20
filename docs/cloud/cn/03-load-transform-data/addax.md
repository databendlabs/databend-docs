---
title: Addax
---

[Addax](https://github.com/wgzhao/Addax), 最初来自阿里巴巴的 [DataX](https://github.com/alibaba/DataX), 是一个多功能开源的 ETL (Extract, Transform, Load) 工具。 它优秀地在不同的 RDBMS (关联数据库管理系统) 和 NoSQL 数据库之间无缝传输数据，使其成为高效数据迁移的最佳解决方案。

要了解系统要求、下载以及 Addax 的部署步骤，请参阅 Addax 的 [开始指南](https://github.com/wgzhao/Addax#getting-started)。指南提供了关于设置和使用 Addax 的详细指示和准则。

另见： [DataX](04-datax.md)

## DatabendReader & DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的集成插件，可以与 Databend 进行无缝的整合。

DatabendReader 插件允许从 Databendd 读取数据。Databend 提供与 MySQL 客户端协议的兼容性，所以您也可以使用 [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) 插件从 Databend 获取数据。欲了解更多关于 DatabendReader 的信息，请访问 https://wgzhao.github.io/Addax/develop/reader/databendreader/

DatabendWriter 插件帮助数据流到 Databend。It leverages the Databend HTTP connection (port 8000) and utilizes the Streaming Load API to efficiently load data into the database. 这个方法提供了比 [INSERT INTO](/sql/sql-commands/dml/dml-insert) 命令更高的效率，并且是为生产环境推荐的数据加载方法。关于 DatabendWriter 的更多信息，见 https://wgzhao.github.io/Adddax/develop/writer/databendwriter/

## 教程：从 MySQL 加载数据

在本教程中，您将使用 Addax 从 MySQL 加载到 Databend。在您开始之前，请确保您已经成功地在您的环境中设置 Databend, MySQL 和 Addax。

1. 在 MySQL 中，创建一个 SQL 用户，您将用于数据加载，然后创建一个表并用样本数据填充它。

```sql title='In MySQL:'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在 Databend，创建相应的目标表。

```sql title='In Databend:'
databend> creating database migrated_db;
databend> creating table migrated_db.tb01(id int null, col1 String null);
```

3. 复制并粘贴以下代码到文件并将其命名为 *mysql_demo.json*：

:::note
关于可用参数及其描述，请参阅以下链接提供的文档：https://wgzhao.github.io/adddax/develop/writer/databendwriter/#_2 :: :

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

4. 运行 Addax：

```shell
cd {YOUR_ADDAX_DIR_BIN}
./addax.sh -L debug ./mysql_demo.json 
```

你都已设置了！要验证数据加载，请执行 Databend 中的查询：

```sql
databend> select * from migrated_db b01;
+------+-------+
| id | col1 |
+------+-------+
| 1 | test1 |
| 2 | test2 |
| 3 | test3 |
+------+-------+
```