---
title: ANY_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.815"/>

聚合函数。

`ANY_VALUE()` 函数从输入表达式中返回一个任意的非 NULL 值。当需要在 `GROUP BY` 查询中选择一个既未分组也未聚合的列时，可以使用此函数。

> **别名：** `ANY()` 返回与 `ANY_VALUE()` 相同的结果，为保持兼容性而保留。

## 语法

```sql
ANY_VALUE(<expr>)
```

## 参数

| 参数 | 说明 |
|-----------|----------------|
| `<expr>` | 任意表达式 |

## 返回类型

`<expr>` 的类型。如果所有值都为 NULL，则返回值为 NULL。

:::note
- `ANY_VALUE()` 是非确定性的，每次执行可能会返回不同的值。
- 为了获得可预测的结果，请改用 `MIN()` 或 `MAX()`。
:::

## 示例

**示例数据：**
```sql
CREATE TABLE sales (
  region VARCHAR,
  manager VARCHAR,
  sales_amount DECIMAL(10, 2)
);

INSERT INTO sales VALUES
  ('North', 'Alice', 15000.00),
  ('North', 'Alice', 12000.00),
  ('South', 'Bob', 20000.00);
```

**问题：** 此查询会失败，因为 `manager` 不在 GROUP BY 子句中：
```sql
SELECT region, manager, SUM(sales_amount)  -- ❌ 错误
FROM sales GROUP BY region;
```

**旧方法：** 将 `manager` 添加到 GROUP BY 中，但这会创建比所需更多的分组，从而影响性能：
```sql
SELECT region, manager, SUM(sales_amount)
FROM sales GROUP BY region, manager;  -- ❌ 因额外分组导致性能不佳
```

**更好的解决方案：** 使用 `ANY_VALUE()` 来选择 manager：
```sql
SELECT
  region,
  ANY_VALUE(manager) AS manager,  -- ✅ 可行
  SUM(sales_amount) AS total_sales
FROM sales
GROUP BY region;
```

**结果：**
```text
| region | manager | total_sales |
|--------|---------|-------------|
| North  | Alice   | 27000.00    |
| South  | Bob     | 20000.00    |
```