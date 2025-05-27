---
title: 性能优化
---

Databend 提供了各种优化功能，可在不同场景下加速查询性能。

## 优化功能

| 功能 | 类别 | 描述 | 示例用例 |
|---------|----------|-------------|------------------|
| [**聚簇键**](00-cluster-key.md) | **存储** | 针对大型表查询的自动数据组织 | 针对时序数据的 `CLUSTER BY (date, region)` |
| [**查询结果缓存**](query-result-cache.md) | **缓存** | 针对重复查询的自动缓存 | 仪表盘查询、日报表 |
| [**虚拟列**](01-virtual-column.md) | **半结构化** | 针对 VARIANT 数据查询的自动加速 | 频繁访问嵌套字段的 JSON 数据 |
| [**聚合索引**](02-aggregating-index.md) | **聚合** | 针对聚合查询的自动索引 | `SUM(sales) GROUP BY region` 查询 |
| [**全文索引**](03-fulltext-index.md) | **文本搜索** | 针对文本搜索查询的自动索引 | `WHERE MATCH(content, 'keyword')` 搜索 |
| [**Ngram 索引**](ngram-index.md) | **模式匹配** | 针对通配符 LIKE 查询的自动索引 | `WHERE name LIKE '%john%'` 搜索 |

## 功能可用性

| 功能 | Databend 社区版 | Databend 企业版 | Databend Cloud |
|---------|-----------|------------|-------|
| 聚簇键 | ✅ | ✅ | ✅ |
| 查询结果缓存 | ✅ | ✅ | ✅ |
| 虚拟列 | ❌ | ✅ | ✅ |
| 聚合索引 | ❌ | ✅ | ✅ |
| 全文索引 | ❌ | ✅ | ✅ |
| Ngram 索引 | ❌ | ✅ | ✅ |