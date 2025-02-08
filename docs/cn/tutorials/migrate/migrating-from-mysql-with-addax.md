<think>
好的，我需要将用户提供的关于使用Addax从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读原文，理解每个步骤和代码块的作用。接下来，根据用户设定的规则，确保不改变Markdown结构、代码块内容以及任何链接或HTML标签。

首先处理标题和正文部分。注意术语的转换，比如“warehouse”要翻译为“计算集群”，“Self-Hosted”转为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”则保持原文。例如，标题“Migrating from MySQL with Addax”应译为“使用 Addax 从 MySQL 迁移数据”。

在代码块中，注释部分如“title='In MySQL:'”需要保留，但内容中的SQL语句不需要翻译。例如，“create user 'mysqlu1'@'%' identified by '123';”保持原样。同时，确保JSON文件中的键（如“name”、“parameter”）不被翻译，只翻译对应的值中的文本内容。

注意用户提到的特定词汇转换，例如“time travel”翻译为“时间回溯”，“Personal”计划翻译为“基础版”。在教程中的“preSql”和“postSql”部分，确保表名和命令正确无误，不进行修改。

对于JSON配置文件，需要特别注意保留键的原文，如“writer”、“reader”、“jdbcUrl”等，而值中的部分如“truncate table @table”需要保留原样。同时，检查URL是否正确，确保没有更改任何链接。

在翻译过程中，保持原有的行结构和换行符，避免添加或删除空行。例如，在代码块中的每一行都应与原文对齐，确保格式一致。此外，注意保留HTML标签如`<Notes>`，不进行任何修改。

最后，验证翻译后的文档是否符合所有规则，特别是术语的一致性和格式的正确性。确保所有代码块、JSON结构和Markdown标记都未被意外修改，并且最终的输出与用户提供的示例格式一致。
</think>

---
title: 使用 Addax 从 MySQL 迁移数据
---

在本教程中，您将使用 Addax 从 MySQL 加载数据到 Databend。开始前，请确保您已在环境中成功部署 Databend、MySQL 和 Addax。

1. 在 MySQL 中创建用于数据加载的 SQL 用户，然后创建表并填充示例数据。

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

完成后，可在 Databend 中查询验证数据加载结果：

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