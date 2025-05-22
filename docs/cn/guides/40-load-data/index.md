---
title: 将数据加载到 Databend
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 强大的 ETL 能力允许从各种来源和格式高效加载数据。
本指南提供了有关如何将数据导入 Databend 的详细说明。

## 数据导入和导出

<DetailsWrap>

<details>
<summary> Parquet </summary>

- [将 Parquet 加载到表](./03-load-semistructured/00-load-parquet.md)
- [将表导出到 Parquet](../50-unload-data/00-unload-parquet.md)
- [直接查询 Parquet](./04-transform/00-querying-parquet.md)
 
</details>

<details>
<summary> CSV </summary>

- [将 CSV 加载到表](./03-load-semistructured/01-load-csv.md)
- [将表导出到 CSV](../50-unload-data/01-unload-csv.md)
- [直接查询 CSV](./04-transform/01-querying-csv.md)

</details>


<details>
<summary> TSV </summary>

- [将 TSV 加载到表](./03-load-semistructured/02-load-tsv.md)
- [将表导出到 TSV](../50-unload-data/02-unload-tsv.md)
- [直接查询 TSV](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON </summary>

- [将 NDJSON 加载到表](./03-load-semistructured/03-load-ndjson.md)
- [将表导出到 NDJSON](../50-unload-data/03-unload-ndjson.md)
- [直接查询 NDJSON](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> ORC </summary>

- [将 ORC 加载到表](./03-load-semistructured/04-load-orc.md)
- [直接查询 ORC](./04-transform/03-querying-orc.md)

</details>

<details>
<summary> Avro </summary>

- [将 Avro 加载到表](./03-load-semistructured/05-load-avro.md)
- [直接查询 Avro](./04-transform/04-querying-avro.md)

</details>


</DetailsWrap>

## 从不同来源加载数据

<DetailsWrap>

<details>
<summary> 从 Stage 加载 </summary>

- [从 Stage 加载](./01-load/00-stage.md)

</details>

<details>
<summary> 从 Bucket (S3) 加载 </summary>

- [从 Bucket 加载](./01-load/01-s3.md)

</details>

<details>
<summary> 从本地文件加载 </summary>

- [从本地文件加载](./01-load/02-local.md)

</details>

<details>
<summary> 从远程文件加载 (HTTP/HTTPS) </summary>

- [从远程文件加载](./01-load/03-http.md)

</details>

</DetailsWrap>

## 从外部系统加载数据

<DetailsWrap>

<details>
<summary> MySQL 数据到 Databend </summary>

- [加载完整的 MySQL 表](./02-load-db/datax.md)
- [同步 MySQL 更改（全量和增量）](./02-load-db/debezium.md)

</details>

<details>
<summary> PostgreSQL 数据到 Databend </summary>

- [同步 PostgreSQL 更改（全量和增量）](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Oracle 数据到 Databend </summary>

- [同步 Oracle 更改（全量和增量）](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Flink 数据到 Databend </summary>

- [同步 Flink 数据](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Kafka 数据到 Databend </summary>

- [Kafka 数据摄取](./02-load-db/kafka.md)

</details>


</DetailsWrap>
