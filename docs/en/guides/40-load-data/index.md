---
title: Load Data into Databend
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend's powerful ETL capabilities allow for efficient data loading from a variety of sources and formats.
This guide provides detailed instructions on how to import data into Databend.

## Data Import and Export

<DetailsWrap>

<details>
<summary> Parquet </summary>

- [How to load Parquet file into a table](./03-load-semistructured/00-load-parquet.md)
- [How to export a table to Parquet file](../50-unload-data/00-unload-parquet.md)
- [How to query directly on Parquet file](./04-transform/00-querying-parquet.md)
 
</details>

<details>
<summary> CSV </summary>

- [How to load CSV file into a table](./03-load-semistructured/01-load-csv.md)
- [How to export a table to CSV file](../50-unload-data/01-unload-csv.md)
- [How to query directly on CSV file](./04-transform/01-querying-csv.md)

</details>


<details>
<summary> TSV </summary>

- [How to load TSV file into a table](./03-load-semistructured/02-load-tsv.md)
- [How to export a table to TSV file](../50-unload-data/02-unload-tsv.md)
- [How to query directly on TSV file](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON </summary>

- [How to load NDJSON file into a table](./03-load-semistructured/03-load-ndjson.md)
- [How to export a table to NDJSON file](../50-unload-data/03-unload-ndjson.md)
- [How to query directly on NDJSON file](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> ORC </summary>

- [How to load ORC file into a table](./03-load-semistructured/04-load-orc.md)
- [How to query directly on ORC file](./04-transform/03-querying-orc.md)

</details>


<details>
<summary> HTTP(S), S3, and More </summary>

- [Understanding Stages](./00-stage/index.md)
- [Loading from Stage](./01-load/00-stage.md)
- [Loading from Bucket](./01-load/01-s3.md)
- [Loading from Local File](./01-load/02-local.md)
- [Loading from Remote File](./01-load/03-http.md)

</details>

</DetailsWrap>

## Loading Data From Other Databases

<DetailsWrap>

<details>
<summary> MySQL Data to Databend </summary>

- [How to Load Full MySQL Tables into Databend](./02-load-db/datax.md)
- [How to Sync Full and Incremental MySQL Changes into Databend](./02-load-db/debezium.md)

</details>

<details>
<summary> PostgreSQL Data to Databend </summary>

- [How to Sync Full and Incremental PostgreSQL Changes into Databend](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Oracle Data to Databend </summary>

- [How to Sync Full and Incremental Oracle Changes into Databend](./02-load-db/flink-cdc.md)

</details>

</DetailsWrap>