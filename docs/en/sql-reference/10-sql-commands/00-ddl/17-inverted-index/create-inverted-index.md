---
title: CREATE INVERTED INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

Creates a new inverted index in Databend.

## Syntax

```sql
CREATE [ OR REPLACE ] [ ASYNC ] INVERTED INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <column>[, <column> ...] )
    [ TOKENIZER = '<tokenizer>' ]
```

| Parameter              | Description                                                                                                                                               |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[ OR REPLACE ]`       | Optional parameter indicating that if the index already exists, it will be replaced.                                                                      |
| `[ ASYNC ]`            | Optional parameter indicating that the created index is asynchronous, requiring manual refresh after creation or data updates.<br/>- If omitted, the index created operates synchronously, without the need for manual refresh.<br/>- To manually refresh an asynchronous inverted index, use the [REFRESH INVERTED INDEX](refresh-inverted-index.md) command.           |
| `[ IF NOT EXISTS ]`    | Optional parameter indicating that the index will only be created if it does not already exist.                                                           |
| `<index>`              | The name of the inverted index to be created.                                                                                                             |
| `[<database>.]<table>` | The name of the database and table containing the columns for which the index will be created.                                                            |
| `<column>`             | The name of the column(s) to be included in the index. Multiple indexes can be created for the same table, but each column must be unique across indexes. |
| `<tokenizer>`          | Optional parameter specifying how texts are split for indexing. Supports `english` (default) and `chinese` tokenizers.                                    |

## Examples

```sql
-- Create an inverted index for the 'comment_text' column in the table 'user_comments'
CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);

-- Create an inverted index with a Chinese tokenizer
-- If no tokenizer is specified, the default is English
CREATE INVERTED INDEX product_reviews_idx ON product_reviews(review_text) TOKENIZER = 'chinese';

-- Create an async inverted index for the 'comment_title' and 'comment_body' columns in the table 'user_comments'
-- The output of SHOW CREATE TABLE includes information about the created inverted index
-- Async inverted indexes require manual refresh after creation or data updates
CREATE ASYNC INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

SHOW CREATE TABLE customer_feedback;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Table       │                                                                                       Create Table                                                                                       │
├───────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ customer_feedback │ CREATE TABLE customer_feedback (\n  comment_title VARCHAR NULL,\n  comment_body VARCHAR NULL,\n  ASYNC INVERTED INDEX customer_feedback_idx (comment_title, comment_body)\n) ENGINE=FUSE │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```