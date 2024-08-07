---
title: 使用仓库
---

## 什么是仓库？

仓库是 Databend Cloud 的重要组成部分。一个仓库代表一组计算能力，包括 CPU、内存和本地缓存。您必须在 Databend Cloud 中运行一个仓库来执行以下 SQL 任务：

- 使用 SELECT 语句查询数据
- 使用 INSERT、UPDATE 或 DELETE 语句修改数据
- 使用 COPY INTO TABLE 命令将数据加载到表中
- 使用 COPY INTO LOCATION 命令从表中卸载数据

运行仓库会消耗信用额度。更多信息，请参阅[定价与计费](/guides/overview/editions/dc/pricing)。

## 仓库大小

Databend Cloud 中的仓库有不同的大小。因为 Databend Cloud 以 vCPU 为单位衡量仓库的计算能力，所以仓库的大小基本上反映了仓库包含的 vCPU 数量。您可以在 Databend Cloud 中拥有不同大小的多个仓库。以下大小在创建仓库时可供选择：

- XSmall：包含 8 个 vCPU。
- Small：包含 16 个 vCPU。
- Medium：包含 32 个 vCPU。
- Large：包含 64 个 vCPU。
- XLarge：包含 128 个 vCPU。

:::tip
**选择合适的仓库大小**。一般来说，小型仓库执行 SQL 任务所需的时间比中型或大型仓库更长。最佳实践是从小型仓库开始。如果返回结果需要很长时间（例如，几分钟），请尝试中型或大型仓库。
:::

## 仓库状态
Databend Cloud 中的仓库可以有以下几种状态：

- 已暂停
- 启动中
- 运行中

请注意，Databend Cloud 仅在您的仓库处于运行状态时收取信用额度。如果没有活动，仓库会自动进入已暂停状态以减少您的信用额度开销。

当您选择一个已暂停的仓库来执行 SQL 任务时，仓库会自动唤醒并开始运行任务。您也可以在**仓库**页面上手动启动或暂停仓库。

![](@site/static/img/documents/warehouses/states.jpg)

## 管理仓库 {#managing}

**仓库**页面列出了现有的仓库，并允许您手动启动或暂停仓库。如果您是管理员用户，您还可以在该页面上创建或删除仓库。

![](@site/static/img/documents/warehouses/warehouse-overview.png)

点击列表中的仓库会打开仓库的详细信息页面，您可以在其中查看信用额度使用统计和历史记录。

![](@site/static/img/documents/warehouses/warehouse-detail.png)

## 连接到仓库 {#connecting}

要获取必要的连接信息，请在**仓库**页面上选择并点击一个仓库进入详细信息页面，然后点击**连接**以显示弹出窗口。

![Alt text](@site/static/img/documents/warehouses/connect-warehouse.png)

以下是一个弹出连接信息窗口的示例，Databend Cloud 提供了一个名为 *cloudapp* 的 SQL 用户和随机生成的密码。连接到仓库时需要使用用户名和密码进行身份验证。请注意，Databend 不会存储生成的密码。您必须将密码复制并粘贴到安全的地方。如果您忘记了密码，请点击**重置数据库密码**以生成一个新密码。

![Alt text](@site/static/img/documents/warehouses/connect-warehouse-2.png)