---
title: '向量距离函数'
description: 'Databend 中用于相似性度量的向量距离函数'
---

本节提供了 Databend 中向量距离函数 (Vector Distance Functions) 的参考信息。这些函数对于在机器学习应用、向量搜索和 AI 驱动的分析中衡量向量之间的相似性至关重要。

## 可用的向量距离函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 计算向量之间的角距离 (Angular Distance)（范围：0-1） | `COSINE_DISTANCE([1,2,3], [4,5,6])` |
| [L1_DISTANCE](./02-vector-l1-distance.md) | 计算向量之间的曼哈顿（L1）距离 | `L1_DISTANCE([1,2,3], [4,5,6])` |
| [L2_DISTANCE](./01-vector-l2-distance.md) | 计算欧几里得（直线）距离 (Euclidean Distance) | `L2_DISTANCE([1,2,3], [4,5,6])` |

## 函数对比

| 函数 | 描述 | 范围 | 最适用于 | 使用场景 |
|----------|-------------|-------|----------|-----------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 向量之间的角距离 | [0, 1] | 当方向比大小更重要时 | • 文档相似度<br/>• 语义搜索<br/>• 推荐系统<br/>• 文本分析 |
| [L1_DISTANCE](./02-vector-l1-distance.md) | 计算向量之间的曼哈顿（L1）距离 | [0, ∞) | 当方向比大小更重要时 | • 文档相似度<br/>• 语义搜索<br/>• 推荐系统<br/>• 文本分析 |
| [L2_DISTANCE](./01-vector-l2-distance.md) | 欧几里得（直线）距离 | [0, ∞) | 当大小很重要时 | • 图像相似度<br/>• 地理数据<br/>• 异常检测<br/>• 基于特征的聚类 |