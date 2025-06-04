---
title: 将 Avro 数据加载到 Databend
sidebar_label: Avro
---

## 什么是 Avro？

[Apache Avro™](https://avro.apache.org/) 是记录数据的领先序列化格式，也是流数据管道的首选方案。

## 加载 Avro 文件

加载 AVRO 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = AVRO)
```

- 更多 Avro 文件格式选项详见 [Avro 文件格式选项](/sql/sql-reference/file-format-options#avro-options)
- 更多 COPY INTO 表操作详见 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从远程 HTTP URL 加载 Avro 数据到 Databend

本教程将指导您使用 Avro 模式在 Databend 中创建表，并通过 HTTPS 直接从 GitHub 托管的 `.avro` 文件加载数据。

### 步骤 1：查看 Avro 模式

在 Databend 中创建表前，请先查看 Avro 模式文件：[userdata.avsc](https://github.com/Teradata/kylo/blob/master/samples/sample-data/avro/userdata.avsc)。该模式定义了名为 `User` 的记录结构，包含 13 个字段，主要为字符串类型，同时包含 `int` 和 `float` 类型。

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

创建与模式结构匹配的表：

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
│                             文件                             │ 已加载行数 │ 错误数 │    首错误    │ 首错误行 │
├──────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ Teradata/kylo/master/samples/sample-data/avro/userdata1.avro │        1000 │           0 │ NULL             │             NULL │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4：查询数据

查询已导入的数据：

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