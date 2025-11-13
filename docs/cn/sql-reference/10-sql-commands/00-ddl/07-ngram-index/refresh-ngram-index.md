---
title: REFRESH NGRAM INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.726"/>

在默认情况下，NGRAM 索引会在数据写入时自动刷新。只有在需要为历史数据回填索引时才需要执行 `REFRESH NGRAM INDEX`。

## 语法

```sql
REFRESH NGRAM INDEX [IF EXISTS] <index_name>
ON [<database>.]<table_name>;
```

## 示例

```sql
-- 表中已有在创建索引之前写入的数据
CREATE TABLE IF NOT EXISTS amazon_reviews_ngram(review_id INT, review STRING);
INSERT INTO amazon_reviews_ngram VALUES
  (1, 'coffee beans from Colombia'),
  (2, 'best roasting kit');

-- 随后才声明 NGRAM 索引
CREATE NGRAM INDEX idx1 ON amazon_reviews_ngram(review) WITH (ngram_size = 3);

-- 通过刷新补齐历史数据
REFRESH NGRAM INDEX idx1 ON amazon_reviews_ngram;

-- 之后的新写入会在 SYNC 模式下自动刷新
```
