---
title: 聚合索引
---

# 聚合索引：预计算结果实现即时分析

聚合索引通过预计算和存储聚合结果，显著加速分析查询，避免对常见分析操作进行全表扫描。

## 解决了什么问题？

大型数据集上的分析查询面临重大性能挑战：

| 问题 | 影响 | 聚合索引解决方案 |
|---------|--------|---------------------------|
| **全表扫描** | SUM、COUNT、MIN、MAX 查询扫描数百万行 | 即时读取预计算结果 |
| **重复计算** | 相同聚合被反复计算 | 存储一次，重复使用 |
| **缓慢的仪表盘查询** | 分析仪表盘需数分钟加载 | 常见指标亚秒级响应 |
| **高计算成本** | 繁重的聚合工作负载消耗资源 | 缓存结果的计算开销极小 |
| **糟糕的用户体验** | 用户等待报表和分析 | 即时获取商业智能结果 |

**示例**：在包含 1 亿行数据的表上执行销售分析查询 `SELECT SUM(revenue), COUNT(*) FROM sales WHERE region = 'US'`。无聚合索引时需扫描所有美国销售记录；使用聚合索引可即时返回预计算结果。

## 工作原理

1. **索引创建** → 定义需预计算的聚合查询
2. **结果存储** → Databend 在优化块中存储聚合结果
3. **查询匹配** → 传入查询自动使用预计算结果
4. **自动更新** → 底层数据变更时结果自动刷新

## 快速设置

```sql
-- 创建包含示例数据的表
CREATE TABLE sales(region VARCHAR, product VARCHAR, revenue DECIMAL, quantity INT);

-- 为常见分析创建聚合索引
CREATE AGGREGATING INDEX sales_summary AS 
SELECT region, SUM(revenue), COUNT(*), AVG(quantity) 
FROM sales 
GROUP BY region;

-- 刷新索引（手动模式）
REFRESH AGGREGATING INDEX sales_summary;

-- 验证索引使用情况
EXPLAIN SELECT region, SUM(revenue) FROM sales GROUP BY region;
```

## 支持的操作

| ✅ 支持 | ❌ 不支持 |
|-------------|-----------------|
| SUM、COUNT、MIN、MAX、AVG | Window Functions |
| GROUP BY 子句 | GROUPING SETS |
| WHERE 过滤器 | ORDER BY、LIMIT |
| 简单聚合 | 复杂子查询 |

## 刷新策略

| 策略 | 适用场景 | 配置 |
|----------|-------------|---------------|
| **自动（SYNC）** | 实时分析，小数据集 | `CREATE AGGREGATING INDEX ... SYNC` |
| **手动** | 大数据集，批处理 | `CREATE AGGREGATING INDEX ...`（默认） |
| **后台（Cloud）** | 生产工作负载 | Databend Cloud 自动处理 |

### 自动 vs 手动刷新

```sql
-- 自动刷新（每次数据变更时更新）
CREATE AGGREGATING INDEX auto_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region SYNC;

-- 手动刷新（按需更新）
CREATE AGGREGATING INDEX manual_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region;

REFRESH AGGREGATING INDEX manual_summary;
```

## 性能示例

该示例展示显著的性能提升：

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

-- 执行计划关键指标：
-- ├── aggregating index: [SELECT MIN(a), MAX(c) FROM default.agg]
-- ├── rewritten query: [selection: [index_col_0 (#0), index_col_1 (#1)]]
-- 表明查询使用预计算结果而非原始数据
```

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **索引高频查询** | 聚焦频繁执行的分析 |
| **采用手动刷新** | 更精准控制更新时间 |
| **监控索引使用** | 使用 EXPLAIN 验证索引效果 |
| **清理闲置索引** | 移除未使用的索引 |
| **匹配查询模式** | 索引过滤器需契合实际查询 |

## 管理命令

| 命令 | 用途 |
|---------|---------|
| `CREATE AGGREGATING INDEX` | 创建新聚合索引 |
| `REFRESH AGGREGATING INDEX` | 使用最新数据更新索引 |
| `DROP AGGREGATING INDEX` | 删除索引（使用 VACUUM TABLE 清理存储） |
| `SHOW AGGREGATING INDEXES` | 列出所有索引 |

## 重要说明

:::tip
**适用场景：**
- 高频分析查询（仪表盘、报表）
- 含重复聚合的大数据集
- 稳定的查询模式
- 性能关键型应用

**不适用场景：**
- 频繁变更的数据
- 一次性分析查询
- 小表的简单查询
:::

## 配置

```sql
-- 启用/禁用聚合索引功能
SET enable_aggregating_index_scan = 1;  -- 启用（默认）
SET enable_aggregating_index_scan = 0;  -- 禁用
```

---

*聚合索引对大数据集上的重复分析工作负载效果最佳，建议从高频仪表盘和报表查询开始实施。*
