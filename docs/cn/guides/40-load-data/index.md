---
title: 将数据加载到Databend
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend强大的ETL功能支持从多种来源和格式高效加载数据。本指南详细介绍了如何将数据导入Databend。

## 数据导入与导出

<DetailsWrap>

<details>
<summary> Parquet </summary>

- [如何将Parquet文件加载到表中](./03-load-semistructured/00-load-parquet.md)
- [如何将表导出为Parquet文件](../50-unload-data/00-unload-parquet.md)
- [如何直接在Parquet文件上进行查询](./04-transform/00-querying-parquet.md)
 
</details>

<details>
<summary> CSV </summary>

- [如何将CSV文件加载到表中](./03-load-semistructured/01-load-csv.md)
- [如何将表导出为CSV文件](../50-unload-data/01-unload-csv.md)
- [如何直接在CSV文件上进行查询](./04-transform/01-querying-csv.md)

</details>


<details>
<summary> TSV </summary>

- [如何将TSV文件加载到表中](./03-load-semistructured/02-load-tsv.md)
- [如何将表导出为TSV文件](../50-unload-data/02-unload-tsv.md)
- [如何直接在TSV文件上进行查询](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON </summary>

- [如何将NDJSON文件加载到表中](./03-load-semistructured/03-load-ndjson.md)
- [如何将表导出为NDJSON文件](../50-unload-data/03-unload-ndjson.md)
- [如何直接在NDJSON文件上进行查询](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> ORC </summary>

- [如何将ORC文件加载到表中](./03-load-semistructured/04-load-orc.md)
- [如何直接在ORC文件上进行查询](./04-transform/03-querying-orc.md)

</details>


<details>
<summary> HTTP(S), S3, 及其他 </summary>

- [理解Stages](./00-stage/index.md)
- [从Stage加载数据](./01-load/00-stage.md)
- [从Bucket加载数据](./01-load/01-s3.md)
- [从本地文件加载数据](./01-load/02-local.md)
- [从远程文件加载数据](./01-load/03-http.md)

</details>

</DetailsWrap>

## 从其他数据库加载数据

<DetailsWrap>

<details>
<summary> MySQL数据到Databend </summary>

- [如何将MySQL表全量加载到Databend](./02-load-db/datax.md)
- [如何同步MySQL的全量和增量变更到Databend](./02-load-db/debezium.md)

</details>

<details>
<summary> PostgreSQL数据到Databend </summary>

- [如何同步PostgreSQL的全量和增量变更到Databend](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Oracle数据到Databend </summary>

- [如何同步Oracle的全量和增量变更到Databend](./02-load-db/flink-cdc.md)

</details>

</DetailsWrap>