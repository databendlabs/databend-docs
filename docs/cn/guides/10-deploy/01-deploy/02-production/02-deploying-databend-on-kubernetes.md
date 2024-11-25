```yaml title="values.yaml"
replicaCount: 3
cluster: example_cluster
meta:
  address: databend-meta.databend-meta.svc.cluster.local:9191
  username: databend
  password: databend
serviceMonitor:
  enabled: true
```

2. Deploy the query cluster in namespace `databend-query`

```shell
helm upgrade --install databend-query databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

3. Wait and verify query service running

```shell
❯ kubectl -n databend-query get pods
NAME                READY   STATUS    RESTARTS   AGE
databend-query-0    1/1     Running   0          5m36s
databend-query-1    1/1     Running   0          4m53s
databend-query-2    1/1     Running   0          4m18s
```

### Step 3. Access Databend Query Cluster

1. Forward the service port to local

```shell
kubectl -n databend-query port-forward svc/databend-query 3307:3307
```

2. Connect to the Databend Query cluster using BendSQL

```shell
bendsql --dsn "databend://databend:databend@127.0.0.1:3307/?sslmode=disable"
```

3. Verify the connection

```shell
❯ bendsql
Welcome to BendSQL.
Trying connect to databend@127.0.0.1:3307 ... connected.
databend :) select 1;

SELECT 1;

┌─1─┐
│ 1 │
└───┘

1 row in set. Query took 0.001 seconds.
```

## Next Steps

Congratulations! You have successfully deployed a Databend cluster on Kubernetes. Here are some suggestions for further exploration:

- **Explore Databend**: Learn more about Databend's features and capabilities by visiting the [Databend Documentation](https://databend.rs/doc).
- **Monitor Your Cluster**: Use the Prometheus and Grafana setup to monitor the performance and health of your Databend cluster.
- **Scale Your Cluster**: Experiment with scaling your Databend Query cluster to handle more workloads.
- **Join the Community**: Engage with the Databend community by joining the [Databend Community](https://databend.rs/community).

```yaml
replicaCount: 3
config:
  query:
    clusterId: example_cluster
    # 添加内置用户
    users:
      - name: databend
        # 可用类型：sha256_password, double_sha1_password, no_password, jwt
        authType: double_sha1_password
        # echo -n "databend" | sha1sum | cut -d' ' -f1 | xxd -r -p | sha1sum
        authString: 3081f32caef285c232d066033c89a78d88a6d8a5
  meta:
    # 设置使用远程元数据服务的端点
    # 依赖于之前部署的元数据服务、命名空间和节点
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
# [推荐] 启用从集群外部访问
service:
  type: LoadBalancer
```

````mdx-code-block

:::caution 关于LoadBalancer
当将服务类型设置为 `LoadBalancer` 时，
几乎所有云平台都会为查询服务分配一个公网IP地址，
这可能会导致安全问题。

因此，需要使用注解来告知云平台创建一个内部负载均衡器。

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

:::tip 关于云存储

<Tabs>
<TabItem value="aws" label="S3(aws)">

```yaml
config:
  storage:
    type: s3
    s3:
      # 默认端点
      endpoint_url: "https://s3.amazonaws.com"
      bucket: "<bucket>"
      region: "<region>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      root: ""
```

</TabItem>

<TabItem value="aliyun" label="OSS(阿里云)">

```yaml title="使用s3客户端的oss"
config:
  storage:
    type: s3
    s3:
      # 区域端点URL
      endpoint_url: "https://oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
      # 必需
      enable_virtual_host_style: true
```

```yaml title="原生oss"
config:
  storage:
    type: oss
    oss:
      # 区域端点URL
      endpoint_url: "https://oss-ap-southeast-1.aliyuncs.com"
      bucket: "<bucket>"
      access_key_id: "<key>"
      access_key_secret: "<secret>"
```

</TabItem>

<TabItem value="qcloud" label="COS(腾讯云)">

```yaml title="原生cos"
config:
  storage:
    type: cos
    cos:
      # 区域端点URL
      endpoint_url: "https://cos.ap-singapore.myqcloud.com"
      bucket: "test-databend-1234567890"
      access_key_id: "<key>"
      secret_access_key: "<secret>"
```

</TabItem>

</Tabs>

:::

````

2. 在命名空间 `databend-query` 中为 `tenant1` 部署查询计算集群

```shell
helm repo add databend https://charts.databend.com
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

4. 访问查询计算集群

我们在这里使用内置用户 `databend`：

- 集群内访问

  ```shell
  bendsql -htenant1-databend-query.databend-query.svc -P8000 -udatabend -pdatabend
  ```

- 集群外访问（通过负载均衡器）

  ```shell
  # 这里的地址是上面服务 tenant1-databend-query 的 `EXTERNAL-IP`
  bendsql -h172.20.0.2 -P8000 -udatabend -pdatabend
  ```

- 本地访问（通过kubectl）

  ```shell
  nohup kubectl port-forward -n databend-query svc/tenant1-databend-query 3307:3307 &
  bendsql -h127.0.0.1 -P8000 -udatabend -pdatabend
  ```

5. 为 tenant2 部署第二个计算集群

修改 `values.yaml` 为 tenant2

```shell
# 可选
helm repo update databend

helm upgrade --install tenant2 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

```shell title="验证 tenant2 的查询服务运行"
❯ kubectl -n databend-query get pods
NAME                                      READY   STATUS    RESTARTS   AGE
tenant1-databend-query-66647594c-lkkm9    1/1     Running   0          55m
tenant1-databend-query-66647594c-lpl2s    1/1     Running   0          55m
tenant1-databend-query-66647594c-4hlpw    1/1     Running   0          55m
tenant2-databend-query-59dcc4949f-9qg9b   1/1     Running   0          53s
tenant2-databend-query-59dcc4949f-pfxxj   1/1     Running   0          53s
tenant2-databend-query-59dcc4949f-mmwr9   1/1     Running   0          53s
```

## 维护 Databend 查询计算集群

### 扩展

要扩展或缩减查询计算集群，有两种方法

- 直接使用 `kubectl`

  ```shell
   # 将查询计算集群数量缩减到 0
   kubectl -n databend-query scale statefulset tenant1-databend-query --replicas=0

   # 将查询计算集群数量扩展到 5
   kubectl -n databend-query scale statefulset tenant1-databend-query --replicas=5
  ```

- 将 `values.yaml` 中的 `replicaCount` 更新为任意值，然后再次运行 helm upgrade

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

要升级查询计算集群，我们需要修改上述查询计算集群的 `values.yaml`。

```diff title="diff values.yaml"
replicaCount: 3
+ image:
+   tag: "v0.8.123-nightly"
config:
  query:
    clusterId: example_cluster
```

然后再次运行 helm upgrade

```shell
# 可选
helm repo update databend

helm upgrade --install tenant1 databend/databend-query \
    --namespace databend-query --create-namespace \
    --values values.yaml
```

### 检查计算集群信息

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

### 验证分布式查询工作

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

分布式查询工作正常，计算集群将通过 `flight_api_address` 高效传输数据。

### 上传数据到计算集群

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

## 监控 Meta 和 Query 计算集群

:::info
部署 meta 和 query 计算集群时，请确保启用了 `serviceMonitor`。
:::

- 从以下地址下载 grafana 仪表盘文件：[datafuselabs/helm-charts](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)。

- 打开计算集群的 grafana web。

- 在右上角选择 `+` 展开菜单，点击“导入仪表盘”以导入仪表盘，并上传两个下载的 JSON 文件。

  ![Alt text](/img/deploy/import-dashboard.png)

- 然后你应该会看到两个仪表盘：

  - Databend Meta Runtime

    ![Alt text](/img/deploy/databend-meta-runtime.png)

  - Databend Query Runtime

    ![Alt text](/img/deploy/databend-query-runtime.png)

## 下一步

部署 Databend 后，你可能需要了解以下主题：

- [加载 & 卸载数据](/guides/load-data)：在 Databend 中管理数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取洞察。