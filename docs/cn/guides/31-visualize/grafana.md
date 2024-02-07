---
title: Grafana
---

[Grafana](https://grafana.com/) 是一个监控仪表板系统，是由 Grafana Labs 开发的开源监控工具。它可以通过允许我们提供要监控的数据，并生成各种可视化图表，极大地简化监控的复杂性。此外，它还具有报警功能，当系统出现问题时会发送通知。Databend 和 Databend Cloud 可以通过 [Altinity 插件 for ClickHouse](https://grafana.com/grafana/plugins/vertamedia-clickhouse-datasource/) 与 Grafana 集成。

## 教程：与 Grafana 集成

本教程指导您通过使用 Altinity 插件 for ClickHouse 将 Databend / Databend Cloud 与 Grafana 集成的过程。

### 步骤 1. 设置环境

在开始之前，请参考官方安装指南安装 Grafana：https://grafana.com/docs/grafana/latest/setup-grafana/installation 。

对于本教程，您可以选择与 Databend 或 Databend Cloud 集成：

- 如果您选择与本地 Databend 实例集成，请按照 [部署指南](/guides/deploy) 部署（如果您还没有的话）。
- 如果您更愿意与 Databend Cloud 集成，请确保您可以登录到您的账户并获取仓库的连接信息。更多详情，请查看 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 安装 Altinity 插件 for ClickHouse

1. 在 Grafana 首页的侧边栏中点击齿轮图标，然后选择 **插件**。

2. 在 **插件** 标签页中，搜索并安装 `Altinity 插件 for ClickHouse`。

### 步骤 3. 创建数据源

1. 在 Grafana 首页的侧边栏中点击齿轮图标，然后选择 **数据源**。

2. 在 **数据源** 标签页中，选择 **添加新数据源**。

3. 搜索并选择数据源类型 **Altinity 插件 for ClickHouse**。

4. 配置数据源。

| 参数       | Databend                                 | Databend Cloud                     |
|------------|------------------------------------------|------------------------------------|
| URL        | `http://localhost:8124`                  | 从连接信息中获取                   |
| 访问       | `服务器 (默认)`                          | `服务器 (默认)`                    |
| 认证       | `基本认证`                               | `基本认证`                         |
| 用户       | 例如，`root`                             | 从连接信息中获取                   |
| 密码       | 输入您的密码                             | 从连接信息中获取                   |
| 额外       | 选择 `使用 POST 方法发送查询`           | 选择 `添加 CORS 标志到请求中`      |                                                                

5. 点击 **保存 & 测试**。如果页面显示“数据源正在工作”，则表示数据源已成功创建。

