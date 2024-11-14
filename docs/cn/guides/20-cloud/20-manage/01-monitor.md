---
title: "监控使用情况"
---

Databend Cloud 提供了监控功能，帮助您全面了解您和您的组织成员在平台上的使用情况。要访问 **Monitor** 页面，请点击首页侧边栏菜单中的 **Monitor**。该页面包含以下标签：

- [Metrics](#metrics)
- [SQL History](#sql-history)
- [Task History](#task-history)
- [Audit](#audit)：仅对 `account_admin` 用户可见。

## Metrics

**Metrics** 标签展示了图表，直观地展示了以下指标的使用统计数据，涵盖过去一小时、一天或一周的数据：

- 存储大小
- SQL 查询次数
- 会话连接数
- 扫描/写入的数据量
- 计算集群状态
- 扫描/写入的行数

## SQL History

**SQL History** 标签显示了您的组织内所有用户执行的 SQL 语句列表。通过点击列表顶部的 **Filter**，您可以按多个维度过滤记录。

点击 **SQL History** 页面上的记录，将显示 Databend Cloud 执行该 SQL 语句的详细信息，提供以下标签的访问：

- **Query Details**：包括查询状态（成功或失败）、扫描的行数、计算集群、扫描的字节数、开始时间、结束时间和处理程序类型。
- **Query Profile**：说明 SQL 语句的执行方式。更多信息，请参阅 [Query Profile](/guides/query/query-profile)。

## Task History

**Task History** 标签提供了您的组织内所有已执行任务的全面日志，使用户能够查看任务设置并监控其状态。

## Audit

**Audit** 标签记录了所有组织成员的操作日志，包括操作类型、操作时间、IP 地址和操作员账户。通过点击列表顶部的 **Filter**，您可以按多个维度过滤记录。