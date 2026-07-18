---
title: AI 文档处理流水线
sidebar_position: 4
---

在 Databend Cloud 中搭建一条流水线：把 S3 中的 PDF / 图片变成可检索文档。

```text
S3 中的 PDF / PNG / JPG
        ↓ COPY INTO（去重 + OCR）
document_raw → document_raw_stream
        ↓ Embedding Task
ai_documents
  ├── 倒排索引 → 全文 / 实体检索
  └── 向量索引 → 语义检索
```

`COPY INTO` 用 Databend 的 copied-files 元数据记录已加载文件，并默认跳过已处理文件。Embedding Task 仅在 `document_raw_stream` 有新数据时运行。不需要文件清单表。

## 前置条件

- Databend Cloud Warehouse。请将下文 `etl_wh` 替换为实际名称。
- 可 list / 读对象的 S3 Bucket。
- 一台可由 Databend Cloud 通过 HTTPS Arrow Flight 访问的 Python UDF Server。
- 将 UDF 主机名加入租户的 UDF Server Allowlist。

:::important[Databend Cloud 网络配置]
外部函数使用 **Arrow Flight over gRPC/HTTP2**（不是 REST）。请将 UDF 以 HTTPS 暴露，并在 **Support → Create New Ticket** 中申请把主机名加入租户 **UDF Server Allowlist**；否则 `CREATE FUNCTION` 会返回 `Unallowed UDF server address`。如有防火墙限制，放通 Databend Cloud 出站地址的 TCP 443。
:::

本教程使用 `s3://my-ai-data/incoming/`。请按实际环境替换路径和凭证。

## 1. 上传示例文档

上传任意 PDF、PNG、JPG 或 JPEG。示例合同文本：

```text
SUPPLIER AGREEMENT
Acme Robotics signed this agreement with Northwind Logistics on July 1, 2026.
The delivery location is Seattle, Washington.
The total contract value is USD 125,000.
Either party may terminate the agreement with 30 days written notice.
```

```bash
aws s3 cp supplier-agreement.pdf \
  s3://my-ai-data/incoming/contracts/supplier-agreement.pdf
```

路径第一段 `contracts` 会作为 `source_group`。

:::important[使用不可变的对象路径]
`COPY INTO` 按 Stage 路径去重。已处理过的对象不要原地覆盖；请在路径中加入版本号、时间戳或内容哈希，例如 `contracts/supplier-agreement-v2.pdf`。
:::

## 2. 创建 Stage、表和 Stream

```sql
CREATE DATABASE IF NOT EXISTS document_ai;
USE document_ai;

CREATE OR REPLACE CONNECTION document_s3
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<AWS_ACCESS_KEY_ID>'
    SECRET_ACCESS_KEY = '<AWS_SECRET_ACCESS_KEY>';

CREATE OR REPLACE STAGE document_stage
    URL = 's3://my-ai-data/incoming/'
    CONNECTION = (CONNECTION_NAME = 'document_s3');

LIST @document_stage PATTERN = '.*[.](pdf|png|jpg|jpeg)';
```

本教程使用长期有效的 Stage 静态凭证。Databend 可以通过 `STAGE_LOCATION` 参数把 External Stage 传给 UDF，因此 UDF 不必再单独配置一套 AWS Key。

:::note[IAM Role / STS Stage]
`STAGE_LOCATION` 目前要求 Stage 使用静态凭证。如果 Stage 配置了 `role_arn` 或 `security_token`，Databend 会返回 `StageLocation: @... must use a separate credential`。这种情况下，`COPY INTO` 仍可继续用 Role；UDF 需要自行具备对象读权限。
:::

```sql
-- 每个源文件一条有效抽取记录；额外的 NULL 触发行由下游过滤。
CREATE OR REPLACE TABLE document_raw (
    document_id     STRING,
    source_group    STRING,
    file_path       STRING,
    file_row_number UINT64,
    extraction      VARIANT,
    extracted_at    TIMESTAMP
);

CREATE OR REPLACE STREAM document_raw_stream
    ON TABLE document_raw APPEND_ONLY = TRUE;

CREATE OR REPLACE TABLE ai_documents (
    document_id   STRING,
    source_group  STRING,
    file_path     STRING,
    content       STRING,
    entities      VARIANT,
    extraction    VARIANT,
    embedding     VECTOR(768),
    created_at    TIMESTAMP,
    INVERTED INDEX idx_document_search(content, extraction)
        FILTERS = 'english_stop,english_stemmer',
    VECTOR INDEX idx_document_embedding(embedding) distance = 'cosine'
);
```

## 3. 启动 External UDF Server

两个标量函数：

- `extract_document(data_stage, path, row_number)` → OCR 文本 + 实体，可空 `VARIANT`
- `embed_text_768(text)` → `VECTOR(768)`

PDF / 图片不是结构化表格式，`COPY INTO` 仅把它们当文本扫出触发行。UDF 只在 `row_number = 0` 时下载完整对象，其余行返回 `NULL`。

Stage 凭证由 Databend 通过 `STAGE_LOCATION` 注入：规划阶段会把 External Stage 序列化到 Flight Header `databend-stage-mapping`，Python SDK 再把它变成 `StageLocation` 参数。UDF 仍然需要能访问该对象存储的网络。

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y tesseract-ocr

python -m pip install \
  databend-udf \
  boto3 \
  pymupdf \
  pillow \
  pytesseract \
  spacy \
  sentence-transformers
python -m spacy download en_core_web_sm
```

```python title="document_udf_server.py"
import io
from pathlib import PurePosixPath

import boto3
import fitz
import pytesseract
import spacy
from PIL import Image
from databend_udf import StageLocation, UDFServer, udf
from sentence_transformers import SentenceTransformer

ner_model = spacy.load("en_core_web_sm")
embedding_model = SentenceTransformer(
    "sentence-transformers/all-mpnet-base-v2"
)


def read_pdf(data: bytes) -> str:
    pdf = fitz.open(stream=data, filetype="pdf")
    pages = []
    for page in pdf:
        text = page.get_text("text").strip()
        if len(text) < 20:
            pixmap = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            image = Image.open(io.BytesIO(pixmap.tobytes("png")))
            text = pytesseract.image_to_string(image, lang="eng").strip()
        pages.append(text)
    return "\n\n".join(pages)


def read_image(data: bytes) -> str:
    image = Image.open(io.BytesIO(data)).convert("RGB")
    return pytesseract.image_to_string(image, lang="eng").strip()


def s3_client(stage: StageLocation):
    storage = stage.storage or {}
    return boto3.client(
        "s3",
        region_name=storage.get("region") or None,
        aws_access_key_id=storage.get("access_key_id") or None,
        aws_secret_access_key=storage.get("secret_access_key") or None,
        endpoint_url=storage.get("endpoint_url") or None,
    )


def object_key(stage: StageLocation, file_path: str) -> str:
    relative = str(PurePosixPath(file_path)).lstrip("/")
    root = (stage.storage or {}).get("root", "").strip("/")
    prefix = stage.relative_path.strip("/")
    return "/".join(part for part in (root, prefix, relative) if part)


@udf(
    stage_refs=["data_stage"],
    input_types=["STRING", "UINT64"],
    result_type="VARIANT NULL",
)
def extract_document(
    data_stage: StageLocation,
    file_path: str,
    row_number: int,
) -> dict | None:
    # 二进制源文件可能产生多条 TEXT 触发行，仅第 0 行下载并处理完整对象。
    if row_number != 0:
        return None

    storage = data_stage.storage or {}
    bucket = storage.get("bucket")
    if not bucket:
        raise ValueError("STAGE_LOCATION is missing storage.bucket")

    key = object_key(data_stage, file_path)
    file_bytes = s3_client(data_stage).get_object(Bucket=bucket, Key=key)["Body"].read()
    suffix = PurePosixPath(file_path).suffix.lower()
    text = read_pdf(file_bytes) if suffix == ".pdf" else read_image(file_bytes)
    parsed = ner_model(text)

    entities = [
        {
            "text": entity.text,
            "type": entity.label_,
            "start": entity.start_char,
            "end": entity.end_char,
        }
        for entity in parsed.ents
    ]

    return {
        "text": text,
        "entities": entities,
        "extractor": "pymupdf+tesseract+spacy-v1",
    }


@udf(
    input_types=["STRING"],
    result_type="VECTOR(768)",
)
def embed_text_768(text: str) -> list[float]:
    return embedding_model.encode(
        text or "",
        normalize_embeddings=True,
    ).tolist()


if __name__ == "__main__":
    server = UDFServer("0.0.0.0:8815")
    server.add_function(extract_document)
    server.add_function(embed_text_768)
    server.serve()
```

```bash
python document_udf_server.py
```

`UDFServer` 在 `8815` 监听未加密 gRPC。前面请接支持 gRPC/HTTP2 的 TLS 代理，只对外开放 `443`：

```text
Databend Cloud → https://document-udf.example.com:443
               → TLS/gRPC load balancer
               → document_udf_server.py:8815
```

主机名加入 Allowlist 后注册函数。`STAGE_LOCATION` 必须是命名参数。`CREATE FUNCTION` 成功也意味着 DNS、TLS、gRPC、Handler 名称和类型均已通过校验：

```sql
CREATE OR REPLACE FUNCTION extract_document AS (
    data_stage STAGE_LOCATION,
    file_path STRING,
    row_number UINT64
)
    RETURNS VARIANT NULL
    LANGUAGE python
    HANDLER = 'extract_document'
    ADDRESS = 'https://document-udf.example.com';

CREATE OR REPLACE FUNCTION embed_text_768 AS (STRING)
    RETURNS VECTOR(768)
    LANGUAGE python
    HANDLER = 'embed_text_768'
    ADDRESS = 'https://document-udf.example.com';

SELECT VECTOR_DIMS(embed_text_768('supplier agreement'));
-- 768
```

可选：为静态 Token 附加请求 Header（在网关侧校验；基础 `UDFServer` 不做鉴权）：

```sql
CREATE OR REPLACE FUNCTION embed_text_768 AS (STRING)
    RETURNS VECTOR(768)
    LANGUAGE python
    HANDLER = 'embed_text_768'
    HEADERS = ('authorization' = 'Bearer <UDF_TOKEN>')
    ADDRESS = 'https://document-udf.example.com';
```

| 错误 | 可能原因 |
| --- | --- |
| `Unallowed UDF server address` | 主机名未加入 UDF Allowlist |
| `Cannot connect to UDF Server` | DNS、防火墙、TLS 或负载均衡器 |
| `UDF schema mismatch` | Python 装饰器类型与 SQL 类型不一致 |
| `StageLocation: @... must use a separate credential` | Stage 使用了 `role_arn` 或 STS 临时凭证 |
| gRPC `UNIMPLEMENTED`、HTTP 404/502 | 代理未正确转发 Arrow Flight / gRPC |

## 4. 手动跑通一次

### 第一步：复制并抽取

```sql
COPY INTO document_raw
FROM (
    SELECT
        MD5(metadata$filename),
        SPLIT_PART(metadata$filename, '/', 1),
        CONCAT(metadata$filename, LEFT($1, 0)),
        metadata$file_row_number,
        extract_document(
            @document_stage,
            metadata$filename,
            metadata$file_row_number
        ),
        NOW()
    FROM @document_stage
)
PATTERN = '.*[.](pdf|png|jpg|jpeg)'
FILE_FORMAT = (
    TYPE = TEXT
    FIELD_DELIMITER = ''
    ENCODING_ERROR_MODE = 'REPLACE'
);
```

说明：

- `$1` 仅用于让 Stage 二进制文件成为合法 `COPY` 源；`LEFT($1, 0)` 返回空字符串。
- `@document_stage` 是常量 `STAGE_LOCATION`。Databend 会把 Stage 存储凭证注入 UDF；UDF 再结合 `metadata$filename` 下载原始对象。

```sql
SELECT
    file_path,
    LEFT(extraction['text']::STRING, 300) AS text_preview,
    extraction['entities']                AS entities
FROM document_raw_stream
WHERE extraction IS NOT NULL;
```

抽取结果示例：

```json
{
  "text": "Acme Robotics signed this agreement with Northwind Logistics...",
  "entities": [
    {"text": "Acme Robotics", "type": "ORG", "start": 19, "end": 32},
    {"text": "Northwind Logistics", "type": "ORG", "start": 60, "end": 79},
    {"text": "July 1, 2026", "type": "DATE", "start": 83, "end": 95},
    {"text": "USD 125,000", "type": "MONEY", "start": 179, "end": 190}
  ],
  "extractor": "pymupdf+tesseract+spacy-v1"
}
```

### 第二步：生成 Embedding

```sql
INSERT INTO ai_documents
SELECT
    document_id,
    source_group,
    file_path,
    extraction['text']::STRING,
    extraction['entities'],
    extraction,
    embed_text_768(extraction['text']::STRING),
    NOW()
FROM document_raw_stream
WHERE extraction IS NOT NULL
  AND LENGTH(TRIM(extraction['text']::STRING)) > 0;
```

```sql
SELECT
    document_id,
    file_path,
    LEFT(content, 200) AS content_preview,
    entities
FROM ai_documents;
```

## 5. 自动运行

一个定时导入 Task + 一个 Stream 条件触发的 Embedding Task：

```sql
CREATE OR REPLACE TASK ingest_documents
    WAREHOUSE = 'etl_wh'
    SCHEDULE = 1 MINUTE
AS
COPY INTO document_ai.document_raw
FROM (
    SELECT
        MD5(metadata$filename),
        SPLIT_PART(metadata$filename, '/', 1),
        CONCAT(metadata$filename, LEFT($1, 0)),
        metadata$file_row_number,
        extract_document(
            @document_stage,
            metadata$filename,
            metadata$file_row_number
        ),
        NOW()
    FROM @document_stage
)
PATTERN = '.*[.](pdf|png|jpg|jpeg)'
FILE_FORMAT = (
    TYPE = TEXT
    FIELD_DELIMITER = ''
    ENCODING_ERROR_MODE = 'REPLACE'
);
```

```sql
CREATE OR REPLACE TASK embed_new_documents
    WAREHOUSE = 'etl_wh'
    SCHEDULE = 1 MINUTE
    WHEN STREAM_STATUS('document_ai.document_raw_stream') = TRUE
AS
INSERT INTO document_ai.ai_documents
SELECT
    document_id,
    source_group,
    file_path,
    extraction['text']::STRING,
    extraction['entities'],
    extraction,
    embed_text_768(extraction['text']::STRING),
    NOW()
FROM document_ai.document_raw_stream
WHERE extraction IS NOT NULL
  AND LENGTH(TRIM(extraction['text']::STRING)) > 0;
```

```sql
ALTER TASK ingest_documents RESUME;
ALTER TASK embed_new_documents RESUME;
```

导入失败时，`COPY INTO` 不会提交，下次可重试。Embedding 失败时 Stream Offset 不推进，下次会重试该批。被 `WHERE` 过滤掉的 `NULL` 触发行仍会随 Offset 消费，不会积压。

```text
ingest_documents → document_raw_stream → embed_new_documents → ai_documents
```

## 6. 检索

以下分数和距离均为示例值，会随索引内容和模型输出变化。

### 全文检索

用倒排索引在 OCR 文本中匹配关键词。适合你已经知道具体词项的场景，例如 `terminate`、`notice`。

```sql
SELECT
    document_id,
    file_path,
    SCORE() AS relevance,
    LEFT(content, 200) AS preview
FROM ai_documents
WHERE QUERY('content:(terminate OR termination) AND content:notice')
ORDER BY relevance DESC;
```

```text
file_path                                  relevance  preview
contracts/supplier-agreement.pdf           1.42       SUPPLIER AGREEMENT Acme Robotics signed ...
```

### 实体检索

检索 UDF 抽取出的结构化字段，例如机构名、日期、金额。适合做精确实体过滤，而不是自由文本关键词匹配。

```sql
SELECT document_id, file_path, entities
FROM ai_documents
WHERE QUERY(
    'extraction.entities.text:"Acme Robotics" AND extraction.entities.type:ORG'
);
```

```text
file_path                                  matched entity
contracts/supplier-agreement.pdf           Acme Robotics (ORG)
```

```sql
SELECT
    entity.value['type']::STRING AS entity_type,
    entity.value['text']::STRING AS entity_text,
    COUNT(*) AS document_count
FROM ai_documents,
LATERAL FLATTEN(input => entities) AS entity
GROUP BY entity_type, entity_text
ORDER BY document_count DESC;
```

```text
entity_type  entity_text             document_count
ORG          Acme Robotics           1
ORG          Northwind Logistics     1
DATE         July 1, 2026            1
GPE          Seattle                 1
MONEY        USD 125,000             1
```

### 语义检索

把查询文本向量化后，按向量距离排序。适合措辞不同、但语义相近的查询。

```sql
WITH query_vector AS (
    SELECT embed_text_768(
        'contracts that require advance termination notice'
    ) AS embedding
)
SELECT
    document_id,
    file_path,
    COSINE_DISTANCE(doc.embedding, query.embedding) AS distance,
    LEFT(content, 200) AS preview
FROM ai_documents AS doc
CROSS JOIN query_vector AS query
ORDER BY distance
LIMIT 10;
```

```text
file_path                                  distance  preview
contracts/supplier-agreement.pdf           0.18      SUPPLIER AGREEMENT Acme Robotics signed ...
```

Cosine Distance 越小，语义越接近。

### 混合检索

在同一条查询里组合分类过滤、关键词匹配和向量相似度。适合既要精确约束、又要语义排序的场景。

```sql
WITH query_vector AS (
    SELECT embed_text_768(
        'supplier contract cancellation terms'
    ) AS embedding
)
SELECT
    doc.document_id,
    doc.file_path,
    SCORE() AS text_score,
    COSINE_DISTANCE(doc.embedding, query.embedding) AS vector_distance
FROM ai_documents AS doc
CROSS JOIN query_vector AS query
WHERE doc.source_group = 'contracts'
  AND QUERY('content:(terminate OR notice OR cancellation)')
ORDER BY vector_distance, text_score DESC
LIMIT 10;
```

```text
file_path                                  text_score  vector_distance
contracts/supplier-agreement.pdf           1.27        0.21
```

## 7. 监控

```sql
SHOW TASKS LIKE '%documents%';

SELECT * FROM task_history('ingest_documents', 10);
SELECT * FROM task_history('embed_new_documents', 10);

SELECT COUNT(*) AS waiting_for_embedding
FROM document_raw_stream
WHERE extraction IS NOT NULL;

LIST @document_stage PATTERN = '.*[.](pdf|png|jpg|jpeg)';
```

```sql
ALTER TASK ingest_documents SUSPEND;
ALTER TASK embed_new_documents SUSPEND;
```

处理较长生产文档时，建议在 Embedding 前将文本分块，并按 `document_id`、`page_number`、`chunk_id` 各存一个向量。流水线其余部分不变。
