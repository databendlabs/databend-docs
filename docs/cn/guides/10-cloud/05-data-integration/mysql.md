---
title: MySQL
---

MySQL 数据集成功能支持将 MySQL 数据库中的数据实时同步到 Databend，并支持全量 `Snapshot` 加载、持续 `Change Data Capture (CDC)`，或两者结合的模式。

## 同步模式

| 同步模式 | 说明 |
|----------|------|
| Snapshot | 对源表执行一次性全量数据加载。适合初始数据迁移或周期性批量导入。 |
| CDC Only | 持续从 MySQL binlog 捕获实时变更（插入、更新、删除）。执行 MERGE 操作时需要主键。 |
| Snapshot + CDC | 先执行一次全量快照，再无缝切换到持续 CDC。适用于大多数场景，推荐优先使用。 |

## 前置条件

在配置 MySQL 数据集成前，请确保您的 MySQL 实例满足以下要求：

### 启用 Binlog

要使用 `CDC` 和 `Snapshot + CDC` 模式，必须启用 ROW 格式的 MySQL binlog：

```ini title='my.cnf'
[mysqld]
server-id=1
log-bin=mysql-bin
binlog-format=ROW
binlog-row-image=FULL
```

修改配置后，请重启 MySQL 以使变更生效。

### 创建专用用户（推荐）

建议创建一个具备数据复制所需权限的 MySQL 用户：

```sql
CREATE USER 'databend_cdc'@'%' IDENTIFIED BY 'your_password';
GRANT SELECT, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'databend_cdc'@'%';
FLUSH PRIVILEGES;
```

### 网络访问

请确保 Databend Cloud 可以访问该 MySQL 实例。请检查防火墙规则和安全组设置，允许通过 MySQL 端口进行入站连接。

## 创建 MySQL 数据源

1. 前往 **Data** > **Data Sources**，点击 **Create Data Source**。

2. 将服务类型选择为 **MySQL - Credentials**，然后填写连接信息：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Name** | 是 | 当前数据源的描述性名称 |
| **Hostname** | 是 | MySQL 服务器主机名或 IP 地址 |
| **Port Number** | 是 | MySQL 服务端口，默认值为 `3306` |
| **DB Username** | 是 | 具有复制权限的 MySQL 用户 |
| **DB Password** | 是 | MySQL 用户密码 |
| **Database Name** | 是 | 源数据库名称 |
| **DB Charset** | 否 | 字符集，默认值为 `utf8mb4` |
| **Server ID** | 否 | 唯一的 binlog 复制标识；如不填写则自动生成 |

![创建 MySQL 数据源](/img/cloud/dataintegration/databendcloud-dataintegration-create-mysql-source.png)

3. 点击 **Test Connectivity** 验证连接；如果测试成功，点击 **OK** 保存数据源。

## 创建 MySQL 集成任务

### 步骤 1：基本信息

1. 前往 **Data** > **Data Integration**，点击 **Create Task**。

![Data Integration 页面](/img/cloud/dataintegration/dataintegration-page-with-create-button.png)

2. 配置基本参数：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Data Source** | 是 | 从下拉列表中选择已有的 MySQL 数据源 |
| **Name** | 是 | 当前集成任务名称 |
| **Source Database** | — | 根据所选数据源自动显示 |
| **Source Table** | 是 | 选择要从 MySQL 数据库同步的表 |
| **Sync Mode** | 是 | 选择 **Snapshot**、**CDC Only** 或 **Snapshot + CDC** |
| **Primary Key** | 条件必填 | 用于 MERGE 操作的唯一标识列；`CDC Only` 和 `Snapshot + CDC` 模式下必填 |
| **Sync Interval** | 是 | 两次写入之间的时间间隔（秒），默认值为 `3` |
| **Batch Size** | 否 | 每个批次处理的行数 |
| **Allow Delete** | 否 | 是否允许在 CDC 中执行 DELETE 操作；仅 `CDC Only` 和 `Snapshot + CDC` 模式可用 |

![创建任务 - 基本信息](/img/cloud/dataintegration/create-mysql-task-step1-basic-info.png)

#### Snapshot 模式选项

使用 **Snapshot** 模式时，可配置以下附加选项：

- **Snapshot WHERE Condition**：用于在快照阶段过滤数据的 SQL `WHERE` 条件（例如 `created_at > '2024-01-01'`），可用于仅加载源数据中的部分数据。

- **Archive Schedule**：启用周期归档后，可按计划定期自动运行快照。启用后会出现以下字段：

| 字段 | 说明 |
|------|------|
| **Cron Expression** | Cron 格式的调度表达式（例如 `0 1 * * *` 表示每天凌晨 1:00） |
| **Timezone** | 调度所使用的时区，默认值为 `UTC` |
| **Mode** | 归档频率，可选 **Daily**、**Weekly** 或 **Monthly** |
| **Time Column** | 用于归档分区的时间列（例如 `created_at`） |

### 步骤 2：预览数据

完成基本设置后，点击 **Next** 预览源数据。

![预览数据](/img/cloud/dataintegration/create-mysql-task-preview-data-step.png)

系统会从所选 MySQL 表中抓取一行示例数据，并显示列名和数据类型。继续之前，请确认所选表及字段无误。

### 步骤 3：设置目标表

配置 Databend 中的目标位置：

| 字段 | 说明 |
|------|------|
| **Warehouse** | 选择用于运行同步任务的 Databend Cloud Warehouse |
| **Target Database** | 选择 Databend 中的目标数据库 |
| **Target Table** | Databend 中的目标表名，默认与源表同名 |

![设置目标表](/img/cloud/dataintegration/dataintegration-mysql-set-target-table.png)

系统会自动将源列映射到目标表结构。确认列映射无误后，点击 **Create** 完成集成任务创建。

## 不同同步模式下的任务行为

| 同步模式 | 行为 |
|----------|------|
| Snapshot | 运行一次，在全量数据加载完成后自动停止。 |
| CDC Only | 持续运行，实时捕获变更，直到手动停止。 |
| Snapshot + CDC | 先完成初始快照，再切换为持续 CDC，直到手动停止。 |

对于 CDC 任务，停止时会将当前 binlog 位置保存为 checkpoint（检查点），因此任务在重新启动后可从上次中断的位置继续执行。

## 同步模式详解

### Snapshot

`Snapshot` 模式会对源表执行一次性全量读取，并将全部数据加载到 Databend 的目标表中。

**适用场景：**

- 将数据从 MySQL 初次迁移到 Databend
- 周期性执行全量数据刷新
- 结合 `WHERE` 条件进行一次性数据导入

**特性：**

- 支持通过 `WHERE` 条件过滤，仅加载部分数据
- 支持配置周期性归档调度，定时执行快照
- 任务执行完成后会自动停止

### CDC (Change Data Capture)

`CDC` 模式会持续监控 MySQL binlog，并捕获源表中的实时行级变更（`INSERT`、`UPDATE`、`DELETE`）。

**适用场景：**

- 实时数据复制
- 保持 Databend 与业务 MySQL 数据库持续同步
- 事件驱动型数据管道

**工作机制：**

1. 使用唯一的 Server ID 连接到 MySQL binlog
2. 实时捕获行级变更
3. 将变更写入 Databend 中的原始暂存表
4. 基于主键定期将变更 MERGE 到目标表
5. 保存 checkpoint（binlog 位置）以支持故障恢复

:::note
`CDC` 模式要求 MySQL 启用 ROW 格式 binlog，并且必须指定主键（唯一列）。MySQL 用户还需具备 `REPLICATION SLAVE` 和 `REPLICATION CLIENT` 权限。
:::

### Snapshot + CDC

该模式结合了两种方式：先对源表执行一次全量快照，再无缝切换到 `CDC` 模式以持续捕获变更。对于大多数数据集成场景，这是推荐模式，因为它既能保证初始数据完整导入，又能持续进行实时同步。

## 高级配置

### Primary Key

`Primary Key` 用于指定 CDC 期间执行 MERGE 操作时所依赖的唯一标识列。当系统捕获到变更事件后，Databend 会借助该键判断应插入新行还是更新已有行。通常应填写源表的主键列。

### Sync Interval

`Sync Interval`（秒）用于控制已捕获变更被 MERGE 到目标表的频率。更短的间隔意味着更低的同步延迟，但也可能带来更高的资源消耗。默认值 `3` 秒适用于大多数工作负载。

### Batch Size

`Batch Size` 控制数据加载时每批处理的行数。对于大表，适当调整该值有助于优化吞吐量；留空则使用系统默认值。

### Allow Delete

启用后（CDC 模式下默认启用），从 MySQL binlog 捕获到的 `DELETE` 操作会同步应用到 Databend 目标表。禁用后，删除操作会被忽略，目标表将保留所有历史记录。这适用于需要保留完整审计轨迹的场景。

### Archive Schedule

在 `Snapshot` 模式下，您可以配置周期性归档，以按计划自动执行快照。这适用于需要定期刷新数据、但又不希望承担持续 CDC 开销的场景。

- **Cron Expression**：用于调度的标准 Cron 表达式（例如 `0 1 * * *` 表示每天凌晨 1:00）
- **Mode**：归档周期，可选 **Daily**、**Weekly** 或 **Monthly**
- **Time Column**：用于时间分区的列（例如 `created_at`）
- **Timezone**：调度使用的时区，默认值为 `UTC`
