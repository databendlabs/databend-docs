---
title: SET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.609"/>

在会话中设置一个或多个SQL变量的值。这些值可以是简单的常量、表达式、查询结果或数据库对象。

## 语法

```sql
-- 设置一个变量
SET VARIABLE <variable_name> = <expression>

-- 设置多个变量
SET VARIABLE (<variable1>, <variable2>, ...) = (<expression1>, <expression2>, ...)
```

## 示例

以下示例设置一个变量：

```sql
-- 将变量a设置为字符串'databend'
SET VARIABLE a = 'databend'; 
```

以下示例设置一个变量，并使用IDENTIFIER根据该变量动态查询表：

```sql
CREATE TABLE monthly_sales(empid INT, amount INT, month TEXT) AS SELECT 1, 2, '3';

-- 将变量't'设置为表名'monthly_sales'
SET VARIABLE t = 'monthly_sales';

-- 使用IDENTIFIER动态引用存储在变量't'中的表名
SELECT * FROM IDENTIFIER($t);

empid|amount|month|
-----+------+-----+
    1|     2|3    |
```

以下示例在一个语句中从查询设置多个变量。查询必须返回一行，并且值的数量与要设置的变量数量相同。

```sql
-- 将变量a设置为3，b设置为55
SET VARIABLE (a, b) = (SELECT 3, 55); 
```

以下示例将多个变量设置为常量：

```sql
-- 将变量x设置为'xx'，y设置为'yy'
SET VARIABLE (x, y) = ('xx', 'yy');
```