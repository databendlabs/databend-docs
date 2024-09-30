---
title: SET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.609"/>

Sets the value of one or more SQL variables within a session. The values can be simple constants, expressions, query results, or database objects.

## Syntax

```sql
-- Set one variable
SET VARIABLE <variable_name> = <expression>

-- Set more than one variable
SET VARIABLE (<variable1>, <variable2>, ...) = (<expression1>, <expression2>, ...)
```

## Examples

The following example sets a single variable:

```sql
-- sets variable a to the string 'databend'
SET VARIABLE a = 'databend'; 
```

The following example sets a variable with the table name and uses IDENTIFIER to dynamically query the table based on that variable:

```sql
CREATE TABLE monthly_sales(empid INT, amount INT, month TEXT) AS SELECT 1, 2, '3';

-- Set a variable 't' to the name of the table 'monthly_sales'
SET VARIABLE t = 'monthly_sales';

-- Use IDENTIFIER to dynamically reference the table name stored in the variable 't'
SELECT * FROM IDENTIFIER($t);

empid|amount|month|
-----+------+-----+
    1|     2|3    |
```

The following example sets multiple variables from a query in a single statement. The query must return exactly one row, with the same number of values as the variables being set.

```sql
-- Sets variable a to 3 and b to 55
SET VARIABLE (a, b) = (SELECT 3, 55); 
```

The following example sets multiple variables to constants:

```sql
-- Sets variable x to 'xx' and y to 'yy'
SET VARIABLE (x, y) = ('xx', 'yy');
```