---
title: 连接（Connection）
---

## 什么是连接？

Databend 中的连接指一种预定义配置，用于封装与外部存储服务交互所需的详细信息。它提供一组集中管理的可重用参数（如访问凭证、端点 URL 和存储类型），简化 Databend 与各类存储服务的集成流程。

连接可用于创建外部阶段、外部表及附加表，通过模块化方式统一管理 Databend 对外部存储服务的数据访问操作。

## 连接管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE CONNECTION](create-connection.md) | 创建访问外部存储服务的新连接 |
| [DROP CONNECTION](drop-connection.md) | 删除现有连接 |

## 连接信息

| 命令 | 描述 |
|---------|-------------|
| [DESCRIBE CONNECTION](desc-connection.md) | 显示指定连接的详细信息 |
| [SHOW CONNECTIONS](show-connections.md) | 列出当前数据库所有连接 |

### 使用示例

本节示例首先创建包含 Amazon S3 访问凭证的连接，随后使用该连接创建外部阶段并附加数据表。

此语句创建名为 toronto 的 Amazon S3 连接，包含必要参数：

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>' 
    ACCESS_KEY_ID = '<your-access-key-id>';
```

#### 示例 1：通过连接创建外部阶段

使用已定义的 toronto 连接创建外部阶段：

```sql
CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');


-- 等效于未使用连接的语句：

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (
        SECRET_ACCESS_KEY = '<your-secret-access-key>' 
        ACCESS_KEY_ID = '<your-access-key-id>'
    );
```

#### 示例 2：通过连接附加表

[ATTACH TABLE](../01-table/92-attach-table.md) 页面的[示例](../01-table/92-attach-table.md#examples)演示了如何将 Databend Cloud 新表连接到 Databend 现有表（数据存储在 Amazon S3 存储桶 "databend-toronto" 中）。各示例的步骤 3 均可通过 toronto 连接简化：

```sql title='Databend Cloud:'
ATTACH TABLE employees_backup 
    's3://databend-toronto/1/216/' 
    CONNECTION = (CONNECTION_NAME = 'toronto');
```

```sql title='Databend Cloud:'
ATTACH TABLE population_readonly 
    's3://databend-toronto/1/556/' 
    CONNECTION = (CONNECTION_NAME = 'toronto') 
    READ_ONLY;
```

#### 示例 3：通过连接创建外部表

使用 toronto 连接创建名为 BOOKS 的外部表：

```sql
CREATE TABLE BOOKS (
    id BIGINT UNSIGNED,
    title VARCHAR,
    genre VARCHAR DEFAULT 'General'
) 
's3://databend-toronto' 
CONNECTION = (CONNECTION_NAME = 'toronto');
```