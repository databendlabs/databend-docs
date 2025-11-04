---
title: REFRESH NGRAM INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.726"/>

刷新表上已有的 NGRAM 索引（NGRAM INDEX）。

## 语法

```sql
REFRESH NGRAM INDEX [IF EXISTS] <index_name>
ON [<database>.]<table_name>;
```

## 示例

以下示例刷新 `amazon_reviews_ngram` 表上的 `idx1` 索引：

```sql
REFRESH NGRAM INDEX idx1 ON amazon_reviews_ngram;
```
