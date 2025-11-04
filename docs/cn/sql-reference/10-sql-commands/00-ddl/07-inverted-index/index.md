---
title: 倒排索引（Inverted Index）
---
本页面按功能分类，全面介绍 Databend 中的倒排索引操作，便于快速查阅。

## 倒排索引管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE INVERTED INDEX](create-inverted-index.md) | 创建全文搜索用的倒排索引 |
| [DROP INVERTED INDEX](drop-inverted-index.md) | 删除倒排索引 |
| [REFRESH INVERTED INDEX](refresh-inverted-index.md) | 使用最新数据更新倒排索引 |

## 相关主题

- [全文索引](/guides/performance/fulltext-index)

:::note
Databend 的倒排索引为文本数据实现高效全文搜索功能，支持在大型文本列中快速执行关键词检索。
:::
