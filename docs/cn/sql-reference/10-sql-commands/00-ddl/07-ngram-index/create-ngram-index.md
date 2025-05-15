---
title: CREATE NGRAM INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.726"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

为表的一个或多个列创建 Ngram 索引。

## 语法

```sql
-- 在现有表上创建 Ngram 索引
CREATE [OR REPLACE] NGRAM INDEX [IF NOT EXISTS] <index_name>
ON [<database>.]<table_name>(<column1> [, <column2>, ...])
[gram_size = <number>] [bitmap_size = <number>]

-- 创建表时创建 Ngram 索引
CREATE [OR REPLACE] TABLE <table_name> (
    <column_definitions>,
    NGRAM INDEX <index_name> (<column1> [, <column2>, ...])
        [gram_size = <number>] [bitmap_size = <number>]
)...
```

- `gram_size` (默认为 3) 指定索引列文本时，每个基于字符的子字符串（n-gram）的长度。例如，当 `gram_size = 3` 时，文本 "hello world" 将被分割成如下重叠的子字符串：

  ```text
  "hel", "ell", "llo", "lo ", "o w", " wo", "wor", "orl", "rld"
  ```

- `bloom_size` 指定 Bloom filter 位图的大小（以字节为单位），用于加速每个数据块中的字符串匹配。它控制索引准确性和内存使用之间的权衡：

  - 较大的 `bloom_size` 减少了字符串查找中的误报，从而提高了查询精度，但代价是需要更多的内存。
  - 较小的 `bloom_size` 节省了内存，但可能会增加误报。
  - 如果未显式设置，则默认值为每个索引列每个块 1,048,576 字节（1m）。有效范围为 512 字节到 10,485,760 字节（10m）。

## 示例

以下示例创建了一个表 `amazon_reviews_ngram`，并在 `review_body` 列上创建了一个 Ngram 索引。该索引配置了 `gram_size` 为 10 和 `bitmap_size` 为 2 MB，以优化大型文本字段（如用户评论）上的模糊搜索性能。

```sql
CREATE OR REPLACE TABLE amazon_reviews_ngram (
    review_date   int(11) NULL,
    marketplace   varchar(20) NULL,
    customer_id   bigint(20) NULL,
    review_id   varchar(40) NULL,
    product_id   varchar(10) NULL,
    product_parent   bigint(20) NULL,
    product_title   varchar(500) NULL,
    product_category   varchar(50) NULL,
    star_rating   smallint(6) NULL,
    helpful_votes   int(11) NULL,
    total_votes   int(11) NULL,
    vine   boolean NULL,
    verified_purchase   boolean NULL,
    review_headline   varchar(500) NULL,
    review_body   string NULL,
    NGRAM INDEX idx1 (review_body) gram_size = 10 bloom_size = 2097152
) Engine = Fuse bloom_index_columns='review_body';
```

要显示创建的索引，请使用 [SHOW INDEXES](../../50-administration-cmds/show-indexes.md) 命令：

```sql
SHOW INDEXES;
```

```sql
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │  type  │ original │                              definition                              │         created_on         │      updated_on     │
├────────┼────────┼──────────┼──────────────────────────────────────────────────────────────────────┼────────────────────────────┼─────────────────────┤
│ idx1   │ NGRAM  │          │ amazon_reviews_ngram(review_body)bloom_size='2097152' gram_size='10' │ 2025-05-13 01:22:34.123927 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

或者，您可以先创建表，然后在 `review_body` 列上创建 Ngram 索引：

```sql
CREATE TABLE amazon_reviews_ngram (
    review_date   int(11) NULL,
    marketplace   varchar(20) NULL,
    customer_id   bigint(20) NULL,
    review_id   varchar(40) NULL,
    product_id   varchar(10) NULL,
    product_parent   bigint(20) NULL,
    product_title   varchar(500) NULL,
    product_category   varchar(50) NULL,
    star_rating   smallint(6) NULL,
    helpful_votes   int(11) NULL,
    total_votes   int(11) NULL,
    vine   boolean NULL,
    verified_purchase   boolean NULL,
    review_headline   varchar(500) NULL,
    review_body   string NULL
);
```

```sql
CREATE NGRAM INDEX idx1
ON amazon_reviews_ngram(review_body)
gram_size = 10 bloom_size = 2097152;
```