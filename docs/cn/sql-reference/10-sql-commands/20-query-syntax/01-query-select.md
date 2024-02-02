---
title: SELECT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.234"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

从表中检索数据。

## 语法

```sql
[WITH]
SELECT
    [ALL | DISTINCT]
    <select_expr> | <col_name> [[AS] <alias>] | $<col_position> [, ...] |
    COLUMNS <expr>
    [EXCLUDE (<col_name1> [, <col_name2>, <col_name3>, ...] ) ]
    [FROM table_references]
    [AT ...]
    [WHERE <expr>]
    [GROUP BY {{<col_name> | <expr> | <col_alias> | <col_position>},
         ... | <extended_grouping_expr>}]
    [HAVING <expr>]
    [ORDER BY {<col_name> | <expr> | <col_alias> | <col_position>} [ASC | DESC],
         [ NULLS { FIRST | LAST }]
    [LIMIT <row_count>]
    [OFFSET <row_count>]
    [IGNORE_RESULT]
```

- SELECT 语句还允许您直接查询阶段文件。有关语法和示例，请参见 [使用 Databend 进行高效数据转换](/guides/load-data/transform/querying-stage)。

- 在本页的示例中，使用了表 `numbers(N)` 进行测试，它有一个单独的 UInt64 列（名为 `number`），包含从 0 到 N-1 的整数。

## SELECT 子句

```sql
SELECT number FROM numbers(3);
+--------+
| number |
+--------+
|      0 |
|      1 |
|      2 |
+--------+
```

### AS 关键字

在 Databend 中，您可以使用 AS 关键字为列分配别名。这允许您为 SQL 语句和查询结果中的列提供更具描述性和易于理解的名称：

- Databend 建议在创建列别名时尽可能避免使用特殊字符。然而，如果在某些情况下需要特殊字符，应将别名用反引号括起来，如：SELECT price AS \`$CA\` FROM ...

- Databend 会自动将别名转换为小写。例如，如果您将列的别名设置为 _Total_，在结果中它将显示为 _total_。如果大小写对您很重要，请将别名用反引号括起来：\`Total\`。

```sql
SELECT number AS Total FROM numbers(3);
+--------+
| total  |
+--------+
|      0 |
|      1 |
|      2 |
+--------+

SELECT number AS `Total` FROM numbers(3);
+--------+
| Total  |
+--------+
|      0 |
|      1 |
|      2 |
+--------+
```

如果您在 SELECT 子句中为列分配了别名，则可以在 WHERE、GROUP BY 和 HAVING 子句中引用该别名，以及在定义别名后的 SELECT 子句本身中引用它。

```sql
SELECT number * 2 AS a, a * 2 AS double FROM numbers(3) WHERE (a + 1) % 3 = 0;
+---+--------+
| a | double |
+---+--------+
| 2 |      4 |
+---+--------+

SELECT MAX(number) AS b, number % 3 AS c FROM numbers(100) GROUP BY c HAVING b > 8;
+----+---+
| b  | c |
+----+---+
| 99 | 0 |
| 97 | 1 |
| 98 | 2 |
+----+---+
```

如果您为列分配了一个别名，并且别名与列名相同，则 WHERE 和 GROUP BY 子句将将别名识别为列名。然而，HAVING 子句将别名识别为别名本身。

```sql
SELECT number * 2 AS number FROM numbers(3)
WHERE (number + 1) % 3 = 0
GROUP BY number
HAVING number > 5;

+--------+
| number |
+--------+
|     10 |
|     16 |
+--------+
```

### EXCLUDE 关键字

通过它们的名称从结果中排除一个或多个列。该关键字通常与 `SELECT * ...` 一起使用，以从结果中排除少数列，而不是检索它们所有。

```sql
SELECT * FROM allemployees ORDER BY id;

---
| id | firstname | lastname | gender |
|----|-----------|----------|--------|
| 1  | Ryan      | Tory     | M      |
| 2  | Oliver    | Green    | M      |
| 3  | Noah      | Shuster  | M      |
| 4  | Lily      | McMeant   | F     |
| 5  | Macy      | Lee      | F      |

-- 从结果中排除列 "id"
SELECT * EXCLUDE id FROM allemployees;

---
| firstname | lastname | gender |
|-----------|----------|--------|
| Noah      | Shuster  | M      |
| Ryan      | Tory     | M      |
| Oliver    | Green    | M      |
| Lily      | McMeant   | F     |
| Macy      | Lee      | F      |

-- 从结果中排除列 "id" 和 "lastname"
SELECT * EXCLUDE (id,lastname) FROM allemployees;

---
| firstname | gender |
|-----------|--------|
| Oliver    | M      |
| Ryan      | M      |
| Lily      | F      |
| Noah      | M      |
| Macy      | F      |
```

### COLUMNS

COLUMNS 关键字提供了一种基于字面正则表达式模式和 lambda 表达式的灵活列选择机制。

```sql
CREATE TABLE employee (
    employee_id INT,
    employee_name VARCHAR(255),
    department VARCHAR(50),
    salary DECIMAL(10, 2)
);

INSERT INTO employee VALUES
(1, 'Alice', 'HR', 60000.00),
(2, 'Bob', 'IT', 75000.00),
(3, 'Charlie', 'Marketing', 50000.00),
(4, 'David', 'Finance', 80000.00);


-- 选择名称以 'employee' 开头的列
SELECT COLUMNS('employee.*') FROM employee;

┌────────────────────────────────────┐
│   employee_id   │   employee_name  │
├─────────────────┼──────────────────┤
│               1 │ Alice            │
│               2 │ Bob              │
│               3 │ Charlie          │
│               4 │ David            │
└────────────────────────────────────┘

-- 选择名称中包含子字符串 'name' 的列
SELECT COLUMNS(x -> x LIKE '%name%') FROM employee;

```

```
┌──────────────────┐
│   employee_name  │
├──────────────────┤
│ Alice            │
│ Bob              │
│ Charlie          │
│ David            │
└──────────────────┘
```

`COLUMNS` 关键字也可以与 `EXCLUDE` 一起使用，以明确排除查询结果中的特定列。

```sql
-- 从 'employee' 表中选择除 'salary' 外的所有列
SELECT COLUMNS(* EXCLUDE salary) FROM employee;

┌───────────────────────────────────────────────────────┐
│   employee_id   │   employee_name  │    department    │
├─────────────────┼──────────────────┼──────────────────┤
│               1 │ Alice            │ HR               │
│               2 │ Bob              │ IT               │
│               3 │ Charlie          │ Marketing        │
│               4 │ David            │ Finance          │
└───────────────────────────────────────────────────────┘
```

### 列位置

通过使用 $N，您可以在 SELECT 子句中表示一个列。例如，$2 代表第二列：

```sql
CREATE TABLE IF NOT EXISTS t1(a int, b varchar);
INSERT INTO t1 VALUES (1, 'a'), (2, 'b');
SELECT a, $2 FROM t1;

+---+-------+
| a | $2    |
+---+-------+
| 1 | a     |
| 2 | b     |
+---+-------+
```

## FROM 子句

SELECT 语句中的 FROM 子句指定将从中查询数据的源表或表。您还可以通过将 FROM 子句放在 SELECT 子句之前来提高代码的可读性，特别是在管理冗长的 SELECT 列表或希望快速识别所选列的来源时。

```sql
-- 以下两个语句是等价的：

-- 语句 1：使用 SELECT 子句与 FROM 子句
SELECT number FROM numbers(3);

-- 语句 2：等价表示，FROM 子句在 SELECT 子句之前
FROM numbers(3) SELECT number;

+--------+
| number |
+--------+
|      0 |
|      1 |
|      2 |
+--------+
```

FROM 子句还可以指定位置，使得可以直接从各种来源查询数据，无需首先将其加载到表中。更多信息，请参见[查询阶段文件](/guides/load-data/transform/querying-stage)。

## AT 子句

AT 子句使您能够查询数据的以前版本。更多信息，请参见 [AT](./03-query-at.md)。

## WHERE 子句

```sql
SELECT number FROM numbers(3) WHERE number > 1;
+--------+
| number |
+--------+
|      2 |
+--------+
```

## GROUP BY 子句

```sql
--按列别名对结果集的行进行分组
SELECT number%2 as c1, number%3 as c2, MAX(number) FROM numbers(10000) GROUP BY c1, c2;
+------+------+-------------+
| c1   | c2   | MAX(number) |
+------+------+-------------+
|    1 |    2 |        9995 |
|    1 |    1 |        9997 |
|    0 |    2 |        9998 |
|    0 |    1 |        9994 |
|    0 |    0 |        9996 |
|    1 |    0 |        9999 |
+------+------+-------------+

--按 SELECT 列表中的列位置对结果集的行进行分组
SELECT number%2 as c1, number%3 as c2, MAX(number) FROM numbers(10000) GROUP BY 1, 2;
+------+------+-------------+
| c1   | c2   | MAX(number) |
+------+------+-------------+
|    1 |    2 |        9995 |
|    1 |    1 |        9997 |
|    0 |    2 |        9998 |
|    0 |    1 |        9994 |
|    0 |    0 |        9996 |
|    1 |    0 |        9999 |
+------+------+-------------+

```

## HAVING 子句

```sql
SELECT
    number % 2 as c1,
    number % 3 as c2,
    MAX(number) as max
FROM
    numbers(10000)
GROUP BY
    c1, c2
HAVING
    max > 9996;

+------+------+------+
| c1   | c2   | max  |
+------+------+------+
|    1 |    0 | 9999 |
|    1 |    1 | 9997 |
|    0 |    2 | 9998 |
+------+------+------+
```

## ORDER BY 子句

```sql
--按列名升序排序。
SELECT number FROM numbers(5) ORDER BY number ASC;
+--------+
| number |
+--------+
|      0 |
|      1 |
|      2 |
|      3 |
|      4 |
+--------+

--按列名降序排序。
SELECT number FROM numbers(5) ORDER BY number DESC;
+--------+
| number |
+--------+
|      4 |
|      3 |
|      2 |
|      1 |
|      0 |
+--------+

--按列别名排序。
SELECT number%2 AS c1, number%3 AS c2  FROM numbers(5) ORDER BY c1 ASC, c2 DESC;
+------+------+
| c1   | c2   |
+------+------+
|    0 |    2 |
|    0 |    1 |
|    0 |    0 |
|    1 |    1 |
|    1 |    0 |
+------+------+

--按 SELECT 列表中的列位置排序
SELECT * FROM t1 ORDER BY 2 DESC;
+------+------+
| a    | b    |
+------+------+
|    2 |    3 |
|    1 |    2 |
+------+------+

SELECT a FROM t1 ORDER BY 1 DESC;
+------+
| a    |
+------+
|    2 |
|    1 |
+------+

--使用 NULLS FIRST 或 LAST 选项排序。

CREATE TABLE t_null (
  number INTEGER
);

INSERT INTO t_null VALUES (1);
INSERT INTO t_null VALUES (2);
INSERT INTO t_null VALUES (3);
INSERT INTO t_null VALUES (NULL);
INSERT INTO t_null VALUES (NULL);

```

```markdown
--Databend 认为 NULL 值大于任何非 NULL 值。
--在以下示例中，按升序排序结果时，NULL 值出现在最后：

SELECT number FROM t_null order by number ASC;
+--------+
| number |
+--------+
| 1 |
| 2 |
| 3 |
| NULL |
| NULL |
+--------+

-- 要使 NULL 值在前面的示例中首先出现，请使用 NULLS FIRST 选项：

SELECT number FROM t_null order by number ASC nulls first;
+--------+
| number |
+--------+
| NULL |
| NULL |
| 1 |
| 2 |
| 3 |
+--------+

-- 使用 NULLS LAST 选项使 NULL 值在降序中最后出现：

SELECT number FROM t_null order by number DESC nulls last;
+--------+
| number |
+--------+
| 3 |
| 2 |
| 1 |
| NULL |
| NULL |
+--------+
```

## LIMIT 子句

```sql
SELECT number FROM numbers(1000000000) LIMIT 1;
+--------+
| number |
+--------+
|      0 |
+--------+

SELECT number FROM numbers(100000) ORDER BY number LIMIT 2 OFFSET 10;
+--------+
| number |
+--------+
|     10 |
|     11 |
+--------+
```

为了优化大结果集的查询性能，Databend 默认启用了 lazy_read_threshold 选项，其默认值为 1,000。此选项专为涉及 LIMIT 子句的查询设计。当启用 lazy_read_threshold 时，如果指定的 LIMIT 数量小于或等于您设置的阈值，则会激活优化。要禁用该选项，请将其设置为 0。

<DetailsWrap>

<details>
  <summary>它是如何工作的</summary>
    <div>对于包含 ORDER BY 子句和 LIMIT 子句的查询，优化可以提高性能。启用后，如果查询中的 LIMIT 数量小于指定的阈值，系统只会检索和排序涉及 ORDER BY 子句的列，而不是整个结果集。</div><br/><div>系统检索并排序涉及 ORDER BY 子句的列后，它会应用 LIMIT 约束从排序后的结果集中选择所需数量的行。然后系统返回作为查询结果的有限行集。这种方法通过仅获取和排序必要的列来减少资源使用，并通过将处理的行限制为所需的子集来进一步优化查询执行。</div>
</details>

</DetailsWrap>

```sql
SELECT * FROM hits WHERE URL LIKE '%google%' ORDER BY EventTime LIMIT 10 ignore_result;
Empty set (0.300 sec)

set lazy_read_threshold=0;
Query OK, 0 rows affected (0.004 sec)

SELECT * FROM hits WHERE URL LIKE '%google%' ORDER BY EventTime LIMIT 10 ignore_result;
Empty set (0.897 sec)
```

## OFFSET 子句

```sql
SELECT number FROM numbers(5) ORDER BY number OFFSET 2;
+--------+
| number |
+--------+
|      2 |
|      3 |
|      4 |
+--------+
```

## IGNORE_RESULT

不输出结果集。

```sql
SELECT number FROM numbers(2);
+--------+
| number |
+--------+
|      0 |
|      1 |
+--------+

SELECT number FROM numbers(2) IGNORE_RESULT;
-- 空集
```

## 嵌套子选择

SELECT 语句可以嵌套在查询中。

```
SELECT ... [SELECT ...[SELECT [...]]]
```

```sql
SELECT MIN(number) FROM (SELECT number%3 AS number FROM numbers(10)) GROUP BY number%2;
+-------------+
| min(number) |
+-------------+
|           1 |
|           0 |
+-------------+
```
