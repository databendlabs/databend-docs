---
title: 'COSINE_DISTANCE'
description: '在 Databend 中使用 cosine_distance 函数测量相似度'
---

计算两个向量之间的余弦距离，测量它们的相异程度。

## 语法

```sql
COSINE_DISTANCE(vector1, vector2)
```

## 参数

- `vector1`: 第一个向量 (ARRAY(FLOAT32 NOT NULL))
- `vector2`: 第二个向量 (ARRAY(FLOAT32 NOT NULL))

## 返回值

返回一个介于 0 和 1 之间的 FLOAT 值：
- 0：相同向量（完全相似）
- 1：正交向量（完全不相似）

## 描述

余弦距离测量两个向量之间基于它们之间角度的相异度，而不管它们的大小。该函数：

1. 验证两个输入向量是否具有相同的长度
2. 计算两个向量的元素乘积之和（点积）
3. 计算每个向量的平方和的平方根（向量大小）
4. 返回 `1 - (dot_product / (magnitude1 * magnitude2))`

实现的数学公式为：

```
cosine_distance(v1, v2) = 1 - (Σ(v1ᵢ * v2ᵢ) / (√Σ(v1ᵢ²) * √Σ(v2ᵢ²)))
```

其中 v1ᵢ 和 v2ᵢ 是输入向量的元素。

:::info
此函数在 Databend 中执行向量计算，不依赖于外部 API。
:::


## 示例

创建一个包含向量数据的表：

```sql
CREATE OR REPLACE TABLE vectors (
    id INT,
    vec ARRAY(FLOAT32 NOT NULL)
);

INSERT INTO vectors VALUES
    (1, [1.0000, 2.0000, 3.0000]),
    (2, [1.0000, 2.2000, 3.0000]),
    (3, [4.0000, 5.0000, 6.0000]);
```

找到与 [1, 2, 3] 最相似的向量：

```sql
SELECT 
    vec, 
    COSINE_DISTANCE(vec, [1.0000, 2.0000, 3.0000]) AS distance
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