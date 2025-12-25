---
title: 在 Kubernetes 上部署集群
sidebar_label: 在 Kubernetes 上部署集群
description: 如何在 Kubernetes 上部署 Databend 查询集群。
---

<!-- import LanguageFileParse from '@site/src/components/LanguageDocs/file-parse'
import VideoCN from '@site/docs/fragment/02-deploying-databend-on-kubernetes-cnvideo.md' -->

本主题介绍如何在 Kubernetes 上安装和配置 Databend 集群。

## 部署架构

![Deployment Architecture](/img/deploy/k8s-deployment-arch.jpg)

**场景描述**

- 本示例演示如何在 Kubernetes 集群中创建多个 Databend 集群。
- 您需要拥有 Kubernetes 集群的管理权限。您可以在任何 Kubernetes 节点上进行操作，但我们建议在管理节点上执行操作。在本示例中，您需要在工作节点上安装 helm 和 BendSQL 工具来执行命令。

## 准备工作

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

- 规划部署。

  在本示例中，您将部署一个由 3 个节点组成的 Databend Meta 集群，以及两个独立的 Databend Query 集群，每个集群也由 3 个节点组成。您应根据实际的部署计划和使用场景来管理和分配资源，以确保服务平稳运行。

  :::info 生产环境部署提示
  请参考 [部署环境](https://docs.databend.cn/guides/self-hosted/deploy/understanding-deployment-modes#deployment-environments) 为您的集群预留适当的资源。
  :::

- 确保已安装 `helm` 命令，请参阅 [指南](https://helm.sh/docs/intro/install/)

- 确保您有一个正在运行的 Kubernetes 集群。
  例如：

  - `AWS` 上的 [EKS](https://aws.amazon.com/eks/)
  - `GCP` 上的 [GKE](https://cloud.google.com/kubernetes-engine/)
  - `Azure` 上的 [AKS](https://azure.microsoft.com/products/kubernetes-service/)
  - `阿里云` 上的 [ACK](https://www.alibabacloud.com/product/kubernetes)
  - `腾讯云` 上的 [TKE](https://cloud.tencent.com/product/tke)

  此外，还有一些用于本地测试的简易 Kubernetes 引擎：

  - [k3d](https://k3d.io)
  - [minikube](https://minikube.sigs.k8s.io/docs/start/)

  :::info 对于远程服务器上的 Kubernetes 集群
  建议设置外部负载均衡器（Load Balancer）或选择合适的端口转发（Port Forwarding）规则，以确保服务可以访问。
  :::

- 创建云对象存储（Object Storage）并提供相应的凭据，即 `access_key_id` 和 `secret_access_key`。

  - AWS S3 或其他 S3 兼容的存储服务
  - Azure Storage Blob
  - 其他 [Apache OpenDAL](https://github.com/databendlabs/opendal#services) 支持的存储服务

  :::tip 推荐的存储设置
  [准备存储](https://docs.databend.cn/guides/self-hosted/deploy/production/preparing-storage) 提供了关于推荐存储设置的详细说明。
  :::

  :::info 高级用户

  也支持不使用访问密钥的身份验证方法：

  - AWS 上的 [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
  - 阿里云上的 [RRSA](https://www.alibabacloud.com/help/container-service-for-kubernetes/latest/use-rrsa-to-enforce-access-control)
  - AWS 上的 [InstanceProfile](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) (即将支持)

  :::

- 确保 Kubernetes 集群有一个默认的存储类（Storage Class）。

  :::tip 对于云平台

  <Tabs>
  <TabItem value="aws" label="EKS(AWS)">

  推荐使用 [Amazon Elastic Block Store (EBS) CSI 驱动](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/install.md)。
  在添加存储类（Storage Class）时，请记得为默认类设置注解，例如：

  ```yaml
  storageClasses:
    - name: gp3
      annotations:
        storageclass.kubernetes.io/is-default-class: "true"
      allowVolumeExpansion: true
      volumeBindingMode: WaitForFirstConsumer
      reclaimPolicy: Delete
      parameters:
        type: gp3
  ```

  ```shell
  ❯ kubectl get sc
  NAME            PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  gp2             kubernetes.io/aws-ebs   Delete          WaitForFirstConsumer   true                   16d
  gp3 (default)   ebs.csi.aws.com         Delete          WaitForFirstConsumer   true                   15d
  ```

  </TabItem>

  <TabItem value="aliyun" label="ACK(阿里云)">

  确保已安装 `csi-provisioner` 组件，然后设置默认存储类（Storage Class）：

  ```shell
  ❯ kubectl get sc
  NAME                             PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE            ALLOWVOLUMEEXPANSION   AGE
  alicloud-disk-available          diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
  alicloud-disk-efficiency         diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
  alicloud-disk-essd               diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
  alicloud-disk-ssd                diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
  alicloud-disk-topology           diskplugin.csi.alibabacloud.com   Delete          WaitForFirstConsumer         true                   66m
  alicloud-disk-topology-alltype   diskplugin.csi.alibabacloud.com   Delete          WaitForFirstConsumer         true                   66m
  # 选择所需的存储类作为默认值，例如：alicloud-disk-topology-alltype
  // highlight-next-line
  ❯ kubectl annotate sc alicloud-disk-topology-alltype storageclass.kubernetes.io/is-default-class=true --overwrite
  ```

  </TabItem>

  </Tabs>

  :::

- **推荐** 确保 Prometheus Operator 在 Kubernetes 集群中运行，以便监控 Databend Meta 和 Databend Query 的状态。

  :::tip 简易 Kube Prometheus Stack 的安装步骤

  1. 为 kube-prometheus-stack 添加图表仓库

     ```shell
     helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
     helm repo update prometheus-community
     ```

  2. 为简易 kube-prometheus-stack 安装准备一个 values 文件

     ```yaml title="values.yaml"
     grafana:
       grafana.ini:
         auth.anonymous:
           enabled: true
           org_role: Admin
     prometheus:
       prometheusSpec:
         ruleNamespaceSelector: {}
         ruleSelectorNilUsesHelmValues: false
         serviceMonitorNamespaceSelector: {}
         serviceMonitorSelectorNilUsesHelmValues: false
         podMonitorNamespaceSelector: {}
         podMonitorSelectorNilUsesHelmValues: false
     ```

  3. 使用 helm 安装 [Kube Prometheus Stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)

     ```shell
     helm upgrade --install monitoring \
         prometheus-community/kube-prometheus-stack \
         --namespace monitoring \
         --create-namespace \
         --values values.yaml
     ```

  4. 验证 prometheus 和 grafana 是否正在运行

     ```shell
     ❯ kubectl -n monitoring get pods
     NAME                                                     READY   STATUS    RESTARTS      AGE
     monitoring-prometheus-node-exporter-7km6w                1/1     Running   0             19m
     monitoring-kube-prometheus-operator-876c99fb8-qjnpd      1/1     Running   0             19m
     monitoring-kube-state-metrics-7c9f7fc49b-4884t           1/1     Running   0             19m
     alertmanager-monitoring-kube-prometheus-alertmanager-0   2/2     Running   1 (18m ago)   18m
     monitoring-grafana-654b4bb58c-sf9wp                      3/3     Running   0             19m
     prometheus-monitoring-kube-prometheus-prometheus-0       2/2     Running   0             18m
     ```

  :::

## 部署 Databend 集群示例

### 步骤 1：部署 Databend Meta 集群

1. 创建一个启用持久化和监控的 values 文件：

详细和默认的 values 值可以在 [文档](https://github.com/databendlabs/helm-charts/blob/main/charts/databend-meta/values.yaml) 中找到

```yaml title="values.yaml"
bootstrap: true
replicaCount: 3
persistence:
  size: 20Gi
serviceMonitor:
  enabled: true
```

:::caution
**强烈建议** 部署一个至少包含 3 个节点的集群，并在每个节点上使用持久化存储以实现高可用性。

当 `replicaCount > 1` 时，首次运行时需要设置 `bootstrap: true`，当集群中所有节点都启动并运行时可以移除此项。
:::

2. 在命名空间（Namespace） `databend-meta` 中部署 meta 集群

```shell
helm repo add databend https://charts.databend.cn
helm repo update databend

helm upgrade --install databend-meta databend/databend-meta \
    --namespace databend-meta --create-namespace \
    --values values.yaml
```

3. 等待并验证 meta 服务（Service）是否正在运行

```shell
❯ kubectl -n databend-meta get pods
NAME              READY   STATUS    RESTARTS        AGE
databend-meta-0   1/1     Running   0               5m36s
databend-meta-1   1/1     Running   1 (4m38s ago)   4m53s
databend-meta-2   1/1     Running   1 (4m2s ago)    4m18s

❯ kubectl -n databend-meta get pvc
NAME                   STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-databend-meta-0   Bound    pvc-578ec207-bf7e-4bac-a9a1-3f0e4b140b8d   20Gi       RWO            local-path     5m45s
data-databend-meta-1   Bound    pvc-693a0350-6b87-491d-8575-90bf62179b59   20Gi       RWO            local-path     5m2s
data-databend-meta-2   Bound    pvc-08bd4ceb-15c2-47f3-a637-c1cc10441874   20Gi       RWO            local-path     4m27s
```

### 步骤 2：部署 Databend Query 集群

1. 创建一个 values 文件，其中包含内置用户 `databend:databend` 和一个名为 `cluster1` 的 3 节点集群。

详细和默认的 values 值可以在 [文档](https://github.com/databendlabs/helm-charts/blob/main/charts/databend-query/values.yaml) 中找到

```yaml
replicaCount: 3
config:
  query:
    clusterId: cluster1
    # add builtin user
    users:
      - name: databend
        # available type: sha256_password, double_sha1_password, no_password, jwt
        authType: double_sha1_password
        # echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
        authString: 3081f32caef285c232d066033c89a78d88a6d8a5
  meta:
    # Set endpoints to use remote meta service
    # depends on previous deployed meta service、namespace and nodes
    namespace: "databend-meta"
    endpoints:
      - "databend-meta-0.databend-meta.databend-meta.svc:9191"
      - "databend-meta-1.databend-meta.databend-meta.svc:9191"
      - "databend-meta-2.databend-meta.databend-meta.svc:9191"
  storage:
    # s3, oss
    type: s3
    s3:
      bucket: "<bucket>"
      region: "<region>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      root: ""
# [recommended] enable monitoring service
serviceMonitor:
  enabled: true
# [recommended] enable access from outside cluster
service:
  type: LoadBalancer
```

````mdx-code-block

:::caution 关于 LoadBalancer 的注意事项
当服务（Service）类型设置为 `LoadBalancer` 时，几乎所有云平台都会为查询服务（Service）分配一个公网 IP 地址，这可能会导致安全问题。

因此，需要使用注解来告知云平台创建一个内部负载均衡器（Load Balancer）。

对于不同的云提供商：


<Tabs>
<TabItem value="aws" label="AWS">

  推荐安装 [AWS Load Balancer Controller](https://github.com/kubernetes-sigs/aws-load-balancer-controller)。

  ```yaml
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-type: external
      service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
      service.beta.kubernetes.io/aws-load-balancer-scheme: internal
  ```

</TabItem>

<TabItem value="aliyun" label="阿里云">

  ```yaml
  service:
    type: LoadBalancer
    annotations:
      service.beta.kubernetes.io/alibaba-cloud-loadbalancer-address-type: "intranet"
  ```

</TabItem>
</Tabs>

:::

````

````mdx-code-block

:::tip 云存储提示

<Tabs>
<TabItem value="aws" label="S3(aws)">

```yaml
config:
  storage:
    type: s3
    s3:
      # default endpoint
      endpoint_url: "https://s3.amazonaws.com"
      bucket: "<bucket>"
      region: "<region>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      root: ""
```

</TabItem>

<TabItem value="aliyun" label="OSS(阿里云)">

```yaml title="oss with s3 client"
config:
  storage:
    type: s3
    s3:
      # regional endpoint url
      endpoint_url: "https://oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      # required
      enable_virtual_host_style: true
```

```yaml title="oss native"
config:
  storage:
    type: oss
    oss:
      # regional endpoint url
      endpoint_url: "https://oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      access_key_secret: "<secret>"
```

</TabItem>

<TabItem value="qcloud" label="COS(腾讯云)">

```yaml title="cos native"
config:
  storage:
    type: cos
    cos:
      # regional endpoint url
      endpoint_url: "https://cos.ap-singapore.myqcloud.com"
      bucket: "test-databend-1234567890"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
```

</TabItem>

</Tabs>

:::

````

2. 在命名空间（Namespace） `databend-query` 中部署查询集群 `cluster1`

```shell
helm repo add databend https://charts.databend.cn
helm repo update databend

helm upgrade --install cluster1 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

3. 等待并验证查询服务（Service）是否正在运行

```shell
❯ kubectl -n databend-query get pods
NAME                                     READY   STATUS    RESTARTS   AGE
cluster1-databend-query-66647594c-lkkm9   1/1     Running   0          36s
cluster1-databend-query-66647594c-lpl2s   1/1     Running   0          36s
cluster1-databend-query-66647594c-4hlpw   1/1     Running   0          36s

❯ kubectl -n databend-query get svc
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                                                                                     AGE
cluster1-databend-query   LoadBalancer   10.43.84.243   172.20.0.2    8080:32063/TCP,9000:31196/TCP,9090:30472/TCP,8000:30050/TCP,7070:31253/TCP,3307:31367/TCP   17m
```

4. 访问查询集群

这里我们使用内置用户 `databend`：

- 集群内访问

  ```shell
  bendsql -hcluster1-databend-query.databend-query.svc -P8000 -udatabend -pdatabend
  ```

- 通过负载均衡器（Load Balancer）从集群外访问

  ```shell
  # 此处的地址是上面服务 cluster1-databend-query 的 `EXTERNAL-IP`
  bendsql -h172.20.0.2 -P8000 -udatabend -pdatabend
  ```

- 使用 kubectl 本地访问

  ```shell
  nohup kubectl port-forward -n databend-query svc/cluster1-databend-query 3307:3307 &
  bendsql -h127.0.0.1 -P8000 -udatabend -pdatabend
  ```

5. 部署第二个集群 `cluster2`

为 cluster2 修改 `values.yaml`

```shell
# optional
helm repo update databend

helm upgrade --install cluster2 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

```shell title="验证 cluster2 的查询服务是否正在运行"
❯ kubectl -n databend-query get pods
NAME                                      READY   STATUS    RESTARTS   AGE
cluster1-databend-query-66647594c-lkkm9    1/1     Running   0          55m
cluster1-databend-query-66647594c-lpl2s    1/1     Running   0          55m
cluster1-databend-query-66647594c-4hlpw    1/极简风格：1/1     Running   0          55m
cluster2-databend-query-59dcc4949f-9qg9b   1/1     Running   0          53s
cluster2-databend-query-59dcc4949f-pfxxj   1/1     Running   0          53s
cluster2-databend-query-59dcc4949f-mmwr9   1/1     Running   0          53s
```

## 维护 Databend Query 集群

### 扩缩容

要对查询集群进行扩容或缩容，有两种方法

- 直接使用 `kubectl`

  ```shell
   # 将查询集群数量缩减到 0
   kubectl -n databend-query scale statefulset cluster1-databend-query --replicas=0

   # 将查询集群数量扩展到 5
   kubectl -n databend-query scale statefulset cluster极简风格：1-databend-query --replicas=5
  ```

- 在 `values.yaml` 中将 `replicaCount` 更新为任意值，然后再次执行 helm upgrade

  ```diff title="diff values.yaml"
  - replicaCount: 3
  + replicaCount: 5
  ```

  ```shell
  helm upgrade --install cluster1 databend/databend-query \
      --namespace databend-query --create-namespace \
      --values values.yaml
  ```

### 升级

要升级查询集群，我们需要修改上面查询集群的 `values.yaml` 文件。

```diff title="diff values.yaml"
replicaCount: 3
+ image:
+   tag: "v0.8.123-nightly"
config:
  query:
    clusterId: cluster1
```

然后再次运行 helm upgrade

```shell
# optional
helm repo update databend

helm upgrade --install cluster1 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

### 检查集群信息

```sql
❯ select * from system.clusters;
+------------------------+------------+------+------------------------------------------------------------------------------+
| name                   | host       | port | version                                                                      |
+------------------------+------------+------+------------------------------------------------------------------------------+
| TJoPIFqvwU6l6IuZzwVmj  | 10.42.0.29 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
| e7leCg352OPa7bIBTi3ZK  | 10.42.0.30 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
| uGD38DVaWDAnJV5jupK4p4 | 10.42.0.28 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
+------------------------+------------+------+------------------------------------------------------------------------------+
3 rows in set (0.009 sec)
```

### 验证分布式查询是否正常工作

```sql
❯ EXPLAIN SELECT max(number), sum(number) FROM numbers_mt(10000000000) GROUP BY number % 3, number % 4, number % 5 LIMIT 10;
+-------------------------------------------------------------------------------------------------------------------------------------------+
| explain                                                                                                                                   |
+-------------------------------------------------------------------------------------------------------------------------------------------+
| Limit                                                                                                                                     |
| ├── limit: 10                                                                                                                       |
| ├── offset: 0                                                                                                                       |
| └── Exchange                                                                                                                        |
|     ├── exchange type: Merge                                                                                                        |
|     └── EvalScalar                                                                                                                  |
|         ├── expressions: [max(number) (#6), sum(number) (#7)]                                                                       |
|         └── AggregateFinal                                                                                                          |
|             ├── group by: [number % 3, number % 4, number % 5]                                                                      |
|             ├── aggregate functions: [max(number), sum(number)]                                                                     |
|             └── Exchange                                                                                                            |
|                 ├── exchange type: Hash(_group_by_key)                                                                              |
|                 └── AggregatePartial                                                                                                |
|                     ├── group by: [number % 3, number % 4, number % 5]                                                              |
|                     ├── aggregate functions: [max(number), sum(number)]                                                             |
|                     └── EvalScalar                                                                                                  |
|                         ├── expressions: [%(numbers_mt.number (#0), 3), %(numbers_mt.number (#0), 4), %(numbers_mt.number (#0), 5)] |
|                         └── TableScan                                                                                               |
|                             ├── table: default.system.numbers_mt                                                                    |
|                             ├── read rows: 10000000000                                                                              |
|                             ├── read bytes: 80000000000                                                                             |
|                             ├── partitions total: 152588                                                                            |
|                             ├── partitions scanned: 152588                                                                          |
|                             └── push downs: [filters: [], limit: NONE]                                                              |
+-------------------------------------------------------------------------------------------------------------------------------------------+
24 rows in set (0.008 sec)
```

分布式查询正常工作，集群将通过 `flight_api_address` 高效地传输数据。

### 向集群上传数据

```sql
CREATE TABLE t1(i INT, j INT);
```

```sql
INSERT INTO t1 SELECT number, number + 300 from numbers(10000000);
```

```sql
SELECT count(*) FROM t1;
```

```
+----------+
| count()  |
+----------+
| 10000000 |
+----------+
```

## 监控 Meta 和 Query 集群

:::info
请注意，在部署 meta 和 query 集群时，应启用 `serviceMonitor`。
:::

- 从 [datafuselabs/helm-charts](https://github.com/databendlabs/helm-charts/tree/main/dashboards) 下载 grafana 仪表盘（Dashboard）文件。

- 为您的集群打开 grafana 网页。

- 选择右上角的 `+` 展开菜单，点击 “Import dashboard” 导入仪表盘（Dashboard），并上传两个下载的 JSON 文件。

  ![Alt text](/img/deploy/import-dashboard.png)

- 然后您应该能看到两个仪表盘（Dashboard）：

  - Databend Meta Runtime

    ![Alt text](/img/deploy/databend-meta-runtime.png)

  - Databend Query Runtime

    ![Alt text](/img/deploy/databend-query-runtime.png)

## 下一步

部署 Databend 后，您可能需要了解以下主题：

- [加载和卸载数据](https://docs.databend.cn/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](https://docs.databend.cn/guides/connect/visualization)：将 Databend 与可视化工具集成以获得洞察。

<!-- <LanguageFileParse
cn={<VideoCN />}
/> -->