---
title: 子查询操作符
---

子查询是嵌套在另一个查询中的查询。Databend支持以下子查询类型：

- [标量子查询](#标量子查询)
- [EXISTS / NOT EXISTS](#exists--not-exists)
- [IN / NOT IN](#in--not-in)
- [ANY (SOME)](#any-some)
- [ALL](#all)

## 标量子查询

标量子查询只选择一个列或表达式，并且最多返回一行。SQL查询可以在期望列或表达式的任何位置有标量子查询。

- 如果标量子查询返回0行，Databend将使用NULL作为子查询输出。
- 如果标量子查询返回多于一行，Databend将抛出一个错误。

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

EXISTS子查询是可以出现在WHERE子句中的布尔表达式：
* 如果子查询产生任何行，EXISTS表达式计算为TRUE。
* 如果子查询没有产生任何行，NOT EXISTS表达式计算为TRUE。

### 语法

```sql
[ NOT ] EXISTS ( <query> )
```

:::note
* 目前仅在WHERE子句中支持相关的EXISTS子查询。
:::

### 示例

```sql
SELECT number FROM numbers(10) WHERE number>5 AND exists(SELECT number FROM numbers(5) WHERE number>4);
```
`SELECT number FROM numbers(5) WHERE number>4` 没有产生任何行，`exists(SELECT number FROM numbers(5) WHERE number>4)` 为FALSE。

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

`EXISTS(SELECT NUMBER FROM NUMBERS(5) WHERE NUMBER>3)` 为TRUE。

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

`not exists(SELECT number FROM numbers(5) WHERE number>4)` 为TRUE。

## IN / NOT IN

通过使用IN或NOT IN，您可以检查表达式是否匹配子查询返回的列表中的任何值。

- 使用IN或NOT IN时，子查询必须返回单列值。

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

-- IN示例
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

-- NOT IN示例
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

您可以使用ANY（或SOME）来检查比较是否对子查询返回的任何值都为真。

- 关键字ANY（或SOME）必须跟随[比较操作符](comparison.md)之一。
- 如果子查询没有返回任何值，比较计算为假。
- SOME的工作方式与ANY相同。

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

您可以使用ALL来检查比较是否对子查询返回的所有值都为真。

- 关键字ALL必须跟随[比较操作符](comparison.md)之一。
- 如果子查询没有返回任何值，比较计算为真。

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