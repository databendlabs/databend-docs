---
title: UNPIVOT
---

`UNPIVOT` 操作通过将列转换为行来旋转表。

它是一个关系操作符，接受两列（来自表或子查询），以及列的列表，并为列表中指定的每列生成一行。在查询中，它在 FROM 子句中指定，位于表名或子查询之后。

**另请参阅：**
[PIVOT](./05-query-pivot.md)

## 语法

```sql
SELECT ...
FROM ...
    UNPIVOT ( <value_column>
    FOR <name_column> IN ( <column_list> ) )

[ ... ]
```

其中：

- `<value_column>`：将存储从 `<column_list>` 中列出的列中提取的值的列。
- `<name_column>`：将存储从中提取值的列的名称的列。
- `<column_list>`：要取消透视的列的列表，用逗号分隔。

## 示例

让我们取消透视个别月份列，以返回每位员工每月的单一销售值：

### 创建和插入数据

```sql
-- 创建 unpivoted_monthly_sales 表
CREATE TABLE unpivoted_monthly_sales(
  empid INT,
  jan INT,
  feb INT,
  mar INT,
  apr INT
);

-- 插入销售数据
INSERT INTO unpivoted_monthly_sales VALUES
  (1, 10400,  8000, 11000, 18000),
  (2, 39500, 90700, 12000,  5300);
```

### 使用 UNPIVOT

```sql
SELECT *
FROM unpivoted_monthly_sales
    UNPIVOT (amount
    FOR month IN (jan, feb, mar, apr));
```

输出：

```sql
+-------+-------+--------+
| empid | month | amount |
+-------+-------+--------+
|     1 | jan   |  10400 |
|     1 | feb   |   8000 |
|     1 | mar   |  11000 |
|     1 | apr   |  18000 |
|     2 | jan   |  39500 |
|     2 | feb   |  90700 |
|     2 | mar   |  12000 |
|     2 | apr   |   5300 |
+-------+-------+--------+
```
