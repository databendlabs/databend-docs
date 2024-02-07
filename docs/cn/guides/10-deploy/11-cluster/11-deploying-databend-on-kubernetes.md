---
title: 在 Kubernetes 上部署集群
sidebar_label: 在 Kubernetes 上部署集群
description:
  如何在 Kubernetes 上部署 Databend 查询集群。
---

本主题解释了如何在 Kubernetes 上安装和配置 Databend 集群。


## 开始之前

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

* 确保安装了 `helm` 命令，参见 [指南](https://helm.sh/docs/intro/install/)

* 确保您有一个正在运行的 Kubernetes 集群。
  例如：
  * [EKS](https://aws.amazon.com/eks/) 在 `AWS` 上
  * [GKE](https://cloud.google.com/kubernetes-engine/) 在 `GCP` 上
  * [AKS](https://azure.microsoft.com/products/kubernetes-service/) 在 `Azure` 上
  * [ACK](https://www.alibabacloud.com/product/kubernetes) 在 `阿里云` 上
  * [TKE](https://cloud.tencent.com/product/tke) 在 `腾讯云` 上

  同时，对于本地测试还有简单的 Kubernetes 引擎：
  * [k3d](https://k3d.io)
  * [minikube](https://minikube.sigs.k8s.io/docs/start/)

* 创建一个云对象存储并获取相应的凭证，即 `access_key_id` 和 `secret_access_key`。
  * AWS S3 或其他兼容 S3 的存储服务
  * Azure 存储 Blob
  * 由 [Apache OpenDAL](https://github.com/datafuselabs/opendal#services) 支持的其他存储服务

  :::info 对于高级用户

    也支持不使用访问密钥的认证方法：
    * [IRSA](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) 在 aws 上
    * [RRSA](https://www.alibabacloud.com/help/container-service-for-kubernetes/latest/use-rrsa-to-enforce-access-control) 在阿里云上
    * [InstanceProfile](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) 在 aws 上（即将推出）

  :::

* 确保 Kubernetes 集群有一个默认的存储类。

  ````mdx-code-block

  :::tip 对于云平台

  <Tabs>
  <TabItem value="aws" label="EKS(AWS)">

    推荐使用 [Amazon Elastic Block Store (EBS) CSI 驱动](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/docs/install.md)。
    添加存储类时记得设置默认类的注解，例如：

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

    确保安装了组件 `csi-provisioner`，然后设置默认存储类：

    ```shell
    ❯ kubectl get sc
    NAME                             PROVISIONER                       RECLAIMPOLICY   VOLUMEBINDINGMODE            ALLOWVOLUMEEXPANSION   AGE
    alicloud-disk-available          diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
    alicloud-disk-efficiency         diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
    alicloud-disk-essd               diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
    alicloud-disk-ssd                diskplugin.csi.alibabacloud.com   Delete          Immediate                    true                   66m
    alicloud-disk-topology           diskplugin.csi.alibabacloud.com   Delete          WaitForFirstConsumer         true                   66m
    alicloud-disk-topology-alltype   diskplugin.csi.alibabacloud.com   Delete          WaitForFirstConsumer         true                   66m
    # 选择一个想要的存储类作为默认值，例如：alicloud-disk-topology-alltype
    ❯ kubectl annotate sc alicloud-disk-topology-alltype storageclass.kubernetes.io/is-default-class=true --overwrite
    ```

  </TabItem>

  </Tabs>

  :::

  ````

* **推荐** 如果您想监控 Databend Meta 和 Databend Query 的状态，请确保 Kubernetes 集群中运行 Prometheus Operator。

  :::tip 一个简单的 Kube Prometheus Stack 步骤

    1. 为 kube-prometheus-stack 添加图表仓库

      ```shell
      helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
      helm repo update prometheus-community
      ```

    2. 为简单的 kube-prometheus-stack 安装准备一个 values 文件



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

4. 验证 prometheus & grafana 运行情况

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


## 部署示例 Databend 集群

### 步骤 1. 部署 Databend Meta 集群

1. 创建一个带有持久化和监控启用的 values 文件：

详细和默认值可在 [文档](https://github.com/datafuselabs/helm-charts/blob/main/charts/databend-meta/values.yaml) 中找到

```yaml title="values.yaml"
bootstrap: true
replicaCount: 3
persistence:
  size: 20Gi
serviceMonitor:
  enabled: true
```

:::caution
强烈推荐部署至少 3 个节点的集群，并在每个节点上使用持久存储，以实现高可用性。

当 `replicaCount > 1` 时，首次运行需要 `bootstrap: true`，当集群中所有节点都启动并运行后，可以移除此设置。
:::

2. 在命名空间 `databend-meta` 中部署 meta 集群

```shell
helm repo add databend https://charts.databend.rs
helm repo update databend

helm upgrade --install databend-meta databend/databend-meta \
    --namespace databend-meta --create-namespace \
    --values values.yaml
```

3. 等待并验证 meta 服务运行情况

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


### 步骤 2. 部署 Databend Query 集群

1. 创建一个 values 文件，包含内置用户 `databend:databend` 和名称为 `example_cluster` 的 3 节点集群。

详细和默认值可在 [文档](https://github.com/datafuselabs/helm-charts/blob/main/charts/databend-query/values.yaml) 中找到

```yaml
replicaCount: 3
config:
  query:
    clusterId: example_cluster
    # 添加内置用户
    users:
      - name: databend
        # 可用类型: sha256_password, double_sha1_password, no_password, jwt
        authType: double_sha1_password
        # echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
        authString: 3081f32caef285c232d066033c89a78d88a6d8a5
  meta:
    # 设置端点以使用远程元数据服务
    # 依赖之前部署的元数据服务、命名空间和节点
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
# [推荐] 启用监控服务
serviceMonitor:
  enabled: true
# [推荐] 启用集群外部访问
service:
  type: LoadBalancer
```

````mdx-code-block

:::caution for LoadBalancer
当设置服务类型为 `LoadBalancer` 时，
几乎所有云平台都会为查询服务分配一个公共 IP 地址，
这可能导致安全问题。

然后，需要通过注释来告知云平台创建一个内部负载均衡器。

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

<TabItem value="aliyun" label="Alibaba Cloud">

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

:::tip for cloud storage

<Tabs>
<TabItem value="aws" label="S3(aws)">

```yaml
config:
  storage:
    type: s3
    s3:
      # 默认端点
      endpoint_url: "s3.amazonaws.com"
      bucket: "<bucket>"
      region: "<region>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      root: ""
```

</TabItem>

<TabItem value="aliyun" label="OSS(Alibaba Cloud)">

```yaml title="使用 s3 客户端的 oss"
config:
  storage:
    type: s3
    s3:
      # 区域端点 URL
      endpoint_url: "oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      # 需要
      enable_virtual_host_style: true
```

```yaml title="原生 oss"
config:
  storage:
    type: oss
    oss:
      # 区域端点 URL
      endpoint_url: "oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      access_key_secret: "<secret>"
```

</TabItem>

<TabItem value="qcloud" label="COS(Tencent Cloud)">

```yaml title="使用 s3 客户端的 cos"
config:
  storage:
    type: s3
    s3:
      # 区域端点 URL
      endpoint_url: "cos.ap-singapore.myqcloud.com"
      bucket: "test-databend-1234567890"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
```

</TabItem>

</Tabs>

:::

````

2. 为 `tenant1` 在命名空间 `databend-query` 中部署查询集群

```shell
helm repo add databend https://charts.databend.rs
helm repo update databend

helm upgrade --install tenant1 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

3. 等待并验证查询服务运行

```shell
❯ kubectl -n databend-query get pods
NAME                                     READY   STATUS    RESTARTS   AGE
tenant1-databend-query-66647594c-lkkm9   1/1     Running   0          36s
tenant1-databend-query-66647594c-lpl2s   1/1     Running   0          36s
tenant1-databend-query-66647594c-4hlpw   1/1     Running   0          36s

❯ kubectl -n databend-query get svc
NAME                     TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                                                                                     AGE
tenant1-databend-query   LoadBalancer   10.43.84.243   172.20.0.2    8080:32063/TCP,9000:31196/TCP,9090:30472/TCP,8000:30050/TCP,7070:31253/TCP,3307:31367/TCP   17m
```

4. 访问查询集群

  我们在这里使用内置用户 `databend`：

  * 集群内访问

```shell
mysql -htenant1-databend-query.databend-query.svc -udatabend -P3307 -pdatabend
```

* 集群外通过负载均衡器访问

    ```shell
    # 这里的地址是上面的服务 tenant1-databend-query 的 `EXTERNAL-IP`
    mysql -h172.20.0.2 -udatabend -P3307 -pdatabend
    ```

* 使用 kubectl 在本地访问

    ```shell
    nohup kubectl port-forward -n databend-query svc/tenant1-databend-query 3307:3307 &
    mysql -h127.0.0.1 -udatabend -P3307 -pdatabend
    ```

5. 为 tenant2 部署第二个集群

修改 tenant2 的 `values.yaml`

```shell
# 可选
helm repo update databend

helm upgrade --install tenant2 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

``` shell title="验证 tenant2 的查询服务正在运行"
❯ kubectl -n databend-query get pods
NAME                                      READY   STATUS    RESTARTS   AGE
tenant1-databend-query-66647594c-lkkm9    1/1     Running   0          55m
tenant1-databend-query-66647594c-lpl2s    1/1     Running   0          55m
tenant1-databend-query-66647594c-4hlpw    1/1     Running   0          55m
tenant2-databend-query-59dcc4949f-9qg9b   1/1     Running   0          53s
tenant2-databend-query-59dcc4949f-pfxxj   1/1     Running   0          53s
tenant2-databend-query-59dcc4949f-mmwr9   1/1     Running   0          53s
```


## 维护 Databend 查询集群

### 扩缩容

扩缩容查询集群有两种方式

* 直接使用 `kubectl`

  ```shell
   # 将查询集群数量缩减到 0
   kubectl -n databend-query scale deployment tenant1-databend-query --replicas=0

   # 将查询集群数量增加到 5
   kubectl -n databend-query scale deployment tenant1-databend-query --replicas=5
  ```

* 在 `values.yaml` 中更新 `replicaCount` 至任意值，然后再次使用 helm 升级

  ```diff title="diff values.yaml"
  - replicaCount: 3
  + replicaCount: 5
  ```

  ```shell
  helm upgrade --install tenant1 databend/databend-query \
      --namespace databend-query --create-namespace \
      --values values.yaml
  ```

### 升级

升级查询集群需要修改上述查询集群的 `values.yaml`。

```diff title="diff values.yaml"
replicaCount: 3
+ image:
+   tag: "v0.8.123-nightly"
config:
  query:
    clusterId: example_cluster
```

然后再次运行 helm 升级

```shell
# 可选
helm repo update databend

helm upgrade --install tenant1 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

### 检查集群信息

```sql
MySQL [(none)]> select * from system.clusters;
+------------------------+------------+------+------------------------------------------------------------------------------+
| name                   | host       | port | version                                                                      |
+------------------------+------------+------+------------------------------------------------------------------------------+
| TJoPIFqvwU6l6IuZzwVmj  | 10.42.0.29 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
| e7leCg352OPa7bIBTi3ZK  | 10.42.0.30 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
| uGD38DVaWDAnJV5jupK4p4 | 10.42.0.28 | 9090 | v0.8.122-nightly-5d3a308(rust-1.67.0-nightly-2022-11-20T16:27:23.284298522Z) |
+------------------------+------------+------+------------------------------------------------------------------------------+
3 rows in set (0.009 sec)
```

### 验证分布式查询工作情况

```sql
MySQL [(none)]> EXPLAIN SELECT max(number), sum(number) FROM numbers_mt(10000000000) GROUP BY number % 3, number % 4, number % 5 LIMIT 10;
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

分布式查询工作正常，集群将通过 `flight_api_address` 高效传输数据。

### 将数据上传到集群

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


## 监控元数据和查询集群

:::info
注意部署元数据和查询集群时应启用 `serviceMonitor`。
:::

* 从以下地址下载grafana仪表板文件：[datafuselabs/helm-charts](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)。

* 为您的集群打开grafana网页。

* 在左侧边栏选择 `+ 导入`，并上传下载的两个json文件。

* 然后您应该看到两个仪表板：

  * Databend Meta 运行时
  * Databend 查询运行时

## 下一步

部署Databend后，您可能需要了解以下主题：

- [加载与卸载数据](/guides/load-data)：在Databend中管理数据的导入/导出。
- [可视化](/guides/visualize)：将Databend与可视化工具集成以获得洞察。