---
title: CREATE INVERTED INDEX
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Creates a new inverted index in Databend.

Inverted indexes are typically used on `STRING` and `VARIANT` columns. For querying, prefer the [`QUERY()`](/sql/sql-functions/search-functions/query) function because it supports field-aware expressions, boolean operators, and nested paths. You can use [`score()`](/sql/sql-functions/search-functions/score) together with `QUERY()` to return relevance scores and rank matched rows.

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
| `<column>`             | The name of the column(s) to be included in the index. In practice these are usually `STRING` or `VARIANT` columns. Multiple indexes can be created for the same table, but each column must be unique across indexes. |
| `<IndexOptions>`       | Optional index options specifying how the inverted index is built.                                                                                            |

### IndexOptions

```sql
IndexOptions ::=
  TOKENIZER = 'english' | 'chinese' | 'japanese' | 'whitespace'
  FILTERS = '<filter_name>[,<filter_name>...]'
  INDEX_RECORD = 'position' | 'basic' | 'freq'
  MODE = 'normal' | 'decompose'
  USER_DICTIONARY = '@<stage>/<path>/userdict.csv'
```

- `TOKENIZER` selects the text segmentation method. Supported values are `english` (default), `chinese`, `japanese`, and `whitespace`.
- `whitespace`, introduced in v1.2.953, is for text that is already segmented. It splits only on ASCII whitespace. Punctuation, hyphens, and non-ASCII separators remain inside tokens. Lowercasing still applies.

- `FILTERS` defines rules for term filtering:

  - Multiple filters can be specified, separated by commas, e.g., `FILTERS = 'english_stop,english_stemmer'`. 
  - A lower case filter is added by default to convert words to lowercase letters.

| FILTERS           | Description                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------|
| `english_stop`    | Removes English stop words like "a", "an", "and" etc.                                                                   |
| `english_stemmer` | Maps different forms of the same word to one common word. For example, "walking" and "walked" will be mapped to "walk". |
| `chinese_stop`    | Removes Chinese stop words, currently only supports removal of Chinese punctuation marks.                               |
| `japanese_stop` | Removes Japanese tokens by part-of-speech tags. |
| `japanese_stemmer` | Converts Japanese words to their base forms. |

- `INDEX_RECORD` determines what is to be stored for the index data:

| INDEX_RECORD | Default? | Description                                                                                                             |
|--------------|----------|-------------------------------------------------------------------------------------------------------------------------|
| `position`   | Yes      | Stores DocId, term frequency, and positions, occupies the most space, offers better scoring, and supports phrase terms. |
| `basic`      | No       | Stores only the DocId, occupies minimal space, but doesn't support phrase searches like "brown fox".                    |
| `freq`       | No       | Stores DocId and term frequency, occupies medium space, doesn't support phrase terms, but may provide better scores.    |

### Japanese Segmentation and User Dictionaries

Since v1.2.953, the Japanese tokenizer supports `MODE` and `USER_DICTIONARY`. Both options require `TOKENIZER = 'japanese'`.

| Option | Default | Behavior |
|--------|---------|----------|
| `MODE` | `normal` | Use `decompose` to split known compound words into searchable components. For example, `decompose` splits `関西国際空港` into component terms. `search` is not a valid mode. |
| `USER_DICTIONARY` | None | Read a user dictionary from a stage file when the index is created. The stage location must start with `@`. Its case is preserved. |

Prepare a UTF-8 Lindera CSV file. The simple format has three fields per row: `surface,part_of_speech,reading`. Do not add a header. For example, save this entry as `/tmp/userdict.csv`:

```csv
Databend Cloud,カスタム名詞,データベンドクラウド
```

The file must not exceed **16 MiB (16,777,216 bytes)**. Invalid encoding or CSV content causes index creation to fail. For full IPADIC-format records, context IDs must also fit the embedded IPADIC dictionary.

Create a stage and upload the file with BendSQL. `PUT` below is a BendSQL command, not server-side SQL:

```sql
CREATE STAGE ja_dict;
PUT fs:///tmp/userdict.csv @ja_dict;
```

Create the index and build it for existing rows:

```sql
CREATE TABLE japanese_news (id INT, content STRING);

INSERT INTO japanese_news VALUES
  (4, 'Databend Cloud は MySQL 互換のデータベースだ'),
  (5, 'Cloud ストレージにバックアップを置く');

CREATE INVERTED INDEX news_idx ON japanese_news(content)
TOKENIZER = 'japanese'
FILTERS = 'japanese_stop,japanese_stemmer'
USER_DICTIONARY = '@ja_dict/userdict.csv';

REFRESH INVERTED INDEX news_idx ON japanese_news;

SELECT id FROM japanese_news WHERE match(content, '"Databend Cloud"') ORDER BY id;
-- 4

SELECT id FROM japanese_news WHERE match(content, 'Cloud') ORDER BY id;
-- 5
```

The dictionary keeps `Databend Cloud` as one token. Quote it inside the search expression to pass the complete term to the analyzer. Without those double quotes, the query grammar splits the text on whitespace before tokenization. In this example, `match(content, 'Databend Cloud')` matches row 5, not row 4.

#### Dictionary Lifecycle and Limits

- Index creation copies the validated CSV into table storage. Indexing and queries use this snapshot, not the stage file.
- Editing or deleting the stage file does not update an existing index. To use changed content, run `CREATE OR REPLACE INVERTED INDEX` with the dictionary location. Then run `REFRESH INVERTED INDEX` for existing rows. `REFRESH` alone does not reload the stage file.
- You can also specify `USER_DICTIONARY` on an inline inverted index in `CREATE TABLE`. Dictionary-backed indexes are not supported on temporary tables.
- In addition to the usual index-creation privileges, the caller needs read access to the dictionary stage. Uploading the file requires the relevant stage write privileges.
- `SHOW CREATE TABLE` shows the user-supplied `USER_DICTIONARY` location. The storage snapshot location is internal. Do not set the reserved `user_dictionary_location` option in user DDL.

## Examples

### Creating an Inverted Index on a Single Column

```sql
CREATE TABLE user_comments (
    id INT,
    comment_text STRING
);

CREATE INVERTED INDEX user_comments_idx ON user_comments(comment_text);
```

### Creating an Inverted Index with Custom Tokenizer and Filters

```sql
CREATE TABLE product_reviews (
    id INT,
    review_text STRING
);

-- If no tokenizer is specified, the default is English.
-- Available filters include `english_stop`, `english_stemmer`, and `chinese_stop`.
CREATE INVERTED INDEX product_reviews_idx
ON product_reviews(review_text)
TOKENIZER = 'chinese'
FILTERS = 'english_stop,english_stemmer,chinese_stop'
INDEX_RECORD = 'basic';
```

### Creating an Inverted Index on Multiple Columns

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

### Querying a Single Indexed Column with `QUERY()`

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

Use `QUERY()` to search the indexed column and return relevance scores with `score()`:

```sql
SELECT id, score(), content
FROM quotes
WHERE QUERY('content:word')
ORDER BY score() DESC;
```

Result:

```text
╭──────────────────────────────────────────────────────╮
│ id │  score()  │               content               │
├────┼───────────┼─────────────────────────────────────┤
│  2 │ 0.8025914 │ A picture is worth a thousand words │
│  3 │ 0.7438652 │ Actions speak louder than words     │
╰──────────────────────────────────────────────────────╯
```

You can also run fuzzy search:

```sql
SELECT id, score(), content
FROM quotes
WHERE QUERY('content:box', 'fuzziness=1');
```

Result:

```text
╭────────────────────────────────────────────────────────────╮
│ id │ score() │                   content                   │
├────┼─────────┼─────────────────────────────────────────────┤
│  1 │     1.0 │ The quick brown fox jumps over the lazy dog │
╰────────────────────────────────────────────────────────────╯
```

### Querying Multiple Indexed Columns with `QUERY()`

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

Use `QUERY()` for field-aware boolean search:

```sql
SELECT id, score(), title
FROM books
WHERE QUERY('title:设计 OR title:实现')
ORDER BY score() DESC;
```

Result:

```text
╭───────────────────────────────────╮
│ id │  score()  │       title      │
├────┼───────────┼──────────────────┤
│  3 │ 1.8571336 │ Vue.js设计与实现 │
│  4 │ 0.6785374 │ 前端架构设计     │
╰───────────────────────────────────╯
```

You can also search multiple fields together:

```sql
SELECT id, score(), title
FROM books
WHERE QUERY('title:ChatGPT OR description:OpenAI')
ORDER BY score() DESC;
```

Result:

```text
╭───────────────────────────────────╮
│ id │  score()  │       title      │
├────┼───────────┼──────────────────┤
│  1 │ 2.5784383 │ 这就是ChatGPT    │
╰───────────────────────────────────╯
```

### Querying a `VARIANT` Column with `QUERY()`

`VARIANT` columns are also supported. This is useful when you want to search nested JSON-like documents without flattening them first.

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

Query nested paths inside the `VARIANT` document:

```sql
SELECT id, body
FROM media_assets
WHERE QUERY('body.videoInfo.extraData.name:codecA AND body.videoInfo.extraData.type:jpg')
ORDER BY id;
```

Result:

```text
╭──────────────────────────────────────────────────────────────────────────────────────────────────╮
│ id │                                             body                                            │
├────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│  2 │ {"videoInfo":{"extraData":[{"name":"codecA","type":"jpg"},{"name":"codecA","type":"mp4"}]}} │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

And quoted terms work for values containing spaces:

```sql
SELECT id, body
FROM media_assets
WHERE QUERY('body.videoInfo.extraData.name:"codec foo" AND body.videoInfo.extraData.type:mp4')
ORDER BY id;
```

Result:

```text
╭──────────────────────────────────────────────────────────────────────╮
│ id │                               body                              │
├────┼─────────────────────────────────────────────────────────────────┤
│  4 │ {"videoInfo":{"extraData":[{"name":"codec foo","type":"mp4"}]}} │
╰──────────────────────────────────────────────────────────────────────╯
```
