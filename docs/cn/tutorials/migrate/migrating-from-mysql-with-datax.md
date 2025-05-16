---
title: 使用 DataX 从 MySQL 迁移
sidebar_label: 'MySQL → Databend: DataX'
---

> **能力**: 全量加载, 增量

在本教程中，您将使用 DataX 将数据从 MySQL 加载到 Databend。在开始之前，请确保您已在您的环境中成功设置了 Databend、MySQL 和 DataX。

1. 在 MySQL 中，创建一个 SQL 用户，您将使用该用户进行数据加载，然后创建一个表并使用示例数据填充它。

```sql title='在 MySQL 中:'
mysql> create user 'mysqlu1'@'%' identified by 'databend';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, d double, t TIMESTAMP,  col1 varchar(10));
mysql> insert into db.tb01 values(1, 3.1,now(), 'test1'), (1, 4.1,now(), 'test2'), (1, 4.1,now(), 'test2');
```

2. 在 Databend 中，创建一个对应的目标表。

:::note
DataX 数据类型在加载到 Databend 时可以转换为 Databend 的数据类型。有关 DataX 数据类型与 Databend 数据类型之间的具体对应关系，请参阅以下链接中提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#33-type-convert
:::

```sql title='在 Databend 中:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

3. 将以下代码复制并粘贴到一个文件中，并将该文件命名为 *mysql_demo.json*。有关可用参数及其描述，请参阅以下链接中提供的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#32-configuration-description

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
上面提供的代码配置 DatabendWriter 在 INSERT 模式下运行。要切换到 REPLACE 模式，您必须包含 writeMode 和 onConflictColumn 参数。例如：

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

4. 运行 DataX:

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