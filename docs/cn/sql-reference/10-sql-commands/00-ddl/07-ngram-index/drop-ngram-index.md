---
title: DROP NGRAM INDEX
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.726"/>

从表中删除现有的 NGRAM 索引。

## 语法

```sql
DROP NGRAM INDEX [IF EXISTS] <index_name>
ON [<database>.]<table_name>;
```

## 示例

以下示例从 `amazon_reviews_ngram` 表中删除 `idx1` 索引：

```sql
DROP NGRAM INDEX idx1 ON amazon_reviews_ngram;
```
