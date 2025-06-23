---
title: REFRESH NGRAM INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.726"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

从表中刷新现有的 NGRAM 索引。

## 语法

```sql
REFRESH NGRAM INDEX [IF EXISTS] <index_name>
ON [<database>.]<table_name>;
```

## 示例

以下示例从 `amazon_reviews_ngram` 表中刷新 `idx1` 索引：

```sql
REFRESH NGRAM INDEX idx1 ON amazon_reviews_ngram;
```