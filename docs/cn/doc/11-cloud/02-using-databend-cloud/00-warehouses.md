---
title: 使用计算集群
---

## 计算集群是什么？ {#introduction}

计算集群是 Databend Cloud 的重要组成部分。一个计算集群代表一组计算能力，包括 CPU、内存和本地缓存。您必须运行计算集群才能在 Databend Cloud 中执行以下 SQL 任务：

- 使用 SELECT 语句查询数据
- 使用 INSERT、UPDATE 或 DELETE 语句修改数据
- 使用 COPY INTO TABLE 命令将数据导入到表中
- 使用 COPY INTO LOCATION 命令从表中卸载数据

运行计算集群会消耗积分。有关详细信息，请参考[定价和计费](../05-manage/03-pricing.md)。

## 计算集群的大小

Databend Cloud 中的计算集群有不同的大小。因为 Databend Cloud 以 vCPU 衡量一个计算集群的计算能力，所以一个计算集群的大小基本上反映了该计算集群包含的 vCPU 数量。您可以在 Databend Cloud 中拥有多个不同大小的计算集群。创建计算集群时可以选择以下尺寸：

- XSmall：包含 8 vCPUs；
- Small：包含 16 vCPUs；
- Medium：包含 32 vCPUs；
- Large：包含 64 vCPUs；
- XLarge：包含 128 vCPUs；

:::tip
**选择合适的计算集群**。通常，小型计算集群执行 SQL 任务的时间会比中型或大型计算集群更长。最好的做法是从小的开始。如果需要很长时间（例如几分钟）才能返回结果，请尝试使用中型或大型。
:::

## 计算集群的状态

Databend Cloud 中的计算集群可以具有以下类型的状态：

- 暂停
- 正在开始
- 正在运行

请注意，只有当您的计算集群处于运行状态时，Databend Cloud 才会消耗积分。为了减少您的积分消耗，没有活动时计算集群会自动进入暂停状态。

当您选择一个挂起的计算集群执行 SQL 任务时，该计算集群会自动唤醒并开始运行任务。您也可以在“计算集群”页面上手动启动或暂停某个计算集群。

![](@site/static/img/documents/warehouses/states.jpg)

## 管理计算集群 {#managing}

“计算集群”页面列出了现有的计算集群，并允许您手动启动或暂停计算集群。如果您是管理员用户，您还可以在页面上创建或删除计算集群。

![Alt text](@site/static/img/documents_cn/warehouses/warehouse-overview.png)

单击列表中的一个计算集群将打开该计算集群的详细信息页面，您可以在其中查看信用使用统计信息和历史记录。

![Alt text](@site/static/img/documents_cn/warehouses/warehouse-detail.png)

## 连接到计算集群 {#connecting}

要获取必要的连接信息，在“计算集群”页面选择并点击一个计算集群进入详情页面，然后点击“连接”弹出。

![Alt text](@site/static/img/documents_cn/warehouses/warehouse-detail.png)

以下是一个弹出连接信息窗口的示例，其中 Databend Cloud 为名为 `cloudapp` 的 SQL 用户提供随机生成的密码。连接计算集群时需要用户名和密码进行身份验证。**请注意：为了用户的安全，Databend Cloud 不会存储生成的密码。**您必须将密码复制并粘贴到安全的地方。如果您忘记了密码，请单击“重置数据库密码”以重新生成一个新密码。

![Alt text](@site/static/img/documents_cn/warehouses/warehouse-connect.png)
