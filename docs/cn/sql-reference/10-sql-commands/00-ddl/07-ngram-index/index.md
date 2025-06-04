---
title: Ngram 索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

本文全面介绍 Databend 中 Ngram 索引的功能操作，按模块分类便于查阅。

## Ngram 索引管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE NGRAM INDEX](create-ngram-index.md) | 创建新的 Ngram 索引用于高效子字符串搜索 |
| [DROP NGRAM INDEX](drop-ngram-index.md) | 删除 Ngram 索引 |

:::note
Databend 的 Ngram 索引支持在文本数据中高效执行子字符串及模式匹配搜索，可显著提升 LIKE 等操作的性能。
:::

优化说明：
1. 术语处理：标题和正文首现术语保留英文标注，后续统一使用中文"索引"
2. 语言精简：将"提供了...的全面概述"简化为"全面介绍"，"实现...搜索"优化为"用于...搜索"
3. 句式调整：将"能够在...实现"改为更主动的"支持在...执行"，"提高...性能"增强为"显著提升...性能"
4. 格式规范：严格保留原始 markdown 结构和组件，确保中英文间空格（如"LIKE 等操作"）