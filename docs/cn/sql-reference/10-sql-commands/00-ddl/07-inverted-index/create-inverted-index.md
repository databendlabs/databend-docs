---
title: 创建倒排索引
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.405"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='倒排索引'/>

在 Databend 中创建一个新的倒排索引。

## 语法

```sql
CREATE [ OR REPLACE ] INVERTED INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <column>[, <column> ...] )
    [ <IndexOptions> ]
```

| 参数              | 描述                                                                                                                                               |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `[ OR REPLACE ]`  | 可选参数，表示如果索引已存在，则替换它。                                                                                                          |
| `[ IF NOT EXISTS ]` | 可选参数，表示仅当索引不存在时才会创建。                                                                                                          |
| `<index>`         | 要创建的倒排索引的名称。                                                                                                                          |
| `[<database>.]<table>` | 包含要创建索引的列的数据库和表的名称。                                                                                                            |
| `<column>`        | 要包含在索引中的列的名称。可以为同一表创建多个索引，但每个列在索引中必须是唯一的。                                                                |
| `<IndexOptions>`  | 可选的索引选项，指定如何构建倒排索引。                                                                                                            |

### IndexOptions

```sql
IndexOptions ::=
  TOKENIZER = 'english' | 'chinese'
  FILTERS = 'english_stop' | 'english_stemmer' | 'chinese_stop'
  INDEX_RECORD = 'position' | 'basic' | 'freq' 
```

- `TOKENIZER` 指定如何对文本进行分词以进行索引。支持 `english`（默认）和 `chinese` 分词器。

- `FILTERS` 定义术语过滤规则：

  - 可以指定多个过滤器，用逗号分隔，例如 `FILTERS = 'english_stop,english_stemmer'`。
  - 默认添加一个将单词转换为小写字母的过滤器。

| FILTERS           | 描述                                                                                                             |
|-------------------|-----------------------------------------------------------------------------------------------------------------|
| `english_stop`    | 移除英文停用词，如 "a", "an", "and" 等。                                                                         |
| `english_stemmer` | 将同一单词的不同形式映射到一个共同的单词。例如，"walking" 和 "walked" 将被映射为 "walk"。                         |
| `chinese_stop`    | 移除中文停用词，目前仅支持移除中文标点符号。                                                                     |

- `INDEX_RECORD` 确定索引数据存储的内容：

| INDEX_RECORD | 默认？ | 描述                                                                                                             |
|--------------|--------|-----------------------------------------------------------------------------------------------------------------|
| `position`   | 是     | 存储 DocId、词频和位置，占用最多空间，提供更好的评分，并支持短语查询。                                             |
| `basic`      | 否     | 仅存储 DocId，占用最小空间，但不支持短语查询，如 "brown fox"。                                                     |
| `freq`       | 否     | 存储 DocId 和词频，占用中等空间，不支持短语查询，但可能提供更好的评分。                                             |

## 示例

```sql
-- 为表 'user_comments' 中的 'comment_text' 列创建倒排索引
CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);

-- 使用中文分词器创建倒排索引
-- 如果未指定分词器，则默认为英文
-- 过滤器为 `english_stop`, `english_stemmer` 和 `chinese_stop`
-- 索引记录为 `basic`。
CREATE INVERTED INDEX product_reviews_idx ON product_reviews(review_text) TOKENIZER = 'chinese' FILTERS = 'english_stop,english_stemmer,chinese_stop' INDEX_RECORD='basic';

-- 为表 'user_comments' 中的 'comment_title' 和 'comment_body' 列创建倒排索引
-- SHOW CREATE TABLE 的输出包含有关创建的倒排索引的信息
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

SHOW CREATE TABLE customer_feedback;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       表       │                                                                                       创建表                                                                                       │
├───────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ customer_feedback │ CREATE TABLE customer_feedback (\n  comment_title VARCHAR NULL,\n  comment_body VARCHAR NULL,\n  SYNC INVERTED INDEX customer_feedback_idx (comment_title, comment_body)\n) ENGINE=FUSE │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```