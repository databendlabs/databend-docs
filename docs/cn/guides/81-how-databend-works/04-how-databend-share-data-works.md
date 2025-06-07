---
title: Databend 免拷贝数据共享（Data Sharing）工作原理
---

## 什么是数据共享（Data Sharing）？

不同团队需要相同数据的不同部分。传统解决方案会多次复制数据，成本高昂且难以维护。

Databend 的 **[ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)** 优雅地解决了这一问题：无需复制数据即可创建多个“视图”。这得益于 Databend 的**真正计算存储分离（Compute-Storage Separation）**架构——无论使用云存储还是本地对象存储，都能实现**存储一次，随处访问**。

ATTACH TABLE 类似于计算机快捷方式：指向原始文件而无需复制。

```
                对象存储（S3, MinIO, Azure 等）
                         ┌─────────────┐
                         │   您的数据   │
                         └──────┬──────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   营销团队   │         │   财务团队   │         │   销售团队   │
│    视图     │         │    视图     │         │    视图     │
└─────────────┘         └─────────────┘         └─────────────┘
```

## 如何使用 ATTACH TABLE

**步骤 1：定位数据位置**
```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'company_sales');
-- 结果：1/23351/_ss/... → 数据位于 s3://your-bucket/1/23351/
```

**步骤 2：创建团队专属视图**
```sql
-- 营销：客户行为分析
ATTACH TABLE marketing_view (customer_id, product, amount, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- 财务：收入跟踪
ATTACH TABLE finance_view (order_id, amount, profit, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- 人力资源：员工信息（不含薪资）
ATTACH TABLE hr_employees (employee_id, name, department) 
's3://data/1/23351/' CONNECTION = (...);

-- 开发：生产结构（不含敏感数据）
ATTACH TABLE dev_customers (customer_id, country, created_date) 
's3://data/1/23351/' CONNECTION = (...);
```

**步骤 3：独立查询**
```sql
-- 营销分析趋势
SELECT product, COUNT(*) FROM marketing_view GROUP BY product;

-- 财务跟踪利润
SELECT order_date, SUM(profit) FROM finance_view GROUP BY order_date;
```

## 主要优势

**实时更新（Real-Time Updates）**：源数据变更时，所有附加表即时可见
```sql
INSERT INTO company_sales VALUES (1001, 501, 'Laptop', 1299.99, 299.99, 'user@email.com', '2025-01-20');
SELECT COUNT(*) FROM marketing_view WHERE order_date = '2024-01-20'; -- 返回： 1
```

**列级安全性（Column-Level Security）**：团队仅见所需字段——营销不可见利润，财务不可见客户邮箱

**强一致性（Strong Consistency）**：永不读取部分更新，始终获取完整快照，完美适用于财务报告与合规场景

**完整性能（Full Performance）**：所有索引自动生效，速度与常规表一致

## 为什么这很重要

| 传统方法 | Databend ATTACH TABLE |
|---------|----------------------|
| 多个数据副本 | 所有人共享单个副本 |
| ETL 延迟与同步问题 | 实时更新，始终最新 |
| 维护复杂 | 零维护 |
| 副本越多，安全风险越高 | 细粒度列访问控制 |
| 因数据迁移导致性能下降 | 基于原始数据的完整优化 |

## 底层工作原理

```
查询：SELECT product, SUM(amount) FROM marketing_view GROUP BY product

┌─────────────────────────────────────────────────────────────────┐
│                      查询执行流程                                │
└─────────────────────────────────────────────────────────────────┘

    用户查询
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 1. 读取快照元数据   │───►│ s3://bucket/1/23351/_ss/            │
│                   │    │ 获取当前表状态                       │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 2. 应用列过滤器     │───►│ 过滤字段：customer_id, product,     │
│                   │    │         amount, order_date          │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 3. 检查统计信息     │───►│ • 段最小/最大值                     │
│ 与索引            │    │ • 布隆过滤器                        │
└───────────────────┘    │ • 聚合索引                         │
        │                └─────────────────────────────────────┘
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 4. 智能数据获取     │───►│ 跳过无关数据块                     │
│                   │    │ 仅从 _b/ 下载所需数据               │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 5. 本地执行        │───►│ 完整优化与并行处理                   │
│                   │    │ 利用所有可用索引处理                 │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
    结果：产品销售摘要
```

多个 Databend 集群可同时执行此流程而无需协调——真正计算存储分离的实际体现。

ATTACH TABLE 代表根本性变革：**从为每个用例复制数据，转向单一副本多视图共享**。无论在云端还是本地环境，Databend 架构均能实现高效强大的数据共享（Data Sharing），同时保障企业级一致性与安全性。