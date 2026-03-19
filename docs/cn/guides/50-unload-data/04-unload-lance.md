---
title: 导出 Lance 数据集
---

## 导出 Lance 数据集

Lance 导出面向的是数据集型下游消费者，例如机器学习和向量检索工作流。与导出 CSV、TSV、NDJSON 或 Parquet 不同，Databend 写出的是一个 Lance **数据集目录**，其中包含 `.lance` 数据文件以及 `_versions/` 等元数据。

语法：

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (TYPE = LANCE)
[MAX_FILE_SIZE = <num>]
[USE_RAW_PATH = true | false]
[OVERWRITE = true | false]
[DETAILED_OUTPUT = true | false]
```

- Lance 仅支持 `COPY INTO <location>`。
- Lance 不支持 `SINGLE` 和 `PARTITION BY`。
- 当 `USE_RAW_PATH = false`（默认值）时，Databend 会把 query ID 追加到目标路径后面，为每次导出创建独立的数据集根目录。
- 如果你希望 Python `lance` 之类的下游消费者使用稳定的数据集 URI，请设置 `USE_RAW_PATH = true`。
- 语法细节请参考 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location)。
- 更多 Lance 行为差异请参考 [文件格式选项](/sql/sql-reference/file-format-options#lance-选项)。

## 教程

这个示例构建一个小型文本分类数据集。原始文本文件先放到 Stage 中，查询时用 `READ_FILE` 读取为 `BINARY`，最后再由 Databend 导出为 Lance 格式，供 Python 下游直接消费。

### 前提条件

准备一个 S3 兼容对象存储，并确保 Databend 和你的 Python 环境都可以访问它。

### Step 1. 创建 External Stage

```sql
CREATE OR REPLACE STAGE ml_assets
URL = 's3://your-bucket/lance-demo/'
CONNECTION = (
    ENDPOINT_URL = '<your-endpoint-url>',
    ACCESS_KEY_ID = '<your-access-key-id>',
    SECRET_ACCESS_KEY = '<your-secret-access-key>',
    REGION = '<your-region>'
);
```

### Step 2. 创建示例源文件

先在 Stage 中创建 3 个原始文本文件：

```sql
COPY INTO @ml_assets/raw/ticket_001.txt
FROM (SELECT 'customer asked for a refund after the package arrived damaged')
FILE_FORMAT = (TYPE = CSV FIELD_DELIMITER = '|' RECORD_DELIMITER = '\n')
SINGLE = TRUE
USE_RAW_PATH = TRUE
OVERWRITE = TRUE;

COPY INTO @ml_assets/raw/ticket_002.txt
FROM (SELECT 'customer praised the fast response and confirmed the issue was resolved')
FILE_FORMAT = (TYPE = CSV FIELD_DELIMITER = '|' RECORD_DELIMITER = '\n')
SINGLE = TRUE
USE_RAW_PATH = TRUE
OVERWRITE = TRUE;

COPY INTO @ml_assets/raw/ticket_003.txt
FROM (SELECT 'customer requested escalation because the replacement order was delayed')
FILE_FORMAT = (TYPE = CSV FIELD_DELIMITER = '|' RECORD_DELIMITER = '\n')
SINGLE = TRUE
USE_RAW_PATH = TRUE
OVERWRITE = TRUE;
```

### Step 3. 创建清单表

```sql
CREATE OR REPLACE TABLE support_ticket_manifest (
    ticket_id INT,
    label STRING,
    file_path STRING
);

INSERT INTO support_ticket_manifest VALUES
    (1, 'refund', 'raw/ticket_001.txt'),
    (2, 'resolved', 'raw/ticket_002.txt'),
    (3, 'escalation', 'raw/ticket_003.txt');
```

### Step 4. 导出为 Lance 数据集

`READ_FILE` 会把 Stage 中的文本文件读取为原始二进制内容，然后 `COPY INTO` 把这些行写成一个 Lance 数据集：

```sql
COPY INTO @ml_assets/datasets/support-ticket-train
FROM (
    SELECT
        ticket_id,
        label,
        file_path,
        READ_FILE('@ml_assets', file_path) AS content
    FROM support_ticket_manifest
    ORDER BY ticket_id
)
FILE_FORMAT = (TYPE = LANCE)
USE_RAW_PATH = TRUE
OVERWRITE = TRUE
DETAILED_OUTPUT = TRUE;
```

结果：

```text
┌───────────────────────────────────────────────────────────────┐
│ file_name                          │ file_size │ row_count   │
├────────────────────────────────────┼───────────┼─────────────┤
│ datasets/support-ticket-train      │ ...       │ 3           │
└───────────────────────────────────────────────────────────────┘
```

### Step 5. 查看导出后的数据集目录

```sql
LIST @ml_assets/datasets/support-ticket-train;
```

你会看到类似下面的目录结构：

```text
datasets/support-ticket-train/_versions/...
datasets/support-ticket-train/data/... .lance
datasets/support-ticket-train/*.manifest
```

### Step 6. 用 Python `lance` 验证

先安装 Python 包：

```bash
pip install pylance
```

然后从同一个对象存储位置读取刚刚导出的 Lance 数据集：

```python
import os
import lance

storage_options = {
    "aws_access_key_id": os.environ["AWS_ACCESS_KEY_ID"],
    "aws_secret_access_key": os.environ["AWS_SECRET_ACCESS_KEY"],
    "region": os.environ.get("AWS_REGION", "us-east-1"),
}

if endpoint := os.environ.get("AWS_ENDPOINT_URL"):
    storage_options["aws_endpoint"] = endpoint
    storage_options["aws_allow_http"] = "true" if endpoint.startswith("http://") else "false"

dataset = lance.dataset(
    "s3://your-bucket/lance-demo/datasets/support-ticket-train",
    storage_options=storage_options,
)

table = dataset.to_table()
print(table.num_rows)
print(table["label"].to_pylist())
print(table["content"].to_pylist()[0].decode("utf-8").strip())
```

期望输出：

```text
3
['refund', 'resolved', 'escalation']
customer asked for a refund after the package arrived damaged
```

至此，你已经得到一个完整的 Lance 数据集：标签、原始文件路径和原始字节内容都被保存在一起，适合继续进入机器学习下游流程。
