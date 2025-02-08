<think>
好的，我需要将用户提供的关于使用DataX从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读原文，理解每个步骤和注意事项。用户提到要严格遵守一些规则，比如保留Markdown结构、不改变代码块内容、保留换行和空行等。同时，有一些特定术语需要保持不翻译，比如“Databend Cloud”、“Vector”、“Stage”等，还有一些词汇需要特定的翻译，比如“time travel”翻译为“时间回溯”，“warehouse”翻译为“计算集群”等。

首先，我会检查原文中的标题和结构，确保在翻译时不改变任何Markdown标记。例如，标题“Migrating from MySQL with DataX”需要准确翻译，同时保留原有的标题级别。接下来是步骤部分，每个步骤的代码块需要保持原样，不进行任何修改，包括SQL语句和JSON配置。用户特别强调不要改动代码块，即使里面有错误，所以这部分需要特别注意。

然后，处理注意事项部分，比如:::note和:::tip这些HTML标签需要保留，不翻译。里面的内容需要准确翻译，同时确保链接的URL不变。例如，文档链接https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md需要保持原样，但周围的描述需要翻译成中文。

在翻译JSON配置文件时，确保键（如"name"、"parameter"）不翻译，只翻译值中的文本内容。例如，"username": "mysqlu1"中的键保持原样，而值中的用户名字段可能不需要翻译，但周围的注释需要翻译。同时，用户提到在JSON对象的_category_.json中，键不翻译，所以需要确认这部分是否有涉及。

接下来，处理特定的术语翻译。例如，原文中的“Self-Hosted”要翻译为“私有化部署”，“Data Warehouse”翻译为“数仓”。需要确保这些术语在整个文档中保持一致。同时，注意“基础版”对应的是“Personal”计划，所以在翻译到相关部分时要替换。

在翻译过程中，还要注意保留原有的换行和空白行，不要添加或删除任何空行。例如，代码块中的每一行都要保持原样，包括缩进和格式。此外，文档末尾的查询结果表格也需要保持结构不变，只翻译表头和数据内容，但数据中的数值和字符串可能不需要翻译。

最后，检查是否有任何</think>标签或内容被错误地包含在输出中，确保完全按照用户要求不添加或生成任何新的</think>标签。完成初稿后，再次通读整个翻译，确保符合所有规则，术语一致，结构正确，没有遗漏或错误。
</think>

---
title: 使用 DataX 从 MySQL 迁移数据
---

在本教程中，您将使用 DataX 将数据从 MySQL 加载到 Databend。开始之前，请确保您已在环境中成功部署 Databend、MySQL 和 DataX。

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
DataX 的数据类型在加载到 Databend 时可以转换为 Databend 的数据类型。有关 DataX 数据类型与 Databend 数据类型的对应关系，请参考以下链接的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#33-type-convert
:::

```sql title='在 Databend 中执行：'
databend> create database migrated_db;
databend> create table migrated_db.tb01(id int null, d double null, t TIMESTAMP null,  col1 varchar(10) null);
```

3. 将以下代码复制粘贴到文件中，并将文件命名为 *mysql_demo.json*。可用参数及其说明请参考以下链接的文档：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md#32-configuration-description

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
上述代码配置了 DatabendWriter 的 INSERT 模式。要切换到 REPLACE 模式，必须包含 writeMode 和 onConflictColumn 参数。例如：

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

完成！要验证数据加载，请在 Databend 中执行查询：

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