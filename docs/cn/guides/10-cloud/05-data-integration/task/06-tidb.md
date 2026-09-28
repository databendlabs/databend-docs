---
title: TiDB 集成任务 (Beta)
---

本页介绍如何创建一个 TiDB 集成任务，将 TiDB 集群中的数据同步到 TiDB Cloud Lake。TiDB 任务支持全量 `Snapshot` 加载、持续 `Change Data Capture (CDC)`，或两者结合的模式。

如需先创建可复用的 TiDB 连接配置，请参阅 [TiDB 数据源](../datasource/07-tidb.md)。

## 使用场景

- 将 TiDB 数据库和表迁移到 TiDB Cloud Lake 进行分析
- 通过 TiCDC 持续同步 TiDB 数据到 TiDB Cloud Lake
- 在单个任务中将分库数据整合到按源分的目标数据库
- 执行一次全量加载，或将全量加载与持续增量捕获结合使用

## 同步模式

| 同步模式 | 说明 |
|----------|------|
| Snapshot | 从 Dumpling 导出执行一次性全量数据加载。适用于初次迁移或定期批量刷新。 |
| CDC Only | 持续消费 TiCDC changefeed 并应用实时变更（插入、更新、删除）。 |
| Snapshot + CDC | 先执行全量快照，然后切换到持续 CDC 模式。推荐大多数场景使用。 |

## 前置条件

在创建 TiDB 集成任务前，请确保：

- 已创建 **TiDB** 数据源。
- 数据源中配置的对象存储桶可从 TiDB Cloud Lake 访问。
- 要同步的表的 TiCDC / Dumpling 导出已写入桶中，并使用任务中将引用的前缀。

## 创建 TiDB 集成任务

### 步骤 1：基本信息

1. 前往 **Data** > **Data Integration**，点击 **Create Task**。
2. 选择 **TiDB** 数据源，然后配置基本参数：

| 字段 | 是否必填 | 说明 |
|------|----------|------|
| **Data Source** | 是 | 选择已有的 **TiDB - Credentials** 数据源。也可以在此处新建 |
| **Name** | 是 | 集成任务名称 |
| **Sync Mode** | 是 | 选择 **Snapshot**、**CDC Only** 或 **Snapshot + CDC** |
| **Table Rules** | 是 | 选择要同步的源对象规则。详见[表规则](#表规则) |
| **Max Matched Tables** | 否 | 规则可匹配的表数量上限。留空使用系统默认值（500） |
| **Dumpling S3 Prefix** | 是（Snapshot 模式） | Dumpling 导出所在的桶前缀，例如 `dumpling/export` |
| **Table Parallelism** | 否 | 并发加载的表数量（默认值：4） |
| **Warehouse** | 是 | 用于运行任务的 TiDB Cloud Lake Warehouse |

### 表规则

每行输入一条规则。规则格式为 `schemaPattern.tablePattern`，可在前面加 `!` 表示排除：

```text
app.orders             精确匹配一张表
shard_*.*              匹配所有 shard_ 数据库下的所有表
!*.tmp_*               排除临时表
```

规则从最后一行到第一行依次评估。第一条数据库和表模式都匹配的规则决定结果。未匹配任何规则的对象将被排除。仅包含排除规则的列表会隐式添加 `*.*` 前缀。

每个匹配的源数据库会写入独立的目标数据库，因此不同源数据库中同名的表不会互相覆盖。这也是在单个任务中同步多个源数据库的唯一方式。

点击 **Preview Matched Tables** 可根据前缀下实际存在的对象评估当前规则。预览会列出匹配的源数据库和表，以及推导出的目标数据库和表。

### Snapshot 选项

当同步模式包含快照时，以下选项控制 Dumpling 导出的加载行为：

| 字段 | 默认值 | 说明 |
|------|--------|------|
| **Auto Create Table** | 是 | 根据源表结构自动创建目标表 |
| **Purge After Load** | 否 | 加载成功后删除桶中的源对象。需要删除权限 |
| **On Error** | Abort | **Abort** 在第一个错误时停止；**Continue** 跳过失败行继续加载 |
| **CSV Separator** | `,` | Dumpling 导出使用的字段分隔符 |
| **Skip Header Rows** | 是 | 第一行是否包含列名。当导出包含表头行时选择 **YES** |
| **Export Escaped Backslashes** | 否 | 必须与 Dumpling 的 `--escape-backslash` 设置匹配 |

### 目标名称前后缀

目标数据库和表名根据源名称推导，可添加可选的前后缀：

```text
目标数据库 = targetDatabasePrefix + sourceDatabase + targetDatabaseSuffix
目标表     = targetTablePrefix    + sourceTable    + targetTableSuffix
```

前后缀留空则使用源名称原样。前后缀只能包含字母、数字和下划线。

例如，设置数据库前缀为 `src_` 时，源数据库 `shard_1` 中的表 `orders` 将写入 `src_shard_1.orders`。

### 步骤 2：创建任务

确认配置后，点击 **Create** 创建集成任务。

## 不同同步模式的任务行为

| 同步模式 | 行为 |
|----------|------|
| Snapshot | 运行一次，全量加载完成后自动停止。 |
| CDC Only | 持续运行，消费 changefeed 事件，直到手动停止。 |
| Snapshot + CDC | 先完成全量快照，然后切换到持续 CDC 模式，直到手动停止。 |

CDC 任务会保存进度检查点。任务停止并重启后，会从保存的位置继续消费，而无需从头重新加载。

## 高级配置

以下参数为任务级别配置，用于调整发现、加载和合并行为。

| 参数 | 默认值 | 说明 |
|------|--------|------|
| **Table Parallelism** | 4 | 并发处理的表数量。值越大吞吐量越高，但消耗的 Warehouse 资源也越多。 |
| **Poll Interval** | 60 秒 | 任务轮询暂存桶（及消费可选 SQS 队列）以发现新 changefeed / 导出对象的频率。间隔越短延迟越低，但会产生更多 List 请求。OSS 仅支持轮询方式。 |
| **Batch File Count** | 100 | 每批处理的最大 CDC 事件文件数。根据内存使用和吞吐量平衡调整。 |
| **Merge Interval** | 30 秒 | 捕获的变更合并到目标表的频率。间隔越短延迟越低，但合并操作更频繁。 |
| **Allow Delete** | 禁用 | 是否将 changefeed 中捕获的 `DELETE` 操作应用到目标表。禁用时忽略删除操作，历史行将被保留。 |
| **Max Matched Tables** | 500 | 规则可匹配的源表数量上限。超出限制时任务将失败并列出匹配详情。 |
