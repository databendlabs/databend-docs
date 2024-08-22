---
title: MATCH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.619"/>

Searches for documents containing specified keywords. Please note that the MATCH function can only be used in a WHERE clause.

:::info
Databend's MATCH function is inspired by Elasticsearch's [MATCH](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-match).
:::

## Syntax

```sql
MATCH( '<columns>', '<keywords>'[, '<options>'] )
```

| Parameter    | Description                                                                                                                                                                                                                                               |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<columns>`  | A comma-separated list of column names in the table to search for the specified keywords, with optional weighting using the syntax (^), which allows assigning different weights to each column, influencing the importance of each column in the search. |
| `<keywords>` | The keywords to match against the specified columns in the table. This parameter can also be used for suffix matching, where the search term followed by an asterisk (*) can match any number of characters or words.                                                                                                                                                                                       |
| `<options>` | A set of configuration options, separated by semicolons `;`, that customize the search behavior. See the table below for details. |

| Option    | Description                                                                                                                                                                                         | Example                                                                                               | Explanation                                                                                                                                                                                                          |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fuzziness | Allows matching terms within a specified Levenshtein distance. `fuzziness` can be set to 1 or 2.                                                                                                    | SELECT id, score(), content FROM t WHERE match(content, 'box', 'fuzziness=1');                       | When matching the query term "box", `fuzziness=1` allows matching terms like "fox", since "box" and "fox" have a Levenshtein distance of 1.                                                                          |
| operator  | Specifies how multiple query terms are combined. Can be set to OR (default) or AND. OR returns results containing any of the query terms, while AND returns results containing all query terms.     | SELECT id, score(), content FROM t WHERE match(content, 'action works', 'fuzziness=1;operator=AND'); | With `operator=AND`, the query requires both "action" and "works" to be present in the results. Due to `fuzziness=1`, it matches terms like "Actions" and "words", so "Actions speak louder than words" is returned. |
| lenient   | Controls whether errors are reported when the query text is invalid. Defaults to `false`. If set to `true`, no error is reported, and an empty result set is returned if the query text is invalid. | SELECT id, score(), content FROM t WHERE match(content, '()', 'lenient=true');                       | If the query text `()` is invalid, setting `lenient=true` prevents an error from being thrown and returns an empty result set instead.                                                                               |

## Examples

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