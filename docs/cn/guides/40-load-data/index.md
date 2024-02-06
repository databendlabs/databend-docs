---
title: 将数据加载到Databend中
---

Databend的强大ETL功能允许高效地从各种来源和格式加载数据。
本指南提供了如何将数据导入Databend的详细说明。

## 数据导入和导出

<details>
<summary> Parquet 文件 </summary>

- [如何将Parquet文件加载到表中](./03-load-semistructured/00-load-parquet.md)
- [如何将表导出到Parquet文件](../50-unload-data/00-unload-parquet.md)
- [如何直接在Parquet文件上查询](./04-transform/00-querying-parquet.md)
 
</details>

<details>
<summary> CSV 文件 </summary>

- [如何将CSV文件加载到表中](./03-load-semistructured/01-load-csv.md)
- [如何将表导出到CSV文件](../50-unload-data/01-unload-csv.md)
- [如何直接在CSV文件上查询](./04-transform/01-querying-csv.md)

</details>


<details>
<summary> TSV 文件 </summary>

- [如何将TSV文件加载到表中](./03-load-semistructured/02-load-tsv.md)
- [如何将表导出到TSV文件](../50-unload-data/02-unload-tsv.md)
- [如何直接在TSV文件上查询](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON 文件 </summary>

- [如何将NDJSON文件加载到表中](./03-load-semistructured/03-load-ndjson.md)
- [如何将表导出到NDJSON文件](../50-unload-data/03-unload-ndjson.md)
- [如何直接在NDJSON文件上查询](./04-transform/03-querying-ndjson.md)

</details>


<details>
<summary> HTTP(S)、S3及更多 </summary>

- [了解阶段](./00-stage/index.md)
- [从阶段加载](./01-load/00-stage.md)
- [从桶加载](./01-load/01-s3.md)
- [从本地文件加载](./01-load/02-local.md)
- [从远程文件加载](./01-load/03-http.md)

</details>


## 从其他数据库加载数据

<details>
<summary> 将MySQL数据导入Databend </summary>

- [如何将完整的MySQL表加载到Databend中](./02-load-db/datax.md)
- [如何将MySQL的全量和增量变更同步到Databend中](./02-load-db/debezium.md)

</details>

<details>
<summary> 将PostgreSQL数据导入Databend </summary>

- [如何将PostgreSQL的全量和增量变更同步到Databend中](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> 将Oracle数据导入Databend </summary>

- [如何将Oracle的全量和增量变更同步到Databend中](./02-load-db/flink-cdc.md)

</details>