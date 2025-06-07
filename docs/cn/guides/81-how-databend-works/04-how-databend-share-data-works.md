---
title: Databend 免拷贝数据共享（Data Sharing）工作原理
---

## 什么是数据共享？

不同团队需要相同数据的不同部分。传统解决方案需要多次复制数据，导致成本高昂且难以维护。

Databend 的 **[ATTACH TABLE](/sql/sql-commands/ddl/table/attach-table)** 优雅地解决了这一问题：为相同数据创建多个“视图”而无需复制。这利用了 Databend 的**真正计算存储分离**架构——无论使用云存储还是本地对象存储，都能实现**存储一次，随处访问**。

可以将 ATTACH TABLE 类比为计算机快捷方式——它指向原始文件而不复制文件。

```
                Object Storage (S3, MinIO, Azure, etc.)
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

**步骤 1：查找数据位置**
```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'company_sales');
-- Result: 1/23351/_ss/... → Data at s3://your-bucket/1/23351/
```

**步骤 2：创建团队特定视图**
```sql
-- Marketing: Customer behavior analysis
ATTACH TABLE marketing_view (customer_id, product, amount, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- Finance: Revenue tracking
ATTACH TABLE finance_view (order_id, amount, profit, order_date) 
's3://your-bucket/1/23351/' CONNECTION = (ACCESS_KEY_ID = 'xxx', SECRET_ACCESS_KEY = 'yyy');

-- HR: Employee info without salaries
ATTACH TABLE hr_employees (employee_id, name, department) 
's3://data/1/23351/' CONNECTION = (...);

-- Development: Production structure without sensitive data
ATTACH TABLE dev_customers (customer_id, country, created_date) 
's3://data/1/23351/' CONNECTION = (...);
```

**步骤 3：独立查询**
```sql
-- Marketing analyzes trends
SELECT product, COUNT(*) FROM marketing_view GROUP BY product;

-- Finance tracks profit
SELECT order_date, SUM(profit) FROM finance_view GROUP BY order_date;
```

## 主要优势

**实时更新**：当源数据发生变化时，所有附加表都能立即看到更新。
```sql
INSERT INTO company_sales VALUES (1001, 501, 'Laptop', 1299.99, 299.99, 'user@email.com', '2024-01-20');
SELECT COUNT(*) FROM marketing_view WHERE order_date = '2024-01-20'; -- Returns: 1
```

**列级安全**：团队只能看到各自需要的内容——营销团队无法看到利润，财务团队无法看到客户邮箱。

**强一致性**：永远不会读取部分更新，始终访问完整快照——非常适合财务报告和合规要求。

**完整性能**：所有索引（Index）自动生效，与常规表速度相同。

## 为什么这很重要

| 传统方法 | Databend ATTACH TABLE |
|---------|----------------------|
| 多个数据副本 | 所有人共享单个副本 |
| ETL 延迟，同步问题 | 实时，始终最新 |
| 复杂维护 | 零维护 |
| 更多副本 = 更多安全风险 | 细粒度列访问 |
| 由于数据移动而变慢 | 对原始数据进行完整优化 |

## 底层工作原理

```
Query: SELECT product, SUM(amount) FROM marketing_view GROUP BY product

┌─────────────────────────────────────────────────────────────────┐
│                    查询执行流程                                   │
└─────────────────────────────────────────────────────────────────┘

    用户查询
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 1. 读取快照       │───►│ s3://bucket/1/23351/_ss/            │
│    元数据         │    │ 获取当前表状态                       │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 2. 应用列         │───►│ 过滤器：customer_id, product,       │
│    过滤器         │    │         amount, order_date          │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 3. 检查统计信息   │───►│ • 段最小/最大值                     │
│    和索引         │    │ • 布隆过滤器                        │
└───────────────────┘    │ • 聚合索引                          │
        │                └─────────────────────────────────────┘
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 4. 智能数据       │───►│ 跳过无关块                          │
│    获取           │    │ 仅从 _b/ 下载所需数据               │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
┌───────────────────┐    ┌─────────────────────────────────────┐
│ 5. 本地           │───►│ 完整优化和并行处理                   │
│    执行           │    │ 使用所有可用索引进行处理             │
└───────────────────┘    └─────────────────────────────────────┘
        │
        ▼
    结果：产品销售摘要
```

多个 Databend 集群可以同时执行此流程而无需协调——这是真正计算存储分离的实际体现。

ATTACH TABLE 代表了一个根本性转变：**从为每个用例复制数据转变为单一副本支持多个视图**。无论在云环境还是本地环境中，Databend 的架构都能实现强大、高效的数据共享，同时保持企业级一致性和安全性。