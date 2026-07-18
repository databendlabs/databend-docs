---
title: AI Document Pipeline
sidebar_position: 4
---

Build a pipeline that turns PDFs and images in S3 into searchable documents:

```text
PDF / PNG / JPG in S3
        ↓ COPY INTO (dedup + OCR)
document_raw → document_raw_stream
        ↓ Embedding task
ai_documents
  ├── Inverted index → full-text / entity search
  └── Vector index   → semantic search
```

`COPY INTO` records loaded files in Databend's copied-files metadata and skips already-loaded files by default. The embedding task runs only when `document_raw_stream` has new rows. No file-manifest table is required.

## Prerequisites

- A Databend Cloud warehouse. Replace `etl_wh` below with its name.
- An S3 bucket with list and read permission.
- A Python UDF server exposed to Databend Cloud over HTTPS Arrow Flight.
- The UDF hostname added to your tenant's UDF server allowlist.

:::important[Databend Cloud network setup]
Before `CREATE FUNCTION`, open **Support → Create New Ticket** and ask Databend Cloud to add the UDF hostname (for example `document-udf.example.com`) to the tenant **UDF server allowlist**. Otherwise you get `Unallowed UDF server address`.

The endpoint needs a public TLS certificate and **Apache Arrow Flight over gRPC/HTTP2**. Plain HTTPS/REST or HTTP/1-only proxies will not work. If the firewall is locked down, ask Support for your region's Databend Cloud egress addresses and allow TCP 443.
:::

This tutorial uses `s3://my-ai-data/incoming/`. Replace the path and credentials for your environment.

## 1. Upload a Sample Document

Upload any PDF, PNG, JPG, or JPEG. Example contract text:

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

The first path segment (`contracts`) becomes `source_group`.

:::important[Use immutable object keys]
`COPY INTO` deduplicates by staged path. Do not overwrite an existing key after processing. Use a version, timestamp, or content hash, for example `contracts/supplier-agreement-v2.pdf`.
:::

## 2. Create the Stage and Tables

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

Use long-lived stage credentials for this tutorial. Databend can pass that External Stage into the UDF through a `STAGE_LOCATION` parameter, so the UDF does not need a second set of AWS keys.

:::note[IAM Role / STS stages]
`STAGE_LOCATION` currently requires static stage credentials. If the stage uses `role_arn` or `security_token`, Databend returns `StageLocation: @... must use a separate credential`. In that case, keep Role-based access for `COPY INTO`, and give the UDF its own read permission instead.
:::

```sql
-- One useful extraction row per file; extra NULL trigger rows are filtered later.
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

## 3. Start the External UDF Server

Two scalar functions:

- `extract_document(data_stage, path, row_number)` → OCR text + entities as nullable `VARIANT`
- `embed_text_768(text)` → `VECTOR(768)`

PDF and image files are not structured table formats, so `COPY INTO` scans them as text only to produce trigger rows. The UDF downloads the real object only when `row_number = 0` and returns `NULL` for other rows.

The stage credentials come from Databend through the `STAGE_LOCATION` parameter. Databend serializes the External Stage into the Flight header `databend-stage-mapping`; the Python SDK injects it as a `StageLocation` argument. The UDF still needs network access to the object store.

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y tesseract-ocr

python -m pip install \
  'databend-udf==0.2.20' \
  'boto3==1.43.48' \
  'pymupdf==1.28.0' \
  'pillow==12.3.0' \
  'pytesseract==0.3.13' \
  'spacy==3.8.13' \
  'sentence-transformers==5.6.0'
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
    # Binary sources can produce several TEXT trigger rows. Only row 0
    # downloads and processes the complete object.
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

`UDFServer` listens for unencrypted gRPC on `8815`. Put TLS + gRPC/HTTP2 in front of it and expose only `443`:

```text
Databend Cloud → https://document-udf.example.com:443
               → TLS/gRPC load balancer
               → document_udf_server.py:8815
```

Register the functions after the hostname is on the allowlist. `STAGE_LOCATION` must be a named parameter. A successful `CREATE FUNCTION` also verifies DNS, TLS, gRPC routing, handler name, and types:

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

Optional request header for a static token (validate it at the gateway; base `UDFServer` does not authenticate):

```sql
CREATE OR REPLACE FUNCTION embed_text_768 AS (STRING)
    RETURNS VECTOR(768)
    LANGUAGE python
    HANDLER = 'embed_text_768'
    HEADERS = ('authorization' = 'Bearer <UDF_TOKEN>')
    ADDRESS = 'https://document-udf.example.com';
```

| Error | Likely cause |
| --- | --- |
| `Unallowed UDF server address` | Hostname not on the UDF allowlist |
| `Cannot connect to UDF Server` | DNS, firewall, TLS, or load balancer |
| `UDF schema mismatch` | Python decorator types ≠ SQL types |
| `StageLocation: @... must use a separate credential` | Stage uses `role_arn` or STS temporary credentials |
| gRPC `UNIMPLEMENTED`, HTTP 404/502 | Proxy is not forwarding Arrow Flight / gRPC |

## 4. Run Once Manually

### Step 1: Copy and extract

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

Notes:

- `$1` is only referenced so the staged binary becomes a valid `COPY` source; `LEFT($1, 0)` contributes an empty string.
- `@document_stage` is a constant `STAGE_LOCATION`. Databend injects its storage credentials into the UDF; the UDF downloads the original object with `metadata$filename`.

```sql
SELECT
    file_path,
    LEFT(extraction['text']::STRING, 300) AS text_preview,
    extraction['entities']                AS entities
FROM document_raw_stream
WHERE extraction IS NOT NULL;
```

Example extraction:

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

### Step 2: Embed

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

## 5. Automate

One scheduled ingestion task and one stream-triggered embedding task:

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

If ingestion fails, `COPY INTO` does not commit, so the next run retries. If embedding fails, the stream offset does not advance, so the next run retries that batch. Filtered `NULL` trigger rows are still consumed with the stream offset and do not accumulate.

```text
ingest_documents → document_raw_stream → embed_new_documents → ai_documents
```

## 6. Search

Scores and distances below are illustrative; they vary with index contents and model output.

### Full-text

Match keywords in the OCR text with the inverted index. Use this when you know the exact terms, such as `terminate` and `notice`.

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

### Entities

Search structured fields extracted by the UDF, such as organization names, dates, or amounts. Use this for exact entity filters rather than free-text keywords.

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

### Semantic

Embed the query and rank documents by vector distance. Use this when the wording differs from the document, but the meaning is similar.

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

Lower cosine distance means closer semantic match.

### Hybrid

Combine a category filter, keyword match, and vector similarity in one query. Use this when you want both exact constraints and semantic ranking.

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

## 7. Monitor

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

For long production documents, chunk the extracted text before embedding and store one vector per `document_id`, `page_number`, and `chunk_id`. The rest of the pipeline stays the same.
