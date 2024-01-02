---
title: Addax
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.70"/>

[Addax](https://github.com/wgzhao/Addax)，最初源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)，是一个多功能的开源ETL（提取、转换、加载）工具。它擅长于在不同的RDBMS（关系数据库管理系统）和NoSQL数据库之间无缝传输数据，使其成为高效数据迁移的理想解决方案。

有关Addax的系统要求、下载和部署步骤的信息，请参考Addax的[入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了设置和使用Addax的详细说明和指导。

另见：[DataX](datax.md)

## DatabendReader & DatabendWriter

DatabendReader和DatabendWriter是Addax的集成插件，允许与Databend无缝集成。

DatabendReader插件支持从Databend读取数据。Databend提供了与MySQL客户端协议的兼容性，因此您也可以使用[MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/)插件从Databend检索数据。有关DatabendReader的更多信息，请参见 https://wgzhao.github.io/Addax/develop/reader/databendreader/

## 教程：从MySQL加载数据

在本教程中，您将使用Addax从MySQL加载数据到Databend。在开始之前，请确保您已经在环境中成功设置了Databend、MySQL和Addax。

1. 在MySQL中，创建一个将用于数据加载的SQL用户，然后创建一个表并用示例数据填充它。

```sql title='在MySQL中:'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在Databend中，创建一个对应的目标表。

```sql title='在Databend中:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, col1 String null);
```

3. 复制并粘贴以下代码到一个文件中，并将该文件命名为 *mysql_demo.json*：

:::note
有关可用参数及其描述，请参考以下链接提供的文档：https://wgzhao.github.io/Addax/develop/writer/databendwriter/#_2
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

4. 运行Addax：

```shell
cd {YOUR_ADDAX_DIR_BIN}
./addax.sh -L debug ./mysql_demo.json 
```

您已经准备就绪！要验证数据加载，请在Databend中执行查询：

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