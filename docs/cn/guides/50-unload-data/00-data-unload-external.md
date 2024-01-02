---
title: 将数据卸载到外部Stage
---

卸载数据是指将存储在数据库中的数据提取或转移到另一个存储位置的过程。这可能涉及将数据从数据库导出到文件或另一个数据库，或者将数据从数据库复制到备份或归档系统中。

Databend 建议使用 `COPY INTO <location>` 命令将您的数据作为文件导出到 Stage 或外部位置，文件格式为支持的格式之一。这个命令是一种方便高效的方式，可以将数据从数据库中转移出来，导出到文件中，以便进一步处理或分析。

有关该命令的更多信息，请参见 [`COPY INTO <location>`](/sql/sql-reference/file-format-options)。要查看支持的文件格式列表，这些格式可用于保存导出的数据，请参见 [输入和输出文件格式](/sql/sql-reference/file-format-options)。

## 卸载到外部 Stage

在本教程中，您将首先创建一个外部 Stage，然后使用 COPY INTO 命令将查询结果作为 parquet 文件导出到外部 Stage。

### 步骤 1. 创建外部 Stage

使用 [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) 命令创建名为 `unload` 的外部 Stage：

```sql
CREATE STAGE unload
    URL = 's3://unload/files/'
    CONNECTION = (
        AWS_KEY_ID = '1a2b3c',
        AWS_SECRET_KEY = '4x5y6z'
    );
```

### 步骤 2. 导出数据

将查询结果作为 parquet 文件导出到外部 Stage `unload` ：

```sql
COPY INTO @unload
FROM (
    SELECT *
    FROM numbers(10000000)
)
FILE_FORMAT = (
    TYPE = PARQUET
);
```

### 步骤 3. 验证导出文件

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
SELECT SUM(number)
FROM @unload (PATTERN => '.*parquet');

+----------------+
| sum(number)    |
+----------------+
| 49999995000000 |
+----------------+
```
