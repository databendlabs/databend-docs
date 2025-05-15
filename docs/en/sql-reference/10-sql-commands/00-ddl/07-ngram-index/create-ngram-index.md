---
title: CREATE NGRAM INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.726"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Creates an Ngram index on one or more columns for a table.

## Syntax

```sql
-- Create an Ngram index on an existing table
CREATE [OR REPLACE] NGRAM INDEX [IF NOT EXISTS] <index_name>
ON [<database>.]<table_name>(<column1> [, <column2>, ...])
[gram_size = <number>] [bitmap_size = <number>]

-- Create an Ngram index when creating a table
CREATE [OR REPLACE] TABLE <table_name> (
    <column_definitions>,
    NGRAM INDEX <index_name> (<column1> [, <column2>, ...])
        [gram_size = <number>] [bitmap_size = <number>]
)...
```

- `gram_size` (defaults to 3) specifies the length of each character-based substring (n-gram) when the column text is indexed. For example, with `gram_size = 3`, the text "hello world" would be split into overlapping substrings like:

  ```text
  "hel", "ell", "llo", "lo ", "o w", " wo", "wor", "orl", "rld"
  ```

- `bloom_size` specifies the size in bytes of the Bloom filter bitmap used to accelerate string matching within each block of data. It controls the trade-off between index accuracy and memory usage:

  - A larger `bloom_size` reduces false positives in string lookups, improving query precision at the cost of more memory.
  - A smaller `bloom_size` saves memory but may increase false positives.
  - If not explicitly set, the default is 1,048,576 bytes (1m) per indexed column per block. The valid range is from 512 bytes to 10,485,760 bytes (10m).

## Examples

The following example creates a table `amazon_reviews_ngram` with an Ngram index on the `review_body` column. The index is configured with a `gram_size` of 10 and a `bitmap_size` of 2 MB to optimize fuzzy search performance on large text fields such as user reviews.

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

To show the created index, use the [SHOW INDEXES](../../50-administration-cmds/show-indexes.md) command:

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

Alternatively, you can create the table first, then create the Ngram index on the `review_body` column:

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