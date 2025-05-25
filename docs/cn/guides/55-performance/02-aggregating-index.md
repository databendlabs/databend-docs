---
title: 聚合索引
---

# 聚合索引：预计算结果实现即时分析

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

聚合索引通过预计算并存储聚合结果，显著加速分析查询，避免对常见分析操作进行全表扫描。

## 解决什么问题？

大型数据集的分析查询面临显著性能挑战：

| 问题 | 影响 | 聚合索引解决方案 |
|------|------|----------------|
| **全表扫描** | SUM、COUNT、MIN、MAX 查询需扫描数百万行 | 即时读取预计算结果 |
| **重复计算** | 相同聚合操作反复执行 | 一次计算多次复用 |
| **仪表板响应慢** | 分析仪表板加载耗时数分钟 | 常见指标亚秒级响应 |
| **计算成本高** | 繁重聚合工作负载消耗资源 | 缓存结果计算量最小化 |
| **用户体验差** | 用户需等待报表和分析结果 | 商业智能即时呈现 |

**示例**：在1亿行数据上执行销售分析查询 `SELECT SUM(revenue), COUNT(*) FROM sales WHERE region = 'US'`。无聚合索引时需扫描所有美国销售记录，有聚合索引时直接返回预计算结果。

## 工作原理

1. **索引创建** → 定义需要预计算的聚合查询
2. **结果存储** → Databend 将聚合结果存储在优化块中
3. **查询匹配** → 自动识别可使用预计算结果的查询
4. **自动更新** → 底层数据变更时刷新结果

## 快速配置

```sql
-- 创建含示例数据的表
CREATE TABLE sales(region VARCHAR, product VARCHAR, revenue DECIMAL, quantity INT);

-- 为常见分析创建聚合索引
CREATE AGGREGATING INDEX sales_summary AS 
SELECT region, SUM(revenue), COUNT(*), AVG(quantity) 
FROM sales 
GROUP BY region;

-- 手动刷新索引
REFRESH AGGREGATING INDEX sales_summary;

-- 验证索引使用情况
EXPLAIN SELECT region, SUM(revenue) FROM sales GROUP BY region;
```

## 支持的操作

| ✅ 已支持 | ❌ 不支持 |
|----------|----------|
| SUM、COUNT、MIN、MAX、AVG | 窗口函数 |
| GROUP BY 子句 | GROUPING SETS |
| WHERE 过滤条件 | ORDER BY、LIMIT |
| 简单聚合 | 复杂子查询 |

## 刷新策略

| 策略 | 适用场景 | 配置方式 |
|------|----------|----------|
| **自动同步(SYNC)** | 实时分析、小数据集 | `CREATE AGGREGATING INDEX ... SYNC` |
| **手动刷新** | 大数据集、批处理 | `CREATE AGGREGATING INDEX ...` (默认) |
| **后台刷新(云版)** | 生产环境工作负载 | Databend Cloud 自动处理 |

### 自动 vs 手动刷新

```sql
-- 自动刷新(每次数据变更时更新)
CREATE AGGREGATING INDEX auto_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region SYNC;

-- 手动刷新(按需更新)
CREATE AGGREGATING INDEX manual_summary AS 
SELECT region, SUM(revenue) FROM sales GROUP BY region;

REFRESH AGGREGATING INDEX manual_summary;
```

## 性能示例

以下示例展示性能的显著提升：

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
-- 这表明查询使用了预计算结果而非扫描原始数据
```

## 最佳实践

| 实践 | 优势 |
|------|------|
| **索引常用查询** | 聚焦高频执行的分析 |
| **使用手动刷新** | 更好控制更新时间 |
| **监控索引使用** | 使用 EXPLAIN 验证索引利用率 |
| **清理未用索引** | 移除不再使用的索引 |
| **匹配查询模式** | 索引过滤条件应与实际查询一致 |

## 管理命令

| 命令 | 用途 |
|------|------|
| `CREATE AGGREGATING INDEX` | 创建新聚合索引 |
| `REFRESH AGGREGATING INDEX` | 用最新数据更新索引 |
| `DROP AGGREGATING INDEX` | 移除索引(使用 VACUUM TABLE 清理存储) |
| `SHOW AGGREGATING INDEXES` | 列出所有索引 |

## 重要说明

:::tip
**适用场景：**
- 高频分析查询(仪表板、报表)
- 需重复聚合的大数据集
- 稳定的查询模式
- 性能关键型应用

**不适用场景：**
- 频繁变更的数据
- 一次性分析查询
- 小表的简单查询
:::

## 配置选项

```sql
-- 启用/禁用聚合索引功能
SET enable_aggregating_index_scan = 1;  -- 启用(默认)
SET enable_aggregating_index_scan = 0;  -- 禁用
```

---

*聚合索引最适合大型数据集上重复的分析工作负载。建议从最常见的仪表板和报表查询开始应用。*