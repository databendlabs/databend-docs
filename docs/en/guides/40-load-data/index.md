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

- [Load Parquet into table](./03-load-semistructured/00-load-parquet.md)
- [Export table to Parquet](../50-unload-data/00-unload-parquet.md)
- [Query Parquet directly](./04-transform/00-querying-parquet.md)
 
</details>

<details>
<summary> CSV </summary>

- [Load CSV into table](./03-load-semistructured/01-load-csv.md)
- [Export table to CSV](../50-unload-data/01-unload-csv.md)
- [Query CSV directly](./04-transform/01-querying-csv.md)

</details>


<details>
<summary> TSV </summary>

- [Load TSV into table](./03-load-semistructured/02-load-tsv.md)
- [Export table to TSV](../50-unload-data/02-unload-tsv.md)
- [Query TSV directly](./04-transform/02-querying-tsv.md)

</details>

<details>
<summary> NDJSON </summary>

- [Load NDJSON into table](./03-load-semistructured/03-load-ndjson.md)
- [Export table to NDJSON](../50-unload-data/03-unload-ndjson.md)
- [Query NDJSON directly](./04-transform/03-querying-ndjson.md)

</details>

<details>
<summary> ORC </summary>

- [Load ORC into table](./03-load-semistructured/04-load-orc.md)
- [Query ORC directly](./04-transform/03-querying-orc.md)

</details>

<details>
<summary> Avro </summary>

- [Load Avro into table](./03-load-semistructured/05-load-avro.md)

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

## Loading Data from External Systems

<DetailsWrap>

<details>
<summary> MySQL Data to Databend </summary>

- [Load Full MySQL Tables](./02-load-db/datax.md)
- [Sync MySQL Changes (Full & Incremental)](./02-load-db/debezium.md)

</details>

<details>
<summary> PostgreSQL Data to Databend </summary>

- [Sync PostgreSQL Changes (Full & Incremental)](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Oracle Data to Databend </summary>

- [Sync Oracle Changes (Full & Incremental)](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Flink Data to Databend </summary>

- [Sync Flink Data](./02-load-db/flink-cdc.md)

</details>

<details>
<summary> Kafka Data to Databend </summary>

- [Kafka Data Ingestion](./02-load-db/kafka.md)

</details>


</DetailsWrap>
