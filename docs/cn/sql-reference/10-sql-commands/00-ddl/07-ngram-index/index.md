---
title: Ngram 索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

本页面全面概述了 Databend 中的 Ngram 索引（Ngram Index）操作，并按功能进行组织，方便参考。

## Ngram 索引管理

| 命令                                       | 描述                                              |
|-----------------------------------------------|----------------------------------------------------------|
| [CREATE NGRAM INDEX](create-ngram-index.md)   | 创建新的 Ngram 索引（Ngram Index），实现高效子字符串搜索 |
| [REFRESH NGRAM INDEX](refresh-ngram-index.md) | 刷新 Ngram 索引（Ngram Index）                          |
| [DROP NGRAM INDEX](drop-ngram-index.md)       | 移除 Ngram 索引（Ngram Index）                          |

:::note
Databend 的 Ngram 索引（Ngram Index）支持高效执行文本数据的子字符串和模式匹配搜索，显著提升 LIKE 及类似操作的性能。
:::