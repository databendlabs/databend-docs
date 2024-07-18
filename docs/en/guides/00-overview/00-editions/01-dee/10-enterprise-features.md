---
title: Enterprise Features
---

This page provides an updated list of available enterprise features. To access these features, you will need an enterprise or trial license. For more details, see [Licensing Databend](20-license.md).

### Enterprise Feature List

| Feature                                                                          | Category       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Vacuum Temp Files](/sql/sql-commands/administration-cmds/vacuum-temp-files)     | Storage        | - Free up storage by removing temporary files, notably join, aggregate, and sort spill files.<br/>- Set retention and file limits as needed.                                                                                                                                                                                                                                                                                                                                |
| [Vacuum Dropped Table](/sql/sql-commands/ddl/table/vacuum-drop-table)            | Storage        | Optimizes storage by deleting data files of dropped tables. Offers a recovery option and a dry-run preview.                                                                                                                                                                                                                                                                                                                                                                 |
| [Vacuum Historical Data](/sql/sql-commands/ddl/table/vacuum-table)               | Storage        | Deep clean your storage space:<br/>- Remove orphan segment and block files. <br/>- Safely preview the removal of data files using the dry-run option.                                                                                                                                                                                                                                                                                                                       |
| [Virtual Column](/sql/sql-commands/ddl/virtual-column)                           | Query          | Enhance efficiency in querying Variant data:<br/>- Virtual columns streamline queries, eliminating the need to traverse the entire nested structure. Direct data retrieval accelerates query execution.<br/>- Virtual columns significantly cut memory usage in Variant data, reducing the risk of memory overflows.                                                                                                                                                        |
| [Aggregating Index](/sql/sql-commands/ddl/aggregating-index)                     | Query          | Elevate your query speed with aggregating indexes:<br/>- Supercharge queries through precomputed and indexed aggregations.<br/>- Customize the index to meet your unique data analysis requirements.                                                                                                                                                                                                                                                                        |
| [Computed Column](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns) | Query          | Computed columns save you time and effort by enabling derivation of new columns from existing ones:<br/>- Automatic updates ensure accurate and consistent data.<br/>- Advanced analysis and calculations can now be performed within the database.<br/>- Two types of computed columns: stored and virtual. Virtual columns save you space as they are calculated on-the-fly when queried.                                                                                 |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise)              | Query          | A Python UDF allows you to invoke Python code from a SQL query via Databend's built-in handler, enabling seamless integration of Python logic within your SQL queries.                                                                                                                                                                                                                                                                                                      |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)                         | Query          | Attach Table enables you to seamlessly connect a table in the cloud service platform to an existing table deployed in a private deployment environment without the need to physically move the data.                                                                                                                                                                                                                                                                        |
| [Stream](/sql/sql-commands/ddl/stream)                                           | Data Streaming | Efficient data change management with stream:<br/>- Append-only mode supported: Instantly capture data insertions in real-time.<br/>- Seamlessly leverage streams for direct querying and analysis, ensuring swift insights.                                                                                                                                                                                                                                                |
| [Masking Policy](/sql/sql-commands/ddl/mask-policy/)                             | Security       | Enhance your data security with role-based masking feature:<br/>- Safeguard sensitive information through customizable data masking.<br/>- Preserve data usability while reinforcing security.                                                                                                                                                                                                                                                                              |
| Storage Encryption                                                               | Security       | Enhance the security of your server-side data encryption, safeguarding your data from unauthorized access by the storage vendor:<br/>- Choose encryption through service-managed keys, KMS managed keys, or customer-managed keys. Options may vary by storage type.<br/>- Currently supported on Alibaba Cloud OSS.<br/>See the [deploy guide](../../../10-deploy/01-deploy/01-non-production/01-deploying-databend.md) for encryption parameters for each storage vendor. |

## Databend Community vs. Enterprise

This section compares Databend Community with Databend Enterprise in the following modules:

### Core Functionalities

| Functionality                                     | Databend Community       | Databend Enterprise      |
| ------------------------------------------------- | ------------------------ | ------------------------ |
| Distributed Metadata Management                   | ✓                        | ✓                        |
| Distributed SQL Engine                            | ✓                        | ✓                        |
| Distributed Storage Engine                        | ✓                        | ✓                        |
| Distributed Scheduling Engine                     | ✓                        | ✓                        |
| Vectorized Engine                                 | ✓                        | ✓                        |
| Distributed Transaction                           | ✓                        | ✓                        |
| Multi-version Data                                | ✓                        | ✓                        |
| Time Travel                                       | ✓                        | ✓                        |
| Performance Optimizer                             | ✓                        | ✓                        |
| Multi-tenancy and Permission Management           | ✓                        | ✓                        |
| Standard Data Types                               | ✓                        | ✓                        |
| Semi-structured Data Type (JSON)                  | ✓                        | ✓                        |
| Unstructured Data Types                           | Parquet/CSV/TSV/JSON/ORC | Parquet/CSV/TSV/JSON/ORC |
| Advanced Compression                              | ✓                        | ✓                        |
| Vector Storage                                    | ✓                        | ✓                        |
| Apache Hive Query                                 | ✓                        | ✓                        |
| Apache Iceberg Query                              | ✓                        | ✓                        |
| Semi-structured Data Query                        | ✓                        | ✓                        |
| External User-defined Functions                   | ✓                        | ✓                        |
| Large Query Resource Isolation Protection (Spill) | ✓                        | ✓                        |

### Extended Functionalities

| Functionality                                            | Databend Community | Databend Enterprise            |
| -------------------------------------------------------- | ------------------ | ------------------------------ |
| Cluster Mode                                             | ✕                  | ✓                              |
| Materialized Views                                       | ✕                  | ✓                              |
| AI Functions (Sentiment Analysis, Data Annotation, etc.) | ✕                  | HuggingFace Open Source Models |
| Multi-tenant Data Sharing                                | ✕                  | ✓                              |

### Deployment

| Functionality                                            | Databend Community | Databend Enterprise |
| -------------------------------------------------------- | ------------------ | ------------------- |
| Deployment Support: K8s, Baremetal, Installer            | ✓                  | ✓                   |
| Backend Storage Support: S3, Azblob, GCS, OSS, COS, HDFS | ✓                  | ✓                   |
| x86_64 &amp; ARM64 Architecture                          | ✓                  | ✓                   |
| Compatible with LoongArch, openEuler, etc.               | ✓                  | ✓                   |
| Monitoring and Alerting APIs                             | ✓                  | ✓                   |

### Ecosystem

| Functionality                              | Databend Community | Databend Enterprise |
| ------------------------------------------ | ------------------ | ------------------- |
| Driver Support: Go, Java, Rust, JS, Python | ✓                  | ✓                   |
| Native REST APIs                           | ✓                  | ✓                   |
| Native Client BendSQL                      | ✓                  | ✓                   |

### Security

| Functionality                       | Databend Community | Databend Enterprise |
| ----------------------------------- | ------------------ | ------------------- |
| Audit Functionality                 | ✓                  | ✓                   |
| Access Control RBAC                 | ✓                  | ✓                   |
| Password Strength and Expiry Policy | ✓                  | ✓                   |
| Whitelist Management                | ✓                  | ✓                   |
| Storage Encryption                  | ✕                  | ✓                   |
| Data Dynamic Masking Policy         | ✕                  | ✓                   |

### Data Import & Export

| Functionality                 | Databend Community     | Databend Enterprise    |
| ----------------------------- | ---------------------- | ---------------------- |
| Data Processing during Import | ✓                      | ✓                      |
| Data Streaming                | ✕                      | ✓                      |
| CDC Real-time Data Import     | ✕                      | ✓                      |
| Data Export Formats           | Parquet/ORC/CSV/NDJSON | Parquet/ORC/CSV/NDJSON |

### Query Optimizations

| Functionality                               | Databend Community | Databend Enterprise |
| ------------------------------------------- | ------------------ | ------------------- |
| Aggregation Query Acceleration Optimization | ✕                  | ✓                   |
| JSON Query Acceleration Optimization        | ✕                  | ✓                   |
| Precomputation Capability                   | ✕                  | ✓                   |

### Storage Optimizations

| Functionality                   | Databend Community | Databend Enterprise |
| ------------------------------- | ------------------ | ------------------- |
| Cold/Hot Data Separation        | ✕                  | ✓                   |
| Automatic Expiry Data Cleaning  | ✕                  | ✓                   |
| Automatic Garbage Data Cleaning | ✕                  | ✓                   |

### Customer Support

| Functionality                     | Databend Community | Databend Enterprise |
| --------------------------------- | ------------------ | ------------------- |
| 24/7 Support & Emergency Response | ✕                  | ✓                   |
| Deployment and Upgrade            | ✕                  | ✓                   |
| Operational Support               | ✕                  | ✓                   |
