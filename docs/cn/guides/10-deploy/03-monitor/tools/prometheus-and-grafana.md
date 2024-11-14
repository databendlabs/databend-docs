---
title: Prometheus & Grafana
---

[Prometheus](https://prometheus.io/) 是一个开源的监控系统，具有维度数据模型、灵活的查询语言、高效的时间序列数据库和现代化的告警方法。[Grafana](https://grafana.com/grafana) 是一个用于分析和可视化指标的开源工具。

以下教程将指导您部署和集成 Databend、Prometheus 和 Grafana。在本教程中，您将部署一个本地的 Databend，并使用 Docker 安装 Prometheus 和 Grafana。在开始之前，请确保您已安装 Docker。

## 教程：使用 Prometheus & Grafana 监控 Databend

### 步骤 1. 部署 Databend

按照 [部署指南](/guides/deploy) 部署一个本地的 Databend。

:::tip
本教程使用安装包 `configs` 文件夹中的 [默认配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/distribution/configs)。databend-meta 的指标 API 为 `0.0.0.0:28101/v1/metrics`，databend-query 的指标 API 为 `0.0.0.0:7070/metrics`。
:::

### 步骤 2. 部署 Prometheus

以下步骤描述了如何使用 Docker 安装和部署 Prometheus。

1. 从 Docker Hub 注册表中拉取 Prometheus 的最新 Docker 镜像。

   ```bash
   docker pull prom/prometheus
   ```

2. 编辑配置文件 **prometheus.yml**。

   将以下脚本添加到 `/etc/prometheus/prometheus.yml` 目录中的 prometheus.yml 文件末尾。请注意，使用 Docker 时，有多种方法可以修改容器的文件。在本教程中，我们演示如何通过将文件保存到本地文件夹并在运行 Prometheus 镜像时进行映射来实现这一点。

   :::tip
   Docker 容器可以通过使用 `host.docker.internal` 连接到主机上运行的本地服务。此功能默认仅在 Docker for Windows/Mac 上可用。但是，从 **20.03** 版本开始，Linux 上也支持此功能。
   :::

   ```yaml
   - job_name: "databend-query"

     # metrics_path defaults to '/metrics'
     # scheme defaults to 'http'.

     static_configs:
       - targets: ["host.docker.internal:7070"]

   - job_name: "databend-meta"

     metrics_path: "/v1/metrics"
     # scheme defaults to 'http'.

     static_configs:
       - targets: ["host.docker.internal:28101"]
   ```

3. 部署 Prometheus。

   如果您将文件 `prometheus.yml` 保存并编辑在本地文件夹中，您需要使用 `-v` 选项在命令中创建映射。为此，请将以下命令中的 `/path/to/prometheus.yml` 替换为您的本地 `prometheus.yml` 的路径。

   ```bash
   docker run \
   -p 9090:9090 \
   --add-host=host.docker.internal:host-gateway \
   -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
   prom/prometheus
   ```

4. 检查指标状态

   检查每个实例右侧的值。`1` 表示实例健康，`0` 表示抓取失败。

   ![Prometheus up](/img/tracing/prometheus-up.png)

### 步骤 3. 部署 Grafana

以下步骤描述了如何使用 Docker 安装和部署 Grafana。

1. 从 Docker Hub 注册表中拉取 Grafana 的最新 Docker 镜像。

   ```bash
   docker pull grafana/grafana
   ```

2. 部署 Grafana。

   ```bash
   docker run \
   -p 3000:3000 \
   --add-host=host.docker.internal:host-gateway \
   grafana/grafana
   ```

3. 添加 Prometheus 类型的数据源。

   打开您的网络浏览器并转到 `http://0.0.0.0:3000`。首先使用用户名 `admin` 和密码 `admin` 登录，然后在 **Configuration** > **Data Sources** > **Add data source** 中添加 Prometheus 类型的数据源。

   请注意，将数据源的 URL 设置为 `http://host.docker.internal:9090`。

   ![Grafana data source](/img/tracing/grafana-datasource.png)

4. 创建仪表盘。

   Databend 建议导入 [datafuselabs/helm-charts - dashboards](https://github.com/datafuselabs/helm-charts/tree/main/dashboards) 中的文件来创建您的仪表盘。为此，首先下载文件，然后转到 `http://0.0.0.0:3000/dashboard/import` 逐个导入下载的文件，并为每个仪表盘选择 `Prometheus` 数据源。

   ![Grafana import query json](/img/tracing/grafana-query-json.png)

   ![Grafana query dashboard](/img/tracing/grafana-query-dashboard.png)