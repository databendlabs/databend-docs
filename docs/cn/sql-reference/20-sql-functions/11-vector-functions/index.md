---
title: '向量函数'
description: 'Databend 中用于向量运算和分析的向量函数'
---

本节提供了 Databend 中向量函数 (Vector Functions) 的参考信息。这些函数支持全面的向量操作，包括距离计算、相似度测量和向量分析，适用于机器学习应用、向量搜索和人工智能驱动的分析。

## 距离函数

| 函数 | 说明 | 示例 |
|----------|-------------|--------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 计算向量之间的角距离 (Angular Distance)（范围：0-1） | `COSINE_DISTANCE([1,2,3], [4,5,6])` |
| [L1_DISTANCE](./02-vector-l1-distance.md) | 计算向量之间的曼哈顿（L1）距离 (Manhattan Distance) | `L1_DISTANCE([1,2,3], [4,5,6])` |
| [L2_DISTANCE](./01-vector-l2-distance.md) | 计算欧几里得（直线）距离 (Euclidean Distance) | `L2_DISTANCE([1,2,3], [4,5,6])` |

## 向量分析函数

| 函数 | 说明 | 示例 |
|----------|-------------|--------|
| [INNER_PRODUCT](./03-inner-product.md) | 计算两个向量的内积（点积）(Inner Product) | `INNER_PRODUCT([1,2,3], [4,5,6])` |
| [VECTOR_NORM](./05-vector-norm.md) | 计算向量的 L2 范数（模长）(L2 Norm) | `VECTOR_NORM([1,2,3])` |
| [VECTOR_DIMS](./04-vector-dims.md) | 返回向量的维度 (Vector Dimensions) | `VECTOR_DIMS([1,2,3])` |

## 距离函数比较

| 函数 | 说明 | 范围 | 最适用场景 | 用例 |
|----------|-------------|-------|----------|-----------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 向量之间的角距离 | [0, 1] | 当方向比大小更重要时 | • 文档相似度<br/>• 语义搜索<br/>• 推荐系统<br/>• 文本分析 |
| [L1_DISTANCE](./02-vector-l1-distance.md) | 向量之间的曼哈顿（L1）距离 | [0, ∞) | 对异常值具有鲁棒性 | • 特征比较<br/>• 异常值检测<br/>• 基于网格的路径规划<br/>• 聚类算法 |
| [L2_DISTANCE](./01-vector-l2-distance.md) | 欧几里得（直线）距离 | [0, ∞) | 当大小很重要时 | • 图像相似度<br/>• 地理数据<br/>• 异常检测<br/>• 基于特征的聚类 |

## 向量分析函数比较

| 函数 | 说明 | 范围 | 最适用场景 | 用例 |
|----------|-------------|-------|----------|-----------|
| [INNER_PRODUCT](./03-inner-product.md) | 两个向量的点积 | (-∞, ∞) | 测量向量相似度和投影 | • 神经网络<br/>• 机器学习<br/>• 物理计算<br/>• 向量投影 |
| [VECTOR_NORM](./05-vector-norm.md) | 向量的 L2 范数（模长） | [0, ∞) | 向量归一化和模长计算 | • 向量归一化<br/>• 特征缩放<br/>• 模长计算<br/>• 物理应用 |
| [VECTOR_DIMS](./04-vector-dims.md) | 向量的维度数 | [1, 4096] | 向量验证和处理 | • 数据验证<br/>• 动态处理<br/>• 调试<br/>• 兼容性检查 |