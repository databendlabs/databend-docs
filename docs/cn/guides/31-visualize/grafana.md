---
title: Grafana
---

[Grafana](https://grafana.com/) 是一个监控仪表板系统，由Grafana Labs开发，是一个开源的监控工具。它通过允许我们提供要监控的数据，极大地简化了监控的复杂性，并生成各种可视化效果。此外，它还具备报警功能，当系统出现问题时，会发送通知。Databend和Databend Cloud可以通过[Grafana Databend数据源插件](https://github.com/datafuselabs/grafana-databend-datasource)与Grafana集成。

## 教程：与Grafana集成

本教程将指导您通过Grafana Databend数据源插件，将Databend / Databend Cloud与Grafana集成。

### 步骤1. 设置环境

开始之前，请参考官方安装指南安装Grafana：https://grafana.com/docs/grafana/latest/setup-grafana/installation。

本教程中，您可以选择与本地Databend实例或Databend Cloud集成：

- 如果您选择与本地Databend实例集成，如果您还没有部署，请按照[部署指南](/guides/deploy)进行部署。
- 如果您更倾向于与Databend Cloud集成，请确保您可以登录到您的账户并获取仓库的连接信息。更多详情，请参阅[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤2. 修改Grafana配置

在您的`grafana.ini`文件中添加以下行：

```ini
[plugins]
allow_loading_unsigned_plugins = databend-datasource
```

### 步骤3. 安装Grafana Databend数据源插件

1. 在[GitHub Release](https://github.com/datafuselabs/grafana-databend-datasource/releases)找到最新版本。

2. 获取插件zip包的下载链接，例如，`https://github.com/datafuselabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip`。

3. 找到Grafana插件文件夹，并将下载的zip包解压到该文件夹中。

```shell
curl -fLo /tmp/grafana-databend-datasource.zip https://github.com/datafuselabs/grafana-databend-datasource/releases/download/v1.0.2/databend-datasource-1.0.2.zip
unzip /tmp/grafana-databend-datasource.zip -d /var/lib/grafana/plugins
rm /tmp/grafana-databend-datasource.zip
```

4. 重启Grafana以加载插件。

5. 导航至Grafana UI中的**Plugins**页面，例如，`http://localhost:3000/plugins`，并确保插件已安装。

![Plugins](@site/docs/public/img/integration/grafana-plugins.png)
![Plugin detail](@site/docs/public/img/integration/grafana-plugin-detail.png)

### 步骤3. 创建数据源

1. 转到`添加新连接`页面，例如，`http://localhost:3000/connections/add-new-connection?search=databend`，搜索`databend`并选择它。

2. 在页面右上角点击**添加新数据源**。

3. 在`DSN`字段中输入您的Databend实例信息。例如，`databend://root:@localhost:8000?sslmode=disable`，或`databend://cloudapp:******@tnxxxxxxx.gw.aws-us-east-2.default.databend.com:443/default?warehouse=xsmall-fsta`。

4. 或者，在`SQL用户密码`字段中输入密码，以覆盖`DSN`字段中的默认密码。

5. 点击**保存并测试**。如果页面显示“数据源工作正常”，则表示数据源已成功创建。