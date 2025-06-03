---
title: Cluster Key
---

# Cluster Key：自动数据组织加速查询

Cluster Key 提供自动数据组织功能，显著提升大表的查询性能。Databend 在后台无缝持续管理所有聚类操作——您只需定义 cluster key，Databend 会处理后续所有工作。

## 解决的核心问题

缺乏合理组织的大表会带来显著的性能和维护挑战：

| 问题 | 影响 | 自动聚类解决方案 |
|---------|--------|------------------------------|
| **全表扫描** | 查询过滤时仍需读取全表 | 自动组织数据，仅读取相关块 |
| **随机数据访问** | 相似数据分散存储 | 持续聚合相关数据 |
| **过滤查询缓慢** | WHERE 子句扫描冗余行 | 自动跳过无关数据块 |
| **高 I/O 成本** | 读取大量未使用数据 | 自动最小化数据传输量 |
| **手动维护** | 需监控并手动重聚类 | 零维护——自动后台优化 |
| **资源管理** | 需分配聚类计算资源 | Databend 自动管理所有资源 |

**示例**：含百万级产品的电商表。未聚类时，查询 `WHERE category IN ('Electronics', 'Computers')` 需扫描所有类别。通过按类别自动聚类，Databend 持续聚合电子产品与计算机类商品，仅扫描 2 个数据块而非 1000+ 个。

## 自动聚类优势

**维护便捷**：Databend 无需：
- 监控聚类表状态
- 手动触发重聚类
- 分配专用计算资源
- 安排维护窗口

**工作原理**：定义 cluster key 后，Databend 自动：
- 监控 DML 操作引起的表变更
- 评估重聚类时机
- 执行后台聚类优化
- 持续维护最优数据组织

您只需为表定义聚类键（如适用），Databend 将自动处理后续所有维护。

## 技术原理

Cluster Key 根据指定列将数据组织至存储块（Parquet 文件）：

![Cluster Key Visualization](/img/sql/clustered.png)

1. **数据组织** → 相似值聚合至相邻块
2. **元数据创建** → 建立块值映射便于快速检索
3. **查询优化** → 仅读取相关数据块
4. **性能提升** → 减少扫描行数，加速结果返回

## 快速配置

```sql
-- 创建含 cluster key 的表
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    region VARCHAR,
    amount DECIMAL
) CLUSTER BY (region);

-- 为现有表添加 cluster key
ALTER TABLE sales CLUSTER BY (region, order_date);
```

## Cluster Key 选型指南

根据高频查询条件选择列：

| 查询模式 | 推荐 Cluster Key | 示例 |
|---------------|------------------------|---------|
| 单列过滤 | 该列 | `CLUSTER BY (region)` |
| 多列过滤 | 多列组合 | `CLUSTER BY (region, category)` |
| 日期范围查询 | 日期/时间戳列 | `CLUSTER BY (order_date)` |
| 高基数列 | 使用表达式降维 | `CLUSTER BY (DATE(created_at))` |

### 优劣 Cluster Key 对比

| ✅ 优选方案 | ❌ 次选方案 |
|----------------|----------------|
| 高频过滤列 | 低频使用列 |
| 中基数 (100-10K 值) | 布尔列 (取值过少) |
| 日期/时间列 | 唯一 ID 列 (取值过多) |
| 区域/类别/状态列 | 随机或哈希列 |

## 性能监控

```sql
-- 检查聚类效果
SELECT * FROM clustering_information('database_name', 'table_name');

-- 关键监控指标：
-- average_depth: 值越低越好 (<2 为佳)
-- average_overlaps: 值越低越好
-- block_depth_histogram: 深度 1-2 的块占比越高越好
```

## 重聚类时机

数据变更会导致表逐渐失序：

```sql
-- 检查重聚类需求
SELECT IF(average_depth > 2 * LEAST(GREATEST(total_block_count * 0.001, 1), 16),
          'Re-cluster needed',
          'Clustering is good')
FROM clustering_information('your_database', 'your_table');

-- 执行重聚类
ALTER TABLE your_table RECLUSTER;
```

## 性能调优

### 自定义块大小
调整块大小优化性能：

```sql
-- 较小块 = 单次查询处理行数更少
ALTER TABLE sales SET OPTIONS(
    ROW_PER_BLOCK = 100000,
    BLOCK_SIZE_THRESHOLD = 52428800
);
```

### 自动重聚类
- `COPY INTO` 与 `REPLACE INTO` 自动触发重聚类
- 定期监控聚类指标
- `average_depth` 过高时执行重聚类

## 最佳实践

| 实践方案 | 核心价值 |
|----------|---------|
| **简单起步** | 优先使用单列 cluster key |
| **指标监控** | 定期检查 clustering_information |
| **性能测试** | 对比聚类前后查询速度 |
| **定期重聚类** | 数据变更后维护聚类状态 |
| **成本考量** | 聚类消耗计算资源 |

## 重要说明

:::tip
**适用场景：**
- 大表 (百万+ 行)
- 查询性能低下
- 高频过滤查询
- 分析型工作负载

**不适用场景：**
- 小表
- 随机访问模式
- 高频变更数据
:::

---

*Cluster Key 在具有可预测过滤模式的大型高频查询表上效果最佳。建议从最常用的 WHERE 子句列开始实施。*