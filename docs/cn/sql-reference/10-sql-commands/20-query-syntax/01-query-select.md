---
title: SELECT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.690"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

从表中检索数据。

## 语法

```sql
[WITH]
SELECT
    [ALL | DISTINCT]
    [ TOP <n> ]
    <select_expr> | <col_name> [[AS] <alias>] | $<col_position> [, ...] | * 
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
- SELECT 语句还允许您直接查询 Stage 文件。有关语法和示例，请参见 [使用 Databend 实现高效数据转换](/guides/load-data/transform/querying-stage)。

- 在此页面上的示例中，表 `numbers(N)` 用于测试，它具有一个 UInt64 类型的列（名为 `number`），其中包含从 0 到 N-1 的整数。

## SELECT 子句

### AS 关键字

在 Databend 中，您可以使用 AS 关键字为列分配别名。 这样，您可以在 SQL 语句和查询结果中为列提供更具描述性和易于理解的名称：

- Databend 建议在创建列别名时，尽可能避免特殊字符。 但是，如果某些情况下必须使用特殊字符，则应将别名用反引号引起来，例如：SELECT price AS \`$CA\` FROM ...

- Databend 会自动将别名转换为小写。 例如，如果您将列别名设置为 *Total*，则它在结果中将显示为 *total*。 如果大小写对您很重要，请将别名用反引号引起来：\`Total\`。

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

如果在 SELECT 子句中为列指定别名，则可以在 WHERE、GROUP BY 和 HAVING 子句中引用该别名，也可以在定义别名后在 SELECT 子句本身中引用该别名。

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

如果为列分配别名，并且别名与列名相同，则 WHERE 和 GROUP BY 子句会将别名识别为列名。 但是，HAVING 子句会将别名识别为别名本身。

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

从结果中排除一个或多个列（通过列名）。 该关键字通常与 `SELECT * ...` 结合使用，以从结果中排除一些列，而不是检索所有列。

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

-- Exclude the column "id" from the result
SELECT * EXCLUDE id FROM allemployees;

---
| firstname | lastname | gender |
|-----------|----------|--------|
| Noah      | Shuster  | M      |
| Ryan      | Tory     | M      |
| Oliver    | Green    | M      |
| Lily      | McMeant   | F     |
| Macy      | Lee      | F      |

-- Exclude the columns "id" and "lastname" from the result
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

### COLUMNS 关键字

COLUMNS 关键字提供了一种灵活的机制，用于基于字面正则表达式模式和 Lambda 表达式进行列选择。

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


-- Select columns with names starting with 'employee'
SELECT COLUMNS('employee.*') FROM employee;

┌────────────────────────────────────┐
│   employee_id   │   employee_name  │
├─────────────────┼──────────────────┤
│               1 │ Alice            │
│               2 │ Bob              │
│               3 │ Charlie          │
│               4 │ David            │
└────────────────────────────────────┘

-- Select columns where the name contains the substring 'name'
SELECT COLUMNS(x -> x LIKE '%name%') FROM employee;

┌──────────────────┐
│   employee_name  │
├──────────────────┤
│ Alice            │
│ Bob              │
│ Charlie          │
│ David            │
└──────────────────┘
```

COLUMNS 关键字还可以与 EXCLUDE 一起使用，以从查询结果中显式排除特定列。

```sql
-- Select all columns excluding 'salary' from the 'employee' table
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

通过使用 $N，您可以在 SELECT 子句中表示一个列。 例如，$2 表示第二列：

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

### 检索所有列

`SELECT *` 语句用于检索表或查询结果中的所有列。 这是一种获取完整数据集的便捷方法，无需指定单个列名。

此示例返回 my_table 中的所有列：

```sql
SELECT * FROM my_table;
```

Databend 扩展了 SQL 语法，允许查询以 `FROM <table>` 开头，而无需显式使用 `SELECT *`：

```sql
FROM my_table;
```

这等效于：

```sql
SELECT * FROM my_table;
```

## FROM 子句

SELECT 语句中的 FROM 子句指定要从中查询数据的源表。 您还可以通过将 FROM 子句放在 SELECT 子句之前来提高代码的可读性，尤其是在管理较长的 SELECT 列表或旨在快速识别所选列的来源时。

```sql
-- 以下两个语句是等效的：

-- 语句 1：使用带有 FROM 子句的 SELECT 子句
SELECT number FROM numbers(3);

-- 语句 2：等效表示，FROM 子句位于 SELECT 子句之前
FROM numbers(3) SELECT number;

+--------+
| number |
+--------+
|      0 |
|      1 |
|      2 |
+--------+
```

FROM 子句还可以指定一个位置，从而可以直接从各种源查询数据，而无需先将其加载到表中。 有关更多信息，请参见 [查询 Stage 文件](/guides/load-data/transform/querying-stage)。

## AT 子句

AT 子句使您可以查询数据的先前版本。 有关更多信息，请参见 [AT](./03-query-at.md)。

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
--Group the rows of the result set by column alias
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

--Group the rows of the result set by column position in the SELECT list
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
--Sort by column name in ascending order.
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

--Sort by column name in descending order.
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

--Sort by column alias.
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

--Sort by column position in the SELECT list
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

--Sort with the NULLS FIRST or LAST option.

CREATE TABLE t_null (
  number INTEGER
);


```sql
INSERT INTO t_null VALUES (1);
INSERT INTO t_null VALUES (2);
INSERT INTO t_null VALUES (3);
INSERT INTO t_null VALUES (NULL);
INSERT INTO t_null VALUES (NULL);

--Databend 认为 NULL 值大于任何非 NULL 值。
--在以下示例中，NULL 值在按升序对结果进行排序时最后显示：

SELECT number FROM t_null order by number ASC;
+--------+
| number |
+--------+
|      1 |
|      2 |
|      3 |
|   NULL |
|   NULL |
+--------+

-- 要使 NULL 值在上一个示例中首先显示，请使用 NULLS FIRST 选项：

SELECT number FROM t_null order by number ASC nulls first;
+--------+
| number |
+--------+
|   NULL |
|   NULL |
|      1 |
|      2 |
|      3 |
+--------+

-- 使用 NULLS LAST 选项使 NULL 值以降序最后显示：

SELECT number FROM t_null order by number DESC nulls last;
+--------+
| number |
+--------+
|      3 |
|      2 |
|      1 |
|   NULL |
|   NULL |
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

为了优化大型结果集的查询性能，Databend 默认启用了 lazy_read_threshold 选项，默认值为 1,000。此选项专门为涉及 LIMIT 子句的查询而设计。启用 lazy_read_threshold 后，对于指定的 LIMIT 数量小于或等于您设置的阈值的查询，将激活优化。要禁用该选项，请将其设置为 0。

<DetailsWrap>

<details>
  <summary>工作原理</summary>
    <div>该优化提高了具有 ORDER BY 子句和 LIMIT 子句的查询的性能。启用后，如果查询中的 LIMIT 数量小于指定的阈值，则仅检索和排序 ORDER BY 子句中涉及的列，而不是整个结果集。</div><br/><div>在系统检索并排序 ORDER BY 子句中涉及的列后，它将应用 LIMIT 约束以从排序后的结果集中选择所需数量的行。然后，系统返回有限的行集作为查询结果。这种方法通过仅获取和排序必要的列来减少资源使用，并且通过将处理的行限制为所需的子集来进一步优化查询执行。</div>
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
-- Empty set
```

## 嵌套子查询

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