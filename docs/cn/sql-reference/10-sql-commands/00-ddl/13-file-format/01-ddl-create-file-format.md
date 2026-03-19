---
title: CREATE FILE FORMAT
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

创建一个命名的文件格式。

## 语法

```sql
CREATE [ OR REPLACE ] FILE FORMAT [ IF NOT EXISTS ] <format_name> FileFormatOptions
```

关于 `FileFormatOptions` 的详细信息，请参考 [输入 & 输出文件格式](../../../00-sql-reference/50-file-format-options.md)。

## 使用文件格式

创建一次，即可在查询和加载数据时重复使用该格式：

```sql
-- 1) 创建可复用的格式
CREATE OR REPLACE FILE FORMAT my_custom_csv TYPE = CSV FIELD_DELIMITER = '\t';

-- 2) 查询 Stage 中的文件（stage 表函数参数使用 =>）
SELECT * FROM @mystage/data.csv (FILE_FORMAT => 'my_custom_csv') LIMIT 10;

-- 3) 用 COPY INTO 导入文件（copy 选项使用 =）
COPY INTO my_table
FROM @mystage/data.csv
FILE_FORMAT = (FORMAT_NAME = 'my_custom_csv');
```

为什么有 `=>` 与 `=` 的区别？Stage 表函数的参数使用键值写法 `=>`，而 `COPY INTO` 的选项采用常规的 `=` 赋值语法。

**快速流程：使用同一格式进行创建、查询和加载**

```sql
-- 创建可复用的格式
CREATE FILE FORMAT my_parquet TYPE = PARQUET;

-- 使用该格式查询 Stage 中的文件（Stage 表函数语法使用 =>）
SELECT * FROM @sales_stage/2024/order.parquet (FILE_FORMAT => 'my_parquet') LIMIT 10;

-- 使用 COPY INTO 加载 Stage 文件（LOAD 选项使用 =）
COPY INTO analytics.orders
FROM @sales_stage/2024/order.parquet
FILE_FORMAT = (FORMAT_NAME = 'my_parquet');
```

## 关于 LANCE 的说明

你也可以创建一个命名的 Lance 文件格式：

```sql
CREATE FILE FORMAT my_lance TYPE = LANCE;
```

但与 CSV、TSV、NDJSON、PARQUET 不同，命名的 `LANCE` 格式只能复用于 `COPY INTO <location>`，不能用于 Stage 文件查询，也不能用于 `COPY INTO <table>`，因为 Databend 写出的是 Lance 数据集目录，而不是单个文件。

```sql
COPY INTO @ml_stage/datasets/train
FROM my_training_table
FILE_FORMAT = (FORMAT_NAME = 'my_lance')
USE_RAW_PATH = TRUE
OVERWRITE = TRUE;
```

关于 Lance 的行为差异和限制，请参阅 [文件格式选项](../../../00-sql-reference/50-file-format-options.md#lance-选项) 和 [`COPY INTO <location>`](../../10-dml/dml-copy-into-location.md)。
