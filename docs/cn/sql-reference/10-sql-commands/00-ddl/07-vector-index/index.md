---
title: Vector Index
---

Databend 的 Vector Index 基于 HNSW（Hierarchical Navigable Small World）算法，能够对高维向量数据进行高效的相似度搜索，支持语义搜索、推荐系统和 AI 应用等场景。

:::tip 核心特性：自动构建索引
Vector Index **随数据写入自动构建**。当你向包含 Vector Index 的表中插入或加载数据时，索引会自动生成，无需手动维护。只有在对已有数据的表创建索引时，才需要运行 `REFRESH VECTOR INDEX`。
:::

## Vector Index 管理

| 命令                                            | 说明                                               |
|-------------------------------------------------|----------------------------------------------------|
| [CREATE VECTOR INDEX](create-vector-index.md)   | 创建 Vector Index 以实现高效相似度搜索               |
| [REFRESH VECTOR INDEX](refresh-vector-index.md) | 为创建索引前已存在的数据构建索引                      |
| [DROP VECTOR INDEX](drop-vector-index.md)       | 删除 Vector Index                                  |
