---
title: SET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.609"/>

设置会话中一个或多个 SQL 变量的值。这些值可以是简单常量、表达式、查询结果或数据库对象。变量在会话期间持续存在，并可在后续查询中使用。

## Syntax

```sql
-- Set one variable
SET VARIABLE <variable_name> = <expression>

-- Set more than one variable
SET VARIABLE (<variable1>, <variable2>, ...) = (<expression1>, <expression2>, ...)

-- Set multiple variables from a query result
SET VARIABLE (<variable1>, <variable2>, ...) = <query>
```

## Accessing Variables

可以使用美元符号语法访问变量：`$variable_name`

## Examples

### Setting a Single Variable

```sql
-- Sets variable a to the string 'databend'
SET VARIABLE a = 'databend'; 

-- Access the variable
SELECT $a;
┌─────────┐
│ $a      │
├─────────┤
│ databend│
└─────────┘
```

### Setting Multiple Variables

```sql
-- Sets variable x to 'xx' and y to 'yy'
SET VARIABLE (x, y) = ('xx', 'yy');

-- Access multiple variables
SELECT $x, $y;
┌────┬────┐
│ $x │ $y │
├────┼────┤
│ xx │ yy │
└────┴────┘
```

### Setting Variables from Query Results

```sql
-- Sets variable a to 3 and b to 55
SET VARIABLE (a, b) = (SELECT 3, 55); 

-- Access the variables
SELECT $a, $b;
┌────┬────┐
│ $a │ $b │
├────┼────┤
│ 3  │ 55 │
└────┴────┘
```

### Dynamic Table References

变量可以与 `IDENTIFIER()` 函数一起使用，以动态引用数据库对象：

```sql
-- Create a sample table
CREATE OR REPLACE TABLE monthly_sales(empid INT, amount INT, month TEXT) AS SELECT 1, 2, '3';

-- Set a variable 't' to the name of the table 'monthly_sales'
SET VARIABLE t = 'monthly_sales';

-- Use IDENTIFIER to dynamically reference the table name stored in the variable 't'
SELECT * FROM IDENTIFIER($t);
┌───────┬────────┬───────┐
│ empid │ amount │ month │
├───────┼────────┼───────┤
│     1 │      2 │ 3     │
└───────┴────────┴───────┘
```