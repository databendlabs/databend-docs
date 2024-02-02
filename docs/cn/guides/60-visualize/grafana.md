---
title: Grafana
---

[Grafana](https://grafana.com/) 是一个监控仪表板系统，它是由 Grafana Labs 开发的开源监控工具。它可以通过允许我们提供要监控的数据，并生成各种可视化图表，大大简化监控的复杂性。此外，它还具有报警功能，当系统出现问题时会发送通知。Databend 和 Databend Cloud 可以通过 [Altinity Plugin for ClickHouse](https://grafana.com/grafana/plugins/vertamedia-clickhouse-datasource/) 与 Grafana 集成。

## 教程：与 Grafana 集成

本教程将指导您使用 Altinity Plugin for ClickHouse 将 Databend / Databend Cloud 与 Grafana 集成的过程。

### 第 1 步. 设置环境

在开始之前，请参考官方安装指南安装 Grafana：https://grafana.com/docs/grafana/latest/setup-grafana/installation 。

对于本教程，您可以选择与 Databend 或 Databend Cloud 集成：

- 如果您选择与本地 Databend 实例集成，请按照 [部署指南](/guides/deploy) 部署（如果您还没有的话）。
- 如果您更愿意与 Databend Cloud 集成，请确保您可以登录到您的账户并获取计算集群的连接信息。更多详情，请查看 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 第 2 步. 安装 Altinity Plugin for ClickHouse

1. 在 Grafana 首页的侧边栏中点击齿轮图标，然后选择 **Plugins**。

2. 在 **Plugins** 标签页中，搜索并安装 `Altinity Plugin for ClickHouse`。

### 第 3 步. 创建数据源

1. 在 Grafana 首页的侧边栏中点击齿轮图标，然后选择 **Data sources**。

2. 在 **Data sources** 标签页中，选择 **Add new data source**。

3. 搜索并选择数据源类型 **Altinity Plugin for ClickHouse**。

4. 配置数据源。

| 参数      | Databend                               | Databend Cloud                   |
| --------- | -------------------------------------- | -------------------------------- |
| URL       | `http://localhost:8124`                | 从连接信息中获取                 |
| Access    | `Server (default)`                     | `Server (default)`               |
| Auth      | `Basic auth`                           | `Basic auth`                     |
| User      | 例如，`root`                           | 从连接信息中获取                 |
| Password  | 输入您的密码                           | 从连接信息中获取                 |
| Additonal | 选择 `Use POST method to send queries` | 选择 `Add CORS flag to requests` |

5. 点击 **Save & test**。如果页面显示“数据源正在工作”，则表示数据源已成功创建。
