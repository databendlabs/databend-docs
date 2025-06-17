---
title: Prometheus & Grafana
---

[Prometheus](https://prometheus.io/) 是一个开源的监控系统，具有维度数据模型、灵活的查询语言、高效的时间序列数据库和现代的警报方法。[Grafana](https://grafana.com/grafana) 是一个用于分析和可视化指标 (metrics) 的开源工具。

本教程将指导你部署和集成 Databend、Prometheus 和 Grafana。在本教程中，你将在本地部署 Databend，并使用 Docker 安装 Prometheus 和 Grafana。在开始之前，请确保你已经安装了 Docker。

## 教程：使用 Prometheus & Grafana 监控 Databend

### 步骤一：部署 Databend

请遵循 [部署指南](/guides/deploy) 在本地部署 Databend。

:::tip
本教程使用安装包 `configs` 文件夹中的[默认配置文件](https://github.com/databendlabs/databend/tree/main/scripts/distribution/configs)。databend-meta 的指标 API 是 `0.0.0.0:28002/v1/metrics`，databend-query 的指标 API 是 `0.0.0.0:7070/metrics`。
:::

### 步骤二：部署 Prometheus

以下步骤描述了如何使用 Docker 安装和部署 Prometheus。

1. 从 Docker Hub 注册表中拉取最新的 Prometheus Docker 镜像。

   ```bash
   docker pull prom/prometheus
   ```

2. 编辑配置文件 **prometheus.yml**。

   将以下脚本添加到文件 `/etc/prometheus/prometheus.yml` 的末尾。请注意，使用 Docker 时，有多种方法可以修改容器内的文件。在本教程中，我们演示如何通过将文件保存到本地文件夹，并在运行 Prometheus 镜像时进行映射来实现。

   :::tip
   Docker 容器可以使用 `host.docker.internal` 连接到在主机上运行的本地服务。此功能默认仅在 Docker for Windows/Mac 上可用。但是，从 **20.03** 版本开始，它在 Linux 上也可用。
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
       - targets: ["host.docker.internal:28002"]
   ```

3. 部署 Prometheus。

   如果你在本地文件夹中保存并编辑了 `prometheus.yml` 文件，你需要使用命令中的 `-v` 选项创建一个映射。为此，请将下面命令中的 `/path/to/prometheus.yml` 替换为你的本地 `prometheus.yml` 的路径。

   ```bash
   docker run \
   -p 9090:9090 \
   --add-host=host.docker.internal:host-gateway \
   -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
   prom/prometheus
   ```

4. 检查指标状态

   检查每个实例右侧的值。`1` 表示实例健康，`0` 表示抓取失败。

   ![Prometheus 启动](/img/tracing/prometheus-up.png)

### 步骤三：部署 Grafana

以下步骤描述了如何使用 Docker 安装和部署 Grafana。

1. 从 Docker Hub 注册表中拉取最新的 Grafana Docker 镜像。

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

   打开你的网络浏览器并访问 `http://0.0.0.0:3000`。首先使用用户名 `admin` 和密码 `admin` 登录，然后在 **Configuration** > **Data Sources** > **Add data source** 添加一个 Prometheus 类型的数据源。

   请注意，将数据源的 URL 设置为 `http://host.docker.internal:9090`。

   ![Grafana 数据源](/img/tracing/grafana-datasource.png)

4. 创建仪表盘 (Dashboard)。

   Databend 建议导入 [datafuselabs/helm-charts - dashboards](https://github.com/databendlabs/helm-charts/tree/main/dashboards) 中的文件来创建你的仪表盘 (Dashboard)。为此，请先下载这些文件，然后访问 `http://0.0.0.0:3000/dashboard/import` 逐个导入下载的文件，并为每个仪表盘 (Dashboard) 选择 `Prometheus` 数据源。

   ![Grafana 导入查询 JSON](/img/tracing/grafana-query-json.png)

   ![Grafana 查询仪表盘](/img/tracing/grafana-query-dashboard.png)