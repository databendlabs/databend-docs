---
title: MATCH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.619"/>

搜索包含指定关键词的文档。请注意，MATCH 函数只能在 WHERE 子句中使用。

:::info
Databend 的 MATCH 函数灵感来源于 Elasticsearch 的 [MATCH](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-match)。
:::

## 语法

```sql
MATCH( '<columns>', '<keywords>'[, '<options>'] )
```

| 参数         | 描述                                                                                                                                                                                                                                               |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<columns>`  | 表中要搜索指定关键词的列名列表，以逗号分隔，可选地使用 (^) 语法进行加权，允许为每个列分配不同的权重，影响每个列在搜索中的重要性。 |
| `<keywords>` | 要匹配表中指定列的关键词。此参数还可用于后缀匹配，搜索词后跟星号 (*) 可以匹配任意数量的字符或词。                                                                                                                                                                                       |
| `<options>` | 一组以分号 `;` 分隔的配置选项，用于自定义搜索行为。详情见下表。 |

| 选项        | 描述                                                                                                                                                                                         | 示例                                                                                               | 解释                                                                                                                                                                                                          |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fuzziness | 允许匹配指定 Levenshtein 距离内的词项。`fuzziness` 可以设置为 1 或 2。                                                                                                    | SELECT id, score(), content FROM t WHERE match(content, 'box', 'fuzziness=1');                       | 当匹配查询词 "box" 时，`fuzziness=1` 允许匹配 "fox" 等词项，因为 "box" 和 "fox" 的 Levenshtein 距离为 1。                                                                          |
| operator  | 指定多个查询词项的组合方式。可以是 OR（默认）或 AND。OR 返回包含任意查询词项的结果，而 AND 返回包含所有查询词项的结果。     | SELECT id, score(), content FROM t WHERE match(content, 'action works', 'fuzziness=1;operator=AND'); | 使用 `operator=AND`，查询要求结果中同时包含 "action" 和 "works"。由于 `fuzziness=1`，它匹配 "Actions" 和 "words" 等词项，因此返回 "Actions speak louder than words"。 |
| lenient   | 控制当查询文本无效时是否报告错误。默认为 `false`。如果设置为 `true`，则不报告错误，如果查询文本无效，则返回空结果集。 | SELECT id, score(), content FROM t WHERE match(content, '()', 'lenient=true');                       | 如果查询文本 `()` 无效，设置 `lenient=true` 会阻止抛出错误，并返回空结果集。                                                                               |

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

-- 检索 'title' 列匹配 'art power' 的文档
SELECT * FROM test WHERE MATCH('title', 'art power');

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含以 'The' 开头后跟任意字符的值的文档
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

-- 检索 'title' 或 'body' 列匹配 'knowledge technology' 的文档
SELECT *, score() FROM test WHERE MATCH('title, body', 'knowledge technology');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │  score()  │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.1550591 │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │ 2.6830134 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 或 'body' 列匹配 'knowledge technology' 的文档，并对两列进行加权
SELECT *, score() FROM test WHERE MATCH('title^5, body^1.2', 'knowledge technology');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │  score()  │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.3860708 │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │ 7.8053584 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'body' 列包含 "knowledge" 和 "imagination"（允许轻微拼写错误）的文档
SELECT * FROM test WHERE MATCH('body', 'knowledg imaginatio', 'fuzziness = 1; operator = AND');

-[ RECORD 1 ]-----------------------------------
title: The Importance of Reading
 body: Reading is a crucial skill that opens up a world of knowledge and imagination.
```