<think>
好的，我需要处理用户提供的Markdown内容，并将其翻译成简体中文，同时遵循一系列特定的规则。首先，我要仔细阅读用户提供的规则，确保在翻译过程中不违反任何要求。

首先，用户要求保留Markdown的结构，不添加或删除链接，也不更改任何URL。这意味着我需要确保所有的超链接和图片引用保持原样。例如，文档中的链接如https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md必须保持不变，不能翻译或修改。

其次，代码块的内容必须完全保留，即使其中有错误。因此，在翻译过程中，我需要特别注意不要修改任何代码块内的内容，包括SQL语句、JSON配置以及shell命令。例如，用户提供的SQL代码中的表结构和插入语句，以及JSON配置文件中的各个参数，都必须保持原样，仅翻译周围的说明文字。

第三，保留原始换行符和空白行。这意味着在翻译时，我需要保持段落的格式与原文一致，避免合并或拆分段落，除非必要。同时，不能添加或删除空行，以保持文档的结构一致。

第四，不处理标题末尾的永久链接，例如{/*examples*/}。这些部分需要保留原样，不进行翻译或修改。同样，HTML标签如<Notes>和</Notes>也不能被改动，只需翻译标签内的内容。

关于术语翻译，用户提供了具体的指导。例如，“time travel”应翻译为“时间回溯”，“warehouse”或“warehouses”翻译为“计算集群”，“Data Warehouse”翻译为“数仓”，“Self-Hosted”翻译为“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”等专有名词则保持不译。此外，如果遇到描述“Personal”计划的情况，需要翻译为“基础版”。这些术语的一致性非常重要，以确保文档的专业性和准确性。

接下来，我需要处理具体的翻译内容。用户提供的文档是关于使用DataX从MySQL迁移数据到Databend的教程。首先，翻译标题和段落内容，同时确保代码块、JSON配置和SQL语句保持不变。例如，原文中的“In MySQL:”和“In Databend:”需要翻译为“在MySQL中：”和“在Databend中：”，但代码块内的内容不翻译。

在处理JSON配置文件时，需要注意参数名如“username”、“password”、“column”等保持原样，仅翻译注释和说明部分。例如，JSON中的“preSql”和“postSql”不需要翻译，但周围的说明文字需要正确翻译。

此外，用户提到的提示部分（:::tip）需要正确翻译，同时保留内部的代码示例。例如，关于切换到REPLACE模式的说明，需要确保代码块内的参数如“writeMode”和“onConflictColumn”保持不变，仅翻译周围的说明文字。

最后，验证部分需要确保用户能够正确执行查询，并看到预期的结果。翻译后的示例输出需要与原文格式一致，包括时间戳和测试数据。

在整个过程中，我需要反复检查是否遵守了所有规则，特别是术语的一致性和代码块的完整性。同时，保持译文的流畅和自然，确保技术文档的准确性和可读性。完成翻译后，还需要进行校对，确保没有遗漏任何规则，并且所有链接、代码和格式都正确无误。
</think>

---
title: 使用 DataX 从 MySQL 迁移数据
---

在本教程中，您将使用 DataX 从 MySQL 加载数据到 Databend。开始前，请确保您已在环境中成功部署 Databend、MySQL 和 DataX。

1. 在 MySQL 中创建一个用于数据加载的 SQL 用户，然后创建表并填充示例数据。

```sql title='在 MySQL 中执行：'
mysql> create user 'mysqlu1'@'%' identified by 'databend';
mysql> grant all on *.* to 'mysqlu1'@'%';
mysql> create database db;
mysql> create table db.tb01(id int, d double, t TIMESTAMP,  col1 varchar(10));
mysql> insert into db.tb01 values(1, 3.1,now(), 'test1'), (1, 4.1,now(), 'test2'), (1, 4.1,now(), 'test2');
```

2. 在 Databend 中创建对应的目标表。

:::note
DataX 的数据类型在加载到 Databend 时可转换为 Databend 的数据类型。有关 DataX 数据类型与 Databend 数据类型的对应关系，请参考以下链接的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#33-type-convert
:::

```sql title='在 Databend 中执行：'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

3. 将以下代码复制粘贴到文件并命名为 *mysql_demo.json*。可用参数及其描述请参考以下链接的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#32-configuration-description

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
上述代码配置了 DatabendWriter 的 INSERT 模式。如需切换为 REPLACE 模式，必须包含 writeMode 和 onConflictColumn 参数。例如：

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

4. 运行 DataX：

```shell
cd {YOUR_DATAX_DIR_BIN}
python datax.py ./mysql_demo.json 
```

完成！执行以下查询验证数据加载结果：

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