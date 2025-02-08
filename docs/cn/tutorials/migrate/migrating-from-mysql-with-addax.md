<think>
好的，我需要将用户提供的关于使用Addax从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读用户提供的规则，确保翻译过程中不违反任何要求。

首先，用户强调必须保持Markdown结构不变，不添加或删除链接，也不更改任何URL。这意味着我需要检查原文中的链接，确保它们原封不动地保留下来。例如，文档中的参考链接到Addax的文档，我需要确保该链接不被修改。

接下来，用户提到不能更改代码块的内容，即使其中有错误。因此，在翻译过程中，所有代码块内的内容，无论是SQL语句还是JSON配置，都必须保持原样，不做任何修改。例如，MySQL和Databend的SQL语句中的表名、字段名以及JSON文件中的配置项都不能被翻译或调整。

保持原始换行符和空白行也是重要的。这意味着在翻译时，我需要确保段落之间的换行与原文一致，避免因格式问题导致文档结构混乱。例如，代码块前后的空行需要保留，以确保正确渲染。

用户还特别指出不能删除任何内容，包括HTML标签如<Notes>。因此，在翻译过程中，我需要保留这些标签，仅翻译其内部的内容。例如，原文中的:::note标签需要保持原样，而其中的内容需要翻译成中文。

关于术语翻译，用户给出了明确的指导。例如，“time travel”应译为“时间回溯”，“warehouse”或“warehouses”译为“计算集群”，“Data Warehouse”译为“数仓”，“Self-Hosted”译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等专有名词则保持不译。此外，在JSON文件中的键（如“job”、“setting”等）也不应翻译，以确保配置文件的正确性。

在处理具体的翻译内容时，需要注意技术术语的一致性。例如，在MySQL和Databend中创建数据库和表的SQL语句，表名和字段名应保持英文，而注释或说明部分需要翻译。同时，JSON配置文件中的参数如“preSql”、“postSql”等键必须保留原样，而值中的表名和数据库名同样不翻译。

在翻译示例中的命令行操作时，如运行Addax的命令，路径和文件名需要保持原样，而命令的说明部分需要翻译。例如，“Run Addax:”应译为“运行Addax：”，但命令本身保持不变。

最后，验证数据加载的SQL查询部分也需要保持代码块不变，仅翻译周围的说明文字。例如，“select * from migrated_db.tb01;”必须保留原样，而结果集中的数据同样不翻译。

总结来说，整个翻译过程需要严格遵守用户提供的格式和术语规范，确保技术文档的准确性和一致性，同时保持原有的结构和格式不变。这需要仔细检查每个部分，确保没有遗漏任何规则，特别是在处理代码块、链接和专有名词时需格外小心。
</think>

---
title: 使用 Addax 从 MySQL 迁移数据
---

在本教程中，您将使用 Addax 从 MySQL 加载数据到 Databend。开始前，请确保您已在环境中成功部署 Databend、MySQL 和 Addax。

1. 在 MySQL 中创建用于数据加载的 SQL 用户，然后创建表并插入示例数据。

```sql title='在 MySQL 中执行:'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在 Databend 中创建对应的目标表。

```sql title='在 Databend 中执行:'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, col1 String null);
```

3. 将以下代码复制到文件并保存为 _mysql_demo.json_：

:::note
可用参数及说明请参考文档：https://wgzhao.github.io/Addax/develop/writer/databendwriter/#_2
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

4. 运行 Addax：

```shell
cd {YOUR_ADDAX_DIR_BIN}
./addax.sh -L debug ./mysql_demo.json
```

完成！要验证数据加载，请在 Databend 中执行查询：

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