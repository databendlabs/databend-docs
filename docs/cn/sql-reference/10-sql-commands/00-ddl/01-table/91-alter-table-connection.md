```markdown
---
title: ALTER TABLE CONNECTION
sidebar_position: 6
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.750"/>

更新外部表的连接设置。

## 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> CONNECTION = ( connection_name = '<connection_name>' )
```

| 参数 | 描述 | 必需 |
|-----------|-------------|----------|
| connection_name | 用于外部表的连接名称。该连接必须已在系统中存在。 | 是 |

## 使用说明

使用 ALTER TABLE CONNECTION 命令时，只能修改与凭据相关的设置，包括 `access_key_id`、`secret_access_key` 和 `role_arn`。修改其他连接参数（如 `bucket`、`region` 或 `root`）将不会生效。

该命令特别适用于凭据轮换或 IAM 角色变更的场景。执行前，指定的连接必须已在系统中存在。

## 安全最佳实践

使用外部表时，AWS IAM 角色相比访问密钥具有显著安全优势：

- **无需存储凭据**：避免在配置中存储访问密钥
- **自动轮换**：自动处理凭据轮换
- **细粒度控制**：支持更精细的访问控制

要在 Databend Cloud 中使用 IAM 角色，请参阅[使用 AWS IAM 角色创建外部阶段](/guides/load-data/stage/aws-iam-role)获取操作指南。

## 示例

### 更新外部表的连接

此示例先创建使用初始连接的外部表，再更新为使用新连接：

```sql
-- 创建两个包含不同凭据的连接
CREATE CONNECTION external_table_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE CONNECTION external_table_conn_new
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-new-access-key-id>'
    SECRET_ACCESS_KEY = '<your-new-secret-access-key>';

-- 使用初始连接创建外部表
CREATE OR REPLACE TABLE external_table_test (
    id INT,
    name VARCHAR,
    age INT
) 
's3://testbucket/13_fuse_external_table/' 
CONNECTION=(connection_name = 'external_table_conn');

-- 更新表以使用包含轮换凭据的新连接
ALTER TABLE external_table_test CONNECTION=( connection_name = 'external_table_conn_new' );
```

### 使用 IAM 角色更新外部表连接

此示例演示从访问密钥认证迁移至 IAM 角色认证：

```sql
-- 创建使用访问密钥认证的外部表
CREATE CONNECTION s3_access_key_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE TABLE sales_data (
    order_id INT,
    product_name VARCHAR,
    quantity INT
) 
's3://sales-bucket/data/' 
CONNECTION=(connection_name = 's3_access_key_conn');

-- 随后创建使用 IAM 角色认证的新连接
CREATE CONNECTION s3_role_conn
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-access';

-- 更新表以改用 IAM 角色连接
ALTER TABLE sales_data CONNECTION=( connection_name = 's3_role_conn' );
```