---
title: Cluster Key
---

# 集群键：查询加速的自动数据组织

集群键提供自动数据组织功能，可显著提升大表的查询性能。Databend 在后台无缝且持续地管理所有聚簇操作——您只需定义集群键，其余工作由 Databend 自动处理。

## 解决哪些问题？

缺乏合理组织的大表会引发显著的性能和维护挑战：

| 问题 | 影响 | 自动聚簇解决方案 |
|---------|--------|------------------------------|
| **全表扫描** | 查询需扫描全表才能获取过滤数据 | 自动组织数据，仅读取相关数据块 |
| **随机数据访问** | 相似数据分散存储 | 持续将相关数据归组 |
| **慢速过滤查询** | WHERE 子句扫描无关行 | 自动跳过无关数据块 |
| **高 I/O 成本** | 读取大量未使用数据 | 自动最小化数据传输量 |
| **手动维护** | 需监控并手动重聚簇表 | 零维护——后台自动优化 |
| **资源管理** | 需为聚簇操作分配计算资源 | Databend 自动管理所有聚簇资源 |

**示例**：含数百万产品的电商表。未聚簇时，查询 `WHERE category IN ('Electronics', 'Computers')` 需扫描所有产品类别。通过按类别自动聚簇，Databend 持续将电子产品与计算机类产品归组，仅扫描 2 个数据块而非 1000+ 个块。

## 自动聚簇优势

**维护便捷**：Databend 免除了以下需求：
- 监控聚簇表状态
- 手动触发重聚簇操作
- 分配聚簇计算资源
- 安排维护窗口

**工作原理**：定义集群键后，Databend 自动执行：
- 监控 DML 操作引起的表变更
- 评估表何时需重聚簇
- 执行后台聚簇优化
- 持续维护最优数据组织

您只需为表定义聚簇键（如适用），Databend 将自动处理后续所有维护工作。

## 工作原理

集群键根据指定列将数据组织到存储块（Parquet 文件）中：

![Cluster Key Visualization](/img/sql/clustered.png)

1. **数据组织** → 相似值归入相邻块
2. **元数据创建** → 存储块值映射关系以便快速查找
3. **查询优化** → 查询时仅读取相关块
4. **性能提升** → 扫描行数减少，结果返回更快

## 快速设置

```sql
-- 创建含集群键的表
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    region VARCHAR,
    amount DECIMAL
) CLUSTER BY (region);

-- 为现有表添加集群键
ALTER TABLE sales CLUSTER BY (region, order_date);
```

## 选择合适集群键

根据常用查询过滤条件选择列：

| 查询模式 | 推荐集群键 | 示例 |
|---------------|------------------------|---------|
| 单列过滤 | 该列 | `CLUSTER BY (region)` |
| 多列过滤 | 多列组合 | `CLUSTER BY (region, category)` |
| 日期范围查询 | 日期/时间戳列 | `CLUSTER BY (order_date)` |
| 高基数列 | 使用表达式降维 | `CLUSTER BY (DATE(created_at))` |

### 集群键选择指南

| ✅ 推荐选择 | ❌ 不推荐选择 |
|----------------|----------------|
| 高频过滤列 | 低频使用列 |
| 中基数（100-10K 值） | 布尔列（取值过少） |
| 日期/时间列 | 唯一 ID 列（取值过多） |
| 区域/类别/状态列 | 随机或哈希列 |

## 性能监控

```sql
-- 检查聚簇效果
SELECT * FROM clustering_information('database_name', 'table_name');

-- 关键监控指标：
-- average_depth：值越低越好（<2 为优）
-- average_overlaps：值越低越好
-- block_depth_histogram：深度 1-2 的块占比越高越好
```

## 重聚簇时机

数据变更会导致表逐渐失序：

```sql
-- 检查是否需要重聚簇
SELECT IF(average_depth > 2 * LEAST(GREATEST(total_block_count * 0.001, 1), 16),
          'Re-cluster needed',
          'Clustering is good')
FROM clustering_information('your_database', 'your_table');

-- 执行重聚簇
ALTER TABLE your_table RECLUSTER;
```

## 性能调优

### 自定义块大小
调整块大小优化性能：

```sql
-- 小数据块 = 单次查询处理行数更少
ALTER TABLE sales SET OPTIONS(
    ROW_PER_BLOCK = 100000,
    BLOCK_SIZE_THRESHOLD = 52428800
);
```

### 自动重聚簇
- `COPY INTO` 和 `REPLACE INTO` 自动触发重聚簇
- 定期监控聚簇指标
- 当 `average_depth` 过高时执行重聚簇

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **从简开始** | 优先使用单列集群键 |
| **监控指标** | 定期检查 clustering_information |
| **性能测试** | 对比聚簇前后查询速度 |
| **定期重聚簇** | 数据变更后维持聚簇状态 |
| **成本考量** | 聚簇消耗计算资源 |

## 重要说明

:::tip
**适用场景：**
- 大表（百万+行）
- 查询性能低下
- 高频过滤查询
- 分析型工作负载

**不适用场景：**
- 小表
- 随机访问模式
- 高频变更数据
:::

---

*集群键在具有可预测过滤模式的大型高频查询表上效果最佳。建议从最常用 WHERE 子句列开始实施。*