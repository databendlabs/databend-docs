---
title: Enterprise Features
---

import DatabendTable from '@site/src/components/DatabendTable';

This page provides an updated list of available enterprise features. To access these features, you will need an enterprise or trial license. For more details, see [Licensing Databend](20-license.md).

### Enterprise Feature List

| Feature                                                                          | Category       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Audit Trail](/guides/security/audit-trail)                                     | Security & Compliance | Monitor database activities with comprehensive audit logs for compliance and security.                                                                                                                                                                                                                                                                                                                                                                                   |
| [Masking Policy](/sql/sql-commands/ddl/mask-policy/)                             | Security & Compliance | Protect sensitive data with role-based masking policies.                                                                                                                                                                                                                                                                                                                                                                                                                |
| Storage Encryption                                                               | Security & Compliance | Encrypt data at rest with service-managed, KMS, or customer-managed keys.                                                                                                                                                                                                                                                                                                                                                                                               |
| [BendSave](/guides/data-management/data-recovery#bendsave) | Disaster Recovery | Backup and restore entire Databend cluster data for disaster recovery. |
| [Fail-Safe](/guides/security/fail-safe)                                          | Disaster Recovery  | Recover lost or accidentally deleted data from S3-compatible object storage.                                                                                                                                                                                                                                                                                                                                                                                            |
| [Aggregating Index](/sql/sql-commands/ddl/aggregating-index)                     | Query Performance  | Speed up queries with precomputed and indexed aggregations.                                                                                                                                                                                                                                                                                                                                                                                                             |
| [Full-Text Index](/guides/performance/fulltext-index)                           | Query Performance  | Enable lightning-fast text search with inverted indexes and relevance scoring.                                                                                                                                                                                                                                                                                                                                                                                          |
| [Ngram Index](/guides/performance/ngram-index)                                  | Query Performance  | Accelerate LIKE pattern matching queries with wildcard searches.                                                                                                                                                                                                                                                                                                                                                                                                        |
| [Virtual Column](/sql/sql-commands/ddl/virtual-column)                          | Query Performance  | Automatically accelerate JSON queries with zero-configuration performance optimization for VARIANT data.                                                                                                                                                                                                                                                                                                                                                                |
| [Dynamic Column](/sql/sql-commands/ddl/table/ddl-create-table#computed-columns)  | Query Performance  | Generate columns automatically from scalar expressions with stored or virtual calculation modes.                                                                                                                                                                                                                                                                                                                                                                         |
| [Python UDF](/guides/query/udf#python-requires-databend-enterprise)              | Advanced Analytics | Execute Python code within SQL queries using built-in handler.                                                                                                                                                                                                                                                                                                                                                                                                          |
| [ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)                         | Data Sharing       | Create read-only links to existing table data with zero-copy access across environments.                                                                                                                                                                                                                                                                                                                                                                                |
| [Stream](/sql/sql-commands/ddl/stream)                                           | Change Data Capture | Track and capture table changes for incremental data processing.                                                                                                                                                                                                                                                                                                                                                                                                        |
| [Vacuum Temp Files](/sql/sql-commands/administration-cmds/vacuum-temp-files)     | Storage Management | Clean up temporary files (join, aggregate, sort spills) to free storage space.                                                                                                                                                                                                                                                                                                                                                                                          |
| [Vacuum Dropped Table](/sql/sql-commands/ddl/table/vacuum-drop-table)            | Storage Management | Delete data files of dropped tables to optimize storage with recovery option.                                                                                                                                                                                                                                                                                                                                                                                           |
| [Vacuum Historical Data](/sql/sql-commands/ddl/table/vacuum-table)               | Storage Management | Remove orphan segment and block files to deep clean storage space.                                                                                                                                                                                                                                                                                                                                                                                                      |

## Databend Community vs. Enterprise

This section compares Databend Community with Databend Enterprise in the following modules:

### Core Functionalities

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Distributed Metadata Management', '✓', '✓'],
['Distributed SQL Engine', '✓', '✓'],
['Distributed Storage Engine', '✓', '✓'],
['Distributed Scheduling Engine', '✓', '✓'],
['Vectorized Engine', '✓', '✓'],
['Distributed Transaction', '✓', '✓'],
['Multi-version Data', '✓', '✓'],
['Time Travel', '✓', '✓'],
['Performance Optimizer', '✓', '✓'],
['Multi-tenancy and Permission Management', '✓', '✓'],
['Standard Data Types', '✓', '✓'],
['Semi-structured Data Type (JSON)', '✓', '✓'],
['Unstructured Data Types', 'Parquet/CSV/TSV/JSON/ORC/AVRO', 'Parquet/CSV/TSV/JSON/ORC/AVRO'],
['Advanced Compression', '✓', '✓'],
['Vector Storage', '✓', '✓'],
['Apache Hive Query', '✓', '✓'],
['Apache Iceberg Query', '✓', '✓'],
['Semi-structured Data Query', '✓', '✓'],
['External User-defined Functions', '✓', '✓'],
['Large Query Resource Isolation Protection (Spill)', '✓', '✓'],
]}
/>

### Extended Functionalities

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Cluster Mode', '✕', '✓'],
['Materialized Views', '✕', '✓'],
['AI Functions (Sentiment Analysis, Data Annotation, etc.)', '✕', '✓ (HuggingFace Open Source Models)'],
['Python UDF (Advanced Analytics)', '✕', '✓'],
]}
/>

### Deployment

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Deployment Support: K8s, Baremetal, Installer', '✓', '✓'],
['Backend Storage Support: S3, Azblob, GCS, OSS, COS', '✓', '✓'],
['x86_64 & ARM64 Architecture', '✓', '✓'],
['Compatible with LoongArch, openEuler, etc.', '✓', '✓'],
['Monitoring and Alerting APIs', '✓', '✓'],
]}
/>

### Ecosystem

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Driver Support: Go, Java, Rust, JS, Python', '✓', '✓'],
['Native REST APIs', '✓', '✓'],
['Native Client BendSQL', '✓', '✓'],
]}
/>

### Security

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Basic Audit Functionality', '✓', '✓'],
['Comprehensive Audit Trail (System History Tables)', '✕', '✓'],
['Access Control RBAC', '✓', '✓'],
['Password Strength and Expiry Policy', '✓', '✓'],
['Whitelist Management', '✓', '✓'],
['Storage Encryption', '✕', '✓'],
['Data Dynamic Masking Policy', '✕', '✓'],
]}
/>

### Data Integration & Sharing

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Data Processing during Import', '✓', '✓'],
['Stream (Change Data Capture)', '✕', '✓'],
['CDC Real-time Data Import', '✕', '✓'],
['ATTACH TABLE (Zero-copy Data Sharing)', '✕', '✓'],
['Data Export Formats', 'Parquet/ORC/CSV/NDJSON', 'Parquet/ORC/CSV/NDJSON'],
]}
/>

### Query Performance

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Aggregating Index (Precomputed Aggregations)', '✕', '✓'],
['Full-Text Index (Text Search)', '✕', '✓'],
['Ngram Index (Pattern Matching)', '✕', '✓'],
['Virtual Column (JSON Query Acceleration)', '✕', '✓'],
['Dynamic Column (Computed Columns)', '✕', '✓'],
]}
title="Query Performance"
/>

### Storage Management & Disaster Recovery

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['Cold/Hot Data Separation', '✕', '✓'],
['Automatic Expiry Data Cleaning', '✕', '✓'],
['Automatic Garbage Data Cleaning', '✕', '✓'],
['BendSave (Cluster Backup & Restore)', '✕', '✓'],
['Fail-Safe (Data Recovery from Object Storage)', '✕', '✓'],
]}
title="Storage Management & Disaster Recovery"
/>

### Customer Support

<DatabendTable
width={['70%', '15%', '15%']}
thead={['Functionality', 'Databend Community', 'Databend Enterprise']}
tbody={[
['24/7 Support & Emergency Response', '✕', '✓'],
['Deployment and Upgrade', '✕', '✓'],
['Operational Support', '✕', '✓'],
]}
title="Customer Support"
/>
