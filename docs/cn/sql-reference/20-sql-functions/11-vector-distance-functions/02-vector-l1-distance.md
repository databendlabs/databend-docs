---
title: 'L1_DISTANCE'
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.777"/>

计算两个向量之间的曼哈顿距离（L1 Distance），即对应元素之间绝对差值的总和。

## 语法

```sql
L1_DISTANCE(vector1, vector2)
```

## 参数

- `vector1`: 第一个向量（VECTOR 数据类型）
- `vector2`: 第二个向量（VECTOR 数据类型）

## 返回值

返回一个 FLOAT 值，表示两个向量之间的曼哈顿距离（L1 Distance）。该值始终为非负数：
- 0：向量相同
- 值越大：表示向量相距越远

## 描述

L1 距离，也称为曼哈顿距离（Manhattan Distance）或出租车距离（Taxicab Distance），用于计算两个向量对应元素之间绝对差值的总和。该度量方式对于特征比较和稀疏数据分析非常有用。

公式：`L1_DISTANCE(a, b) = |a1 - b1| + |a2 - b2| + ... + |an - bn|`

## 示例

### 基本用法

```sql
-- 计算两个向量之间的 L1 距离
SELECT L1_DISTANCE([1.0, 2.0, 3.0], [4.0, 5.0, 6.0]) AS distance;
```

结果：
```
┌──────────┐
│ distance │
├──────────┤
│ 9.0      │
└──────────┘
```

### 结合 VECTOR 类型使用

```sql
-- 创建包含 VECTOR 列的表
CREATE TABLE products (
    id INT,
    features VECTOR(3),
    VECTOR INDEX idx_features(features) distance='l1'
);

INSERT INTO products VALUES 
    (1, [1.0, 2.0, 3.0]::VECTOR(3)),
    (2, [2.0, 3.0, 4.0]::VECTOR(3));

-- 使用 L1 距离查找与查询向量相似的产品
SELECT 
    id,
    features,
    L1_DISTANCE(features, [1.5, 2.5, 3.5]::VECTOR(3)) AS distance
FROM products
ORDER BY distance ASC
LIMIT 5;
```