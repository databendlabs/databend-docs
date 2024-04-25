---
title: TOP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.435"/>

Limits the maximum number of rows returned by a query.

See also: [Limit Clause](01-query-select.md#limit-clause)

## Syntax

```sql
SELECT 
    [DISTINCT] TOP <n> <column1>, <column2>, ...
FROM ...
[ ORDER BY ... ]
```

| Parameter | Description                                                                                                                                                                    |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DISTINCT  | Ensures that only unique values are returned in the result, eliminating any duplicates.                                                                                        |
| TOP       | `TOP` and `LIMIT` are equivalent keywords for limiting the number of rows returned by a query, but they cannot be used together in the same query.                             |
| n         | Represents the maximum limit of rows to be returned in the result, and it must be a non-negative integer.                                                                      |
| ORDER BY  | If `TOP` is used without the `ORDER BY` clause, the query lacks a meaningful sequence for selecting the top rows, potentially resulting in inconsistent or unexpected results. |

## Examples

```sql
CREATE TABLE Students (
    ID INT,
    Name VARCHAR(50),
    Score INT
);

INSERT INTO Students (ID, Name, Score) VALUES
(1, 'John', 85),
(2, 'Emily', 92),
(3, 'Michael', 78),
(4, 'Sophia', 95),
(5, 'William', 88),
(6, 'Emma', 90),
(7, 'James', 82),
(8, 'Olivia', 96),
(9, 'Alexander', 75),
(10, 'Ava', 96);

-- Return the top 3 students based on their scores in descending order
-- Equivalent to: SELECT * FROM Students ORDER BY Score DESC LIMIT 3;
SELECT TOP 3 * FROM Students ORDER BY Score DESC;

┌──────────────────────────────────────────────────────┐
│        id       │       name       │      score      │
├─────────────────┼──────────────────┼─────────────────┤
│               8 │ Olivia           │              96 │
│              10 │ Ava              │              96 │
│               4 │ Sophia           │              95 │
└──────────────────────────────────────────────────────┘

--  Return the top 3 students' names and scores only
SELECT TOP 3 name, score FROM Students ORDER BY Score DESC;

┌────────────────────────────────────┐
│       name       │      score      │
├──────────────────┼─────────────────┤
│ Olivia           │              96 │
│ Ava              │              96 │
│ Sophia           │              95 │
└────────────────────────────────────┘

-- Error: TopN and Limit cannot be used together in the same query
SELECT TOP 3 name, score FROM Students ORDER BY Score DESC LIMIT 3;
error: APIError: ResponseError with 1065: Duplicate LIMIT: TopN and Limit cannot be used together

-- Return the top 3 distinct scores from the Students table, ordered in descending order
SELECT DISTINCT TOP 3 score FROM Students ORDER BY Score DESC;

┌─────────────────┐
│      score      │
├─────────────────┤
│              96 │
│              95 │
│              92 │
└─────────────────┘
```