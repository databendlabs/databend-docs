---
sidebar_label: Databend Cloud
title: 发布记录
sidebar_position: 1
slug: '/'
---

本页面提供有关 Databend Cloud 新功能、周边工具以及问题修复的更新信息。

## 2023 年 10 月 30 日

- 将 databend-query 升级到 v1.2.184-nightly：
  - MERGE INTO 语句已支持自动 recluster 和 compact。
  - SQLsmith 已支持 DELETE、UPDATE、ALTER TABLE、CAST 和 MERGE INTO。
  - 新增系统函数 FUSE_ENCODING。
  - 新增半结构化数据处理函数 JSON_EACH 和 JSON_ARRAY_ELEMENTS。
  - 新增时间和日期函数 TO_WEEK_OF_YEAR 和 DATE_PART。
- 新增对 UDF 的支持。

## 2023 年 9 月 13 日

### 新功能

- 将 databend-query 升级到 v1.2.109-nightly:
  - 支持 GROUP BY ALL。
  - 支持 Data Masking Policies。
  - 支持分布式 REPLACE INTO。
  - 支持 Hash Join Spill。
  - 支持初版 DAC 权限模型。
  - 优化了 Inner Join 的性能。
  - 优化了 Common Table Expressions (CTEs) 的性能。
  - 新创建的列将默认为 Nullable。
- 提供 [databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 允许从 Kafka 无缝地实现增量数据同步。

## 2023 年 7 月 25 日

### 新功能

- 将 databend-query 升级到 v1.2.31-nightly：
  - 支持为特定列配置 Bloom Index。
  - 支持 Iceberg 表的基础读取。
  - 支持分布式 COPY INTO。
  - 在 system.query_profile 中增加更多执行信息，允许更好地优化你的查询。
- 提供 [debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 允许从 MySQL、Postgres 等关系数据库 CDC 同步到 Databend。

## 2023 年 6 月 30 日

### 新功能

- 将 databend-query 升级到 v1.2.0-nightly：
  - 支持通过 Flink CDC 同步来自关系式数据库的数据到 Databend。
  - 支持列重命名语法：`ALTER TABLE [ IF EXISTS ] <name> RENAME COLUMN <col_name> TO <new_col_name>`。
  - 支持按列序号进行 CSV 与 TSV 文件的查询。
  - 支持通过 `X-DATABEND-DEDUPLICATE-LABEL` 对数据进行去重。
  - 支持分布式的数据删除。

### 问题修复

- 修复存储空间扫描统计的稳定性问题。

## 2023 年 6 月 6 日

### 新功能

- 将 databend-query 升级至 v1.1.54-nightly:
  - 增加 Virtual Column 支持。
  - 支持在 Window 函数中增加表达式。
  - 支持在追加、修改操作中利用 label 进行去重。
  - 支持在 COPY INTO 中利用 optimization hint。
  - 增加了原生的 COS 支持。
  - 支持 IEJoin。
- 基于 Azure OpenAI 优化工作区中的 SQL IDE 提示。

## 2023 年 5 月 23 日

### 新功能

- 将 databend-query 升级至 v1.1.40-nightly：
  - 引入 VACUUM TABLE 命令，通过释放存储空间并从表中永久删除历史数据文件来优化系统性能。
  - 增加 Computed Column 支持。
  - 允许在 REPLACE 语句中附带对象存储的文件地址。
  - 扩展 bitmap 函数支持，添加新函数：`bitmap_contains`、`bitmap_has_all`、`bitmap_has_any`、`bitmap_or`、`bitmap_and`、`bitmap_xor` 等。
- 与 Tableau 集成，实现无缝数据可视化和报告。
- 支持修改 Warehouse 大小和自动休眠时间。

## 2023 年 5 月 15 日

### 新功能

- 将 databend-query 升级到 v1.1.30-nightly:
  - 在 COPY 中支持更高效地扫描大量小文件。
  - 优化器支持常量折叠。
  - 新增 bitmap 函数：`bitmap_count` 和 `build_bitmap`.
  - 通过新的 Hash Table 设计优化了 Hash Join 性能。
- 工作区支持多标签 UI，更易于切换。
- 允许修改手机号。

## 2023 年 4 月 25 日

### 新功能

- 将 databend-query 升级到 v1.1.7-nightly:
  - 使 REPLACE INTO 语句支持拥有 Cluster Key 定义的表。
  - 支持 `array_aggregate` 函数，以及包括 std, median 在内的更多数组聚合函数。
  - 支持窗口函数 `percent_rank`。
- 新版的 `bendsql` 命令行工具，提供更好的语法高亮与自动完成。

### 问题修复

- 修复在导入数据界面时未显示 default 数据库选项的问题。

## 2023 年 4 月 12 日

### 新功能

- 将 databend-query 升级到 v1.0.60-nightly:
  - 支持通过 Eager Aggregation 优化 GROUP BY 和 JOIN 性能。
  - 支持了所有 TPC-DS 查询。
  - 新增聚合函数：QUANTILE_DISC, KURTOSIS, SKEWNESS。
- 新的集成：
  - 支持通过 Apache DolphinScheduler 自动导入数据。

## 2023 年 4 月 4 日

### 新功能

- 将 databend-query 升级到 v1.0.43-nightly：
  - 引入窗口函数（window functions）。
  - 支持包括 PIVOT、UNPIVOT、GROUP BY CUBE 和 ROLLUP 在内的查询语法。
  - 新增了 cosine_distance、ai_embedding_vector 等 [AI 函数](/sql/sql-functions/ai-functions/)，将 Databend 转变为一个 AI 知识存储库，允许您解锁更深入的见解，从数据中提取更多价值。
- 新的集成：
  - [DBeaver](/doc/sql-clients/jdbc)：现在您可以使用桌面应用程序轻松连接到 Databend Cloud，获得更无缝的体验。
  - [Redash](/doc/visualize/redash): 轻松创建美丽的可视化图表，使分析和展示数据更加容易。

### 改进

- 支持银行线下转账汇款。

## 问题修复

- 改善了 Auto Suspend 机制的稳定性，确保计算集群及时地自动进入休眠。 

## 2023 年 3 月 21 日

### 新功能

- 原生的 [Metabase 集成](https://github.com/databendcloud/metabase-databend-driver): 允许使 Metabase 连接到 Databend Cloud 制作美观的数据可视化报表。
- 将 databend-query 升级到 1.0.26-nightly：
  - 允许在 COPY INTO 文件过程中进行数据转换。

### 改进

- 在创建管道时添加了 Purge 选项，可以自动清理已导入的文件。
- 使计算集群和表存储大小的计量数据收集更加实时。
- 优化套餐过期时的信息提示。

## 2023 年 3 月 14 日

### 新功能

- 升级 databend-query 至 v1.0.15-nightly：
  - 增加 REPLACE 语句支持，允许高效的批量数据更新。
  - 优化了扫描海量文件时 COPY 语句的性能。
  - 增加了内建 BloomFilter 索引的 Map 类型，允许更高效地检索 K/V 类型数据。
  - 兼容阿里云 Quick BI 查询与图表展示。
- 新增阿里云 cn-shanghai 区。

### 改进

- 调大默认成员人数上限为 5。
- 优化账单页的 UI 展示。

## 2023 年 3 月 7 日

### 新功能

- 新工具：
  - Flink databend connector：允许将 Databend 连接到 Flink 应用程序中。
  - bend-ingest-kafka：允许从 Kafka 中摄取数据。
- 升级 databend-query 至 v1.0.4-nightly：
  - 增加了对 Decimal 数据类型的支持。
  - 增加了 Block Cache 和 Query Result Cache 的支持。
  - 优化了 GROUP BY 的内存使用。
  - 改进了性能。

### 改进

- Pipe 增加了区域选项，并支持定期进行完整轮询重置。

### 问题修复

- 当创建新租户时，不再默认启动计算集群。
