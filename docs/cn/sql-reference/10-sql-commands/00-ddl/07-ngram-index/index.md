---
title: Ngram 索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

本文全面介绍 Databend 中 Ngram 索引的功能操作，按模块分类便于查阅。

## Ngram 索引管理

| 命令                                            | 描述                      |
|-----------------------------------------------|-------------------------|
| [CREATE NGRAM INDEX](create-ngram-index.md)   | 创建新的 Ngram 索引用于高效子字符串搜索 |
| [REFRESH NGRAM INDEX](refresh-ngram-index.md) | 刷新 Ngram 索引             |
| [DROP NGRAM INDEX](drop-ngram-index.md)       | 删除 Ngram 索引             |

:::note
Databend 的 Ngram 索引支持在文本数据中高效执行子字符串及模式匹配搜索，可显著提升 LIKE 等操作的性能。
:::
