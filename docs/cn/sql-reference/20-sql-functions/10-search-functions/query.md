---
title: QUERY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.619"/>

搜索满足指定查询表达式的文档。请注意，QUERY 函数只能在 WHERE 子句中使用。

:::info
Databend 的 QUERY 函数灵感来源于 Elasticsearch 的 [QUERY](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-query)。
:::

## 语法

```sql
QUERY( '<query_expr>'[, '<options>'] )
```

查询表达式支持以下语法。请注意，`<keyword>` 也可用于后缀匹配，搜索词后跟星号 (*) 可以匹配任意数量的字符或单词。

| 语法                                                  | 描述                                                                                                                                                                                                                                             | 示例                                |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `<column>:<keyword>`                                    | 匹配指定列包含指定关键词的文档。                                                                                                                                                                            | `QUERY('title:power')`                  |
| `<column>:IN [<keyword1>, <keyword2>...]` | 匹配指定列包含方括号内任一关键词的文档。 | `QUERY('title:IN [power, art]')`|
| `<column>:<keyword> AND / OR <keyword>`                 | 匹配指定列包含指定关键词中的全部或任一关键词的文档。在同时包含 AND 和 OR 的查询中，AND 操作优先于 OR，即 'a AND b OR c' 被解读为 '(a AND b) OR c'。                       | `QUERY('title:power AND art')`          |
| `<column>:+<keyword> -<keyword>`                        | 匹配指定列包含指定正关键词且不包含指定负关键词的文档。                                                                                               | `QUERY('title:+the -reading')`          |
| `<column>:"<phrase>"`                                   | 匹配指定列包含指定确切短语的文档。                                                                                                                                                                       | `QUERY('title:"Benefits of Exercise"')` |
| `<column>:<keyword>^<boost> <column>:<keyword>^<boost>` | 匹配指定关键词存在于指定列中，并根据指定的权重增加其在搜索中的相关性。此语法允许为多个列设置不同的权重，以影响搜索相关性。 | `QUERY('title:art^5 body:reading^1.2')` |


| 选项    | 描述                                                                                                                                                                                         | 示例                                                                                              | 解释                                                                                                                                                                                                          |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fuzziness | 允许匹配在指定 Levenshtein 距离内的词项。`fuzziness` 可以设置为 1 或 2。                                                                                                    | SELECT id, score(), content FROM t WHERE query('content:box', 'fuzziness=1');                        | 当匹配查询词 "box" 时，`fuzziness=1` 允许匹配 "fox" 等词项，因为 "box" 和 "fox" 的 Levenshtein 距离为 1。                                                                          |
| operator  | 指定多个查询词项的组合方式。可以是 OR（默认）或 AND。OR 返回包含任一查询词项的结果，而 AND 返回包含所有查询词项的结果。     | SELECT id, score(), content FROM t WHERE query('content:action works', 'fuzziness=1;operator=AND');  | 使用 `operator=AND`，查询要求结果中同时包含 "action" 和 "works"。由于 `fuzziness=1`，它匹配 "Actions" 和 "words" 等词项，因此 "Actions speak louder than words" 被返回。 |
| lenient   | 控制当查询文本无效时是否报告错误。默认为 `false`。如果设置为 `true`，则不报告错误，如果查询文本无效，则返回空结果集。 | SELECT id, score(), content FROM t WHERE query('content:()', 'lenient=true');                        | 如果查询文本 `()` 无效，设置 `lenient=true` 防止抛出错误并返回空结果集。                                                                               |

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

-- 检索 'title' 列包含关键词 'power' 的文档
SELECT * FROM test WHERE QUERY('title:power');

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含以 'The' 开头后跟任意字符的值的文档
SELECT * FROM test WHERE QUERY('title:The*');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                      body                                      │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ The Importance of Reading           │ Reading is a crucial skill that opens up a world of knowledge and imagination. │
│ The Benefits of Exercise            │ Exercise is essential for maintaining a healthy lifestyle.                     │
│ The Power of Perseverance           │ Perseverance is the key to overcoming obstacles and achieving success.         │
│ The Art of Communication            │ Effective communication is crucial in everyday life.                           │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含关键词 'power' 或 'art' 的文档
SELECT * FROM test WHERE QUERY('title:power OR art');

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

SELECT * FROM test WHERE QUERY('title:IN [power, art]')

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
│      Nullable(String)     │                            Nullable(String)                            │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含正向关键词 'the' 但不包含 'reading' 的文档
SELECT * FROM test WHERE QUERY('title:+the -reading');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                title                │                                  body                                  │
├─────────────────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Benefits of Exercise            │ Exercise is essential for maintaining a healthy lifestyle.             │
│ The Power of Perseverance           │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication            │ Effective communication is crucial in everyday life.                   │
│ The Impact of Technology on Society │ Technology has revolutionized our society in countless ways.           │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含确切短语 'Benefits of Exercise' 的文档
SELECT * FROM test WHERE QUERY('title:"Benefits of Exercise"');

┌───────────────────────────────────────────────────────────────────────────────────────┐
│           title          │                            body                            │
├──────────────────────────┼────────────────────────────────────────────────────────────┤
│ The Benefits of Exercise │ Exercise is essential for maintaining a healthy lifestyle. │
└───────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含关键词 'art' 并提升权重 5 以及 'body' 列包含关键词 'reading' 并提升权重 1.2 的文档
SELECT *, score() FROM test WHERE QUERY('title:art^5 body:reading^1.2');

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                      body                                      │  score()  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.3860708 │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                           │ 7.1992116 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'body' 列同时包含 "knowledge" 和 "imagination"（允许轻微拼写错误）的文档
SELECT * FROM test WHERE QUERY('body:knowledg OR imaginatio', 'fuzziness = 1; operator = AND');

-[ RECORD 1 ]-----------------------------------
title: The Importance of Reading
 body: Reading is a crucial skill that opens up a world of knowledge and imagination.
```