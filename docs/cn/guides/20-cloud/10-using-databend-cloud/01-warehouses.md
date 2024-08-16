---
title: 计算集群
---

计算集群是 Databend Cloud 的重要组成部分。一个计算集群代表一组计算能力，包括 CPU、内存和本地缓存。您必须运行一个计算集群才能在 Databend Cloud 中执行以下 SQL 任务：

- 使用 SELECT 语句查询数据
- 使用 INSERT、UPDATE 或 DELETE 语句修改数据
- 使用 COPY INTO TABLE 命令将数据加载到表中
- 使用 COPY INTO LOCATION 命令从表中卸载数据

运行计算集群会消耗信用额度。更多信息，请参阅[定价与计费](/guides/overview/editions/dc/pricing)。

## 计算集群大小

Databend Cloud 中的计算集群有不同的大小。由于 Databend Cloud 以 vCPU 为单位衡量计算集群的计算能力，计算集群的大小基本上反映了计算集群包含的 vCPU 数量。您可以在 Databend Cloud 中拥有不同大小的多个计算集群。以下大小可供您在创建计算集群时选择：

- XSmall：包含 8 个 vCPU。
- Small：包含 16 个 vCPU。
- Medium：包含 32 个 vCPU。
- Large：包含 64 个 vCPU。
- XLarge：包含 128 个 vCPU。

:::tip
**选择合适的计算集群大小**。一般来说，小型计算集群执行 SQL 任务所需的时间比中型或大型计算集群更长。最佳实践是从小型计算集群开始。如果返回结果需要很长时间（例如，几分钟），请尝试中型或大型计算集群。
:::

## 计算集群状态

Databend Cloud 中的计算集群可以具有以下几种状态：

- 已暂停
- 启动中
- 运行中

请注意，Databend Cloud 仅在您的计算集群处于运行状态时收取信用额度。如果计算集群没有活动，它会自动进入已暂停状态以减少您的信用额度开销。

当您选择一个已暂停的计算集群来执行 SQL 任务时，计算集群会自动唤醒并开始运行任务。您也可以在**计算集群**页面上手动启动或暂停计算集群。

![](@site/static/img/documents/warehouses/states.jpg)

## 管理计算集群 {#managing}

**计算集群**页面列出了现有的计算集群，并允许您手动启动或暂停计算集群。如果您是管理员用户，您还可以在该页面上创建或删除计算集群。

![](@site/static/img/documents/warehouses/warehouse-overview.png)

点击列表中的计算集群会打开计算集群的详细信息页面，您可以在其中查看信用额度使用统计和历史记录。

![](@site/static/img/documents/warehouses/warehouse-detail.png)

## 连接到计算集群 {#connecting}

要获取必要的连接信息，请在**计算集群**页面上选择并点击一个计算集群以进入详细信息页面，然后点击**连接**以显示弹出窗口。

![Alt text](@site/static/img/documents/warehouses/connect-warehouse.png)

以下是一个弹出连接信息窗口的示例，Databend Cloud 提供了一个名为 _cloudapp_ 的 SQL 用户和随机生成的密码。连接到计算集群时，您需要使用用户名和密码进行身份验证。请注意，Databend 不会存储生成的密码。您必须将密码复制并粘贴到安全的地方。如果您忘记了密码，请点击**重置数据库密码**以生成一个新密码。

![Alt text](@site/static/img/documents/warehouses/connect-warehouse-2.png)
