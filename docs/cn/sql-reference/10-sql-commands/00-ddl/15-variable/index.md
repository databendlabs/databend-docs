---
title: SQL 变量
sidebar_label: SQL 变量
---

SQL 变量允许你在会话中存储和管理临时数据，使脚本更具动态性和可重用性。

## 变量命令

| 命令 | 描述 |
|---------|-------------|
| [SET VARIABLE](set-variable.md) | 创建或修改会话或用户变量。 |
| [UNSET VARIABLE](unset-variable.md) | 删除用户定义的变量。 |
| [SHOW VARIABLES](show-variables.md) | 显示系统和用户变量的当前值。 |

`SHOW VARIABLES` 命令还有一个对应的表函数，即 [`SHOW_VARIABLES`](../../../20-sql-functions/17-table-functions/show-variables.md)，它以表格格式返回相同的信息，以便进行更丰富的筛选和查询。

## 使用变量进行查询

你可以在语句中引用变量，以进行动态值替换或在运行时构建对象名称。

### 使用 `$` 和 `getvariable()` 访问变量

使用 `$` 符号或 `getvariable()` 函数将变量值直接嵌入查询中。

```sql title='示例：'
-- 设置一个变量用作筛选值
SET VARIABLE threshold = 100;

-- 在查询中使用 $ 引用变量
SELECT * FROM sales WHERE amount > $threshold;

-- 或者，使用 getvariable() 函数
SELECT * FROM sales WHERE amount > getvariable('threshold');
```

### 使用 `IDENTIFIER` 访问对象

`IDENTIFIER` 关键字允许你引用名称存储在变量中的数据库对象，从而实现灵活的查询构建。（注意：BendSQL 尚不支持 `IDENTIFIER`。）

```sql title='示例：'
-- 创建一个包含销售数据的表
CREATE TABLE sales_data (region TEXT, sales_amount INT, month TEXT) AS
SELECT 'North', 5000, 'January' UNION ALL
SELECT 'South', 3000, 'January';

select * from sales_data;

-- 为表名和列名设置变量
SET VARIABLE table_name = 'sales_data';
SET VARIABLE column_name = 'sales_amount';

-- 使用 IDENTIFIER 在查询中动态引用表和列
SELECT region, IDENTIFIER($column_name)
FROM IDENTIFIER($table_name)
WHERE IDENTIFIER($column_name) > 4000;
```