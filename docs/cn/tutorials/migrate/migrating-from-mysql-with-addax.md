<think>
好的，我需要将用户提供的关于使用Addax从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读原文，理解每个步骤和代码块的内容。接下来，根据用户设定的规则，确保不改变Markdown结构、代码块内容以及保留所有链接和HTML标签。

首先处理标题和正文部分。注意用户要求特定的术语如“time travel”翻译为“时间回溯”，“warehouse”翻译为“计算集群”，“Databend Cloud”等保留不译。例如，原文中的“Databend”不需要翻译，保持原样。

在代码块部分，确保不进行任何修改，包括SQL语句和JSON配置。例如，MySQL和Databend的SQL命令以及JSON文件内容必须保持原样，仅注释部分需要翻译。同时，注意用户提到的“基础版”对应“Personal”计划，需要正确替换。

对于注意事项部分，保留原始链接不变，仅翻译周围的说明文字。例如，关于Addax参数的文档链接保持不变，但提示文字翻译成中文。

检查JSON配置中的键名是否被翻译，根据规则，键名不应翻译。例如，“job”、“setting”、“speed”等键保持原样，而值中的“databendwriter”、“mysqlreader”等也不翻译。

在翻译过程中，保持原有的换行和空白行结构，避免添加或删除空行。确保Markdown的标题层级和格式正确，例如“title”属性中的内容需要翻译，但保持格式正确。

最后，验证翻译后的内容是否符合所有规则，特别是术语的一致性和结构的保留。例如，确认“计算集群”、“时间回溯”等术语正确使用，所有代码块未做修改，链接和HTML标签如<Notes>保留原样。

完成翻译后，再次检查是否有遗漏的规则，例如是否误删了某些部分或错误翻译了术语。确保输出中没有出现任何`<think>`标签，并且符合用户的所有格式要求。
</think>

---
title: 使用 Addax 从 MySQL 迁移数据
---

在本教程中，您将使用 Addax 从 MySQL 加载数据到 Databend。开始前，请确保您已在环境中成功部署 Databend、MySQL 和 Addax。

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

完成后，您可以在 Databend 中验证数据加载结果：

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