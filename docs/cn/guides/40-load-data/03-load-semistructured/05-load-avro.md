---
title: 将 Avro 数据加载到 Databend
sidebar_label: Avro
---

## 什么是 Avro？

[Apache Avro™](https://avro.apache.org/) 是领先的记录数据序列化格式，也是流式数据管道的首选。

## 加载 Avro 文件

加载 AVRO 文件的常用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = AVRO)
```

- 有关 Avro 文件格式的更多选项，请参阅 [Avro 文件格式选项](/sql/sql-reference/file-format-options#avro-options)。
- 有关 `COPY INTO table` 的更多选项，请参阅 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从远程 HTTP URL 将 Avro 数据加载到 Databend

在本教程中，你将使用 Avro 模式在 Databend 中创建表，并通过 HTTPS 直接从 GitHub 托管的 `.avro` 文件加载 Avro 数据。

### 步骤 1：查看 Avro 模式

在 Databend 中创建表之前，我们先快速查看一下正在使用的 Avro 模式：[userdata.avsc](https://github.com/Teradata/kylo/blob/master/samples/sample-data/avro/userdata.avsc)。此模式定义了一个名为 `User` 的记录，包含 13 个字段，大部分是字符串类型，还有 `int` 和 `float` 类型。

```json
{
  "type": "record",
  "name": "User",
  "fields": [
    {"name": "registration_dttm", "type": "string"},
    {"name": "id", "type": "int"},
    {"name": "first_name", "type": "string"},
    {"name": "last_name", "type": "string"},
    {"name": "email", "type": "string"},
    {"name": "gender", "type": "string"},
    {"name": "ip_address", "type": "string"},
    {"name": "cc", "type": "string"},
    {"name": "country", "type": "string"},
    {"name": "birthdate", "type": "string"},
    {"name": "salary", "type": "float"},
    {"name": "title", "type": "string"},
    {"name": "comments", "type": "string"}
  ]
}
```

### 步骤 2：在 Databend 中创建表

创建与模式中定义的结构匹配的表：

```sql
CREATE TABLE userdata (
  registration_dttm STRING,
  id INT,
  first_name STRING,
  last_name STRING,
  email STRING,
  gender STRING,
  ip_address STRING,
  cc VARIANT,
  country STRING,
  birthdate STRING,
  salary FLOAT,
  title STRING,
  comments STRING
);
```

### 步骤 3：从远程 HTTPS URL 加载数据

```sql
COPY INTO userdata
FROM 'https://raw.githubusercontent.com/Teradata/kylo/master/samples/sample-data/avro/userdata1.avro'
FILE_FORMAT = (type = avro);
```

```sql
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             File                             │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├──────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ Teradata/kylo/master/samples/sample-data/avro/userdata1.avro │        1000 │           0 │ NULL             │             NULL │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4：查询数据

现在你可以探索刚刚导入的数据：

```sql
SELECT id, first_name, email, salary FROM userdata LIMIT 5;
```

```sql
┌───────────────────────────────────────────────────────────────────────────────────┐
│        id       │    first_name    │           email          │       salary      │
├─────────────────┼──────────────────┼──────────────────────────┼───────────────────┤
│               1 │ Amanda           │ ajordan0@com.com         │          49756.53 │
│               2 │ Albert           │ afreeman1@is.gd          │         150280.17 │
│               3 │ Evelyn           │ emorgan2@altervista.org  │         144972.52 │
│               4 │ Denise           │ driley3@gmpg.org         │          90263.05 │
│               5 │ Carlos           │ cburns4@miitbeian.gov.cn │              NULL │
└───────────────────────────────────────────────────────────────────────────────────┘
```