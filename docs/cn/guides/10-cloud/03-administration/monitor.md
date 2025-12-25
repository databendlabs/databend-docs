---
title: "监控使用情况"
---

Databend Cloud 提供监控功能，帮助你全面了解你和组织成员在平台上的使用情况。要访问 **Monitor** 页面，请在主页侧边栏菜单中点击 **Monitor**。该页面包含以下选项卡：

- [Metrics](#metrics)
- [SQL History](#sql-history)
- [Task History](#task-history)
- [Audit](#audit)：仅对 `account_admin` 用户可见。

## Metrics

**Metrics** 选项卡以图表形式直观展示以下指标的使用统计，数据范围涵盖过去一小时、一天或一周：

- Storage Size
- SQL Query Count
- Session Connections
- Data Scanned / Written
- Warehouse Status
- Rows Scanned / Written

## SQL History

**SQL History** 选项卡列出组织内所有用户已执行的 SQL 语句。点击列表顶部的 **Filter**，可按多个维度筛选记录。

在 **SQL History** 页面点击某条记录，可查看 Databend Cloud 执行该 SQL 语句的详细信息，并访问以下选项卡：

- **Query Details**：包含 Query State（成功或失败）、Rows Scanned、Warehouse、Bytes Scanned、Start Time、End Time 和 Handler Type。
- **Query Profile**：展示 SQL 语句的执行过程。

## Task History

**Task History** 选项卡提供组织内所有已执行任务的完整日志，方便用户查看任务配置并监控其状态。

## Audit

**Audit** 选项卡记录所有组织成员的操作日志，包括操作类型、操作时间、IP 地址和操作者账号。点击列表顶部的 **Filter**，可按多个维度筛选记录。