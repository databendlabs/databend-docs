---
title: Grafana
sidebar_position: 1
---

[Grafana](https://grafana.com/) 是一个监控仪表盘系统，由 Grafana Labs 开发的开源监控工具。它能够极大简化监控的复杂性，只需我们提供待监控的数据，它就能生成各种可视化图表。此外，它还具备告警功能，当系统出现问题时可以发送通知。

Databend 和 Databend Cloud 可以通过以下两种方式与 Grafana 集成：

- **Databend 数据源插件（推荐）**：使用 [Grafana Databend 数据源插件](https://github.com/databendlabs/grafana-databend-datasource) 进行直接 SQL 访问，支持查询构建器、指标、日志、追踪、告警和注释。同时适用于自托管 Databend 和 Databend Cloud。
- **Loki 协议**：使用 Grafana 内置的 Loki 数据源，通过 Loki 兼容的 API 端点连接 Databend Cloud。

## 使用 Databend 数据源插件（推荐）

[Grafana Databend 数据源插件](https://github.com/databendlabs/grafana-databend-datasource) 提供对 Databend 的直接 SQL 访问，包含以下功能：

- **SQL 编辑器** —— 完整的 SQL 查询编辑器，支持宏和模板变量
- **查询构建器** —— 可视化查询构建器，支持数据库/表/列选择、过滤、聚合和排序
- **指标（Metrics）** —— 通过 `$__timeInterval` 宏实现时间序列可视化
- **日志（Logs）** —— 原生日志支持，可配置时间/级别/消息列
- **追踪（Traces）** —— 原生追踪支持，可配置 span/trace ID 列
- **告警（Alerting）** —— 支持 Grafana 告警
- **注释（Annotations）** —— 基于查询的注释

### 步骤 1. 环境准备

开始前，请确保已完成以下准备：

- 已安装 Grafana。请参考官方安装指南：[https://grafana.com/docs/grafana/latest/setup-grafana/installation](https://grafana.com/docs/grafana/latest/setup-grafana/installation)
- 以下任选其一：
  - 本地 Databend 实例（请按照 [部署指南](/guides/self-hosted) 完成部署）
  - 或 Databend Cloud 账户及计算集群的连接信息（详见 [连接计算集群](/guides/cloud/resources/warehouses#connecting)）

### 步骤 2. 修改 Grafana 配置

该插件尚未签名，因此需要允许 Grafana 加载它。在 `grafana.ini` 文件中添加以下配置：

```ini
[plugins]
allow_loading_unsigned_plugins = databendlabs-databend-datasource
```

也可以通过环境变量设置：

```bash
GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=databendlabs-databend-datasource
```

### 步骤 3. 安装 Grafana Databend 数据源插件

1. 在 [Releases](https://github.com/databendlabs/grafana-databend-datasource/releases) 页面查找最新版本。

2. 下载插件压缩包并解压至 Grafana 插件目录。例如使用 `v1.4.9` 版本：

```shell
curl -fLo /tmp/grafana-databend-datasource.zip https://github.com/databendlabs/grafana-databend-datasource/releases/download/v1.4.9/databendlabs-databend-datasource-1.4.9.zip
unzip /tmp/grafana-databend-datasource.zip -d /var/lib/grafana/plugins
rm /tmp/grafana-databend-datasource.zip
```

  在 Docker 中运行 Grafana 时，改为挂载插件并设置环境变量：

  ```yaml
  services:
    grafana:
      image: grafana/grafana:latest
      environment:
        - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=databendlabs-databend-datasource
      volumes:
        - ./databendlabs-databend-datasource:/var/lib/grafana/plugins/databendlabs-databend-datasource
  ```

3. 重启 Grafana 加载插件。

4. 在 Grafana UI 的 **Plugins** 页面（如 `http://localhost:3000/plugins`）确认插件已安装。

![插件列表](/img/integration/grafana-plugins.png)
![插件详情](/img/integration/grafana-plugin-detail.png)

### 步骤 4. 创建数据源

1. 访问 `Add new connection` 页面（如 `http://localhost:3000/connections/add-new-connection?search=databend`），搜索 `databend` 并选择。

2. 点击页面右上角的 **Add new data source**。

3. 输入 Databend 实例的 `DSN` 字段。例如：
   - 自托管：`databend://root:@localhost:8000/default?sslmode=disable`
   - Databend Cloud：`databend://cloudapp:******@tnxxxxxxx.gw.aws-us-east-2.default.databend.com:443/default?warehouse=xsmall-fsta`

4. 也可选择在 `SQL User Password` 字段输入密码以覆盖 `DSN` 中的默认密码。

5. 点击 **Save & test**。若页面显示 "Data source is working"，则表示数据源创建成功。

### 步骤 5. 测试查询

1. 新建仪表盘并添加面板。

2. 选择你的 Databend 数据源。

3. 使用 SQL 编辑器编写查询，或使用可视化查询构建器检索并可视化数据。插件支持 `$__timeFilter(col)`、`$__timeInterval(col)` 等宏用于基于时间的查询，完整列表请参见 [插件 README](https://github.com/databendlabs/grafana-databend-datasource#macros)。

4. 根据需要配置面板可视化选项。

## 使用 Loki 协议（备选方案）

Databend Cloud 提供 Loki 兼容的 API，让你无需安装额外插件即可使用 Grafana 原生的 Loki 数据源。当你只需通过 LogQL 进行日志可视化时，这是一个不错的选择。

:::note
Loki 协议功能需要激活。请联系支持团队为你的账户启用此功能。
:::

### 步骤 1. 配置表

在连接 Grafana 之前，请为日志数据可视化配置 Databend Cloud 表。以下是两种推荐的 schema 类型：

#### Loki Schema

此 schema 将标签作为 VARIANT/MAP 与日志正文一起存储：

```sql
CREATE TABLE logs (
  `timestamp` TIMESTAMP NOT NULL,
  `labels` VARIANT NOT NULL,
  `line` STRING NOT NULL,
  `stream_hash` UInt64 NOT NULL AS (city64withseed(labels, 0)) STORED
) CLUSTER BY (to_start_of_hour(timestamp), stream_hash);

CREATE INVERTED INDEX logs_line_idx ON logs(line);
REFRESH INVERTED INDEX logs_line_idx ON logs;
```

- `timestamp`：日志事件时间戳
- `labels`：存储序列化 Loki 标签的 VARIANT
- `line`：原始日志行
- `stream_hash`：用于聚簇的计算哈希值

#### Flat Schema

此 schema 使用宽表，每个属性为单独一列：

```sql
CREATE TABLE nginx_logs (
  `agent` STRING,
  `client` STRING,
  `host` STRING,
  `path` STRING,
  `request` STRING,
  `status` INT,
  `timestamp` TIMESTAMP NOT NULL
) CLUSTER BY (to_start_of_hour(timestamp), host, status);

CREATE INVERTED INDEX nginx_request_idx ON nginx_logs(request);
REFRESH INVERTED INDEX nginx_request_idx ON nginx_logs;
```

除时间戳列和日志行列外，每一列都会成为一个 LogQL 标签。

![配置表](/img/connect/grafana-configure-table.png)

### 步骤 2. 获取连接信息

1. 登录你的 Databend Cloud 账户。

2. 在仪表盘上点击 **Connect** 查看连接信息。请记录：
   - **Host**：计算集群端点（如 `tnxxxxxxx.gw.aws-us-east-2.default.databend.com`）
   - **User**：用户名（通常为 `cloudapp`）
   - **Password**：密码或 API Key
   - **Database**：包含日志表的数据库名
   - **Warehouse**：计算集群名称

![获取连接信息](/img/connect/grafana-get-connect-info.png)

有关获取连接详情的更多信息，请参见 [连接计算集群](/guides/cloud/resources/warehouses#connecting)。

### 步骤 3. 配置 Grafana 数据源

1. 在 Grafana 中，导航至 **Connections** > **Data sources** > **Add data source**。

2. 搜索并选择 **Loki**。

3. 配置基本设置：
   - **Name**：为数据源起一个描述性名称（如 "Databend Cloud Logs"）
   - **URL**：使用步骤 2 中的 host 输入 `https://<host>`

![配置 Loki 数据源 - 基本](/img/connect/grafana-configure-loki-datasource-basic.png)

4. 配置认证：
   - 在 Authentication 部分启用 **Basic auth**
   - **User**：输入用户名（通常为 `cloudapp`）
   - **Password**：输入密码或 API Key

5. 添加自定义 HTTP 头。在 **Custom HTTP Headers** 下添加以下内容：
   - **Header**：`X-Databend-Warehouse`，**Value**：你的计算集群名称
   - **Header**：`X-Databend-Database`，**Value**：你的数据库名
   - **Header**：`X-Databend-Table`，**Value**：你的表名

![配置 Loki 数据源 - HTTP 头](/img/connect/grafana-configure-loki-datasource-header.png)

6. 点击 **Save & test** 验证连接。

![配置 Loki 数据源 - 完成](/img/connect/grafana-configure-loki-datasource-complete.png)

### 步骤 4. 测试查询

1. 在 Grafana 中导航至 **Explore**。

2. 选择你的 Databend Cloud Loki 数据源。

3. 使用 LogQL 查询可视化数据。例如：
   - `{service="api"}` —— 按 service 标签过滤日志
   - `{level="error"}` —— 仅显示 error 级别的日志
   - `{service="api"} |= "timeout"` —— 在日志中搜索特定文本
   - `count_over_time({status="500"}[5m])` —— 统计一段时间内的错误数

4. 根据需要使用 Grafana 的面板选项自定义可视化。

![使用 Explore 测试 Loki 查询](/img/connect/grafana-test-loki-query-with-explore.png)
