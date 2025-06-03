---
title: 性能优化
---

Databend 主要通过**多种索引技术**加速查询性能，包括数据聚类、结果缓存和专用索引，帮助您显著提升查询响应速度。

## 优化功能

| 功能 | 用途 | 使用场景 |
|---------|---------|------------|
| [**Cluster Key**](00-cluster-key.md) | 自动优化数据物理存储布局 | 需频繁过滤特定列的大型表（如时序数据或分类数据） |
| [**Query Result Cache**](query-result-cache.md) | 自动存储并复用相同查询结果 | 重复执行相同分析查询的场景（如仪表盘/定时报表） |
| [**Virtual Column**](01-virtual-column.md) | 加速访问 JSON/VARIANT 内部字段 | 需亚秒级响应半结构化数据特定路径查询时 |
| [**Aggregating Index**](02-aggregating-index.md) | 预计算并存储常用聚合结果 | 需在大型数据集频繁执行 SUM/COUNT/AVG 查询时 |
| [**Full-Text Index**](03-fulltext-index.md) | 实现毫秒级语义文本搜索 | 需高级文本功能（相关性评分/模糊匹配）时 |
| [**Ngram Index**](ngram-index.md) | 加速通配符匹配 | 在大型文本列使用 `LIKE '%keyword%` 类查询时 |

## 功能可用性

| 功能 | 社区版 | 企业版 | Cloud |
|---------|-----------|------------|-------|
| Cluster Key | ✅ | ✅ | ✅ |
| Query Result Cache | ✅ | ✅ | ✅ |
| Virtual Column | ❌ | ✅ | ✅ |
| Aggregating Index | ❌ | ✅ | ✅ |
| Full-Text Index | ❌ | ✅ | ✅ |
| Ngram Index | ❌ | ✅ | ✅ |
