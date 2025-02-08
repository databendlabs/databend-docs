<think>
好的，我需要处理用户提供的这个Markdown文档的翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。用户特别强调了一些技术术语的翻译方式，比如“time travel”要翻译为“时间回溯”，“warehouse”要翻译为“计算集群”等。同时，不能改变Markdown的结构、链接、代码块内容，以及保留原有的换行和空白行。

首先，我会通读整个英文文档，理解每个部分的内容。文档是关于使用Addax从MySQL迁移数据到Databend的教程。包括在MySQL中创建用户、数据库和表，插入数据；在Databend中创建对应的表；配置Addax的JSON文件，并运行Addax进行数据迁移，最后验证数据是否正确导入。

接下来，我需要按照规则逐部分翻译。标题部分“Migrating from MySQL with Addax”可以翻译为“使用 Addax 从 MySQL 迁移数据”，保持简洁明了。然后，开头的段落需要说明本教程的目的，并提醒用户在开始前确保环境已正确设置。这里要注意“Databend”和“Addax”不翻译，保持原名。

在步骤1中，MySQL的SQL命令部分需要保留原样，仅翻译注释部分。例如，注释'title='In MySQL:''翻译为'title='在 MySQL 中：''。同样，步骤2中的Databend SQL命令也要保持代码块不变，仅翻译注释。

步骤3中的JSON配置文件是关键部分，需要确保代码块内的内容不被修改。用户特别指出，JSON中的键和值如“preSql”、“postSql”等不需要翻译，但注释部分需要翻译。同时，用户提供的链接需要保留原样，不能更改。例如，注释中的“:::note”需要保留，但后面的内容需要翻译成中文，提醒用户参考文档获取参数说明。

在JSON配置文件中，需要检查是否有需要保留的术语，如“databendwriter”、“mysqlreader”等，这些都属于技术术语，按照规则不翻译。同时，URL和参数如“jdbc:mysql://127.0.0.1:3306/db”也要保持原样。

步骤4中的运行Addax的命令行指令需要保持原样，仅翻译注释部分。最后的验证查询同样如此，确保SQL语句不变，仅翻译周围的说明文字。

在翻译过程中，我需要特别注意用户提到的特定词汇翻译，如“Self-Hosted”翻译为“私有化部署”，“Databend Cloud”、“Vector”、“Stage”保持不翻译。此外，如果遇到“Personal”计划，要翻译为“基础版”。

另外，要确保不改变任何Markdown的标记结构，比如标题的#号、代码块的```符号，以及链接和图片的格式。同时，保留原有的换行和空白行，避免增加或删除任何行。

最后，完成翻译后，我会通读一遍检查是否符合所有规则，特别是技术术语是否正确处理，代码块是否未被修改，结构是否与原文档一致。确保没有遗漏任何用户指定的要求，比如特定词汇的翻译和格式保留。
</think>

---
title: 使用 Addax 从 MySQL 迁移数据
---

在本教程中，您将使用 Addax 从 MySQL 迁移数据到 Databend。开始前请确保您已在环境中成功部署 Databend、MySQL 和 Addax。

1. 在 MySQL 中创建用于数据迁移的 SQL 用户，然后创建测试表并插入样例数据。

```sql title='在 MySQL 中：'
mysql> create user 'mysqlu1'@'%' identified by '123';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, col1 varchar(10));
mysql> insert into db.tb01 values(1, 'test1'), (2, 'test2'), (3, 'test3');
```

2. 在 Databend 中创建对应的目标表。

```sql title='在 Databend 中：'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, col1 String null);
```

3. 将以下配置复制到文件并保存为 _mysql_demo.json_：

:::note
可用参数及详细说明请参考文档：https://wgzhao.github.io/Addax/develop/writer/databendwriter/#_2
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

4. 执行 Addax 迁移任务：

```shell
cd {YOUR_ADDAX_DIR_BIN}
./addax.sh -L debug ./mysql_demo.json
```

完成迁移后，您可以在 Databend 中验证数据：

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