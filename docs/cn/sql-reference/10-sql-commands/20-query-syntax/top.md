---
title: TOP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.435"/>

限制查询返回的最大行数。

另请参阅: [Limit 子句](01-query-select.md#limit-clause)

## 语法

```sql
SELECT 
    [ TOP <n> ] <column1>, <column2>, ...
FROM ...
[ ORDER BY ... ]
```

| 参数      | 描述                                                                                                                                                                    |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| n         | 表示结果中要返回的最大行数限制，必须是非负整数。                                                                      |

- `TOP` 和 `LIMIT` 是限制查询返回行数的等效关键字，但不能在同一查询中同时使用。
- 如果使用 `TOP` 而没有 `ORDER BY` 子句，查询缺乏选择顶部行的有意义顺序，可能会导致不一致或意外的结果。

## 示例

此示例返回按分数降序排列的前 3 名学生：

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

SELECT TOP 3 * FROM Students ORDER BY Score DESC;

┌──────────────────────────────────────────────────────┐
│        id       │       name       │      score      │
├─────────────────┼──────────────────┼─────────────────┤
│               8 │ Olivia           │              96 │
│              10 │ Ava              │              96 │
│               4 │ Sophia           │              95 │
└──────────────────────────────────────────────────────┘
```

上述查询等效于：

```sql
SELECT * FROM Students ORDER BY Score DESC LIMIT 3;

┌──────────────────────────────────────────────────────┐
│        id       │       name       │      score      │
├─────────────────┼──────────────────┼─────────────────┤
│               8 │ Olivia           │              96 │
│              10 │ Ava              │              96 │
│               4 │ Sophia           │              95 │
└──────────────────────────────────────────────────────┘
```

此示例仅返回前 3 名学生的姓名和分数：

```sql
SELECT TOP 3 name, score FROM Students ORDER BY Score DESC;

┌────────────────────────────────────┐
│       name       │      score      │
├──────────────────┼─────────────────┤
│ Olivia           │              96 │
│ Ava              │              96 │
│ Sophia           │              95 │
└────────────────────────────────────┘
```

在同一查询中同时使用 `TOP` 和 `LIMIT` 会导致错误：

```sql
SELECT TOP 3 name, score FROM Students ORDER BY Score DESC LIMIT 3;
error: APIError: ResponseError with 1065: Duplicate LIMIT: TopN and Limit cannot be used together
```