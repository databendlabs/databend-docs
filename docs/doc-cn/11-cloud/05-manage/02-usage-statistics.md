---
title: 用量查询
---

这个主题描述了如何在 Databend Cloud 中查看和控制您的用量。

## 用量查询

如果您是管理员，则可以单击“管理”>“用量查询”来访问组织的消费统计信息。

The "Usage Query" page displays the consumption of users within an organization, including:

- Today's and the past month's consumption, categorized by compute and storage usage.
- Consumption trends.

![](@site/static/img/documents_cn/org-and-users/usage.png)

点击“查看更多”可以获取更详尽的统计数据：

- 左侧可以根据时间范围、类别和记录进行过滤。
- 右侧将会显示消费情况、趋势和并列出详情。

## 用量控制

对于管理员用户，Databend Cloud 提供了为其组织设置支出限制的选项。这使得管理员能够控制平台上的最大花费金额。要设置支出限制，请前往首页，点击“设置支出限制”。在打开的页面上，您可以打开“启用消费限制”按钮，并指定您的组织允许的最大月度支出金额。

:::note
您所设定的消费限额将适用于每个日历月。例如，如果您在 8 月 10 日设置了限额，它将在整个 8 月份内生效，从 1 号持续到 31 号。
:::

在设置消费限额时，您需要决定当限额达到时 Databend Cloud 应该采取哪种措施。目前有两个选项：

- **暂停服务**: 如果超出限制，计算集群将无法重新启动，直到限制期结束或支出限制被修改，以便再次使用。

- **提醒通知**: 超过限制后，系统会发送一条消息通知，确认后您仍然可以继续使用。

对于“提醒通知”选项，Databend Cloud 将根据以下频率周期向管理员发送电子邮件通知：

| 消费范围   	| 通知频率   	|
|------------	|------------	|
| 80% - 90%  	| 每三天一次 	|
| 90% - 100% 	| 每三天一次 	|
| 100% 或以上    | 每三天一次 	|