<think>
好的，我需要将用户提供的关于使用Addax从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读原文，理解每个步骤的内容和目的。接下来，根据用户设定的规则，确保不改变Markdown结构、代码块内容以及链接等元素。

首先，检查是否有需要保留的专有名词，比如“Databend Cloud”、“Vector”、“Stage”等，这些不需要翻译。同时注意术语如“time travel”应译为“时间回溯”，“warehouse”译为“计算集群”，“Data Warehouse”译为“数仓”，“Self-Hosted”译为“私有化部署”。此外，用户提到如果遇到描述“Personal”计划时，要翻译为“基础版”。

接下来，处理标题和段落内容。例如，原文中的“Migrating from MySQL with Addax”应翻译为“使用 Addax 从 MySQL 迁移数据”，同时保留Markdown的标题结构。注意代码块中的SQL语句和JSON配置要保持原样，不进行任何修改，包括注释和格式。

在处理JSON文件时，确保键（如“job”、“setting”、“content”等）不被翻译，仅翻译对应的值中的文本内容。例如，在“preSql”中的“truncate table @table”不需要改动，而注释部分需要正确翻译。

还要注意用户提到的特殊格式要求，比如保留原有的换行和空白行，不添加或删除任何内容。例如，在代码块中的SQL结果表格结构要保持一致，确保翻译后的内容在渲染时格式正确。

另外，用户强调不要添加任何`</think>`标签，因此在最终输出中必须完全避免出现这些内容。需要仔细检查生成的翻译，确保没有遗漏或错误。

最后，通读整个翻译后的文档，确保流畅性和准确性，同时符合技术文档的专业性。验证所有术语是否符合用户指定的翻译规则，并确保所有链接和代码示例未被修改。完成这些步骤后，输出最终的简体中文翻译结果。
</think>

---
title: 使用 Addax 从 MySQL 迁移数据
---

在本教程中，您将使用 Addax 将数据从 MySQL 加载到 Databend。开始之前，请确保您已在环境中成功部署 Databend、MySQL 和 Addax。

1. 在 MySQL 中创建一个用于数据加载的 SQL 用户，然后创建表并填充示例数据。

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

3. 将以下代码复制到文件并命名为 _mysql_demo.json_：

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

验证数据加载是否成功，在 Databend 中执行查询：

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