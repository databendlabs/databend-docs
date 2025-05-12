---
title: SQL 变量
sidebar_label: SQL 变量
---

SQL 变量允许您在会话中存储和管理临时数据。

## 变量 DDL 命令

Databend 提供了以下 DDL 命令来使用 SQL 变量：

- [SET VARIABLE](../10-sql-commands/00-ddl/15-variable/set-variable.md)
- [SHOW VARIABLES](../10-sql-commands/00-ddl/15-variable/show-variables.md)
- [UNSET VARIABLE](../10-sql-commands/00-ddl/15-variable/unset-variable.md)

SHOW VARIABLES 命令有一个对应的表函数 [SHOW_VARIABLES](../20-sql-functions/17-table-functions/show-variables.md)，它以表格格式提供相同的信息，允许在 SQL 语句中进行更复杂的过滤和查询。

## 使用变量进行查询

本节介绍如何在查询中有效地使用变量，利用 `$` 进行值替换，以及利用 `IDENTIFIER` 访问数据库对象（如表）。

### 使用 `$` 和 `getvariable()` 访问变量

您可以使用 `$` 符号或 `getvariable()` 函数在 SQL 语句中引用变量的值。这两种方法都允许动态替换，其中变量的值在运行时直接嵌入到查询中。

```sql title='Example:'
-- 设置一个变量，用作筛选值
SET VARIABLE threshold = 100;

-- 在查询中使用带有 $ 的变量
SELECT * FROM sales WHERE amount > $threshold;

-- 或者，使用 getvariable() 函数
SELECT * FROM sales WHERE amount > getvariable('threshold');
```

### 使用 `IDENTIFIER` 访问对象

`IDENTIFIER` 关键字允许您动态引用数据库对象，这些对象的名称存储在变量中。请注意，BendSQL 尚不支持使用 `IDENTIFIER` 访问对象。

```sql title='Example:'
-- 创建一个包含销售数据的表
CREATE TABLE sales_data (region TEXT, sales_amount INT, month TEXT) AS 
SELECT 'North', 5000, 'January' UNION ALL
SELECT 'South', 3000, 'January';

select * from sales_data;

-- 设置表名和列名的变量
SET VARIABLE table_name = 'sales_data';
SET VARIABLE column_name = 'sales_amount';

-- 使用 IDENTIFIER 在查询中动态引用表和列
SELECT region, IDENTIFIER($column_name) 
FROM IDENTIFIER($table_name) 
WHERE IDENTIFIER($column_name) > 4000;
```