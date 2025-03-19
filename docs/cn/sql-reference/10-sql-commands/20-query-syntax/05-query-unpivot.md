---
title: UNPIVOT
---

`UNPIVOT` 操作通过将列转换为行来旋转表。

它是一种关系运算符，接受两列（来自表或子查询）以及一个列列表，并为列表中指定的每一列生成一行。在查询中，它在表名或子查询后的 FROM 子句中指定。

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
* `<value_column>`：将存储从 `<column_list>` 中列出的列中提取的值的列。
* `<name_column>`：将存储从中提取值的列名的列。
* `<column_list>`：要取消透视的列列表，以逗号分隔。您可以选择使用 AS 为列名提供别名，或者直接使用字符串字面量。


## 示例

让我们取消透视各个月份的列，以返回每个员工每月的单一销售值：

### 创建并插入数据


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
    FOR month IN (jan as 'Jan', feb AS 'Feb', mar 'MARCH', apr));
```

输出：
```sql
┌──────────────────────────────────────────────────────┐
│      empid      │       month      │      amount     │
├─────────────────┼──────────────────┼─────────────────┤
│               1 │ Jan              │           10400 │
│               1 │ Feb              │            8000 │
│               1 │ MARCH            │           11000 │
│               1 │ apr              │           18000 │
│               2 │ Jan              │           39500 │
│               2 │ Feb              │           90700 │
│               2 │ MARCH            │           12000 │
│               2 │ apr              │            5300 │
└──────────────────────────────────────────────────────┘

```