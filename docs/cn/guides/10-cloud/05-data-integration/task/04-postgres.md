---
title: PostgreSQL 集成任务
slug: /cloud/data-integration/postgres
---

本页介绍如何创建 PostgreSQL 集成任务，将数据从 PostgreSQL 数据库同步到 Databend。PostgreSQL 任务支持全量 `Snapshot` 加载、持续 `变更数据捕获（CDC）`，或两者的组合。

如需先创建可复用的 PostgreSQL 连接配置，请参阅 [PostgreSQL - 连接凭证](../datasource/04-postgres.md)。

## 同步模式

| 同步模式 | 说明 |
|----------|------|
| Snapshot | 对源表执行一次性全量数据加载。适用于初始数据迁移或定期批量导入。 |
| CDC Only | 通过 PostgreSQL 逻辑复制持续捕获实时变更（插入、更新、删除）。需要主键用于合并操作。 |
| Snapshot + CDC | 先执行全量快照，然后无缝过渡到持续 CDC。推荐用于大多数场景。 |

## 前置条件

在设置 PostgreSQL 数据集成之前，请确保您的 PostgreSQL 实例满足以下要求：

- 已创建 **PostgreSQL - 连接凭证** 数据源
- 目标 PostgreSQL 实例可从 Databend Cloud 访问
- PostgreSQL 版本 10 或更高

### 启用逻辑复制

CDC 和 Snapshot + CDC 模式需要将 PostgreSQL WAL（预写日志）配置为 logical 级别：

```ini title='postgresql.conf'
wal_level = logical
max_replication_slots = 4
max_wal_senders = 4
```

修改配置后，需要重启 PostgreSQL 使更改生效。

### 创建专用用户（推荐）

创建具有数据复制所需权限的 PostgreSQL 用户：

```sql
CREATE USER databend_cdc WITH PASSWORD 'your_password' REPLICATION;
GRANT CONNECT ON DATABASE your_database TO databend_cdc;
GRANT USAGE ON SCHEMA public TO databend_cdc;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO databend_cdc;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO databend_cdc;
```

### 创建 Publication 和复制槽（CDC 必需）

CDC 和 Snapshot + CDC 模式需要 Publication 和复制槽。由于 `CREATE PUBLICATION ... FOR ALL TABLES` 需要超级用户权限，且添加单个表需要表的所有权，因此这些对象应由数据库所有者或超级用户在启动 CDC 任务之前创建。

以超级用户或数据库所有者身份执行：

```sql
-- 创建包含要复制的表的 Publication
CREATE PUBLICATION bend_cdc_pub FOR ALL TABLES;

-- 创建逻辑复制槽
SELECT * FROM pg_create_logical_replication_slot('bend_cdc_slot', 'pgoutput');

-- 授予专用用户使用复制槽的权限
ALTER ROLE databend_cdc WITH REPLICATION;
```

:::note
如果只需要复制特定表而非所有表，可以使用：
```sql
CREATE PUBLICATION bend_cdc_pub FOR TABLE table1, table2;
```
这样可以避免超级用户要求，但仍需要对列出的表拥有所有权。
:::

### 网络访问

确保 PostgreSQL 实例可从 Databend Cloud 访问。检查防火墙规则和安全组，允许 PostgreSQL 端口的入站连接。

## 创建 PostgreSQL 集成任务

### 步骤 1：基本信息

1. 进入 **Data** > **Data Integration**，点击 **Create Task**。

![数据集成页面](/img/cloud/dataintegration/pg-dataintegration-page-with-create-button.png)

2. 配置基本设置：

| 字段 | 必填 | 说明 |
|------|------|------|
| **Data Source** | 是 | 从下拉列表中选择已有的 **PostgreSQL - 连接凭证** 数据源 |
| **Name** | 是 | 集成任务的名称 |
| **Source Database** | — | 根据所选数据源自动显示 |
| **Source Table** | 是 | 从 PostgreSQL 数据库中选择要同步的表 |
| **Sync Mode** | 是 | 选择 **Snapshot**、**CDC Only** 或 **Snapshot + CDC** |
| **Primary Key** | 条件必填 | 用于合并操作的唯一标识列。CDC Only 和 Snapshot + CDC 模式必填 |
| **Sync Interval** | 是 | 写入操作之间的间隔（秒）（默认：3） |
| **Batch Size** | 否 | 每批处理的行数 |
| **Allow Delete** | 否 | 是否允许 CDC 中的 DELETE 操作。适用于 CDC Only 和 Snapshot + CDC 模式 |

![创建任务 - 基本信息](/img/cloud/dataintegration/create-postgres-task-step1-basic-info.png)

#### Snapshot 模式选项

使用 **Snapshot** 模式时，可使用以下附加选项：

- **Snapshot WHERE Condition**：用于在快照期间过滤数据的 SQL WHERE 子句（例如 `created_at > '2024-01-01'`）。允许您仅加载源数据的子集。

### 步骤 2：预览数据

配置基本设置后，点击 **Next** 预览源数据。

![预览数据](/img/cloud/dataintegration/create-postgres-task-preview-data-step.png)

系统从所选 PostgreSQL 表中获取示例行，并显示列名和数据类型。在继续之前，请检查数据以确保选择了正确的表和列。

### 步骤 3：设置目标表

配置 Databend 中的目标：

| 字段 | 说明 |
|------|------|
| **Warehouse** | 选择用于运行同步的目标 Databend Cloud 计算集群 |
| **Target Database** | 选择 Databend 中的目标数据库 |
| **Target Table** | Databend 中的表名（默认与源表名相同） |

![设置目标表](/img/cloud/dataintegration/dataintegration-postgres-set-target-table.png)

系统自动将源列映射到目标表结构。检查列映射后，点击 **Create** 完成集成任务的创建。

## 各同步模式的任务行为

| 同步模式 | 行为 |
|----------|------|
| Snapshot | 运行一次，全量数据加载完成后自动停止。 |
| CDC Only | 持续运行，捕获实时变更，直到手动停止。 |
| Snapshot + CDC | 先完成初始快照，然后过渡到持续 CDC，直到手动停止。 |

对于 CDC 任务，停止时会保存当前 LSN（日志序列号）作为检查点，允许任务在重启时从中断处继续。

## 同步模式详解

### Snapshot

Snapshot 模式对源表执行一次性全量读取，并将所有数据加载到 Databend 的目标表中。

**使用场景：**
- 从 PostgreSQL 到 Databend 的初始数据迁移
- 定期全量数据刷新
- 使用 WHERE 条件过滤的一次性数据导入

**特性：**
- 支持 WHERE 条件过滤以加载数据子集
- 任务完成后自动停止

### CDC（变更数据捕获）

CDC 模式通过逻辑复制持续监控 PostgreSQL WAL（预写日志），并从源表捕获实时行级变更（INSERT、UPDATE、DELETE）。

**使用场景：**
- 实时数据复制
- 保持 Databend 与生产 PostgreSQL 数据库同步
- 事件驱动的数据管道

**工作原理：**

1. 使用逻辑复制槽连接到 PostgreSQL
2. 通过 `pgoutput` 插件实时捕获行级变更
3. 将变更写入 Databend 中的原始暂存表
4. 使用主键定期将变更合并到目标表
5. 保存检查点（LSN 位置）用于故障恢复

:::note
CDC 模式要求 PostgreSQL WAL 级别设置为 `logical`，且必须指定主键（唯一列）。PostgreSQL 用户必须具有 `REPLICATION` 权限。
:::

### Snapshot + CDC

此模式结合了两种方式：先对源表执行全量快照，然后无缝过渡到 CDC 模式进行持续变更捕获。这是大多数数据集成场景的推荐模式，因为它确保了完整的初始数据加载以及后续的实时同步。

## 高级配置

### Primary Key

主键指定 CDC 期间用于 MERGE 操作的唯一标识列。当捕获到变更事件时，Databend 使用此键来确定是插入新行还是更新现有行。通常应使用源表的主键。

### Sync Interval

同步间隔（秒）控制捕获的变更合并到目标表的频率。较短的间隔提供更低的延迟，但可能增加资源使用。默认值 3 秒适用于大多数工作负载。

### Batch Size

控制数据加载期间每批处理的行数。调整此值可以帮助优化大表的吞吐量。留空则使用系统默认值。

### Allow Delete

启用时（CDC 模式默认启用），从 PostgreSQL WAL 捕获的 DELETE 操作将应用到 Databend 的目标表。禁用时，删除操作将被忽略，目标表保留所有历史记录。这对于需要维护完整审计跟踪的场景很有用。
