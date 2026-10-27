---
title: "向量检索与全文检索基准测试"
sidebar_label: "向量与全文检索基准测试"
toc_max_heading_level: 2
latency_cards:
  - title: 向量检索
    scale: 1000 万行
    note: 客户端延迟
    warm: [40.8, 43.2, 53.3]
    cold: [472, 695, 785]
  - title: 全文检索
    scale: 1000 万行
    note: 客户端延迟
    warm: [34.5, 40.5, 52.7]
    cold: [35.6, 99.2, 253.1]
---

import SignupCard from '@site/src/components/SignupCard';

本页给出向量检索和全文检索在 1000 万行数据上的查询延迟和吞吐，每次查询返回 Top 10 结果。所有数据集都是公开数据集。执行本页的 SQL，可以搭建相同的测试环境。

## 测试环境

| 项目       | 值                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Warehouse  | Small，单集群，默认配置，AWS us-east-2                                                                         |
| 客户端     | 同一 region，[AWS PrivateLink](/guides/cloud/security/private-link)，[HTTP Query API](/developer/apis/http)   |
| 延迟测试   | 8 QPS。客户端延迟：从发出请求到收到全部结果行。服务端延迟：在 warehouse 内的执行时间。                       |
| 吞吐测试   | 4–48 个并发客户端，热缓存                                                                                      |
| 热缓存     | 测试前缓存已填满                                                                                               |
| 冷缓存     | 测试开始时缓存为空                                                                                             |
| Recall@10  | 与全表扫描得到的精确 Top 10 的重合比例                                                                         |

## 向量检索

### 延迟

单位：ms。480 次请求，0 错误。

| 缓存          | 延迟    | p50  | p90  | p99  | Recall@10 |
| ------------- | ------- | ---: | ---: | ---: | --------: |
| 热 | 客户端 | 40.8 | 43.2 | 53.3 | 94.6%     |
| 热 | 服务端 | 27   | 28   | 29   | 94.6%     |
| 冷（估算） | 客户端 | 472  | 695  | 785  | 94.6%     |
| 冷（估算） | 服务端 | 458  | 680  | 760  | 94.6%     |

:::note
冷缓存数据为估算值：向量索引已在内存中，结果行从对象存储读取。
:::

### 吞吐

Small warehouse，单集群。单位：ms（客户端）。1,000 个查询向量，0 错误。

| 并发数      | QPS       | p50   | p90   | p99   |
| ----------: | --------: | ----: | ----: | ----: |
| 4           | 71.2      | 46.2  | 52.2  | 58.9  |
| 6           | 98.6      | 50.5  | 58.0  | 67.5  |
| 8           | 117.0     | 57.3  | 68.3  | 78.1  |
| 10          | **141.7** | 59.9  | 77.2  | 94.6  |
| 12          | 137.0     | 76.8  | 95.8  | 115.3 |

:::tip
并发数超过 12 后，QPS 稳定在约 120–125，延迟随之上升。如需更高的 QPS，请开启 [Multi-Cluster](/guides/cloud/resources/warehouses#multi-cluster-warehouses)，或使用[更大规格的 warehouse](/guides/cloud/resources/warehouses#warehouse-sizes)。
:::

### 数据集

| 项目    | 值                                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 来源    | [Wikipedia 2023-11 (en)](https://huggingface.co/datasets/CohereLabs/wikipedia-2023-11-embed-multilingual-v3)，文件 `0000`–`0099` |
| 行数    | 10,000,000 × 1024 维 float32（Cohere `embed-multilingual-v3`）                                                                   |
| 大小    | 原始 41.0 GB → 数据 19.4 GB + HNSW 索引 7.5 GB                                                                                   |
| 索引    | HNSW，cosine，`m = 32`, `ef_construct = 200`                                                                                    |
| 查询    | 文件 `0100` 中的 1,000 个向量（不在表中）                                                                                      |

### 加载与查询

使用 [Hugging Face CLI](https://huggingface.co/docs/huggingface_hub/guides/cli) 下载文件，再使用 [BendSQL](/guides/connect/sql-clients/bendsql) 上传到 stage：

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

## 全文检索

### 延迟

单位：ms。1,677 条查询，0 错误。

| 缓存  | 延迟    | p50  | p90  | p99   |
| ----- | ------- | ---: | ---: | ----: |
| 热 | 客户端 | 34.5 | 40.5 | 52.7  |
| 热 | 服务端 | 21   | 26   | 38    |
| 冷 | 客户端 | 35.6 | 99.2 | 253.1 |
| 冷 | 服务端 | 22   | 85   | 229   |

### 吞吐

Small warehouse，单集群。单位：ms（客户端）。1,677 条查询，0 错误。

| 并发数      | QPS       | p50  | p90   | p99   |
| ----------: | --------: | ---: | ----: | ----: |
| 4           | 82.4      | 38.1 | 45.2 | 57.5  |
| 6           | 109.6     | 43.3 | 55.4 | 71.8  |
| 8           | 120.0     | 53.8 | 72.1 | 90.1  |
| 10          | 127.2     | 67.4 | 85.3 | 103.4 |
| 12          | **128.0** | 82.2 | 101.0 | 132.2 |

:::tip
并发数超过 12 后，QPS 稳定在约 120–125，延迟随之上升。如需更高的 QPS，请开启 [Multi-Cluster](/guides/cloud/resources/warehouses#multi-cluster-warehouses)，或使用[更大规格的 warehouse](/guides/cloud/resources/warehouses#warehouse-sizes)。
:::

### 数据集

| 项目    | 值                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| 来源    | [MS MARCO v2.1 passages](https://huggingface.co/datasets/CohereLabs/msmarco-v2.1-embed-english-v3)，分片 `00`–`05` |
| 行数    | 10,000,000 条段落，平均 990 字节                                                                                   |
| 大小    | 原始 9.9 GB → 数据 2.1 GB + 倒排索引 3.5 GB                                                                        |
| 查询    | 1,677 条 TREC 2021–2023 查询                                                                                       |

### 加载与查询

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

<SignupCard title="在 Databend Cloud 上体验向量检索和全文检索" />
