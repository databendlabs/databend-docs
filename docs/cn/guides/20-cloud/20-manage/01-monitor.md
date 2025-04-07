---
title: "监控使用情况"
---

Databend Cloud 提供了监控功能，帮助您全面了解您和您的组织成员在平台上的使用情况。要访问 **Monitor** 页面，请单击主页侧边栏菜单中的 **Monitor**。该页面包括以下选项卡：

- [Metrics](#metrics)
- [SQL History](#sql-history)
- [Task History](#task-history)
- [Audit](#audit)：仅对 `account_admin` 用户可见。

## Metrics

**Metrics** 选项卡显示图表，以可视化方式展示以下指标的使用统计信息，涵盖过去一小时、一天或一周的数据：

- Storage Size
- SQL Query Count
- Session Connections
- Data Scanned / Written
- Warehouse Status
- Rows Scanned / Written

## SQL History

**SQL History** 选项卡显示组织内所有用户已执行的 SQL 语句列表。通过单击列表顶部的 **Filter**，您可以按多个维度过滤记录。

单击 **SQL History** 页面上的记录会显示有关 Databend Cloud 如何执行 SQL 语句的详细信息，从而可以访问以下选项卡：

- **Query Details**：包括 Query State（成功或失败）、Rows Scanned、Warehouse、Bytes Scanned、Start Time、End Time 和 Handler Type。
- **Query Profile**：说明 SQL 语句的执行方式。有关更多信息，请参见 [Query Profile](/guides/query/query-profile)。

## Task History

**Task History** 选项卡提供了组织内所有已执行任务的完整日志，使用户可以查看任务设置并监控其状态。

## Audit

**Audit** 选项卡记录所有组织成员的操作日志，包括操作类型、操作时间、IP 地址和操作员帐户。通过单击列表顶部的 **Filter**，您可以按多个维度过滤记录。