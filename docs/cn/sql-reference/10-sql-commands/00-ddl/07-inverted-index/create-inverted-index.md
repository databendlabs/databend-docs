---
title: CREATE INVERTED INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.405"/>

在 Databend 中创建一个新的 inverted index。

## 语法

```sql
CREATE [ OR REPLACE ] INVERTED INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <column>[, <column> ...] )
    [ <IndexOptions> ]
```

| 参数              | 描述                                                                                                                                               |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[ OR REPLACE ]`       | 可选参数，指示如果索引已存在，则将其替换。                                                                                                     |
| `[ IF NOT EXISTS ]`    | 可选参数，指示仅当索引尚不存在时才创建索引。                                                           |
| `<index>`              | 要创建的 inverted index 的名称。                                                                                                             |
| `[<database>.]<table>` | 包含要为其创建索引的列的数据库和表的名称。                                                            |
| `<column>`             | 要包含在索引中的列的名称。可以为同一表创建多个索引，但每个列在索引中必须是唯一的。 |
| `<IndexOptions>`       | 可选的索引选项，用于指定如何构建 inverted index。                                                                                            |

### IndexOptions

```sql
IndexOptions ::=
  TOKENIZER = 'english' | 'chinese'
  FILTERS = 'english_stop' | 'english_stemmer' | 'chinese_stop'
  INDEX_RECORD = 'position' | 'basic' | 'freq' 
```

- `TOKENIZER` 指定如何对文本进行分段以进行索引。它支持 `english` (默认) 和 `chinese` tokenizer。

- `FILTERS` 定义了术语过滤的规则：

  - 可以指定多个过滤器，用逗号分隔，例如 `FILTERS = 'english_stop,english_stemmer'`。
  - 默认情况下会添加小写过滤器，以将单词转换为小写字母。

| FILTERS           | 描述                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| `english_stop`    | 删除英语停用词，如 "a"、"an" 和 "and" 等。                                                                   |
| `english_stemmer` | 将同一单词的不同形式映射到一个通用单词。例如，"walking" 和 "walked" 将被映射到 "walk"。 |
| `chinese_stop`    | 删除中文停用词，目前仅支持删除中文标点符号。                               |

- `INDEX_RECORD` 确定要为索引数据存储的内容：

| INDEX_RECORD | 默认？ | 描述                                                                                                             |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `position`   | 是      | 存储 DocId、词频和位置，占用空间最大，提供更好的评分，并支持短语术语。 |
| `basic`      | 否       | 仅存储 DocId，占用空间最小，但不支持像 "brown fox" 这样的短语搜索。                    |
| `freq`       | 否       | 存储 DocId 和词频，占用中等空间，不支持短语术语，但可以提供更好的分数。    |

## 示例

```sql
-- 为表 'user_comments' 中的 'comment_text' 列创建 inverted index
CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);

-- 创建一个带有中文 tokenizer 的 inverted index
-- 如果未指定 tokenizer，则默认为英语
-- Filters are `english_stop`, `english_stemmer` and `chinese_stop`
-- Index_record in `basic`.
CREATE INVERTED INDEX product_reviews_idx ON product_reviews(review_text) TOKENIZER = 'chinese' FILTERS = 'english_stop,english_stemmer,chinese_stop' INDEX_RECORD='basic';

-- 为表 'user_comments' 中的 'comment_title' 和 'comment_body' 列创建 inverted index
-- SHOW CREATE TABLE 的输出包括有关已创建的 inverted index 的信息
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

SHOW CREATE TABLE customer_feedback;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       Table       │                                                                                       Create Table                                                                                      │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ customer_feedback │ CREATE TABLE customer_feedback (\n  comment_title VARCHAR NULL,\n  comment_body VARCHAR NULL,\n  SYNC INVERTED INDEX customer_feedback_idx (comment_title, comment_body)\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
