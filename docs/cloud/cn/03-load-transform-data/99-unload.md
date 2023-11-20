---
title: 导出数据
---

导出数据是指将存储在数据库中的数据提取或传输到另一个存储位置的过程。这可能涉及将数据从数据库导出到文件或另一个数据库，或者将数据从数据库复制到备份或归档系统。

Databend Cloud 建议使用 `COPY INTO <location>` 命令将您的数据以文件的形式导出到 Stage 或外部位置。此命令是将数据从数据库传输到文件以供进一步处理或分析的一种方便而有效的方法。

有关该命令的详细信息，请参考 [`COPY INTO <location>`](/sql/sql-commands/dml/dml-copy-into-location)。要查看可用于保存导出数据的文件格式列表，请参考[输入 & 输出文件格式](/sql/sql-reference/file-format-options)。

## 教程：数据导出到指定的对象存储中

在本教程中，您将首先创建一个外部 Stage，然后使用 `COPY INTO <location>` 命令将查询结果作为 Parquet 文件导出到外部 Stage。

### 步骤一：创建外部 Stage

打开一个工作区，然后使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建一个名为 `unload` 的外部 Stage：

```sql
CREATE STAGE unload url='s3://unload/files/' connection=(aws_key_id='1a2b3c' aws_secret_key='4x5y6z');
```
:::note
`COPY INTO <location>` 对内部 Stage 和外部 Stage 都适用，可以根据实际需要进行选择。更多有关 Databend Cloud Stage 的介绍，请参考[使用 Stage](01-stages.md)。
:::

### 步骤二：导出数据

将查询结果作为 Parquet 文件导出到创建的外部 Stage：

```sql
COPY INTO @unload FROM (SELECT * FROM numbers(10000000)) FILE_FORMAT = (TYPE = PARQUET);
```

### 步骤三：验证导出的文件

使用 [LIST STAGE](/sql/sql-commands/ddl/stage/ddl-list-stage) 命令显示导出的文件：

```sql
LIST @unload;
+--------------------------------------------------------+----------+------------------------------------+-------------------------------+---------+
| name                                                   | size     | md5                                | last_modified                 | creator |
+--------------------------------------------------------+----------+------------------------------------+-------------------------------+---------+
| data_8799a438-9788-4dcb-bd45-3aa23ea9c6a3_32_0.parquet | 41486538 | "F187251F37666928684DBED4AF0523DF" | 2023-02-12 03:45:03.000 +0000 | NULL    |
+--------------------------------------------------------+----------+------------------------------------+-------------------------------+---------+
```

您还可以查询导出的数据以确认其有效性：

```sql
SELECT sum(number) FROM @unload (PATTERN => '.*parquet');
+----------------+
| sum(number)    |
+----------------+
| 49999995000000 |
+----------------+
```