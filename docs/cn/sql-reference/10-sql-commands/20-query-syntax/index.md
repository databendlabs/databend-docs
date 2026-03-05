---
title: 查询语法
---

本页面提供 Databend 查询语法的参考信息。每个组件都可以单独使用，也可以组合起来构建强大的查询。

## 核心查询组件

| 组件 | 描述 |
|-----------|-------------|
| **[SELECT](query-syntax/query-select)** | 从表中检索数据——所有查询的基础 |
| **[FROM / JOIN](query-syntax/query-join)** | 指定数据源并组合多个表 |
| **[WHERE](query-syntax/query-select#where-clause)** | 根据条件过滤行 |
| **[GROUP BY](query-syntax/query-group-by)** | 对行进行分组并执行聚合（SUM、COUNT、AVG 等） |
| **[HAVING](query-syntax/query-group-by#having-clause)** | 过滤分组后的结果 |
| **[ORDER BY](query-syntax/query-select#order-by-clause)** | 对查询结果排序 |
| **[LIMIT / TOP](query-syntax/top)** | 限制返回的行数 |

## 高级功能

| 组件 | 描述 |
|-----------|-------------|
| **[WITH (CTE)](query-syntax/with-clause)** | 定义可复用的查询块，用于复杂逻辑 |
| **[PIVOT](query-syntax/query-pivot)** | 将行转换为列（宽格式） |
| **[UNPIVOT](query-syntax/query-unpivot)** | 将列转换为行（长格式） |
| **[QUALIFY](query-syntax/qualify)** | 在窗口函数计算后过滤行 |
| **[VALUES](query-syntax/values)** | 创建内联临时数据集 |

## 时间回溯与流式处理

| 组件 | 描述 |
|-----------|-------------|
| **[AT](query-syntax/query-at)** | 查询特定时间点的数据 |
| **[CHANGES](query-syntax/changes)** | 跟踪插入、更新和删除 |
| **[WITH CONSUME](query-syntax/with-consume)** | 通过偏移量管理处理流式数据 |
| **[WITH STREAM HINTS](query-syntax/with-stream-hints)** | 优化流处理行为 |

## 查询执行

| 组件 | 描述 |
|-----------|-------------|
| **[Settings](query-syntax/settings)** | 配置查询优化和执行参数 |

## 查询结构

一个典型的 Databend 查询遵循以下结构：

```sql
[WITH cte_expressions]
SELECT [TOP n] columns
FROM table
[JOIN other_tables]
[WHERE conditions]
[GROUP BY columns]
[HAVING group_conditions]
[QUALIFY window_conditions]
[ORDER BY columns]
[LIMIT n]
```