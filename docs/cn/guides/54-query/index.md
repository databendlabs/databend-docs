---
title: 统一工作负载
---

Databend 现已作为统一引擎，支持 SQL 分析、多模态搜索、向量相似度、地理空间分析及持续 ETL。本迷你系列以 **EverDrive 智能视觉** 场景为例（会话 ID 如 `SES-20240801-SEA01`，帧 ID 如 `FRAME-0001`），演示同一数据集如何在不跨系统复制的情况下流经所有工作负载。

| 指南 | 涵盖内容 |
|-------|----------------|
| [SQL 分析](./00-sql-analytics.md) | 构建共享表、切分会话、添加窗口/聚合加速 |
| [JSON 与搜索](./01-json-search.md) | 存储检测负载并 `QUERY` 风险场景 |
| [向量搜索](./02-vector-db.md) | 保留帧嵌入并查找语义邻居 |
| [地理分析](./03-geo-analytics.md) | 使用 `HAVERSINE`、多边形、H3 映射事件 |
| [湖仓 ETL](./04-lakehouse-etl.md) | 暂存文件、`COPY INTO` 表、可选流/任务 |

按顺序完成即可看到 Databend 的单个查询优化器（Query Optimizer）如何为同一车队数据上的分析、搜索、向量、地理及加载流水线提供支持。