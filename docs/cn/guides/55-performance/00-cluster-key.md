---
title: Cluster Key
---

# 聚簇键 (Cluster Key): 自动数据组织以加速查询

聚簇键 (cluster key) 提供自动数据组织功能，可显著提高大型表的查询性能。Databend 在后台无缝且持续地管理所有聚簇操作——您只需定义聚簇键，Databend 就会处理其余的工作。

## 解决了什么问题？

未经适当组织的大型表会带来显著的性能和维护挑战：

| 问题 | 影响 | 自动聚簇解决方案 |
|---------|--------|------------------------------|
| **全表扫描** | 即使是过滤后的数据，查询也会读取整个表 | 自动组织数据，只读取相关数据块 |
| **随机数据访问** | 相似数据分散在存储中 | 持续将相关数据分组在一起 |
| **慢速过滤查询** | WHERE 子句扫描不必要的行 | 自动完全跳过不相关的块 |
| **高 I/O 成本** | 读取大量未使用的旧数据 | 自动最小化数据传输 |
| **手动维护** | 需要监控和手动重新聚簇表 | 零维护——自动后台优化 |
| **资源管理** | 必须为聚簇操作分配计算资源 | Databend 自动处理所有聚簇资源 |

**示例**: 一个包含数百万商品的电商表。如果没有聚簇，查询 `WHERE category IN ('Electronics', 'Computers')` 必须扫描所有商品类别。通过按类别自动聚簇，Databend 会持续将电子产品和电脑产品分组在一起，只扫描 2 个数据块而不是 1000 多个数据块。

## 自动聚簇的优势

**易于维护**: Databend 消除了以下需求：
- 监控聚簇表的状态
- 手动触发重新聚簇操作
- 为聚簇指定计算资源
- 安排维护窗口

**工作原理**: 定义聚簇键后，Databend 会自动：
- 监控 DML 操作引起的表更改
- 评估何时需要重新聚簇表
- 执行后台聚簇优化
- 持续维护最佳数据组织

您所需要做的就是为每个表定义一个聚簇键 (如果适用)，Databend 会自动管理所有未来的维护。

## 工作原理

聚簇键根据指定的列将数据组织到存储块 (Parquet 文件) 中：

![Cluster Key Visualization](/img/sql/clustered.png)

1. **数据组织** → 相似值分组到相邻的数据块中
2. **元数据创建** → 存储块到值的映射，用于快速查找
3. **查询优化** → 查询期间只读取相关数据块
4. **性能提升** → 扫描的行数更少，结果更快

## 快速设置

```sql
-- Create table with cluster key
-- 创建带有聚簇键的表
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    region VARCHAR,
    amount DECIMAL
) CLUSTER BY (region);

-- Or add cluster key to existing table
-- 或者为现有表添加聚簇键
ALTER TABLE sales CLUSTER BY (region, order_date);
```

## 选择正确的聚簇键

根据您最常见的查询过滤器选择列：

| 查询模式 | 推荐的聚簇键 | 示例 |
|---------------|------------------------|---------|
| 按单列过滤 | 该列 | `CLUSTER BY (region)` |
| 按多列过滤 | 多列 | `CLUSTER BY (region, category)` |
| 日期范围查询 | 日期/时间戳列 | `CLUSTER BY (order_date)` |
| 高基数列 | 使用表达式减少值 | `CLUSTER BY (DATE(created_at))` |

### 好的聚簇键 vs 坏的聚簇键

| ✅ 好的选择 | ❌ 差的选择 |
|----------------|----------------|
| 频繁过滤的列 | 很少使用的列 |
| 中等基数 (100-10K 个值) | 布尔列 (值太少) |
| 日期/时间列 | 唯一 ID 列 (值太多) |
| 区域、类别、状态 | 随机或哈希列 |

## 监控性能

```sql
-- Check clustering effectiveness
-- 检查聚簇效果
SELECT * FROM clustering_information('database_name', 'table_name');

-- Key metrics to watch:
-- 关键指标：
-- average_depth: Lower is better (< 2 ideal)
-- average_depth: 越低越好 (理想情况 < 2)
-- average_overlaps: Lower is better
-- average_overlaps: 越低越好
-- block_depth_histogram: More blocks at depth 1-2
-- block_depth_histogram: 更多数据块在深度 1-2
```

## 何时重新聚簇

随着数据变化，表会随着时间变得无序：

```sql
-- Check if re-clustering is needed
-- 检查是否需要重新聚簇
SELECT IF(average_depth > 2 * LEAST(GREATEST(total_block_count * 0.001, 1), 16),
          'Re-cluster needed',
          'Clustering is good')
FROM clustering_information('your_database', 'your_table');

-- Re-cluster the table
-- 重新聚簇表
ALTER TABLE your_table RECLUSTER;
```

## 性能调优

### 自定义数据块大小
调整数据块大小以获得更好的性能：

```sql
-- Smaller blocks = fewer rows per query
-- 更小的数据块 = 每次查询的行数更少
ALTER TABLE sales SET OPTIONS(
    ROW_PER_BLOCK = 100000,
    BLOCK_SIZE_THRESHOLD = 52428800
);
```

### 自动重新聚簇
- `COPY INTO` 和 `REPLACE INTO` 会自动触发重新聚簇
- 定期监控聚簇指标
- 当 `average_depth` 过高时重新聚簇

## 最佳实践

| 实践 | 益处 |
|----------|---------|
| **从简单开始** | 首先使用单列聚簇键 |
| **监控指标** | 定期检查 clustering_information |
| **测试性能** | 在聚簇前后测量查询速度 |
| **定期重新聚簇** | 数据更改后保持聚簇 |
| **考虑成本** | 聚簇会消耗计算资源 |

## 重要说明

:::tip
**何时使用聚簇键:**
- 大型表 (数百万行以上)
- 查询性能慢
- 频繁基于过滤器的查询
- 分析型工作负载

**何时不使用:**
- 小型表
- 随机访问模式
- 频繁更改的数据
:::

---

*聚簇键在具有可预测过滤模式的大型、频繁查询的表上最有效。从您最常见的 WHERE 子句列开始。*