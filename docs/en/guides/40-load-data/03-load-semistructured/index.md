---
title: Loading Semi-structured Data
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

## What is Semi-structured Data?

Semi-structured data is a form of data that does not conform to a rigid structure like traditional databases but still contains tags or markers to separate semantic elements and enforce hierarchies of records and fields. 

Databend facilitates the efficient and user-friendly loading of semi-structured data. It supports various formats such as **Parquet**, **CSV**, **TSV**, and **NDJSON**. 

Additionally, Databend allows for on-the-fly transformation of data during the loading process.
Copy from semi-structured data format is the most common way to load data into Databend, it is very efficient and easy to use.


## Supported Formats

Databend supports several semi-structured data formats loaded using the `COPY INTO` command:

- **Parquet**: A columnar storage format, ideal for optimizing data storage and retrieval. It is best suited for complex data structures and offers efficient data compression and encoding schemes.

- **CSV (Comma-Separated Values)**: A simple format that is widely used for data exchange. CSV files are easy to read and write but might not be ideal for complex hierarchical data structures.

- **TSV (Tab-Separated Values)**: Similar to CSV, but uses tabs as delimiters. It's often used for data with simple structures that require a delimiter other than a comma.

- **NDJSON (Newline Delimited JSON)**: This format represents JSON data with each JSON object separated by a newline. It is particularly useful for streaming large datasets and handling data that changes frequently. NDJSON facilitates the processing of large volumes of data by breaking it down into manageable, line-delimited chunks.


For detailed instructions on how to load semi-structured data, check out the following topics:
<IndexOverviewList />
