---
title: SET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.609"/>

设置会话中一个或多个 SQL 变量的值。这些值可以是简单常量、表达式、查询结果或数据库对象。

## 语法

```sql
-- 设置一个变量
SET VARIABLE <variable_name> = <expression>

-- 设置多个变量
SET VARIABLE (<variable1>, <variable2>, ...) = (<expression1>, <expression2>, ...)
```

## 示例

以下示例设置单个变量：

```sql
-- 将变量 a 设置为字符串 'databend'
SET VARIABLE a = 'databend'; 
```

以下示例设置一个包含表名的变量，并使用 IDENTIFIER 基于该变量动态查询表：

```sql
CREATE TABLE monthly_sales(empid INT, amount INT, month TEXT) AS SELECT 1, 2, '3';

-- 将变量 't' 设置为表 'monthly_sales' 的名称
SET VARIABLE t = 'monthly_sales';

-- 使用 IDENTIFIER 动态引用存储在变量 't' 中的表名
SELECT * FROM IDENTIFIER($t);

empid|amount|month|
-----+------+-----+
    1|     2|3    |
```

以下示例在单个语句中从查询设置多个变量。查询必须只返回一行，且值的数量与要设置的变量数量相同。

```sql
-- 将变量 a 设置为 3，b 设置为 55
SET VARIABLE (a, b) = (SELECT 3, 55); 
```

以下示例将多个变量设置为常量：

```sql
-- 将变量 x 设置为 'xx'，y 设置为 'yy'
SET VARIABLE (x, y) = ('xx', 'yy');
```