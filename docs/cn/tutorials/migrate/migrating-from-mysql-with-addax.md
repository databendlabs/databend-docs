<think>
好的，我需要处理用户提供的关于使用Addax从MySQL迁移数据到Databend的教程翻译。首先，我要仔细阅读整个内容，确保理解每个步骤和技术术语。用户已经给出了一些具体的翻译规则，比如保留特定的术语不翻译，如“Databend Cloud”、“Vector”等，还有一些特定的词汇需要统一翻译，比如“time travel”翻译为“时间回溯”，“warehouse”翻译为“计算集群”等。

首先，标题部分“Migrating from MySQL with Addax”需要翻译，但保持简洁。接下来，检查每个步骤的描述，确保不改变Markdown结构，特别是代码块和链接。例如，代码块中的SQL语句和JSON配置需要保持原样，不进行任何修改，但周围的说明文字需要准确翻译。

注意用户提到的注意事项，比如不要翻译JSON文件中的键，保持“_category_.json”的键不变。同时，要确保HTML标签如<Notes>不被处理，保持原样。此外，用户提到如果遇到描述“Personal”计划时，应翻译为“基础版”，但在这个文档中没有出现，所以暂时不需要处理。

在处理具体内容时，比如步骤1中的MySQL命令，需要确保代码块的标题正确翻译为中文，但代码内容保持不变。同样，步骤2中的Databend SQL语句也是如此。步骤3中的JSON配置文件，需要确保注释部分正确翻译，但JSON结构不变，特别是URL和参数名保持原样。

用户还提到要保留原有的换行和空白行，所以在翻译过程中需要注意不要合并或拆分段落。此外，检查是否有任何permalink如{/*examples*/}出现在标题末尾，确保不被修改。

最后，验证翻译后的内容是否符合格式要求，比如代码块是否正确标记，链接是否完整，以及术语是否统一。例如，确认“计算集群”正确替换了“warehouse”，“时间回溯”替换了“time travel”等。完成后，通读整个翻译，确保流畅且准确，没有遗漏任何用户指定的规则。
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

完成后，您可以在 Databend 中查询验证数据加载结果：

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