---
title: Cluster Key
---

# 聚簇键：查询加速的自动数据组织

聚簇键提供自动数据组织功能，可显著提升大表的查询性能。Databend 在后台无缝且持续地管理所有聚簇操作——您只需定义聚簇键，Databend 会处理其余工作。

## 解决了什么问题？

缺乏合理组织的大表会带来显著的性能和维护挑战：

| 问题 | 影响 | 自动聚簇解决方案 |
|---------|--------|------------------------------|
| **全表扫描** | 即使过滤数据，查询也要读取整个表 | 自动组织数据，仅读取相关块 |
| **随机数据访问** | 相似数据分散在存储中 | 持续将相关数据分组存储 |
| **慢速过滤查询** | WHERE 子句扫描不必要的行 | 自动完全跳过不相关块 |
| **高 I/O 成本** | 读取大量未使用数据 | 自动最小化数据传输量 |
| **手动维护** | 需要监控并手动重新聚簇表 | 零维护——自动后台优化 |
| **资源管理** | 必须为聚簇操作分配计算资源 | Databend 自动管理所有聚簇资源 |

**示例**：包含数百万产品的电商表。未聚簇时，查询 `WHERE category IN ('Electronics', 'Computers')` 必须扫描所有产品类别。通过按类别自动聚簇，Databend 持续将电子产品和计算机产品分组存储，仅扫描 2 个块而非 1000+ 个块。

## 自动聚簇的优势

**维护便捷性**：Databend 消除了以下需求：
- 监控聚簇表状态
- 手动触发重新聚簇操作
- 为聚簇分配计算资源
- 安排维护窗口

**工作原理**：定义聚簇键后，Databend 自动执行：
- 监控 DML 操作引起的表变更
- 评估表何时需要重新聚簇
- 执行后台聚簇优化
- 持续维护最优数据组织

您只需为每个表定义聚簇键（如适用），Databend 将自动管理所有后续维护工作。

## 工作原理

聚簇键根据指定列将数据组织到存储块（Parquet 文件）中：

![聚簇键可视化](/img/sql/clustered.png)

1. **数据组织** → 相似值分组到相邻块
2. **元数据创建** → 存储块值映射关系以便快速查找
3. **查询优化** → 查询时仅读取相关块
4. **性能提升** → 扫描行数减少，结果返回更快

## 快速设置

```sql
-- Create table with cluster key
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    region VARCHAR,
    amount DECIMAL
) CLUSTER BY (region);

-- Or add cluster key to existing table
ALTER TABLE sales CLUSTER BY (region, order_date);
```

## 选择正确的聚簇键

根据最常见查询过滤条件选择列：

| 查询模式 | 推荐聚簇键 | 示例 |
|---------------|------------------------|---------|
| 单列过滤 | 该列 | `CLUSTER BY (region)` |
| 多列过滤 | 多列组合 | `CLUSTER BY (region, category)` |
| 日期范围查询 | 日期/时间戳列 | `CLUSTER BY (order_date)` |
| 高基数列 | 使用表达式减少取值 | `CLUSTER BY (DATE(created_at))` |

### 良好与欠佳的聚簇键

| ✅ 良好选择 | ❌ 欠佳选择 |
|----------------|----------------|
| 高频过滤列 | 极少使用列 |
| 中等基数（100-10K 值） | 布尔列（取值过少） |
| 日期/时间列 | 唯一 ID 列（取值过多） |
| 区域/类别/状态列 | 随机或哈希列 |

## 性能监控

```sql
-- Check clustering effectiveness
SELECT * FROM clustering_information('database_name', 'table_name');

-- Key metrics to watch:
-- average_depth: 越低越好（< 2 为佳）
-- average_overlaps: 越低越好
-- block_depth_histogram: 深度 1-2 的块占比越高越好
```

## 何时重新聚簇

数据变更会导致表逐渐失序：

```sql
-- Check if re-clustering is needed
SELECT IF(average_depth > 2 * LEAST(GREATEST(total_block_count * 0.001, 1), 16),
          'Re-cluster needed',
          'Clustering is good')
FROM clustering_information('your_database', 'your_table');

-- Re-cluster the table
ALTER TABLE your_table RECLUSTER;
```

## 性能调优

### 自定义块大小
调整块大小优化性能：

```sql
-- Smaller blocks = fewer rows per query
ALTER TABLE sales SET OPTIONS(
    ROW_PER_BLOCK = 100000,
    BLOCK_SIZE_THRESHOLD = 52428800
);
```

### 自动重新聚簇
- `COPY INTO` 和 `REPLACE INTO` 自动触发重新聚簇
- 定期监控聚簇指标
- 当 `average_depth` 过高时执行重新聚簇

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **从简单开始** | 优先使用单列聚簇键 |
| **监控指标** | 定期检查 clustering_information |
| **性能测试** | 对比聚簇前后查询速度 |
| **定期重新聚簇** | 数据变更后维护聚簇状态 |
| **成本考量** | 聚簇会消耗计算资源 |

## 重要说明

:::tip
**适用场景：**
- 大表（百万+ 行）
- 查询性能低下
- 高频过滤查询
- 分析型工作负载

**不适用场景：**
- 小表
- 随机访问模式
- 高频变更数据
:::

---

*聚簇键在具有可预测过滤模式的大型高频查询表上效果最佳。建议从最常用的 WHERE 子句列开始实施。*