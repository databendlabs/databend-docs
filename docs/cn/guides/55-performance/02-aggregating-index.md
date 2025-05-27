---
title: 聚合索引
---

# 聚合索引：预计算结果，实现即时分析

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

聚合索引通过预计算和存储聚合结果，显著加速分析查询，无需扫描整个表即可进行常见的分析操作。

## 解决什么问题？

对大型数据集进行分析查询面临显著的性能挑战：

| 问题 | 影响 | 聚合索引解决方案 |
|---------|--------|---------------------------|
| **全表扫描** | SUM、COUNT、MIN、MAX 查询扫描数百万行 | 即时读取预计算结果 |
| **重复计算** | 相同的聚合操作重复计算 | 存储一次结果，多次复用 |
| **仪表盘查询缓慢** | 分析仪表盘加载需要数分钟 | 常见指标实现亚秒级响应 |
| **高计算成本** | 大量聚合工作负载消耗资源 | 缓存结果只需极少计算 |
| **用户体验差** | 用户等待报告和分析 | 为商业智能提供即时结果 |

**示例**：对 1 亿行数据执行销售分析查询 `SELECT SUM(revenue), COUNT(*) FROM sales WHERE region = 'US'`。如果没有聚合索引，它会扫描所有美国销售记录。有了聚合索引，它会立即返回预计算结果。

## 工作原理

1. **索引创建** → 定义要预计算的聚合查询
2. **结果存储** → Databend 将聚合结果存储在优化后的块中
3. **查询匹配** → 传入查询自动使用预计算结果
4. **自动更新** → 当底层数据更改时，结果会自动刷新

## 快速设置

```sql
-- 创建包含示例数据的表
CREATE TABLE sales(region VARCHAR, product VARCHAR, revenue DECIMAL, quantity INT);

-- 为常见分析创建聚合索引
CREATE AGGREGATING INDEX sales_summary AS 
SELECT region, SUM(revenue), COUNT(*), AVG(quantity) 
FROM sales 
GROUP BY region;

-- 刷新索引 (手动模式)
REFRESH AGGREGATING INDEX sales_summary;

-- 验证索引是否被使用
EXPLAIN SELECT region, SUM(revenue) FROM sales GROUP BY region;
```

## 支持的操作

| ✅ 支持 | ❌ 不支持 |
|-------------|-----------------|
| SUM, COUNT, MIN, MAX, AVG | 窗口函数 |
| GROUP BY 子句 | GROUPING SETS |
| WHERE 过滤 | ORDER BY, LIMIT |
| 简单聚合 | 复杂子查询 |

## 刷新策略

| 策略 | 使用场景 | 配置 |
|----------|-------------|---------------|
| **自动 (SYNC)** | 实时分析，小型数据集 | `CREATE AGGREGATING INDEX ... SYNC` |
| **手动** | 大型数据集，批处理 | `CREATE AGGREGATING INDEX ...` (默认) |
| **后台 (Cloud)** | 生产工作负载 | Databend Cloud 中自动 |

### 自动刷新 vs 手动刷新

```sql
-- 自动刷新 (每次数据更改时更新)
CREATE AGGREGATING INDEX auto_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region SYNC;

-- 手动刷新 (按需更新)
CREATE AGGREGATING INDEX manual_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region;

REFRESH AGGREGATING INDEX manual_summary;
```

## 性能示例

此示例展示了显著的性能提升：

```sql
-- 准备数据
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4), (2,2,5);

-- 创建聚合索引
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- 刷新聚合索引
REFRESH AGGREGATING INDEX my_agg_index;

-- 验证聚合索引是否生效
EXPLAIN SELECT MIN(a), MAX(c) FROM agg;

-- 执行计划中的关键指标：
-- ├── aggregating index: [SELECT MIN(a), MAX(c) FROM default.agg]
-- ├── rewritten query: [selection: [index_col_0 (#0), index_col_1 (#1)]]
-- 这表明查询使用了预计算结果，而不是扫描原始数据
```

## 最佳实践

| 实践 | 益处 |
|----------|---------|
| **索引常见查询** | 专注于频繁执行的分析 |
| **使用手动刷新** | 更好地控制更新时间 |
| **监控索引使用情况** | 使用 EXPLAIN 验证索引利用率 |
| **清理未使用的索引** | 删除未使用的索引 |
| **匹配查询模式** | 索引过滤器应与实际查询匹配 |

## 管理命令

| 命令 | 用途 |
|---------|---------|
| `CREATE AGGREGATING INDEX` | 创建新的聚合索引 |
| `REFRESH AGGREGATING INDEX` | 使用最新数据更新索引 |
| `DROP AGGREGATING INDEX` | 删除索引 (使用 VACUUM TABLE 清理存储) |
| `SHOW AGGREGATING INDEXES` | 列出所有索引 |

## 重要说明

:::tip
**何时使用聚合索引：**
- 频繁的分析查询 (仪表盘、报告)
- 具有重复聚合的大型数据集
- 稳定的查询模式
- 性能关键型应用

**何时不使用：**
- 数据频繁变化
- 一次性分析查询
- 小型表上的简单查询
:::

## 配置

```sql
-- 启用/禁用聚合索引功能
SET enable_aggregating_index_scan = 1;  -- 启用 (默认)
SET enable_aggregating_index_scan = 0;  -- 禁用
```

---

*聚合索引对于大型数据集上的重复分析工作负载最有效。从您最常用的仪表盘和报告查询开始。*