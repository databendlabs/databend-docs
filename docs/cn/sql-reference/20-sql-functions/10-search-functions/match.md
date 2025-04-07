```markdown
---
title: MATCH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.619"/>

搜索包含指定关键词的文档。请注意，MATCH 函数只能在 WHERE 子句中使用。

:::info
Databend 的 MATCH 函数的灵感来自 Elasticsearch 的 [MATCH](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-match)。
:::

## 语法

```sql
MATCH( '<columns>', '<keywords>'[, '<options>'] )
```

| 参数    | 描述                                                                                                                                                                                                                                               |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<columns>`  | 表中要搜索指定关键词的列的逗号分隔列表，可以使用语法 (^)，对每个列进行可选的加权，允许为每个列分配不同的权重，从而影响每个列在搜索中的重要性。 |
| `<keywords>` | 要与表中指定列匹配的关键词。此参数还可以用于后缀匹配，其中搜索词后跟星号 (*) 可以匹配任意数量的字符或单词。                                                                                                                                                                                       |
| `<options>` | 一组配置选项，用分号 `;` 分隔，用于自定义搜索行为。有关详细信息，请参见下表。 |

| 选项    | 描述                                                                                                                                                                                         | 示例                                                                                               | 说明                                                                                                                                                                                                          |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fuzziness | 允许匹配指定 Levenshtein 距离内的词。`fuzziness` 可以设置为 1 或 2。                                                                                                    | SELECT id, score(), content FROM t WHERE match(content, 'box', 'fuzziness=1');                       | 匹配查询词 "box" 时，`fuzziness=1` 允许匹配像 "fox" 这样的词，因为 "box" 和 "fox" 的 Levenshtein 距离为 1。                                                                          |
| operator  | 指定如何组合多个查询词。可以设置为 OR（默认）或 AND。OR 返回包含任何查询词的结果，而 AND 返回包含所有查询词的结果。     | SELECT id, score(), content FROM t WHERE match(content, 'action works', 'fuzziness=1;operator=AND'); | 使用 `operator=AND`，查询要求结果中同时存在 "action" 和 "works"。由于 `fuzziness=1`，它可以匹配像 "Actions" 和 "words" 这样的词，因此返回 "Actions speak louder than words"。 |
| lenient   | 控制在查询文本无效时是否报告错误。默认为 `false`。如果设置为 `true`，则不报告错误，如果查询文本无效，则返回一个空结果集。 | SELECT id, score(), content FROM t WHERE match(content, '()', 'lenient=true');                       | 如果查询文本 `()` 无效，则设置 `lenient=true` 可防止抛出错误，并返回一个空结果集。                                                                               |

## 示例

```sql
CREATE TABLE test(title STRING, body STRING);

CREATE INVERTED INDEX idx ON test(title, body);

INSERT INTO test VALUES
('The Importance of Reading', 'Reading is a crucial skill that opens up a world of knowledge and imagination.'),
('The Benefits of Exercise', 'Exercise is essential for maintaining a healthy lifestyle.'),
('The Power of Perseverance', 'Perseverance is the key to overcoming obstacles and achieving success.'),
('The Art of Communication', 'Effective communication is crucial in everyday life.'),
('The Impact of Technology on Society', 'Technology has revolutionized our society in countless ways.');

-- Retrieve documents where the 'title' column matches 'art power'
SELECT * FROM test WHERE MATCH('title', 'art power');

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Retrieve documents where the 'title' column contains values that start with 'The' followed by any characters
SELECT * FROM test WHERE MATCH('title', 'The*')

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │
│           Nullable(String)          │                                Nullable(String)                                │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │
│ The Benefits of Exercise            │ Exercise is essential for maintaining a healthy lifestyle.                     │
│ The Power of Perseverance           │ Perseverance is the key to overcoming obstacles and achieving success.         │
│ The Art of Communication            │ Effective communication is crucial in everyday life.                           │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Retrieve documents where either the 'title' or 'body' column matches 'knowledge technology'
SELECT *, score() FROM test WHERE MATCH('title, body', 'knowledge technology');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │  score()  │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.1550591 │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │ 2.6830134 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Retrieve documents where either the 'title' or 'body' column matches 'knowledge technology', with weighted importance on both columns
SELECT *, score() FROM test WHERE MATCH('title^5, body^1.2', 'knowledge technology');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │  score()  │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.3860708 │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │ 7.8053584 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Retrieve documents where the 'body' column contains both "knowledge" and "imagination" (allowing for minor typos).
SELECT * FROM test WHERE MATCH('body', 'knowledg imaginatio', 'fuzziness = 1; operator = AND');

-[ RECORD 1 ]-----------------------------------
title: The Importance of Reading
 body: Reading is a crucial skill that opens up a world of knowledge and imagination.
```