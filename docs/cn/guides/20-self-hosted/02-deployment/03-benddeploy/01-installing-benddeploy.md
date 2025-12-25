---
title: 安装 BendDeploy
---

本指南将引导你使用 [k3d](https://k3d.io/)、[Helm](https://helm.sh/) 和 [kubectl](https://kubernetes.io/docs/tasks/tools/) 在 Kubernetes 环境中部署 BendDeploy 及其可选的 Logging 组件。

## 前提条件

在开始之前，请确保已安装以下工具：

- **S3 Bucket**: 用于存储从 BendDeploy 收集的日志。本指南使用位于 `us-east-2` 区域中名为 `databend-doc` 的 Amazon S3 bucket 作为示例，但你可以使用任何与 S3 兼容的存储。确保你拥有相应的 Access Key ID 和 Secret Access Key。
- **k3d**: 本指南使用 k3d 创建一个本地 Kubernetes 集群，用于测试和开发。k3d 在 Docker 容器内运行轻量级的 K3s 集群，从而可以轻松快速地开始使用。但是，你可以使用任何适合你需求的 Kubernetes 环境。从 [k3d.io](https://k3d.io/stable/) 安装。
- **kubectl**: 需要管理 Kubernetes 集群并与之交互。安装说明可在 [官方 Kubernetes 文档](https://kubernetes.io/docs/tasks/tools/) 中找到。
- **Helm**: 需要安装 BendDeploy 和可选的 logging 组件作为 Helm charts。它简化了部署过程并为你处理配置。从 [helm.sh](https://helm.sh/docs/intro/install/) 安装 Helm。

## 步骤 1：创建 Kubernetes 集群

首先，你需要一个 Kubernetes 环境来运行 BendDeploy 及其 logging 组件。

1. 创建一个名为 `benddeploy-tutorial` 的本地集群：

```bash
k3d cluster create benddeploy-tutorial
```

你将看到输出显示集群正在设置的步骤。完成后，你的集群已准备就绪：

```bash
INFO[0000] Prep: Network
INFO[0000] Created network 'k3d-benddeploy-tutorial'
INFO[0000] Created image volume k3d-benddeploy-tutorial-images
INFO[0000] Starting new tools node...
INFO[0000] Starting node 'k3d-benddeploy-tutorial-tools'
INFO[0001] Creating node 'k3d-benddeploy-tutorial-server-0'
INFO[0001] Creating LoadBalancer 'k3d-benddeploy-tutorial-serverlb'
INFO[0001] Using the k3d-tools node to gather environment information
INFO[0001] Starting new tools node...
INFO[0001] Starting node 'k3d-benddeploy-tutorial-tools'
INFO[0002] Starting cluster 'benddeploy-tutorial'
INFO[0002] Starting servers...
INFO[0002] Starting node 'k3d-benddeploy-tutorial-server-0'
INFO[0005] All agents already running.
INFO[0005] Starting helpers...
INFO[0005] Starting node 'k3d-benddeploy-tutorial-serverlb'
INFO[0011] Injecting records for hostAliases (incl. host.k3d.internal) and for 3 network members into CoreDNS configmap...
INFO[0013] Cluster 'benddeploy-tutorial' created successfully!
INFO[0013] You can now use it like this:
kubectl cluster-info
➜  ~ k3d cluster list

NAME                  SERVERS   AGENTS   LOADBALANCER
benddeploy-tutorial   1/1       0/0      true
```

2. 验证 Kubernetes 节点是否已启动并正在运行：

```bash
kubectl get nodes
```

你应该在 `Ready` 状态下看到控制平面节点：

```bash
NAME                               STATUS   ROLES                  AGE     VERSION
k3d-benddeploy-tutorial-server-0   Ready    control-plane,master   7m35s   v1.31.5+k3s1
```

3. 安装 Prometheus CRDs。在继续之前，请确保你的集群具有所需的 Prometheus Operator CRDs，尤其是 ServiceMonitor。

```bash
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml
```

4. 克隆 BendDeploy Helm charts 存储库：

```bash
git clone https://github.com/databendcloud/benddeploy-charts.git
cd benddeploy-charts/charts/logging
```

## 步骤 2：部署 Logging 组件（可选）

如果你想从 BendDeploy 收集系统日志并将其存储在 S3 中以进行进一步分析，则此步骤是可选的，但建议执行。

1. 更新 `charts/logging` 目录中的 **values.yaml** 文件，以启用 `warehouseLogCollector` 并将其配置为使用与 S3 兼容的存储：

```yaml

---
warehouseLogCollector:
  enabled: true
  replicas: 1
  nameOverride: warehouse-log-collector
  fullnameOverride: warehouse-log-collector
  s3:
    endpoint: "https://s3.us-east-2.amazonaws.com"
    bucket: "databend-doc"
    region: "us-east-2"
    auth:
      accessKeyId: "<your-access-key-id>"
      secretAccessKey: "<your-secret-access-key>"
```

2. 编辑位于 `configs/vector/` 中的 **agent.yaml** 文件，以配置 S3 sink 用于日志存储：

```yaml

---
# S3 sink
s3_logs:
  type: aws_s3
  inputs:
    #      - filter_kubernetes_logs
    - filter_warehouse_system_logs
  endpoint: "https://s3.us-east-2.amazonaws.com"
  bucket: "databend-doc"
  key_prefix: "logs/{{ tenant }}/system/"
  compression: gzip
  encoding:
    codec: native_json

  auth:
    access_key_id: "<your-access-key-id>"
    secret_access_key: "<your-secret-access-key>"

  region: "us-east-2"
```

3. 使用 Helm 部署 logging 组件：

```bash
helm upgrade --install logging . --namespace=logging --create-namespace
```

成功后，Helm 将显示一条消息，确认部署：

```bash
Release "logging" does not exist. Installing it now.
NAME: logging
LAST DEPLOYED: Sun Apr 20 11:36:46 2025
NAMESPACE: logging
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

4. 验证 logging 组件是否正在运行：

```bash
kubectl get pod -n logging
```

你应该看到如下输出：

```bash
NAME                         READY   STATUS    RESTARTS   AGE
vector-xpshl                 1/1     Running   0          6s
warehouse-log-aggregator-0   1/1     Running   0          70m
warehouse-log-collector-0    1/1     Running   0          3s
```

## 步骤 3：部署 BendDeploy

现在你的集群已准备就绪，你可以将 BendDeploy 安装到 Kubernetes 环境中。

1. 对于生产部署，自定义 `charts/benddeploy/templates` 目录中的 **configmap-benddeploy.yaml** 文件，以确保 BendDeploy 可以正确拉取镜像、存储日志、连接到指标和数据库以及验证用户身份。如果保持不变，将使用默认设置，这些设置适用于测试，但不建议用于生产环境。

| 字段                   | 描述                                                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `imageRegistry`        | 用于拉取 Databend Docker 镜像的镜像仓库。如果你的集群无法访问互联网，请将镜像推送到你自己的仓库（例如，`registry.databend.local`）。留空以使用 Docker Hub。 |
| `registryUsername`     | 用于访问你的镜像仓库的用户名（如果需要）。                                                                                                                  |
| `registryPassword`     | 用于访问你的镜像仓库的密码（如果需要）。                                                                                                                    |
| `repoNamespace`        | 存储 Databend 镜像的命名空间。例如，如果镜像为 `registry.databend.local/datafuselabs/databend-query:tag`，则 `repoNamespace` 为 `datafuselabs`。            |
| `promEndpoint`         | 你的 Prometheus 服务器的端点，例如 `prometheus-k8s.monitoring.svc.cluster.local:9090`。                                                                     |
| `logCollectorEndpoint` | 你的日志收集器（例如，Vector 或 OpenTelemetry）的端点，例如 `http://warehouse-log-collector.logging.svc.cluster.local:4318`。                               |
| `grafanaEndpoint`      | 你的 Grafana 仪表板的地址，例如 `http://grafana.monitoring.svc.cluster.local:80`。                                                                          |
| `db.postgresDSN`       | 外部 PostgreSQL 数据库的 DSN。                                                                                                                              |
| `oidcProvider`         | 用于身份验证的 OIDC 提供程序 URL。必须可以从集群内部访问或通过 Ingress 公开。                                                                               |

2. 使用 Helm 从克隆的存储库的根目录安装 BendDeploy。访问 [Amazon ECR Public Gallery 上的 BendDeploy 镜像存储库](https://gallery.ecr.aws/databendlabs/benddeploy) 并检查 **Image tags** 部分以查找最新版本，例如 `v1.0.2`。

```bash
# 将 <version> 替换为最新版本：
helm install benddeploy -n benddeploy --create-namespace ./charts/benddeploy --set image=public.ecr.aws/databendlabs/benddeploy:<version>
```

Helm 将确认部署：

```bash
NAME: benddeploy
LAST DEPLOYED: Sun Apr 20 12:44:44 2025
NAMESPACE: benddeploy
STATUS: deployed
REVISION: 1
TEST SUITE: None
➜  benddeploy-charts git:(main) ✗
```

3. 验证 BendDeploy pods 是否正在运行：

```bash
kubectl get pod -n benddeploy
```

预期输出：

```bash
NAME                                   READY   STATUS    RESTARTS   AGE
benddeploy-cfdd898d5-pkfwd             1/1     Running   0          69s
benddeploy-frontend-6988fdc5b9-blt2n   1/1     Running   0          69s
pg-benddeploy-64c64b95c-wd55m          1/1     Running   0          69s
```

## 步骤 4：访问 Web 界面

部署完成后，你现在可以在浏览器中访问 BendDeploy Web UI。

1. 通过端口转发公开前端。

:::tip
虽然端口转发非常适合快速本地访问，但对于生产或共享环境，请考虑配置 Ingress 控制器（如 NGINX Ingress）或通过 LoadBalancer 公开服务，以便从集群外部访问 BendDeploy。这允许您通过真实的域名或 IP 地址访问 Web UI。
:::

首先，检查服务：

```bash
kubectl get svc -n benddeploy
```

```bash
NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
benddeploy-service   ClusterIP   10.43.74.161   <none>        8080/TCP   9m23s
frontend-service     ClusterIP   10.43.70.22    <none>        8080/TCP   9m23s
pg-benddeploy        ClusterIP   10.43.38.197   <none>        5432/TCP   9m23s
```

然后将前端服务转发到您的本地计算机：

```bash
kubectl port-forward -n benddeploy svc/frontend-service 8080:8080
```

您将看到：

```bash
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

2. 导航到 [http://localhost:8080](http://localhost:8080) 以使用默认凭据（用户名：`databend`，密码：`Databend@1*`）访问 BendDeploy。

![alt text](@site/static/img/documents/benddeploy/login.png)
