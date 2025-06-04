---
title: '向量距离函数 (Vector Distance Functions)'
description: 'Databend 中用于相似性测量的向量距离函数'
---

本节提供 Databend 中向量距离函数的参考信息。这些函数在机器学习应用、向量搜索和 AI 驱动分析中，对测量向量间的相似性至关重要。

## 可用的向量距离函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 计算向量间的角度距离（范围：0-1） | `COSINE_DISTANCE([1,2,3], [4,5,6])` |
| [L2_DISTANCE](./01-vector-l2-distance.md) | 计算欧几里得（直线）距离 | `L2_DISTANCE([1,2,3], [4,5,6])` |

## 函数比较

| 函数 | 描述 | 范围 | 最佳用途 | 应用场景 |
|----------|-------------|-------|----------|-----------|
| [L2_DISTANCE](./01-vector-l2-distance.md) | 欧几里得（直线）距离 | [0, ∞) | 当向量大小重要时 | • 图像相似性<br/>• 地理数据<br/>• 异常检测<br/>• 基于特征的聚类 |
| [COSINE_DISTANCE](./00-vector-cosine-distance.md) | 向量间的角度距离 | [0, 1] | 当方向比大小更重要时 | • 文档相似性<br/>• 语义搜索<br/>• 推荐系统<br/>• 文本分析 |