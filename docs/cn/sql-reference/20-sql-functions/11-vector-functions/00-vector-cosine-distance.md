---
title: 'COSINE_DISTANCE'
description: '在 Databend 中使用 cosine_distance 函数衡量相似性'
---

计算两个向量之间的余弦距离，用于衡量它们的不相似程度。

## 语法

```sql
COSINE_DISTANCE(vector1, vector2)
```

## 参数

- `vector1`: 第一个向量（VECTOR 数据类型）
- `vector2`: 第二个向量（VECTOR 数据类型）

## 返回值

返回一个介于 0 和 1 之间的 FLOAT 值：
- 0：向量相同（完全相似）
- 1：向量正交（完全不相似）

## 描述

余弦距离根据两个向量之间的夹角来衡量它们的不相似性，而不考虑它们的模长。该函数执行以下操作：

1. 验证两个输入向量具有相同的长度
2. 计算两个向量的元素级乘积之和（点积 (Dot Product)）
3. 计算每个向量的平方和的平方根（向量模长 (magnitude)）
4. 返回 `1 - (dot_product / (magnitude1 * magnitude2))`

其实现的数学公式为：

```
cosine_distance(v1, v2) = 1 - (Σ(v1ᵢ * v2ᵢ) / (√Σ(v1ᵢ²) * √Σ(v2ᵢ²)))
```

其中 v1ᵢ 和 v2ᵢ 是输入向量的元素。

:::info
此函数在 Databend 内部执行向量计算，不依赖于外部 API。
:::


## 示例

创建一个包含向量数据的表：

```sql
CREATE OR REPLACE TABLE vectors (
    id INT,
    vec VECTOR(3),
    VECTOR INDEX idx_vec(vec) distance='cosine'
);

INSERT INTO vectors VALUES
    (1, [1.0000, 2.0000, 3.0000]),
    (2, [1.0000, 2.2000, 3.0000]),
    (3, [4.0000, 5.0000, 6.0000]);
```

查找与 [1, 2, 3] 最相似的向量：

```sql
SELECT 
    vec, 
    COSINE_DISTANCE(vec, [1.0000, 2.0000, 3.0000]::VECTOR(3)) AS distance
FROM 
    vectors
ORDER BY 
    distance ASC
LIMIT 1;
```

```
+-------------------------+----------+
| vec                     | distance |
+-------------------------+----------+
| [1.0000,2.2000,3.0000]  | 0.0      |
+-------------------------+----------+
```