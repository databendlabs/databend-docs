---
title: 将数据加载到 Databend 中
---

Databend 的强大 ETL 能力允许从各种来源和格式高效加载数据。
本指南提供了如何将数据导入 Databend 的详细说明。

## 数据导入和导出

<details>
<summary> Parquet 文件 </summary>

- [如何将 Parquet 文件加载到表中](./03-load-semistructured/00-load-parquet.md)
- [如何将表导出到 Parquet 文件](../50-unload-data/00-unload-parquet.md)
- [如何直接在 Parquet 文件上查询](./04-transform/00-querying-parquet.md)

</details>

<details>
<summary> CSV 文件 </summary>

- [如何将 CSV 文件加载到表中](./03-load-semistructured/01-load-csv.md)
- [如何将表导出到 CSV 文件](../50-unload-data/01-unload-csv.md)
- [如何直接在 CSV 文件上查询](./04-transform/01-querying-csv.md)

</details>

<details>
<summary> TSV 文件 </summary>

- [如何将 TSV 文件加载到表中](./03-load-semistructured/02-load-tsv.md)
- [如何将表导出到 TSV 文件](../50-unload-data/02-unload-tsv.md)
- [如何直接在 TSV 文件上查询](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON 文件 </summary>

- [如何将 NDJSON 文件加载到表中](./03-load-semistructured/03-load-ndjson.md)
- [如何将表导出到 NDJSON 文件](../50-unload-data/03-unload-ndjson.md)
- [如何直接在 NDJSON 文件上查询](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> HTTP(S)、S3 和更多 </summary>

- [了解 Stage](./00-stage/index.md)
- [从 Stage 加载](./01-load/00-stage.md)
- [从桶加载](./01-load/01-s3.md)
- [从本地文件加载](./01-load/02-local.md)
- [从远程文件加载](./01-load/03-http.md)

</details>

## 从其他数据库加载数据

<details>
<summary> 将 MySQL 数据导入到 Databend </summary>

- [如何将完整的 MySQL 表加载到 Databend 中](./02-load-db/datax.md)
- [如何将 MySQL 的完整和增量更改同步到 Databend 中](./02-load-db/debezium.md)

</details>

<details>
<summary> 将 PostgreSQL 数据导入到 Databend </summary>

- [如何将 PostgreSQL 的完整和增量更改同步到 Databend 中](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> 将 Oracle 数据导入到 Databend </summary>

- [如何将 Oracle 的完整和增量更改同步到 Databend 中](./02-load-db/flink-cdc.md)

</details>
