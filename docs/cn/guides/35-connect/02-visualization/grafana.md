---
title: Grafana
sidebar_position: 1
---

[Grafana](https://grafana.com/) 是一个监控仪表盘系统，由 Grafana Labs 开发的开源监控工具。它能够极大简化监控的复杂性，只需我们提供待监控的数据，它就能生成各种可视化图表。此外，它还具备告警功能，当系统出现问题时可以发送通知。Databend 和 Databend Cloud 可以通过 [Grafana Databend 数据源插件](https://github.com/databendlabs/grafana-databend-datasource) 与 Grafana 集成。

## 教程：与 Grafana 集成

本教程将指导您使用 Grafana Databend 数据源插件完成 Databend / Databend Cloud 与 Grafana 的集成过程。

### 步骤 1. 环境准备

开始前，请参考官方安装指南安装 Grafana: [https://grafana.com/docs/grafana/latest/setup-grafana/installation](https://grafana.com/docs/grafana/latest/setup-grafana/installation)。

本教程可选择与 Databend 或 Databend Cloud：

-：

- 若选择与本地 Databend 实例集成，请先按照 [部署指南](/guides/self-hosted) 完成部署（如尚未部署）。
- 若选择与 Databend Cloud 集成，请确保可登录账户并获取计算集群的连接信息。详见 [连接计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 2. 修改 Grafana 配置

在 `grafana.ini` 文件中添加以下配置：

```ini
[plugins]
allow_loading_unsigned_plugins = databend-datasource
```

### 步骤 3. 安装 Grafana Databend 数据源插件

1. 在 [GitHub Release](https://github.com/databendlabs/grafana-databend-datasource/releases) 查找最新版本。

2. 获取插件 zip 包的下载链接，例如 `https://github.com/databendlabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip`。

3. 获取 Grafana 插件目录并将下载的 zip 包解压至该目录。

```shell
curl -fLo /tmp/grafana-databend-datasource.zip https://github.com/databendlabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip
unzip /tmp/grafana-databend-datasource.zip -d /var/lib/grafana/plugins
rm /tmp/grafana-databend-datasource.zip
```

4. 重启 Grafana 加载插件。

5. 在 Grafana UI 的 **Plugins页面（页面（如 `http://localhost:3000/plugins`）确认插件已安装。

![插件列表](/img/integration/grafana-plugins.png)
![插件详情](/img/integration/grafana-plugin-detail.png)

### 步骤 3. 创建数据源

 访问 访问 `Add new connection` 页面（如 `http://localhost:3000/connections/add-new-connection?search=databend`），搜索 `databend` 并选择。

2. 点击页面右上角的 **Add new data source**。

3. 输入 Databend 实例的 `DSN` 字段。例如 `databend://root:@localhost:8000?sslmode=disable`，或 `databend://cloudapp:******@tnxxxxxxx.gw.aws-us-east-2.default.databend.com:443/default?warehouse=xsmall-fsta`。

4. 也可选择在 `SQL User Password` 字段输入密码以覆盖 `DSN` 中的默认密码。

5. 点击 **Save & test**。若页面显示 "Data source is working"，则表示数据源创建成功。