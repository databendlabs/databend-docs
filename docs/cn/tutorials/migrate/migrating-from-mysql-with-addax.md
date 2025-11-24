---
title: 使用 Addax 迁移 MySQL
sidebar_label: 'Addax'
---

> **功能**: 全量导入, 增量导入

在本教程中，您将使用 Addax 将数据从 MySQL 加载到 Databend。在开始之前，请确保您已在环境中成功设置 Databend、MySQL 和 Addax。

1. 在 MySQL 中，创建一个 SQL 用户，您将使用该用户进行数据加载，然后创建一个表并使用示例数据填充它。

```sql title='In MySQL:'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在 Databend 中，创建相应的目标表。

```sql title='In Databend:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, col1 String null);
```

3. 将以下代码复制并粘贴到文件中，并将该文件命名为 _mysql_demo.json_:

:::note
有关可用参数及其说明，请参阅以下链接提供的文档：https://wgzhao.github.io/Addax/develop/writer/databendwriter/#_2
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
          "preSql": ["truncate table @table"],
          "postSql": [],
          "username": "u1",
          "password": "123",
          "database": "migrate_db",
          "table": "tb01",
          "jdbcUrl": "jdbc:mysql://127.0.0.1:3307/migrated_db",
          "loadUrl": ["127.0.0.1:8000", "127.0.0.1:8000"],
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
          "column": ["*"],
          "connection": [
            {
              "jdbcUrl": ["jdbc:mysql://127.0.0.1:3306/db"],
              "driver": "com.mysql.jdbc.Driver",
              "table": ["tb01"]
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

一切就绪！要验证数据加载，请在 Databend 中执行查询：

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