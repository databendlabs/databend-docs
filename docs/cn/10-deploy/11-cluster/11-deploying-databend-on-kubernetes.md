```yaml title="values.yaml"
users:
  - name: databend
    password: databend
    databases: ["default"]
cluster:
  name: example_cluster
replicaCount: 3
meta:
  address: databend-meta
  username: root
  password: root
persistence:
  size: 20Gi
serviceMonitor:
  enabled: true
```

:::caution
确保已经部署了Databend Meta集群，并且Meta集群地址在`meta.address`中正确配置。

在`replicaCount > 1`的情况下，建议开启持久化存储，以确保高可用性。
:::

2. 在命名空间`databend-query`中部署查询集群

```shell
helm upgrade --install databend-query databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

3. 等待并验证查询服务运行

```shell
❯ kubectl -n databend-query get pods
NAME                READY   STATUS    RESTARTS      AGE
databend-query-0    1/1     Running   0             3m45s
databend-query-1    1/1     Running   0             3m15s
databend-query-2    1/1     Running   0             2m45s

❯ kubectl -n databend-query get pvc
NAME                     STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-databend-query-0    Bound    pvc-0c45d1f0-3a0e-4b77-b9df-8c5e3c1f6c3d   20Gi       RWO            local-path     3m55s
data-databend-query-1    Bound    pvc-0d7a5d0c-3b81-4a6b-ae0e-3f9a3c9d8ad4   20Gi       RWO            local-path     3m25s
data-databend-query-2    Bound    pvc-0e9f5e4c-9c1e-4e6c-9e9e-3d7c6e27d342   20Gi       RWO            local-path     2m55s
```

## 后续步骤

部署完成后，您可以通过以下步骤来访问和使用Databend集群：

1. 使用`kubectl port-forward`来转发查询服务端口到本地：

```shell
kubectl port-forward svc/databend-query 3307:3307 -n databend-query
```

2. 使用任何MySQL兼容的客户端连接到本地端口`3307`，使用用户名`databend`和密码`databend`登录。

3. 开始使用Databend进行数据查询和分析。

确保您已经阅读并理解了Databend的[用户文档](https://databend.rs/docs/)，以便更好地使用Databend集群。

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
    # 取决于之前部署的元数据服务、命名空间和节点
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
# [推荐] 允许从集群外部访问
service:
  type: LoadBalancer
```

````mdx-code-block

:::caution for LoadBalancer
当将服务类型设置为 `LoadBalancer` 时，
几乎所有云平台都会为查询服务分配一个公共 IP 地址，
这可能会导致安全问题。

然后需要注释来告诉云平台创建一个内部负载均衡器。

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
      # 必填
      enable_virtual_host_style: true
```

```yaml title="oss 原生"
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

2. 为 `tenant1` 部署查询集群，命名空间为 `databend-query`

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

  这里我们使用内置用户 `databend`：

  * 集群内访问

    ```shell
    mysql -htenant1-databend-query.databend-query.svc -udatabend -P3307 -pdatabend
    ```

  * 使用负载均衡器的集群外访问

    ```shell
    # 这里的地址是上面服务 tenant1-databend-query 的 `EXTERNAL-IP`
    mysql -h172.20.0.2 -udatabend -P3307 -pdatabend
    ```

  * 使用 kubectl 的本地访问

    ```shell
    nohup kubectl port-forward -n databend-query svc/tenant1-databend-query 3307:3307 &
    mysql -h127.0.0.1 -udatabend -P3307 -pdatabend
    ```

5. 为 tenant2 部署第二个集群

修改 `values.yaml` 以适用于 tenant2

```shell
# 可选
helm repo update databend

helm upgrade --install tenant2 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

``` shell title="验证 tenant2 的查询服务运行情况"
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

### 扩容

要扩大或缩小查询集群，有两种方式

* 直接使用 `kubectl`

  ```shell
   # 将查询集群数量缩减到 0
   kubectl -n databend-query scale deployment tenant1-databend-query --replicas=0

   # 将查询集群数量增加到 5
   kubectl -n databend-query scale deployment tenant1-databend-query --replicas=5
  ```

* 在 `values.yaml` 中更新 `replicaCount` 为任意值，然后再次使用 helm 升级

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

要升级查询集群，我们需要修改上面查询集群的 `values.yaml`。

```diff title="diff values.yaml"
replicaCount: 3
+ image:
+   tag: "v0.8.123-nightly"
config:
  query:
    clusterId: example_cluster
```

然后只需再次运行 helm 升级

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
3 行在集 (0.009 秒)
```

### 验证分布式查询工作



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
24行在集 (0.008 秒)
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
注意在部署元数据和查询集群时应启用 `serviceMonitor`。
:::

* 从以下地址下载grafana仪表板文件：[datafuselabs/helm-charts](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)。

* 打开您集群的grafana网页。

* 在左侧边栏选择 `+ Import`，并上传下载的两个json文件。

* 然后您应该可以看到两个仪表板：

  * Databend Meta 运行时
  * Databend Query 运行时

## 下一步

在部署Databend之后，您可能需要了解以下主题：

- [管理设置](/sql/sql-reference/manage-settings)：根据您的需求优化Databend。
- [加载和卸载数据](/guides/load-data)：管理Databend中的数据导入/导出。
- [可视化](/guides/visualize)：将Databend与可视化工具集成以获得洞察力。