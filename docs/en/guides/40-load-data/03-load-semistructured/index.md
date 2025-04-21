---
title: Loading Semi-structured Formats
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

## What is Semi-structured Data?

Semi-structured data is a form of data that does not conform to a rigid structure like traditional databases but still contains tags or markers to separate semantic elements and enforce hierarchies of records and fields. 

Databend facilitates the efficient and user-friendly loading of semi-structured data. It supports various formats such as **Parquet**, **CSV**, **TSV**, and **NDJSON**. 

Additionally, Databend allows for on-the-fly transformation of data during the loading process.
Copy from semi-structured data format is the most common way to load data into Databend, it is very efficient and easy to use.


## Supported Formats

Databend supports several semi-structured data formats loaded using the `COPY INTO` command:

<IndexOverviewList />
