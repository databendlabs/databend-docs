---
title: 将数据加载到Databend
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 强大的 ETL 功能支持从多种来源和格式高效加载数据。本指南详细介绍了如何将数据导入 Databend。

## 数据导入与导出

<DetailsWrap>

<details>
<summary> Parquet </summary>

- [如何将 Parquet 文件加载到表中](./03-load-semistructured/00-load-parquet.md)
- [如何将表导出为 Parquet 文件](../50-unload-data/00-unload-parquet.md)
- [如何直接在 Parquet 文件上进行查询](./04-transform/00-querying-parquet.md)

</details>

<details>
<summary> CSV </summary>

- [如何将 CSV 文件加载到表中](./03-load-semistructured/01-load-csv.md)
- [如何将表导出为 CSV 文件](../50-unload-data/01-unload-csv.md)
- [如何直接在 CSV 文件上进行查询](./04-transform/01-querying-csv.md)

</details>

<details>
<summary> TSV </summary>

- [如何将 TSV 文件加载到表中](./03-load-semistructured/02-load-tsv.md)
- [如何将表导出为 TSV 文件](../50-unload-data/02-unload-tsv.md)
- [如何直接在 TSV 文件上进行查询](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON </summary>

- [如何将 NDJSON 文件加载到表中](./03-load-semistructured/03-load-ndjson.md)
- [如何将表导出为 NDJSON 文件](../50-unload-data/03-unload-ndjson.md)
- [如何直接在 NDJSON 文件上进行查询](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> ORC </summary>

- [如何将 ORC 文件加载到表中](./03-load-semistructured/04-load-orc.md)
- [如何直接在 ORC 文件上进行查询](./04-transform/03-querying-orc.md)

</details>

<details>
<summary> HTTP(S), S3, 及其他 </summary>

- [理解 Stages](./00-stage/index.md)
- [从 Stage 加载数据](./01-load/00-stage.md)
- [从 Bucket 加载数据](./01-load/01-s3.md)
- [从本地文件加载数据](./01-load/02-local.md)
- [从远程文件加载数据](./01-load/03-http.md)

</details>

</DetailsWrap>

## 从其他数据库加载数据

<DetailsWrap>

<details>
<summary> MySQL数据到Databend </summary>

- [如何将 MySQL 表全量加载到 Databend](./02-load-db/datax.md)
- [如何同步 MySQL 的全量和增量变更到 Databend](./02-load-db/debezium.md)

</details>

<details>
<summary> PostgreSQL数据到Databend </summary>

- [如何同步 PostgreSQL 的全量和增量变更到 Databend](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Oracle数据到Databend </summary>

- [如何同步 Oracle 的全量和增量变更到 Databend](./02-load-db/flink-cdc.md)

</details>

</DetailsWrap>
