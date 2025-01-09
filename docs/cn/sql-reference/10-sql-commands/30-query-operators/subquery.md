---
title: 子查询操作符
---

子查询是嵌套在另一个查询中的查询。Databend 支持以下子查询类型：

- [标量子查询](#标量子查询)
- [EXISTS / NOT EXISTS](#exists--not-exists)
- [IN / NOT IN](#in--not-in)
- [ANY (SOME)](#any-some)
- [ALL](#all)

## 标量子查询

标量子查询仅选择一列或一个表达式，并且最多只返回一行。SQL 查询可以在任何需要列或表达式的地方使用标量子查询。

- 如果标量子查询返回 0 行，Databend 将使用 NULL 作为子查询的输出。
- 如果标量子查询返回多行，Databend 将抛出错误。

### 示例

```sql
CREATE TABLE t1 (a int);
CREATE TABLE t2 (a int);

INSERT INTO t1 VALUES (1);
INSERT INTO t1 VALUES (2);
INSERT INTO t1 VALUES (3);

INSERT INTO t2 VALUES (3);
INSERT INTO t2 VALUES (4);
INSERT INTO t2 VALUES (5);

SELECT * 
FROM   t1 
WHERE  t1.a < (SELECT Min(t2.a) 
               FROM   t2); 

--
+--------+
|      a |
+--------+
|      1 |
|      2 |
+--------+
```

## EXISTS / NOT EXISTS

EXISTS 子查询是一个布尔表达式，可以出现在 WHERE 子句中：
* 如果子查询产生任何行，EXISTS 表达式将评估为 TRUE。
* 如果子查询没有产生任何行，NOT EXISTS 表达式将评估为 TRUE。

### 语法

```sql
[ NOT ] EXISTS ( <query> )
```

:::note
* 目前仅在 WHERE 子句中支持相关的 EXISTS 子查询。
:::

### 示例

```sql
SELECT number FROM numbers(10) WHERE number>5 AND exists(SELECT number FROM numbers(5) WHERE number>4);
```
`SELECT number FROM numbers(5) WHERE number>4` 没有产生任何行，`exists(SELECT number FROM numbers(5) WHERE number>4)` 为 FALSE。

```sql
SELECT number FROM numbers(10) WHERE number>5 and exists(SELECT number FROM numbers(5) WHERE number>3);
+--------+
| number |
+--------+
|      6 |
|      7 |
|      8 |
|      9 |
+--------+
```

`EXISTS(SELECT NUMBER FROM NUMBERS(5) WHERE NUMBER>3)` 为 TRUE。

```sql
SELECT number FROM numbers(10) WHERE number>5 AND not exists(SELECT number FROM numbers(5) WHERE number>4);
+--------+
| number |
+--------+
|      6 |
|      7 |
|      8 |
|      9 |
+--------+
```

`not exists(SELECT number FROM numbers(5) WHERE number>4)` 为 TRUE。

## IN / NOT IN

通过使用 IN 或 NOT IN，您可以检查表达式是否匹配子查询返回的列表中的任何值。

- 当您使用 IN 或 NOT IN 时，子查询必须返回单列值。

### 语法

```sql
[ NOT ] IN ( <query> )
```

### 示例

```sql
CREATE TABLE t1 (a int);
CREATE TABLE t2 (a int);

INSERT INTO t1 VALUES (1);
INSERT INTO t1 VALUES (2);
INSERT INTO t1 VALUES (3);

INSERT INTO t2 VALUES (3);
INSERT INTO t2 VALUES (4);
INSERT INTO t2 VALUES (5);

-- IN 示例
SELECT * 
FROM   t1 
WHERE  t1.a IN (SELECT *
               FROM   t2);

--
+--------+
|      a |
+--------+
|      3 |
+--------+

-- NOT IN 示例
SELECT * 
FROM   t1 
WHERE  t1.a NOT IN (SELECT *
               FROM   t2);

--
+--------+
|      a |
+--------+
|      1 |
|      2 |
+--------+
```

## ANY (SOME)

您可以使用 ANY（或 SOME）来检查比较是否对子查询返回的任何值为真。

- 关键字 ANY（或 SOME）必须跟在[比较操作符](comparison.md)之后。
- 如果子查询没有返回任何值，比较将评估为 false。
- SOME 的工作方式与 ANY 相同。

### 语法

```sql
-- ANY
comparison_operator ANY ( <query> )

-- SOME
comparison_operator SOME ( <query> )
```

### 示例

```sql
CREATE TABLE t1 (a int);
CREATE TABLE t2 (a int);

INSERT INTO t1 VALUES (1);
INSERT INTO t1 VALUES (2);
INSERT INTO t1 VALUES (3);

INSERT INTO t2 VALUES (3);
INSERT INTO t2 VALUES (4);
INSERT INTO t2 VALUES (5);

SELECT * 
FROM   t1 
WHERE  t1.a < ANY (SELECT * 
                   FROM   t2);

--
+--------+
|      a |
+--------+
|      1 |
|      2 |
|      3 |
+--------+
```

## ALL

您可以使用 ALL 来检查比较是否对子查询返回的所有值为真。

- 关键字 ALL 必须跟在[比较操作符](comparison.md)之后。
- 如果子查询没有返回任何值，比较将评估为 true。

### 语法

```sql
comparison_operator ALL ( <query> )
```

### 示例

```sql
CREATE TABLE t1 (a int);
CREATE TABLE t2 (a int);

INSERT INTO t1 VALUES (1);
INSERT INTO t1 VALUES (2);
INSERT INTO t1 VALUES (3);

INSERT INTO t2 VALUES (3);
INSERT INTO t2 VALUES (4);
INSERT INTO t2 VALUES (5);

SELECT * 
FROM   t1 
WHERE  t1.a < ALL (SELECT * 
                   FROM   t2);

--
+--------+
|      a |
+--------+
|      1 |
|      2 |
+--------+
```