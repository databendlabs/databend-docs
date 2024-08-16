---
title: Databend Cloud 发布
sidebar_position: 2
---

来自 [Databend Cloud](https://app.databend.com/) 的最新产品更新。

## 2023 年 10 月 30 日

### 新功能

- 将 databend-query 升级到 v1.2.184-nightly：
  - MERGE INTO 现在支持自动重聚类和压缩。
  - SQLsmith 现在覆盖 DELETE、UPDATE、ALTER TABLE、CAST 和 MERGE INTO。
  - 添加了一个新的系统函数 FUSE_ENCODING。
  - 添加了半结构化数据处理函数 JSON_EACH 和 JSON_ARRAY_ELEMENTS。
  - 添加了日期和时间函数 TO_WEEK_OF_YEAR 和 DATE_PART。
- 添加了对用户定义函数（UDFs）的支持。

## 2023 年 9 月 13 日

### 新功能

- 将 databend-query 升级到 v1.2.109-nightly：
  - 添加了对 GROUP BY ALL 的支持。
  - 引入了掩码策略。
  - 添加了对分布式 REPLACE INTO 的支持。
  - 添加了对 Hash Join 溢出的支持。
  - 添加了对 DAC 权限模型的初步支持。
  - 提高了 Inner Join 的性能。
  - 通过物化提高了公共表达式（CTEs）的性能。
  - Databend 中的列现在默认为可空。
- Databend Cloud 现已上线 [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-6dvshjlbds7b6)。
- 引入了 [databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 以实现从 Kafka 的无缝数据摄取。

## 2023 年 7 月 25 日

### 新功能

- 将 databend-query 升级到 v1.2.31-nightly：
  - 添加了对为指定列创建布隆索引的支持。
  - 添加了对 Iceberg 表的基本读取支持。
  - 添加了对分布式 COPY INTO 的支持。
  - 通过额外的执行信息增强了 system.query_profile，便于查询分析。
- 引入了 [debezium-server-databend](https://github.com/databendcloud/debezium-server-databend)，使得从 MySQL/Postgres 等 RDBMS 到 Databend 的 CDC 流摄取成为可能。

## 2023 年 6 月 30 日

### 新功能

- 将 databend-query 升级到 v1.2.0-nightly：
  - 现在您可以使用 Flink CDC 连接器实时从其他数据库加载数据。
  - 添加了使用 `ALTER TABLE [ IF EXISTS ] <name> RENAME COLUMN <col_name> TO <new_col_name>` 重命名列的支持。
  - 添加了在查询 CSV 和 TSV 文件时使用列位置的支持。
  - 通过 `X-DATABEND-DEDUPLICATE-LABEL` 头添加了 HTTP 查询去重。
  - 添加了对分布式删除的支持。

### Bug 修复

- 修复了存储使用统计的稳定性问题。

## 2023 年 6 月 6 日

### 新功能

- 将 databend-query 升级到 v1.1.54-nightly：
  - 添加了对虚拟列的支持。
  - 添加了向窗口函数添加表达式的支持。
  - 添加了在 INSERT、UPDATE 和 REPLACE 操作中设置 deduplicate_label 的支持。
  - 添加了在 COPY INTO 中设置优化提示的支持。
  - 添加了对 COS 的原生支持。
  - 添加了对 IEJoin 的支持。
- 使用 Azure OpenAI 服务增强了工作表中的 SQL 提示。

## 2023 年 5 月 23 日

### 新功能

- 将 databend-query 升级到 v1.1.40-nightly：
  - 引入了 VACUUM TABLE 命令，通过释放存储空间和永久删除表中的历史数据文件来优化系统性能。
  - 添加了对通过其他列的标量表达式生成的计算列的支持。
  - 添加了替换 Stage 附件的支持。
  - 引入了新的 bitmap 函数：`bitmap_contains`、`bitmap_has_all`、`bitmap_has_any`、`bitmap_or`、`bitmap_and`、`bitmap_xor` 等。
- 添加了与 Tableau 集成的能力。
- 添加了在创建管道时使用正则表达式模式过滤文件的支持。
- 添加了修改计算集群大小和自动暂停时间的支持。

## 2023 年 5 月 15 日

### 新功能

- 将 databend-query 升级到 v1.1.30-nightly：
  - 添加了 bitmap 函数：bitmap_count 和 build_bitmap。
  - 优化器现在支持常量折叠。
  - 通过新的 Hash 表设计提高了 Hash Join 的性能。
- 现在工作表可以作为标签页查看和管理。

## 2023 年 4 月 25 日

### 新功能

- 将 databend-query 升级到 v1.1.7-nightly：
  - REPLACE INTO 现在可以处理具有聚类键的表。
  - 引入了 array_aggregate 函数和其他数组聚合函数，如 std、median。
  - 引入了窗口函数 percent_rank。
- 升级 BendSQL 以提供改进的 SQL 关键字高亮和自动完成。

### Bug 修复

- 修复了数据加载页面上默认数据库不可用的问题。

## 2023 年 4 月 12 日

### 新功能

- 将 databend-query 升级到 v1.0.60-nightly：
  - 引入了 Eager Aggregation 以提高数据分组和连接性能。
  - 通过了所有 TPC-DS 查询。
  - 新的聚合函数：QUANTILE_DISC、KURTOSIS、SKEWNESS。
- 新集成：
  - 通过 Apache DolphinScheduler 实现自动数据加载。

## 2023 年 4 月 4 日

### 新功能

- 将 databend-query 升级到 v1.0.43-nightly：
  - 新的查询语法：PIVOT、UNPIVOT、GROUP BY CUBE 和 ROLLUP。
  - 引入了 [AI 函数](/sql/sql-functions/ai-functions/)：将 Databend Cloud 变成一个智能数据存储，让您解锁更深入的洞察并从您的数据中提取更多价值。
  - 引入了窗口函数。
- 新集成：
  - [DBeaver](/guides/sql-clients/jdbc)：使您能够使用桌面应用程序更无缝地连接到 Databend Cloud。
  - [Redash](/guides/visualize/redash)：使您能够生成美观的数据可视化，便于分析和展示。

### Bug 修复

- 提高了仓库自动暂停的稳定性：仓库现在可以按预期暂停。

## 2023 年 3 月 21 日

### 新功能

- 引入了与 Metabase 的原生 [集成](https://github.com/databendcloud/metabase-databend-driver)：您现在可以连接到 Metabase 并创建美观的数据可视化或报告。
- 将 databend-query 升级到 1.0.26-nightly：
  - 允许在使用 COPY INTO 加载数据时进行数据转换。
  - 引入了将自然语言指令转换为 SQL 查询的 ai_to_sql() 函数。

### 增强

- 为创建管道添加了 `purge` 选项，允许自动清除摄取的文件。
- 增强了收集仓库使用情况和表存储大小的实时数据的能力。
- 优化了过期计划的 UI 提示。

## 2023 年 3 月 14 日

### 新功能

- 将 databend-query 升级到 v1.0.15-nightly：
  - 在处理大量数据文件时改善了 COPY 性能。
  - 添加了对 REPLACE 语句的支持，允许更高效的数据操作。
  - 添加了对 Map 类型的支持，内置 BloomFilter 索引，允许更高效的数据检索和查询。
- 添加了 AWS us-west-2 区域。

### 增强

- 默认情况下将组织的成员限制扩大到 5。
- 改进了计费页面以提高可用性。

## 2023 年 3 月 7 日

### 新功能

- 引入了新工具：
  - [Flink databend 连接器](https://github.com/databendcloud/flink-connector-databend)：允许将 Databend 连接到 Flink 应用程序。
  - [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 使得可以从 Kafka 中摄取数据。
- 将 databend-query 升级到 v1.0.4-nightly：
  - 添加了对十进制数据类型的支持。
  - 添加了对数据块缓存和查询结果缓存的支持。
  - 优化了 GROUP BY 的内存使用。
  - 性能改进。

### 增强功能

- Pipe 现在包括一个区域选项，并支持常规的完整轮询重置。

### 错误修复

- 创建新租户时不再自动启动计算集群。
