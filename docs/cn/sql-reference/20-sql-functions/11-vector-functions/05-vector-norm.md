---
title: 'VECTOR_NORM'
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.780"/>

计算向量的 L2 范数（欧几里得范数），它表示向量的长度或大小。

## 语法

```sql
VECTOR_NORM(vector)
```

## 参数

- `vector`: 输入向量（VECTOR 数据类型）

## 返回值

返回一个 FLOAT 值，表示向量的 L2 范数（大小）。

## 描述

`VECTOR_NORM` 函数计算向量的 L2 范数（也称为欧几里得范数），它表示向量在欧几里得空间中的长度或大小。该函数执行以下操作：

1. 将向量中的每个元素平方
2. 将所有平方值相加
3. 返回总和的平方根

其实现的数学公式为：

```
vector_norm(v) = √(Σ(vᵢ²))
```

其中 vᵢ 是输入向量的元素。

向量范数在以下方面是基础：
- 将向量归一化为单位长度
- 在机器学习中测量向量的大小
- 计算距离和相似度
- 特征缩放和预处理
- 涉及大小的物理计算

:::info
此函数在 Databend 内部执行向量计算，不依赖于外部 API。
:::

## 示例

```sql
-- 计算向量的大小（长度）
SELECT 
    VECTOR_NORM([3,4]::VECTOR(2)) AS norm_2d,
    VECTOR_NORM([1,2,3]::VECTOR(3)) AS norm_3d,
    VECTOR_NORM([0,0,0]::VECTOR(3)) AS zero_vector;
```

结果：
```
┌─────────┬───────────┬─────────────┐
│ norm_2d │  norm_3d  │ zero_vector │
├─────────┼───────────┼─────────────┤
│     5.0 │ 3.7416575 │         0.0 │
└─────────┴───────────┴─────────────┘
```