---
title: INFER_SCHEMA
---

自动检测文件元数据模式并检索列定义。

`infer_schema` 目前支持以下文件格式：
- **Parquet** - 原生支持模式推断
- **CSV** - 支持自定义分隔符和表头检测
- **NDJSON** - 换行分隔的 JSON 文件

**压缩支持**：所有格式均支持扩展名为 `.zip`、`.xz`、`.zst` 的压缩文件。

:::info 文件大小限制
每个独立文件的模式推断最大大小限制为 **100MB**。
:::

:::info 模式合并
处理多个文件时，`infer_schema` 会自动合并不同模式：

- **兼容类型** 会被提升（例如，INT8 + INT16 → INT16）
- **不兼容类型** 会回退到 **VARCHAR**（例如，INT + FLOAT → VARCHAR）
- 某些文件中 **缺失的列** 会被标记为 **nullable**
- 后续文件中的 **新列** 会被添加到最终模式

这确保所有文件都能使用统一模式读取。
:::

## 语法

```sql
INFER_SCHEMA(
  LOCATION => '{ internalStage | externalStage }'
  [ PATTERN => '<regex_pattern>']
  [ FILE_FORMAT => '<format_name>' ]
  [ MAX_RECORDS_PRE_FILE => <number> ]
  [ MAX_FILE_COUNT => <number> ]
)
```

## 参数

| 参数 | 描述 | 默认值 | 示例 |
|-----------|-------------|---------|---------|
| `LOCATION` | 暂存区位置：`@<stage_name>[/<path>]` | 必需 | `'@my_stage/data/'` |
| `PATTERN` | 文件名匹配模式 | 所有文件 | `'*.csv'`, `'*.parquet'` |
| `FILE_FORMAT` | 解析用的文件格式名称 | 暂存区格式 | `'csv_format'`, `'NDJSON'` |
| `MAX_RECORDS_PRE_FILE` | 每文件采样的最大记录数 | 所有记录 | `100`, `1000` |
| `MAX_FILE_COUNT` | 处理的最大文件数 | 所有文件 | `5`, `10` |

## 示例

### Parquet 文件

```sql
-- 创建暂存区并导出数据
CREATE STAGE test_parquet;
COPY INTO @test_parquet FROM (SELECT number FROM numbers(10)) FILE_FORMAT = (TYPE = 'PARQUET');

-- 使用模式从 Parquet 文件推断模式
SELECT * FROM INFER_SCHEMA(
    location => '@test_parquet',
    pattern => '*.parquet'
);
```

结果：
```
+-------------+-----------------+----------+----------+----------+
| column_name | type            | nullable | filenames| order_id |
+-------------+-----------------+----------+----------+----------+
| number      | BIGINT UNSIGNED |    false | data_... |        0 |
+-------------+-----------------+----------+----------+----------+
```

### CSV 文件

```sql
-- 创建暂存区并导出 CSV 数据
CREATE STAGE test_csv;
COPY INTO @test_csv FROM (SELECT number FROM numbers(10)) FILE_FORMAT = (TYPE = 'CSV');

-- 创建 CSV 文件格式
CREATE FILE FORMAT csv_format TYPE = 'CSV';

-- 使用模式和文件格式推断模式
SELECT * FROM INFER_SCHEMA(
    location => '@test_csv',
    pattern => '*.csv',
    file_format => 'csv_format'
);
```

结果：
```
+-------------+---------+----------+----------+----------+
| column_name | type    | nullable | filenames| order_id |
+-------------+---------+----------+----------+----------+
| column_1    | BIGINT  |     true | data_... |        0 |
+-------------+---------+----------+----------+----------+
```

带表头的 CSV 文件：

```sql
-- 创建支持表头的 CSV 文件格式
CREATE FILE FORMAT csv_headers_format
TYPE = 'CSV'
field_delimiter = ','
skip_header = 1;

-- 导出带表头的数据
CREATE STAGE test_csv_headers;
COPY INTO @test_csv_headers FROM (
  SELECT number as user_id, 'user_' || number::string as user_name
  FROM numbers(5)
) FILE_FORMAT = (TYPE = 'CSV', output_header = true);

-- 推断带表头的模式
SELECT * FROM INFER_SCHEMA(
    location => '@test_csv_headers',
    file_format => 'csv_headers_format'
);
```

限制记录数以加快推断：

```sql
-- 仅采样前 5 条记录进行模式推断
SELECT * FROM INFER_SCHEMA(
    location => '@test_csv',
    pattern => '*.csv',
    file_format => 'csv_format',
    max_records_pre_file => 5
);
```

### NDJSON 文件

```sql
-- 创建暂存区并导出 NDJSON 数据
CREATE STAGE test_ndjson;
COPY INTO @test_ndjson FROM (SELECT number FROM numbers(10)) FILE_FORMAT = (TYPE = 'NDJSON');

-- 使用模式和 NDJSON 格式推断模式
SELECT * FROM INFER_SCHEMA(
    location => '@test_ndjson',
    pattern => '*.ndjson',
    file_format => 'NDJSON'
);
```

结果：
```
+-------------+---------+----------+----------+----------+
| column_name | type    | nullable | filenames| order_id |
+-------------+---------+----------+----------+----------+
| number      | BIGINT  |     true | data_... |        0 |
+-------------+---------+----------+----------+----------+
```

限制记录数以加快推断：

```sql
-- 仅采样前 5 条记录进行模式推断
SELECT * FROM INFER_SCHEMA(
    location => '@test_ndjson',
    pattern => '*.ndjson',
    file_format => 'NDJSON',
    max_records_pre_file => 5
);
```

### 多文件模式合并

当文件模式不同时，`infer_schema` 会智能合并：

```sql
-- 假设有多个不同模式的 CSV 文件：
-- file1.csv: id(INT), name(VARCHAR)
-- file2.csv: id(INT), name(VARCHAR), age(INT)
-- file3.csv: id(FLOAT), name(VARCHAR), age(INT)

SELECT * FROM INFER_SCHEMA(
    location => '@my_stage/',
    pattern => '*.csv',
    file_format => 'csv_format'
);
```

结果显示合并后的模式：
```
+-------------+---------+----------+-----------+----------+
| column_name | type    | nullable | filenames | order_id |
+-------------+---------+----------+-----------+----------+
| id          | VARCHAR |     true | file1,... |        0 |  -- INT+FLOAT→VARCHAR
| name        | VARCHAR |     true | file1,... |        1 |
| age         | BIGINT  |     true | file1,... |        2 |  -- file1 缺失→nullable
+-------------+---------+----------+-----------+----------+
```

### 模式匹配与文件限制

使用模式匹配从多个文件推断模式：

```sql
-- 从目录中所有 CSV 文件推断模式
SELECT * FROM INFER_SCHEMA(
    location => '@my_stage/',
    pattern => '*.csv'
);
```

限制处理文件数以提升性能：

```sql
-- 仅处理前 5 个匹配文件
SELECT * FROM INFER_SCHEMA(
    location => '@my_stage/',
    pattern => '*.csv',
    max_file_count => 5
);
```

### 压缩文件

`infer_schema` 自动处理压缩文件：

```sql
-- 适用于压缩 CSV 文件
SELECT * FROM INFER_SCHEMA(location => '@my_stage/data.csv.zip');

-- 适用于压缩 NDJSON 文件
SELECT * FROM INFER_SCHEMA(
    location => '@my_stage/data.ndjson.xz',
    file_format => 'NDJSON',
    max_records_pre_file => 50
);
```

### 从推断模式创建表

`infer_schema` 函数显示模式但不创建表。要从推断模式创建表：

```sql
-- 从文件模式创建表结构
CREATE TABLE my_table AS
SELECT * FROM @my_stage/ (pattern=>'*.parquet')
LIMIT 0;

-- 验证表结构
DESC my_table;
```