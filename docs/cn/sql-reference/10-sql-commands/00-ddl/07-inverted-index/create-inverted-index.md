---
title: CREATE INVERTED INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.405"/>

在 Databend 中创建新的倒排索引。

倒排索引通常用于 `STRING` 和 `VARIANT` 列。查询时建议优先使用 [`QUERY()`](/sql/sql-functions/search-functions/query) 函数，因为它支持字段感知表达式、布尔运算符和嵌套路径。你也可以将 [`score()`](/sql/sql-functions/search-functions/score) 与 `QUERY()` 一起使用，返回相关性分数并对匹配结果排序。

## 语法

```sql
CREATE [ OR REPLACE ] INVERTED INDEX [IF NOT EXISTS] <index>
    ON [<database>.]<table>( <column>[, <column> ...] )
    [ <IndexOptions> ]
```

| 参数 | 描述 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[ OR REPLACE ]`       | 可选参数，表示如果索引已存在，则替换现有索引。 |
| `[ IF NOT EXISTS ]`    | 可选参数，表示仅在索引不存在时才创建。 |
| `<index>`              | 要创建的倒排索引名称。 |
| `[<database>.]<table>` | 包含被索引列的数据库和表名。 |
| `<column>`             | 要加入索引的列名。实际使用中通常是 `STRING` 或 `VARIANT` 列。可以为同一张表创建多个索引，但每个列在索引定义中必须唯一。 |
| `<IndexOptions>`       | 可选索引选项，用于指定倒排索引的构建方式。 |

### IndexOptions

```sql
IndexOptions ::=
  TOKENIZER = 'english' | 'chinese'
  FILTERS = 'english_stop' | 'english_stemmer' | 'chinese_stop'
  INDEX_RECORD = 'position' | 'basic' | 'freq' 
```

- `TOKENIZER` 指定如何对文本进行分词索引，支持 `english`（默认）和 `chinese` tokenizer。

- `FILTERS` 定义术语过滤规则：

  - 可以指定多个过滤器，并使用逗号分隔，例如 `FILTERS = 'english_stop,english_stemmer'`。
  - 默认会附加一个 lowercase filter，将单词转成小写。

| FILTERS           | 描述                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| `english_stop`    | 去除英语停用词，例如 "a"、"an"、"and" 等。 |
| `english_stemmer` | 将同一单词的不同形式映射到共同词根。例如，"walking" 和 "walked" 都会映射到 "walk"。 |
| `chinese_stop`    | 删除中文停用词，目前仅支持删除中文标点符号。                               |

- `INDEX_RECORD` 决定索引中实际存储的内容：

| INDEX_RECORD | 默认？ | 描述 |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `position`   | 是      | 存储 DocId、词频和位置信息，占用空间最大，但评分效果更好，并支持短语搜索。 |
| `basic`      | 否       | 仅存储 DocId，占用空间最小，但不支持像 "brown fox" 这样的短语搜索。 |
| `freq`       | 否       | 存储 DocId 和词频，占用空间中等，不支持短语搜索，但评分可能更好。 |

## 示例

### 在单列上创建倒排索引

```sql
CREATE TABLE user_comments (
    id INT,
    comment_text STRING
);

CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);
```

### 使用自定义 tokenizer 和 filters 创建倒排索引

```sql
CREATE TABLE product_reviews (
    id INT,
    review_text STRING
);

-- 如果未指定 tokenizer，默认使用 English。
-- 可用 filters 包括 `english_stop`、`english_stemmer` 和 `chinese_stop`。
CREATE INVERTED INDEX product_reviews_idx
ON product_reviews(review_text)
TOKENIZER = 'chinese'
FILTERS = 'english_stop,english_stemmer,chinese_stop'
INDEX_RECORD = 'basic';
```

### 在多列上创建倒排索引

```sql
CREATE TABLE customer_feedback (
    comment_id INT,
    comment_title STRING,
    comment_body VARIANT
);

CREATE INVERTED INDEX customer_feedback_idx
ON customer_feedback(comment_title, comment_body);

SHOW CREATE TABLE customer_feedback;

*************************** 1. row ***************************
       Table: customer_feedback
Create Table: CREATE TABLE customer_feedback (
  comment_id INT NULL,
  comment_title VARCHAR NULL,
  comment_body VARIANT NULL,
  SYNC INVERTED INDEX customer_feedback_idx (comment_title, comment_body)
) ENGINE=FUSE
```

### 使用 `QUERY()` 查询单个索引列

```sql
CREATE TABLE quotes (
    id INT,
    content STRING,
    INVERTED INDEX idx_content(content)
        FILTERS = 'english_stop,english_stemmer'
);

INSERT INTO quotes VALUES
  (1, 'The quick brown fox jumps over the lazy dog'),
  (2, 'A picture is worth a thousand words'),
  (3, 'Actions speak louder than words'),
  (4, 'Time flies like an arrow; fruit flies like a banana');
```

使用 `QUERY()` 搜索索引列，并通过 `score()` 返回相关性分数：

```sql
SELECT id, score(), content
FROM quotes
WHERE QUERY('content:word')
ORDER BY score() DESC;
```

结果：

```text
╭──────────────────────────────────────────────────────╮
│ id │  score()  │               content               │
├────┼───────────┼─────────────────────────────────────┤
│  2 │ 0.8025914 │ A picture is worth a thousand words │
│  3 │ 0.7438652 │ Actions speak louder than words     │
╰──────────────────────────────────────────────────────╯
```

你也可以执行模糊搜索：

```sql
SELECT id, score(), content
FROM quotes
WHERE QUERY('content:box', 'fuzziness=1');
```

结果：

```text
╭────────────────────────────────────────────────────────────╮
│ id │ score() │                   content                   │
├────┼─────────┼─────────────────────────────────────────────┤
│  1 │     1.0 │ The quick brown fox jumps over the lazy dog │
╰────────────────────────────────────────────────────────────╯
```

### 使用 `QUERY()` 查询多列索引

```sql
CREATE TABLE books (
    id INT,
    title STRING,
    author STRING,
    description STRING
);

CREATE INVERTED INDEX idx_books
ON books(title, author, description)
TOKENIZER = 'chinese'
FILTERS = 'english_stop,english_stemmer,chinese_stop';

INSERT INTO books VALUES
  (1, '这就是ChatGPT', '斯蒂芬·沃尔弗拉姆', 'ChatGPT 是 OpenAI 开发的人工智能聊天机器人程序。'),
  (2, 'Python深度学习（第2版）', '弗朗索瓦·肖莱', '本书通过 Python 代码讲解深度学习的核心思想。'),
  (3, 'Vue.js设计与实现', '霍春阳', '本书从规范和源码出发，讲解 Vue.js 框架设计与实现细节。'),
  (4, '前端架构设计', '迈卡·高保特', '本书探讨前端架构原则、工作流程和工程实践。');
```

使用 `QUERY()` 执行字段感知的布尔搜索：

```sql
SELECT id, score(), title
FROM books
WHERE QUERY('title:设计 OR title:实现')
ORDER BY score() DESC;
```

结果：

```text
╭───────────────────────────────────╮
│ id │  score()  │       title      │
├────┼───────────┼──────────────────┤
│  3 │ 1.8571336 │ Vue.js设计与实现 │
│  4 │ 0.6785374 │ 前端架构设计     │
╰───────────────────────────────────╯
```

你也可以联合多个字段一起查询：

```sql
SELECT id, score(), title
FROM books
WHERE QUERY('title:ChatGPT OR description:OpenAI')
ORDER BY score() DESC;
```

结果：

```text
╭───────────────────────────────────╮
│ id │  score()  │       title      │
├────┼───────────┼──────────────────┤
│  1 │ 2.5784383 │ 这就是ChatGPT    │
╰───────────────────────────────────╯
```

### 使用 `QUERY()` 查询 `VARIANT` 列

`VARIANT` 列同样支持倒排索引。这在需要检索嵌套 JSON 文档、但又不想预先扁平化数据时非常有用。

```sql
CREATE TABLE media_assets (
    id INT,
    body VARIANT,
    INVERTED INDEX idx_body(body)
);

INSERT INTO media_assets VALUES
  (1, '{"videoInfo":{"extraData":[{"name":"codecA","type":"mp4"},{"name":"codecB","type":"jpg"}]}}'),
  (2, '{"videoInfo":{"extraData":[{"name":"codecA","type":"jpg"},{"name":"codecA","type":"mp4"}]}}'),
  (3, '{"videoInfo":{"extraData":[{"name":"codecA","attributes":{"type":"jpg"}},{"name":"codecB","attributes":{"type":"mp4"}}]}}'),
  (4, '{"videoInfo":{"extraData":[{"name":"codec foo","type":"mp4"}]}}');
```

查询 `VARIANT` 文档中的嵌套路径：

```sql
SELECT id, body
FROM media_assets
WHERE QUERY('body.videoInfo.extraData.name:codecA AND body.videoInfo.extraData.type:jpg')
ORDER BY id;
```

结果：

```text
╭──────────────────────────────────────────────────────────────────────────────────────────────────╮
│ id │                                             body                                            │
├────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│  2 │ {"videoInfo":{"extraData":[{"name":"codecA","type":"jpg"},{"name":"codecA","type":"mp4"}]}} │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

对于带空格的值，可以使用带引号的查询词：

```sql
SELECT id, body
FROM media_assets
WHERE QUERY('body.videoInfo.extraData.name:"codec foo" AND body.videoInfo.extraData.type:mp4')
ORDER BY id;
```

结果：

```text
╭──────────────────────────────────────────────────────────────────────╮
│ id │                               body                              │
├────┼─────────────────────────────────────────────────────────────────┤
│  4 │ {"videoInfo":{"extraData":[{"name":"codec foo","type":"mp4"}]}} │
╰──────────────────────────────────────────────────────────────────────╯
```
