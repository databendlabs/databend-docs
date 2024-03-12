---
title: Accessing Data Lake
---

Databend presents a seamless integration with three robust Data Lake technologies—[Apache Hive](https://hive.apache.org/), [Apache Iceberg](https://iceberg.apache.org/), and [Delta Lake](https://delta.io/). This integration brings a distinct advantage by supporting multiple facets of Data Lake functionality. Databend offers a versatile and comprehensive platform, empowering users with increased flexibility and efficiency in handling diverse datasets within the Data Lake environment.

Furthermore, the integration of these three technologies within Databend is characterized by varying approaches. While some, like Apache Hive, integrate at the catalog level, others, such as Delta Lake, operate at the table engine level. Apache Iceberg supports integration at both levels. The catalog-based integration establishes a centralized connection to the Data Lake, streamlining access and management across multiple tables. On the other hand, table engine-level integration provides a more granular control, allowing for tailored optimization and fine-tuning at the individual table level.