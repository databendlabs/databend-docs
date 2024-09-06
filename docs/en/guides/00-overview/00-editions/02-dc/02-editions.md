---
title: Editions
---

import DatabendTable from '@site/src/components/DatabendTable';

Databend Cloud comes in three editions: **Standard**, **Business**, and **Dedicated**, that you can choose from to serve a wide range of needs and ensure optimal performance for different use cases.

For a quick overview of these editions, see [https://www.databend.com/databend-cloud](https://www.databend.com/databend-cloud). For the pricing information, see [Pricing & Billing](/guides/overview/editions/dc/pricing). For the detailed feature list among these editions, see [Feature Lists](#feature-lists).

## Feature Lists

The following are feature lists of Databend Cloud among editions:

#### Release Management

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
[`Early access to weekly new releases, which can be used for additional testing/validation before each release is deployed to your production accounts.`, 'No', 'Yes', 'Yes']
]} />

#### Security & Governance

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['SOC 1 Type I certification.', 'Yes', 'Yes', 'Yes'],
['Automatic encryption of all data.', 'Yes', 'Yes', 'Yes'],
['Object-level access control.', 'Yes', 'Yes', 'Yes'],
['Standard Time Travel (up to 1 day) for accessing/restoring modified and deleted data.', 'Yes', 'Yes', 'Yes'],
['Disaster recovery of modified/deleted data (for 7 days beyond Time Travel) through Fail-safe.', 'Yes', 'Yes', 'Yes'],
['<b>Extended Time Travel</b>.', 'No', '90 days', '90 days'],
['Column-level Security to apply masking policies to columns in tables or views.', 'Yes', 'Yes', 'Yes'],
['Audit the user access history through the Account Usage ACCESS_HISTORY view.', 'Yes', 'Yes', 'Yes'],
['<b>Support for private connectivity to the Databend Cloud service using AWS PrivateLink</b>.', 'No', 'Yes', 'Yes'],
['<b>Dedicated metadata store and pool of compute resources (used in virtual warehouses)</b>.', 'No', 'No', 'Yes'],
]}
/>

#### Compute Resource

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['Virtual warehouses, separate compute clusters for isolating query and data loading workloads.', 'Yes', 'Yes', 'Yes'],
['Resource monitors for monitoring virtual warehouse credit usage.', 'Yes', 'Yes', 'Yes'],
]}
/>

#### SQL Support

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['Standard SQL, including most DDL and DML defined in SQL:1999.', 'Yes', 'Yes', 'Yes'],
['Advanced DML such as multi-table INSERT, MERGE, and multi-merge.', 'Yes', 'Yes', 'Yes'],
['Broad support for standard data types.', 'Yes', 'Yes', 'Yes'],
['Native support for semi-structured data (JSON, ORC, Parquet).', 'Yes', 'Yes', 'Yes'],
['Native support for geospatial data.', 'Yes', 'Yes', 'Yes'],
['Native support for unstructured data.', 'Yes', 'Yes', 'Yes'],
['Collation rules for string/text data in table columns.', 'Yes', 'Yes', 'Yes'],
['Multi-statement transactions.', 'Yes', 'Yes', 'Yes'],
['User-defined functions (UDFs) with support for JavaScript, Python, and WebAssembly.', 'Yes', 'Yes', 'Yes'],
['External functions for extending Databend Cloud to other development platforms.', 'Yes', 'Yes', 'Yes'],
['Amazon API Gateway private endpoints for external functions.', 'Yes', 'Yes', 'Yes'],
['External tables for referencing data in a cloud storage data lake.', 'Yes', 'Yes', 'Yes'],
['Support for clustering data in very large tables to improve query performance, with automatic maintenance of clustering.', 'Yes', 'Yes', 'Yes'],
['Search optimization for point lookup queries, with automatic maintenance.', 'Yes', 'Yes', 'Yes'],
['Materialized views, with automatic maintenance of results.', 'Yes', 'Yes', 'Yes'],
['Iceberg tables for referencing data in a cloud storage data lake.', 'Yes', 'Yes', 'Yes'],
['Schema detection for automatically detecting the schema in a set of staged semi-structured data files and retrieving the column definitions.', 'Yes', 'Yes', 'Yes'],
['Schema evolution for automatically evolving tables to support the structure of new data received from the data sources.', 'Yes', 'Yes', 'Yes'],
['Support for <a href="/sql/sql-commands/ddl/table/ddl-create-table-external-location" target="_self">creating table with external location</a>.', 'Yes', 'Yes', 'Yes'],
['Supports for <a href="/sql/sql-commands/ddl/table/attach-table" target="_self">ATTACH TABLE</a>.', 'Yes', 'Yes', 'Yes'],
]}
/>

#### Interfaces & Tools

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['The next-generation SQL worksheet for advanced query development, data analysis, and visualization.', 'Yes', 'Yes', 'Yes'],
['BendSQL, a command line client for building/testing queries, loading/unloading bulk data, and automating DDL operations.', 'Yes', 'Yes', 'Yes'],
['Programmatic interfaces for Rust, Python, Java, Node.js, .js, PHP, and Go.', 'Yes', 'Yes', 'Yes'],
['Native support for JDBC.', 'Yes', 'Yes', 'Yes'],
['Extensive ecosystem for connecting to ETL, BI, and other third-party vendors and technologies.', 'Yes', 'Yes', 'Yes'],
]}
/>

#### Data Import & Export

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['Bulk loading from delimited flat files (CSV, TSV, etc.) and semi-structured data files (JSON, ORC, Parquet).', 'Yes', 'Yes', 'Yes'],
['Bulk unloading to delimited flat files and JSON files.', 'Yes', 'Yes', 'Yes'],
['Continuous micro-batch loading.', 'Yes', 'Yes', 'Yes'],
['Streaming for low-latency loading of streaming data.', 'Yes', 'Yes', 'Yes'],
['Databend Cloud Connector for Kafka for loading data from Apache Kafka topics.', 'Yes', 'Yes', 'Yes'],
]}
/>

#### Data Pipelines

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['Streams for tracking table changes.', 'Yes', 'Yes', 'Yes'],
['Tasks for scheduling the execution of SQL statements, often in conjunction with table streams.', 'Yes', 'Yes', 'Yes'],
]}
/>

#### Customer Support

<DatabendTable
width={['67%', '11%', '11%', '11%']}
thead={['Features', 'Standard', 'Business', 'Dedicated']}
tbody={[
['Logging and tracking support tickets.', 'Yes', 'Yes', 'Yes'],
['4/7 coverage and 1-hour response window for Severity 1 issues.', 'Yes', 'Yes', 'Yes'],
['<b>Response to non-severity-1 issues in hours</b>.', '8h', '4h', '1h'],
]}
/>
