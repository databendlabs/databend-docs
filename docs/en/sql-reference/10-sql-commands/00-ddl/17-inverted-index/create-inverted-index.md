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
CREATE [ OR REPLACE ] INVERTED INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <column>[, <column> ...] )
    [ <IndexOptions> ]
```

| Parameter              | Description                                                                                                                                               |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[ OR REPLACE ]`       | Optional parameter indicating that if the index already exists, it will be replaced.                                                                      |
| `[ IF NOT EXISTS ]`    | Optional parameter indicating that the index will only be created if it does not already exist.                                                           |
| `<index>`              | The name of the inverted index to be created.                                                                                                             |
| `[<database>.]<table>` | The name of the database and table containing the columns for which the index will be created.                                                            |
| `<column>`             | The name of the column(s) to be included in the index. Multiple indexes can be created for the same table, but each column must be unique across indexes. |
| `<IndexOptions>`       | Optional index options specifying how the inverted index is built.                                                                                            |

### IndexOptions

`IndexOptions` specifying the TOKENIZER

```sql
IndexOptions ::=
  TOKENIZER = 'english' | 'chinese'
  FILTERS = 'english_stop' | 'english_stemmer' | 'chinese_stop'
  INDEX_RECORD = 'basic' | 'freq' | 'position'
```

`TOKENIZER` specifying how texts are split for indexing. Supports `english` (default) and `chinese` tokenizers.

`FILTERS` specifies filtering rules for terms, including the following:

| Parameter.        | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| `english_stop`    | removes English stop words like "a", "an", "and" etc.                                                                   |
| `english_stemmer` | maps different forms of the same word to one common word. For example, "walking" and "walked" will be mapped to "walk". |
| `chinese_stop`    | removes Chinese stop words, currently only supports removal of Chinese punctuation marks.                               |

Multiple filters can be specified, separated by commas, e.g. FILTERS = 'english_stop,english_stemmer,chinese_stop'. In addition to these filters, a lower case filter is added by default to convert words to lower case letters.

`INDEX_RECORD` is used to define the storage format of index data and supports `basic`, `freq` and `position` (default).

| Parameter  | Description                                                                                                             |
|------------|-------------------------------------------------------------------------------------------------------------------------|
| `basic`    | stores only the `DocId`, takes up minimal space, but can't search for phrases like "brown fox".                         |
| `freq`     | stores `DocId` and term frequency, takes up medium space and can't search for phrase terms, but can give better scores. |
| `position` | stores `DocId`, term frequency and positions, takes up most space, has better scoring and can search for phrase terms.  |

## Examples

```sql
-- Create an inverted index for the 'comment_text' column in the table 'user_comments'
CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);

-- Create an inverted index with a Chinese tokenizer
-- If no tokenizer is specified, the default is English
-- Filters are `english_stop`, `english_stemmer` and `chinese_stop`
-- Index_record in `basic`.
CREATE INVERTED INDEX product_reviews_idx ON product_reviews(review_text) TOKENIZER = 'chinese' FILTERS = 'english_stop,english_stemmer,chinese_stop' INDEX_RECORD='basic';

-- Create an inverted index for the 'comment_title' and 'comment_body' columns in the table 'user_comments'
-- The output of SHOW CREATE TABLE includes information about the created inverted index
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

SHOW CREATE TABLE customer_feedback;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Table       │                                                                                       Create Table                                                                                      │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ customer_feedback │ CREATE TABLE customer_feedback (\n  comment_title VARCHAR NULL,\n  comment_body VARCHAR NULL,\n  SYNC INVERTED INDEX customer_feedback_idx (comment_title, comment_body)\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```