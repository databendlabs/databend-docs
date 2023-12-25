---
title: 聚合索引
---

## 什么是聚合索引 {/*what-is-aggregating-index*/}

聚合索引是一种专门设计用于加速Databend中聚合查询的索引类型。它通过预先计算并存储像总和、平均值和计数这样的聚合值。对于使用`GROUP BY`子句的查询，这种索引特别有效，因为它允许更快地检索聚合数据。


## 为什么使用聚合索引 {/*why-use-aggregating-index*/}

使用聚合索引的主要优势是它能显著提高查询性能，特别是在数据量大的数据库中。这种效率是通过减少全表扫描的需要，而是利用索引中的预聚合值来实现的。这使得聚合索引非常适合分析和报告查询，其中频繁访问聚合数据。

:::info
Databend聚合索引会在底层数据变化时自动更新自身。
这意味着您不必每次数据变更时都手动更新索引。
:::

## 如何使用聚合索引 {/*how-to-use-aggregating-index*/}

### 创建表 {/*create-table*/}

```sql
CREATE TABLE sales_data (
    id INT,
    category VARCHAR(50),
    value INT,
    timestamp DATE
);

-- 插入多样化的数据集
INSERT INTO sales_data (id, category, value, timestamp) VALUES
    (1, 'Electronics', 100, '2023-01-01'),
    (2, 'Books', 50, '2023-01-02'),
    (3, 'Electronics', 80, '2023-01-03'),
    -- 其他不同类别和值的行...
    (100, 'Clothing', 60, '2023-04-10');
```

### 创建聚合索引 {/*create-aggregating-index*/}

```sql
CREATE AGGREGATING INDEX sales_agg_index AS
SELECT
    MIN(value),
    MAX(value),
    COUNT(*)
FROM
    sales_data
GROUP BY
    category;
```

### 检查聚合索引 {/*check-aggregating-index*/}

```sql
EXPLAIN SELECT
    MIN(value),
    MAX(value),
FROM
    sales_data
GROUP BY
    category;
```

```sql
-[ EXPLAIN ]-----------------------------------
AggregateFinal
├── 输出列: [MIN(value) (#4), MAX(value) (#5), sales_data.category (#1)]
├── 分组依据: [category]
├── 聚合函数: [min(value), max(value)]
├── 预估行数: 4.00
└── AggregatePartial
    ├── 输出列: [MIN(value) (#4), MAX(value) (#5), #_group_by_key]
    ├── 分组依据: [category]
    ├── 聚合函数: [min(value), max(value)]
    ├── 预估行数: 4.00
    └── TableScan
        ├── 表: default.docs_test.sales_data
        ├── 输出列: [category (#1), value (#2)]
        ├── 读取行数: 4
        ├── 读取字节数: 125
        ├── 分区总数: 1
        ├── 扫描分区数: 1
        ├── 剪枝统计: [段: <范围剪枝: 1到1>, 块: <范围剪枝: 1到1, 布隆剪枝: 0到0>]
        ├── 下推: [过滤器: [], 限制: NONE]
        ├── 聚合索引: [SELECT COUNT(), MAX(value), MIN(value), category FROM docs_test.sales_data GROUP BY category] -- 使用了聚合索引
        ├── 重写查询: [选择: [index_col_0 (#0), index_col_3 (#3), index_col_2 (#2)]]
        └── 预估行数: 4.00
```

现在，这些查询可以通过聚合索引加速，其中包括`MIN(value)`、`MAX(value)`、`COUNT(*)`以及`GROUP BY category`子句，例如：
```sql
SELECT MIN(value) FROM sales_data GROUP BY category;
SELECT MAX(value) FROM sales_data GROUP BY category;
SELECT COUNT(*) FROM sales_data GROUP BY category;
```

### 删除聚合索引 {/*drop-aggregating-index*/}

```sql
DROP AGGREGATING INDEX sales_agg_index;
```