---
title: Databend 免拷贝数据共享 (Copy-Free Data Sharing) 工作原理
---

## 什么是数据共享 (Data Sharing)？

不同团队需要相同数据的不同部分。传统解决方案需要多次复制数据，不仅成本高昂，而且难以维护。

Databend 的 **[ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)** 命令优雅地解决了这一问题：它能为同一份数据创建多个“视图”，而无需进行数据复制。这得益于 Databend 真正的**存算分离 (compute-storage separation)** 架构。无论数据存储在云端还是本地对象存储 (Object Storage) 中，都能实现：**一次存储，随处访问**。

您可以将 ATTACH TABLE 理解为计算机中的快捷方式——它指向原始文件，但并不会复制文件本身。

```
                对象存储 (Object Storage) (S3, MinIO, Azure, 等)
                         ┌─────────────┐
                         │ Your Data   │
                         └──────┬──────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ Marketing   │         │  Finance    │         │   Sales     │
│ Team View   │         │ Team View   │         │ Team View   │
└─────────────┘         └─────────────┘         └─────────────┘
```

## 如何使用 ATTACH TABLE

**第 1 步：查找数据位置**
```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'company_sales');
-- 结果: 1/23351/_ss/... → 数据位于 s3://your-bucket/1/23351/
```

**第 2 步：创建团队专属视图**
```sql
-- 营销：客户行为分析
ATTACH TABLE marketing_view (customer_id, product, amount, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- 财务：收入跟踪
ATTACH TABLE finance_view (order_id, amount, profit, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- 人力资源：不包含薪资的员工信息
ATTACH TABLE hr_employees (employee_id, name, department) 
's3://data/1/23351/' CONNECTION = (...);

-- 开发：不包含敏感数据的生产结构
ATTACH TABLE dev_customers (customer_id, country, created_date) 
's3://data/1/23351/' CONNECTION = (...);
```

**第 3 步：独立查询 (Query)**
```sql
-- 营销分析趋势
SELECT product, COUNT(*) FROM marketing_view GROUP BY product;

-- 财务跟踪利润
SELECT order_date, SUM(profit) FROM finance_view GROUP BY order_date;
```

## 主要优势

**实时更新**：源数据变更时，所有挂载表都能即时感知。
```sql
INSERT INTO company_sales VALUES (1001, 501, 'Laptop', 1299.99, 299.99, 'user@email.com', '2025-01-20');
SELECT COUNT(*) FROM marketing_view WHERE order_date = '2024-01-20'; -- 返回: 1
```

**列级安全性**：各团队只能看到其所需的数据——营销团队无法看到利润，财务团队无法看到客户邮箱。

**强一致性**：永远不会读取到部分更新的数据，确保看到的是完整的快照 (Snapshot)——完美适用于财务报告和合规性场景。

**完整性能**：所有索引 (Index) 均可自动生效，查询速度与常规表无异。

## 为什么这很重要

| 传统方法 | Databend ATTACH TABLE |
|---------------------|----------------------|
| 多份数据副本 | 单份副本，多方共享 |
| ETL 延迟和同步问题 | 实时同步，永远最新 |
| 维护复杂 | 零维护 |
| 副本越多，安全风险越高 | 细粒度的列级别访问控制 |
| 因数据移动导致性能下降 | 基于原始数据实现全面优化 |

## 底层工作原理

```
查询 (Query): SELECT product, SUM(amount) FROM marketing_view GROUP BY product

┌─────────────────────────────────────────────────────────────────┐
│                    查询执行流程                                   │
└─────────────────────────────────────────────────────────────────┘

    用户查询
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 1. 读取快照元数据 │───►│ s3://bucket/1/23351/_ss/            │
│    (Snapshot Metadata)│    │ 获取当前表状态                       │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 2. 应用列过滤器   │───►│ 过滤器: customer_id, product,       │
│                   │    │         amount, order_date          │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 3. 检查统计信息与 │───►│ • Segment 的 min/max 值             │
│    索引           │    │ • 布隆过滤器 (Bloom filters)        │
└───────────────────┘    │ • 聚合索引 (Aggregate indexes)      │
        │                └─────────────────────────────────────┘
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 4. 智能数据获取   │───►│ 跳过不相关的数据块                   │
│                   │    │ 仅从 _b/ 下载所需数据               │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 5. 本地执行       │───►│ 全面的优化与并行处理                 │
│                   │    │ 利用所有可用索引进行处理             │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
    结果: 产品销售摘要
```

多个 Databend 集群可以同时执行此流程而无需相互协调——这正是存算分离架构的实际体现。

ATTACH TABLE 代表了一种根本性的转变：**从“为每个用例复制一份数据”转变为“一份数据，多个视图”**。无论是在云端还是本地环境中，Databend 的架构都能够实现强大、高效的数据共享，同时保持企业级的一致性和安全性。