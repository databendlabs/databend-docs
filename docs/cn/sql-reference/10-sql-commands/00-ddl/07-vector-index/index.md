---
title: Vector Index
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Databend 的 Vector Index 基于 HNSW（Hierarchical Navigable Small World）算法，能够对高维向量数据进行高效的相似度搜索，支持语义搜索、推荐系统和 AI 应用等场景。

:::tip[核心特性：自动构建索引]
Vector Index **随数据写入自动构建**。当你向包含 Vector Index 的表中插入或加载数据时，索引会自动生成，无需手动维护。创建或替换索引后，请运行 `REFRESH VECTOR INDEX` 为已有数据建立索引。需要为旧数据块构建当前索引格式时，也可以运行此命令。
:::

<a id="rolling-upgrades"></a>

## 滚动升级

<FunctionDescription description="Introduced or updated: Unreleased"/>

升级到包含向量 TopN 行裁剪的构建时，请先完成所有 Query 节点的升级，再恢复分布式向量搜索。如果 Query 节点同时运行此变更前后的版本，分布式向量查询可能失败。

## Vector Index 管理

| 命令                                            | 说明                                               |
|-------------------------------------------------|----------------------------------------------------|
| [CREATE VECTOR INDEX](create-vector-index.md)   | 创建 Vector Index 以实现高效相似度搜索               |
| [REFRESH VECTOR INDEX](refresh-vector-index.md) | 为已有数据构建缺少的当前版本索引文件                  |
| [DROP VECTOR INDEX](drop-vector-index.md)       | 删除 Vector Index                                  |
