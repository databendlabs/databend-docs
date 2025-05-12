---
title: 集合运算符
description:
  集合运算符将两个查询的结果合并为一个结果。
---

集合运算符将两个查询的结果合并为一个结果。Databend 支持以下集合运算符：

- [INTERSECT](#intersect)
- [EXCEPT](#except)
- [UNION [ALL]](#union-all)

## INTERSECT

返回两个查询选择的所有不同的行。

### 语法

```sql
SELECT column1 , column2 ....
FROM table_names
WHERE condition

INTERSECT

SELECT column1 , column2 ....
FROM table_names
WHERE condition
```

### 示例

```sql
create table t1(a int, b int);
create table t2(c int, d int);

insert into t1 values(1, 2), (2, 3), (3 ,4), (2, 3);
insert into t2 values(2,2), (3, 5), (7 ,8), (2, 3), (3, 4);

select * from t1 intersect select * from t2;
```

输出:

```sql
2|3
3|4
```

## EXCEPT

返回第一个查询选择的所有不同的行，但不包括第二个查询选择的行。

### 语法

```sql
SELECT column1 , column2 ....
FROM table_names
WHERE condition

EXCEPT

SELECT column1 , column2 ....
FROM table_names
WHERE condition
```

### 示例

```sql
create table t1(a int, b int);
create table t2(c int, d int);

insert into t1 values(1, 2), (2, 3), (3 ,4), (2, 3);
insert into t2 values(2,2), (3, 5), (7 ,8), (2, 3), (3, 4);

select * from t1 except select * from t2;
```

输出:

```sql
1|2
```

## UNION [ALL]

合并两个或多个结果集中的行。每个结果集必须返回相同数量的列，并且对应的列必须具有相同或兼容的数据类型。

默认情况下，该命令在合并结果集时删除重复的行。要包括重复的行，请使用 **UNION ALL**。

### 语法

```sql
SELECT column1 , column2 ...
FROM table_names
WHERE condition

UNION [ALL]

SELECT column1 , column2 ...
FROM table_names
WHERE condition

[UNION [ALL]

SELECT column1 , column2 ...
FROM table_names
WHERE condition]...

[ORDER BY ...]
```

### 示例

```sql
CREATE TABLE support_team 
  ( 
     NAME   STRING, 
     salary UINT32 
  ); 

CREATE TABLE hr_team 
  ( 
     NAME   STRING, 
     salary UINT32 
  ); 

INSERT INTO support_team 
VALUES      ('Alice', 
             1000), 
            ('Bob', 
             3000), 
            ('Carol', 
             5000); 

INSERT INTO hr_team 
VALUES      ('Davis', 
             1000), 
            ('Eva', 
             4000); 

-- The following code returns the employees in both teams who are paid less than 2,000 dollars:

SELECT NAME AS SelectedEmployee, 
       salary 
FROM   support_team 
WHERE  salary < 2000 
UNION 
SELECT NAME AS SelectedEmployee, 
       salary 
FROM   hr_team 
WHERE  salary < 2000 
ORDER  BY selectedemployee DESC; 
```

输出:

```sql
Davis|1000
Alice|1000
```