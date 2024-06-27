```toml title='databend-query.toml'
[storage.oss]
# Enable server-side encryption
enable_server_side_encryption = true

# Specify the encryption method
# Supported methods: AES256, KMS
server_side_encryption_method = "AES256"

# If using KMS, provide the KMS key ID
# server_side_encryption_kms_key_id = "<your-kms-key-id>"
```

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

// highlight-next-line
endpoint_url = "https://s3.wasabisys.com"

# How to get access_key_id and secret_access_key:
# https://docs.wasabi.com/docs/access-keys-1
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="MinIO" label="MinIO">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

// highlight-next-line
endpoint_url = "http://<your-minio-server>:9000"

# How to get access_key_id and secret_access_key:
# https://min.io/docs/minio/container/administration/console/security-and-access.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="CubeFS" label="CubeFS">

```toml title='databend-query.toml'
[storage]
# cfs
type = "cfs"

[storage.cfs]
// highlight-next-line
bucket = "my_bucket"

// highlight-next-line
endpoint_url = "http://<your-cubefs-endpoint>"

# How to get access_key_id and secret_access_key:
# https://cubefs.io/docs/master/maintenance/admin-api/master/user.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

</Tabs>

</StepContent>

<StepContent number="2">

### Start Query Node

1. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.
2. Run the following command to start the Query node:

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3">

### Check Query Node

Run the following command to check if the Query node was started successfully:

```shell
curl -I  http://127.0.0.1:8000/v1/health
```

</StepContent>

</StepsWrap>

### Step 3: Accessing Databend

Once the Meta and Query nodes are successfully deployed, you can access Databend through the Query node's endpoint.

1. Open a web browser and enter the following URL:

```
http://127.0.0.1:8000
```

2. Log in with your credentials to start using Databend.

### Conclusion

This guide has provided you with the steps to deploy Databend with your object storage. By following these instructions, you can set up a robust and scalable data warehouse solution tailored to your needs. For further assistance or to explore more advanced features, please refer to the [Databend documentation](../00-overview/00-introduction.md).

{/*examples*/}

| 参数                          | 描述                                                                                                                                                                                  | 可用值                                         |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| server_side_encryption        | 指定OSS数据的server-side加密方法。"AES256"使用OSS管理的AES256密钥进行加密，而"KMS"则使用server_side_encryption_key_id中定义的密钥。 | "AES256" 或 "KMS"                                |
| server_side_encryption_key_id | 当server_side_encryption设置为"KMS"时，此参数用于指定OSS的server-side加密密钥ID。仅在使用KMS加密模式时适用。                                                                       | 字符串，KMS加密密钥的唯一标识符。                |
</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

# 可从以下链接获取URL：
# https://wasabi-support.zendesk.com/hc/en-us/articles/360015106031-What-are-the-service-URLs-for-Wasabi-s-different-regions-
// highlight-next-line
endpoint_url = "https://s3.us-east-2.wasabisys.com"

# 如何获取access_key_id和secret_access_key：
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="MinIO" label="MinIO">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
bucket = "my_bucket"
endpoint_url = "<your-endpoint-url>"
access_key_id = "<your-key-id>"
secret_access_key = "<your-access-key>"
```
</TabItem>

<TabItem value="CubeFS" label="CubeFS">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
bucket = "my_bucket"
endpoint_url = "<your-endpoint-url>"
access_key_id = "<your-key-id>"
secret_access_key = "<your-access-key>"
```
</TabItem>

</Tabs>

3. 使用[query.users]部分配置管理员用户。更多信息，请参阅[配置管理员用户](../../04-references/01-admin-users.md)。若要使用默认root用户及"no_password"认证类型，请确保在`databend-query.toml`文件中移除以下行前的'#'字符：

:::caution
本教程中使用"no_password"认证的root用户仅为示例，由于潜在的安全风险，不推荐在生产环境中使用。
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

</StepContent>

<StepContent number="2">

### 启动查询节点

1. 打开终端窗口，导航至`/usr/local/databend/bin`文件夹。
2. 运行以下命令启动查询节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3">

### 检查查询节点

运行以下命令检查查询节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### 步骤3：验证部署

在此步骤中，您将使用[BendSQL](https://github.com/datafuselabs/BendSQL)对Databend运行一个简单查询，以验证部署。

<StepsWrap>

<StepContent number="1">

### 安装BendSQL

按照[安装BendSQL](../../../30-sql-clients/00-bendsql/index.md#安装BendSQL)在您的机器上安装BendSQL。

</StepContent>

<StepContent number="2">

### 连接到Databend

启动BendSQL并检索当前时间以进行验证。

</StepContent>
</StepsWrap>

### 启动/停止Databend

每次启动或停止Databend时，无需单独管理Meta和Query节点。执行`/usr/local/databend/scripts`目录中的脚本，即可一键管理两个节点：

```shell
# 启动Databend
./scripts/start.sh

# 停止Databend
# 此脚本使用KILLALL命令。如未安装，请为您的系统安装psmisc包。
# 例如，在CentOS上：yum install psmisc
./scripts/stop.sh
```

<DetailsWrap>
<details>
  <summary>权限被拒绝？</summary>
  <div>
    如果在尝试启动Databend时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```
运行以下命令后，再次尝试启动Databend：

```shell
sudo mkdir /var/log/databend
sudo mkdir /var/lib/databend
sudo chown -R $USER /var/log/databend
sudo chown -R $USER /var/lib/databend
```
  </div>
</details>
</DetailsWrap>
<GetLatest/>

### 后续步骤

部署Databend后，您可能需要了解以下主题：

- [数据加载与卸载](/guides/load-data)：管理Databend中的数据导入/导出。
- [可视化](/guides/visualize)：将Databend与可视化工具集成以获取洞察。