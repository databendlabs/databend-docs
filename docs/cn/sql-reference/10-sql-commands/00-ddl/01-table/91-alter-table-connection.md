---
title: ALTER TABLE CONNECTION
sidebar_position: 6
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于： v1.2.750"/>

更新外部表的连接设置。

## 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> CONNECTION = ( connection_name = '<connection_name>' )
```

| 参数 | 描述 | 必需 |
|-----------|-------------|----------|
| connection_name | 外部表使用的连接名称。该连接必须在系统中已存在。 | 是 |

## 使用说明

使用 ALTER TABLE CONNECTION 命令时，仅可修改与凭证相关的设置，包括 `access_key_id`、`secret_access_key` 和 `role_arn`。其他连接参数（如 `bucket`、`region` 或 `root`）的更改将被忽略。

此命令在需要轮换凭证或 IAM 角色变更时特别有用。指定的连接必须在系统中已存在，才能使用此命令。

## 安全最佳实践

使用外部表时，AWS IAM 角色相比访问密钥具有显著的安全优势：

- **无存储凭证**：无需在配置中存储访问密钥
- **自动轮换**：自动处理凭证轮换
- **细粒度控制**：允许更精确的访问控制

要在 Databend Cloud 中使用 IAM 角色，请参阅[使用 AWS IAM 角色创建外部阶段](/guides/load-data/stage/aws-iam-role)获取指导。

## 示例

### 更新外部表的连接

此示例创建一个带有初始连接的外部表，然后更新为使用不同的连接：

```sql
-- 创建两个具有不同凭证的连接
CREATE CONNECTION external_table_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE CONNECTION external_table_conn_new
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-new-access-key-id>'
    SECRET_ACCESS_KEY = '<your-new-secret-access-key>';

-- 使用第一个连接创建外部表
CREATE OR REPLACE TABLE external_table_test (
    id INTEGER,
    name VARCHAR,
    age INT
) 
's3://testbucket/13_fuse_external_table/' 
CONNECTION=(connection_name = 'external_table_conn');

-- 更新表以使用具有轮换凭证的新连接
ALTER TABLE external_table_test CONNECTION=( connection_name = 'external_table_conn_new' );
```

### 使用 IAM 角色更新外部表连接

此示例演示如何从访问密钥身份验证迁移到 IAM 角色身份验证：

```sql
-- 使用访问密钥身份验证创建外部表
CREATE CONNECTION s3_access_key_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE TABLE sales_data (
    order_id INTEGER,
    product_name VARCHAR,
    quantity INT
) 
's3://sales-bucket/data/' 
CONNECTION=(connection_name = 's3_access_key_conn');

-- 稍后，使用 IAM 角色身份验证创建新连接
CREATE CONNECTION s3_role_conn
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-access';

-- 更新表以使用 IAM 角色连接
ALTER TABLE sales_data CONNECTION=( connection_name = 's3_role_conn' );
```