---
title: SCORE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.425"/>

返回查询字符串的相关性。分数越高，数据相关性越高。请注意，SCORE 函数只能与 [QUERY](query.md) 或 [MATCH](match.md) 函数一起使用。

:::info
Databend 的 SCORE 函数的灵感来自 Elasticsearch 的 [SCORE](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-score)。
:::

## 语法

```sql
SCORE()
```

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

-- 检索 'title' 列包含关键字 'art' 且 boost 为 5，'body' 列包含关键字 'reading' 且 boost 为 1.2 的文档，以及它们的相关性分数
SELECT *, score() FROM test WHERE QUERY('title:art^5 body:reading^1.2');

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                      body                                      │  score()  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading │ Reading is a crucial skill that opens up a world of knowledge and imagination. │ 1.3860708 │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                           │ 7.1992116 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 检索 'title' 列包含关键字 'reading' 且 boost 为 5，'body' 列包含关键字 'everyday' 且 boost 为 1.2 的文档，以及它们的相关性分数
SELECT *, score() FROM test WHERE MATCH('title^5, body^1.2', 'reading everyday');

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           title           │                                      body                                      │  score()  │
├───────────────────────────┼────────────────────────────────────────────────────────────────────────────────┼───────────┤
│ The Importance of Reading │ Reading is a crucial skill that opens up a world of knowledge and imagination. │  8.585282 │
│ The Art of Communication  │ Effective communication is crucial in everyday life.                           │ 1.8575745 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```