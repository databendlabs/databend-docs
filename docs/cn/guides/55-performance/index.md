---
title: 性能优化
---

Databend 主要通过**各种索引技术**来加速查询性能，包括数据聚簇、结果缓存和专用索引，帮助您显著提升查询响应时间。

## 优化功能

| 功能 | 用途 | 使用场景 |
|---------|---------|------------|
| [**Cluster Key**](00-cluster-key.md) | 自动物理组织数据以获得最佳查询性能 | 当您有大型表且经常对特定列进行过滤时，特别是时间序列或分类数据 |
| [**Query Result Cache**](query-result-cache.md) | 自动存储和重用相同查询的结果 | 当您的应用程序重复运行相同的分析查询时，例如在仪表盘或定时报告中 |
| [**Virtual Column**](01-virtual-column.md) | 自动加速对 JSON/VARIANT 数据中字段的访问 | 当您频繁查询半结构化数据中的特定路径且需要亚秒级响应时间时 |
| [**Aggregating Index**](02-aggregating-index.md) | 预计算并存储常见聚合结果 | 当您的分析工作负载经常在大型数据集上运行 SUM、COUNT、AVG 查询时 |
| [**Full-Text Index**](03-fulltext-index.md) | 启用闪电般快速的语义文本搜索功能 | 当您需要高级文本搜索功能，如相关性评分和模糊匹配时 |
| [**Ngram Index**](ngram-index.md) | 使用通配符加速模式匹配 | 当您的查询在大型文本列上使用带通配符的 LIKE 操作符 (特别是 '%keyword%') 时 |

## 功能可用性

| 功能 | 社区版 | 企业版 | Cloud |
|---------|-----------|------------|-------|
| Cluster Key | ✅ | ✅ | ✅ |
| Query Result Cache | ✅ | ✅ | ✅ |
| Virtual Column | ❌ | ✅ | ✅ |
| Aggregating Index | ❌ | ✅ | ✅ |
| Full-Text Index | ❌ | ✅ | ✅ |
| Ngram Index | ❌ | ✅ | ✅ |