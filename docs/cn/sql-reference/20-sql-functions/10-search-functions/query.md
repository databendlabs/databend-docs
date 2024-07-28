---
title: QUERY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.425"/>

搜索满足指定查询表达式的文档。请注意，QUERY 函数只能在 WHERE 子句中使用。

:::info
Databend 的 QUERY 函数灵感来源于 Elasticsearch 的 [QUERY](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-query)。
:::

## 语法

```sql
QUERY( '<query_expr>' )
```

查询表达式支持以下语法：

| 语法                                                  | 描述                                                                                                                                                                                                                                             | 示例                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `<column>:<keyword>`                                    | 匹配指定列包含指定关键词的文档。                                                                                                                                                                            | `QUERY('title:power')`                  |
| `<column>:<keyword> AND / OR <keyword>`                 | 匹配指定列包含指定关键词的文档。在同时包含 AND 和 OR 的查询中，AND 操作优先于 OR，即 'a AND b OR c' 被解读为 '(a AND b) OR c'。                       | `QUERY('title:power AND art')`          |
| `<column>:+<keyword> -<keyword>`                        | 匹配指定列包含指定正关键词且不包含指定负关键词的文档。                                                                                               | `QUERY('title:+the -reading')`          |
| `<column>:"<phrase>"`                                   | 匹配指定列包含指定确切短语的文档。                                                                                                                                                                       | `QUERY('title:"Benefits of Exercise"')` |
| `<column>:<keyword>^<boost> <column>:<keyword>^<boost>` | 匹配指定关键词存在于指定列中，并根据指定的权重增加其在搜索中的相关性。此语法允许为多个列设置不同的权重以影响搜索相关性。 | `QUERY('title:art^5 body:reading^1.2')` |

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

-- 检索 'title' 列包含关键词 'power' 或 'art' 的文档
SELECT * FROM test WHERE QUERY('title:power OR art');

┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                  body                                  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────┤
│ The Power of Perseverance │ Perseverance is the key to overcoming obstacles and achieving success. │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                   │
└────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含正关键词 'the' 但不包含 'reading' 的文档
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

-- 检索 'title' 列包含关键词 'art' 且权重为 5，以及 'body' 列包含关键词 'reading' 且权重为 1.2 的文档
SELECT *, score() FROM test WHERE QUERY('title:art^5 body:reading^1.2');

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                      body                                      │  score()  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.3860708 │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                           │ 7.1992116 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```