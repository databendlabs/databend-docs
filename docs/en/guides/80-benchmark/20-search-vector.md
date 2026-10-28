---
title: "Vector and Full-Text Search Benchmark"
sidebar_label: "Vector & Full-Text Benchmark"
toc_max_heading_level: 2
latency_cards:
  - title: Vector Query
    scale: 10M docs
    note: Client latency
    warm: [40.8, 43.2, 53.3]
    cold: [472, 695, 785]
  - title: Full-Text Query
    scale: 10M docs
    note: Client latency
    warm: [34.5, 40.5, 52.7]
    cold: [35.6, 99.2, 253.1]
---

import SignupCard from '@site/src/components/SignupCard';

Query latency and throughput of vector search and full-text search on 10 million rows, top 10 results. All datasets are public. You can run the SQL on this page to get the same setup.

## Test Environment

| Item       | Value                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Warehouse  | Small, one cluster, default settings, AWS us-east-2                                                            |
| Client     | Same region, [AWS PrivateLink](/guides/cloud/security/private-link), [HTTP Query API](/developer/apis/http)   |
| Latency    | 8 QPS. Client: request sent to all rows received. Server: time in the warehouse.                               |
| Throughput | 4–48 concurrent clients, warm cache                                                                            |
| Warm cache | The cache is full before the test                                                                              |
| Cold cache | The cache is empty at the start of the test                                                                    |
| Recall@10  | Overlap with the exact top 10 of a full scan                                                                   |

## Vector Search

### Latency

Unit: ms. 480 requests, 0 errors.

| Cache         | Latency | p50  | p90  | p99  | Recall@10 |
| ------------- | ------- | ---: | ---: | ---: | --------: |
| Warm          | Client  | 40.8 | 43.2 | 53.3 | 94.6%     |
| Warm          | Server  | 27   | 28   | 29   | 94.6%     |
| Cold (est.)   | Client  | 472  | 695  | 785  | 94.6%     |
| Cold (est.)   | Server  | 458  | 680  | 760  | 94.6%     |

:::note
The cold values are estimates. The vector index is in memory, and the result rows come from object storage.
:::

### Throughput

Small warehouse, one cluster. Unit: ms (client). 1,000 query vectors, 0 errors.

| Concurrency | QPS       | p50   | p90   | p99   |
| ----------: | --------: | ----: | ----: | ----: |
| 4           | 71.2      | 46.2  | 52.2  | 58.9  |
| 6           | 98.6      | 50.5  | 58.0  | 67.5  |
| 8           | 117.0     | 57.3  | 68.3  | 78.1  |
| 10          | **141.7** | 59.9  | 77.2  | 94.6  |
| 12          | 137.0     | 76.8  | 95.8  | 115.3 |

:::tip
Above 12 concurrent clients, QPS stays at approximately 120–125 and latency increases. For more QPS, enable [Multi-Cluster](/guides/cloud/resources/warehouses#multi-cluster-warehouses) or use a [larger warehouse](/guides/cloud/resources/warehouses#warehouse-sizes).
:::

### Dataset

| Item    | Value                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Source  | [Wikipedia 2023-11 (en)](https://huggingface.co/datasets/CohereLabs/wikipedia-2023-11-embed-multilingual-v3), files `0000`–`0099` |
| Rows    | 10,000,000 × 1024-dim float32 (Cohere `embed-multilingual-v3`)                                                                  |
| Size    | 41.0 GB raw → 19.4 GB data + 7.5 GB HNSW index                                                                                  |
| Index   | HNSW, cosine, `m = 32`, `ef_construct = 200`                                                                                    |
| Queries | 1,000 vectors from file `0100` (not in the table)                                                                               |

### Load and Query

Download the files with the [Hugging Face CLI](https://huggingface.co/docs/huggingface_hub/guides/cli), and upload them to a stage with [BendSQL](/guides/connect/sql-clients/bendsql):

```bash
# 1. Download files 0000–0100 (approximately 22 GB)
hf download CohereLabs/wikipedia-2023-11-embed-multilingual-v3 --repo-type dataset \
  --revision ade45fb52bd549f5e8c065636fe4160a43c2af36 \
  --include "en/00*.parquet" "en/0100.parquet" --local-dir /data/wiki

# 2. Upload the files to a stage
bendsql --query "CREATE STAGE wiki_stage FILE_FORMAT = (TYPE = PARQUET)"
bendsql --query "PUT fs:///data/wiki/en/*.parquet @wiki_stage/"
```

```sql
-- 3. Table with a vector index
CREATE TABLE vec_10m (
    id  BIGINT,
    emb VECTOR(1024),
    VECTOR INDEX vidx (emb) distance = 'cosine' m = 32 ef_construct = 200
);

-- 4. Load files 0000–0099 (10,000,000 rows). Hash the string _id to BIGINT.
COPY INTO vec_10m
FROM (SELECT xxhash64(_id) >> 1, emb FROM @wiki_stage)
PATTERN = '00[0-9][0-9][.]parquet';

-- 5. Query vectors from file 0100
CREATE TABLE vec_queries AS
SELECT _id, emb::VECTOR(1024) AS emb
FROM @wiki_stage/0100.parquet
LIMIT 1000;

-- 6. Top 10 query. Use a vector from vec_queries.
SELECT id, cosine_distance(emb, [0.0123, -0.0456, ...]::VECTOR(1024)) AS distance
FROM vec_10m
ORDER BY distance ASC
LIMIT 10;
```

## Full-Text Search

### Latency

Unit: ms. 1,677 queries, 0 errors.

| Cache | Latency | p50  | p90  | p99   |
| ----- | ------- | ---: | ---: | ----: |
| Warm  | Client  | 34.5 | 40.5 | 52.7  |
| Warm  | Server  | 21   | 26   | 38    |
| Cold  | Client  | 35.6 | 99.2 | 253.1 |
| Cold  | Server  | 22   | 85   | 229   |

### Throughput

Small warehouse, one cluster. Unit: ms (client). 1,677 queries, 0 errors.

| Concurrency | QPS       | p50  | p90   | p99   |
| ----------: | --------: | ---: | ----: | ----: |
| 4           | 82.4      | 38.1 | 45.2 | 57.5  |
| 6           | 109.6     | 43.3 | 55.4 | 71.8  |
| 8           | 120.0     | 53.8 | 72.1 | 90.1  |
| 10          | 127.2     | 67.4 | 85.3 | 103.4 |
| 12          | **128.0** | 82.2 | 101.0 | 132.2 |

:::tip
Above 12 concurrent clients, QPS stays at approximately 120–125 and latency increases. For more QPS, enable [Multi-Cluster](/guides/cloud/resources/warehouses#multi-cluster-warehouses) or use a [larger warehouse](/guides/cloud/resources/warehouses#warehouse-sizes).
:::

### Dataset

| Item    | Value                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| Source  | [MS MARCO v2.1 passages](https://huggingface.co/datasets/CohereLabs/msmarco-v2.1-embed-english-v3), shards `00`–`05` |
| Rows    | 10,000,000 passages, 990 bytes average                                                                             |
| Size    | 9.9 GB raw → 2.1 GB data + 3.5 GB inverted index                                                                   |
| Queries | 1,677 TREC 2021–2023 queries                                                                                       |

### Load and Query

```bash
# 1. Download shards 00–05 and the queries (approximately 26 GB)
hf download CohereLabs/msmarco-v2.1-embed-english-v3 --repo-type dataset \
  --revision e78737fe92ac1b783211b705c12207ca75fcc9b7 \
  --include "passages_parquet/*segmented_0[0-5].parquet" "queries_parquet/queries.parquet" \
  --local-dir /data/msmarco

# 2. Upload the files to a stage
bendsql --query "CREATE STAGE msmarco_stage FILE_FORMAT = (TYPE = PARQUET)"
bendsql --query "PUT fs:///data/msmarco/*/*.parquet @msmarco_stage/"
```

```sql
-- 3. Table with an inverted index
CREATE TABLE fts_10m (
    id   VARCHAR,
    text VARCHAR,
    INVERTED INDEX idx_text (text)
);

-- 4. Load shards 00–04 (9,511,868 rows), then 488,132 rows of shard 05
COPY INTO fts_10m
FROM (SELECT docid, segment FROM @msmarco_stage)
PATTERN = '.*segmented_0[0-4][.]parquet';

INSERT INTO fts_10m
SELECT docid, segment
FROM @msmarco_stage/msmarco_v2.1_doc_segmented_05.parquet
LIMIT 488132;

-- 5. Queries
CREATE TABLE fts_queries AS
SELECT _id, text
FROM @msmarco_stage/queries.parquet;

-- 6. Top 10 query. Use a text from fts_queries in lowercase,
--    with special characters escaped by a backslash (\).
SELECT id, score() AS score
FROM fts_10m
WHERE MATCH(text, 'what is produced by muscle', 'operator=or')
ORDER BY score DESC
LIMIT 10;
```

<SignupCard title="Ready to run vector and full-text search on Databend Cloud?" />
