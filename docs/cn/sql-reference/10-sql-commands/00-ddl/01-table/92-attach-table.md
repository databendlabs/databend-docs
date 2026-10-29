---
title: ATTACH TABLE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ATTACH TABLE'/>

ATTACH TABLE 创建指向现有表数据的只读链接而无需复制数据，特别适用于跨环境数据共享，尤其是从私有部署的 Databend 迁移至 [Databend Cloud](https://www.databend.cn)。

## 核心功能

- **零拷贝 (Zero-Copy) 数据访问**：链接源数据而无需物理移动
- **实时更新**：源表变更即时反映在附加表中
- **只读模式**：仅支持 SELECT 查询（禁止 INSERT/UPDATE/DELETE）
- **列级 (Column-Level) 访问**：可选包含特定列以提升安全性与性能

## 访问控制要求

从 v1.2.953 开始，附加表既需要满足原有的 `CREATE` 权限要求，也需要在目标数据库级或全局拥有显式的 `ATTACH TABLE` 权限。

- 在 `db_name.*` 或 `*.*` 上授予 `ATTACH TABLE`。不支持表级授权。
- `CREATE`、`SUPER` 和数据库所有权均不包含 `ATTACH TABLE` 权限。内置角色 `account_admin` 包含该权限。
- 数据库级或全局的 `ALL` 包含 `ATTACH TABLE` 权限。
- 使用 `STORAGE_PREFIX` 的 `CREATE TABLE` 也执行相同的权限检查。
- 不使用 `STORAGE_PREFIX` 的普通建表操作不需要 `ATTACH TABLE` 权限。

升级后，请向需要附加表的角色授予 `ATTACH TABLE` 权限。例如，管理员可以创建一个角色，并授予其在 `default` 数据库中所需的两项权限：

```sql
CREATE ROLE attach_reader;
GRANT CREATE ON default.* TO ROLE attach_reader;
GRANT ATTACH TABLE ON default.* TO ROLE attach_reader;
```

将该角色授予需要附加表的用户。仅有 `ATTACH TABLE` 权限不能满足 `CREATE` 权限检查。

参见 [GRANT](../02-user/10-grant.md#授予-attach-table-权限) 和[权限](/guides/security/access-control/privileges)。

## 语法

```sql
ATTACH TABLE <target_table_name> [ ( <column_list> ) ] '<source_table_data_URI>'
CONNECTION = ( CONNECTION_NAME = '<connection_name>' )
```

### 参数

- **`<target_table_name>`**：新建附加表的名称

- **`<column_list>`**：可选列清单（从源表选择）

  - 缺省时包含所有列
  - 提供列级安全与访问控制
  - 示例：`(customer_id, product, amount)`

- **`<source_table_data_URI>`**：对象存储中的源表数据路径

  - 格式：`s3://<bucket-name>/<database_ID>/<table_ID>/`
  - 示例：`s3://databend-toronto/1/23351/`

- **`CONNECTION_NAME`**：引用 [CREATE CONNECTION](../13-connection/create-connection.md) 创建的连接

### 获取源表路径

通过 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数获取数据库/表 ID：

```sql
SELECT snapshot_location FROM FUSE_SNAPSHOT('default', 'employees');
-- 结果示例：1/23351/_ss/... → 对应路径 s3://your-bucket/1/23351/
```

## 数据共享优势

### 工作原理

```
                对象存储（S3/MinIO/Azure 等）
                         ┌─────────────┐
                         │    源数据   │
                         └──────┬──────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ 市场团队视图 │         │ 财务团队视图 │         │ 销售团队视图 │
└─────────────┘         └─────────────┘         └─────────────┘
```

### 核心优势

| 传统方法             | Databend ATTACH TABLE |
| -------------------- | --------------------- |
| 多份数据副本         | 单副本全局共享        |
| ETL 延迟与同步问题   | 实时更新永不滞后      |
| 复杂维护流程         | 零维护成本            |
| 副本增加安全风险     | 细粒度列级访问        |
| 数据移动导致性能下降 | 基于原始数据全面优化  |

### 安全与性能

- **列级安全**：团队仅见所需列
- **实时更新**：源表变更全局即时可见
- **强一致性 (Strong Consistency)**：始终获取完整数据快照
- **完整性能**：继承源表所有索引与优化

## 示例

### 基础用法

```sql
-- 1. 创建存储连接
CREATE CONNECTION my_s3_connection
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your_aws_key_id>'
    SECRET_ACCESS_KEY = '<your_aws_secret_key>';

-- 2. 附加全列数据表
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/'
    CONNECTION = (CONNECTION_NAME = 'my_s3_connection');
```

### 安全列筛选

```sql
-- 附加选定列保障数据安全
ATTACH TABLE population_selected (city, population) 's3://databend-doc/1/16/'
    CONNECTION = (CONNECTION_NAME = 'my_s3_connection');
```

### IAM 角色认证

```sql
-- 创建 IAM 角色连接（比密钥更安全）
CREATE CONNECTION s3_role_connection
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-role';

-- 通过 IAM 角色附加表
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/'
    CONNECTION = (CONNECTION_NAME = 's3_role_connection');
```

### 团队专属视图

```sql
-- 市场分析视图
ATTACH TABLE marketing_view (customer_id, product, amount, order_date)
's3://your-bucket/1/23351/'
CONNECTION = (CONNECTION_NAME = 'my_s3_connection');

-- 财务分析视图（不同列）
ATTACH TABLE finance_view (order_id, amount, profit, order_date)
's3://your-bucket/1/23351/'
CONNECTION = (CONNECTION_NAME = 'my_s3_connection');
```

## 扩展阅读

- [使用 ATTACH TABLE 链接表](/tutorials/cloud-ops/link-tables)
