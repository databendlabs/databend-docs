```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-unknown-linux-gnu.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-unknown-linux-gnu.tar.gz
```

</TabItem>
<TabItem value="macos-x86_64" label="macOS(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-x86_64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-apple-darwin.tar.gz
```

</TabItem>
<TabItem value="macos-arm64" label="macOS(Arm)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-apple-darwin.tar.gz
```

</TabItem>
</Tabs>

</StepContent>
</StepsWrap>

### Configuring Databend

After downloading Databend, you need to configure it to work with your object storage. This involves editing the `databend-query.toml` configuration file.

<DetailsWrap>
<StepContent number="1" title="Edit the databend-query.toml file">

1. Open the `databend-query.toml` file in your favorite text editor.
2. Configure the object storage settings according to your object storage provider. Here is an example configuration for Amazon S3:

```toml
[storage]
type = "s3"
bucket = "my_bucket"
endpoint_url = "https://s3.amazonaws.com"
access_key_id = "your_access_key_id"
secret_access_key = "your_secret_access_key"
```

3. Save the changes to the `databend-query.toml` file.

</StepContent>
</DetailsWrap>

### Starting Databend

With the configuration complete, you can now start Databend.

<StepsWrap>
<StepContent number="1" title="Start Databend">

1. Navigate to the `databend` directory.
2. Run the following command to start Databend:

```shell
./databend-query -c databend-query.toml
```

</StepContent>
</StepsWrap>

Congratulations! You have successfully deployed Databend with your object storage.

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

</TabItem>
</Tabs>

3. 将解压后的文件夹 `bin`、`configs` 和 `scripts` 移动到文件夹 `/usr/local/databend` 中。

</StepContent>

</StepsWrap>

### 步骤 1：部署 Meta 节点

按照以下说明部署 Meta 节点：

<StepsWrap>
<StepContent number="1" title="启动 Meta 节点">

1. 打开一个终端窗口并导航到文件夹 `/usr/local/databend/bin`。
2. 运行以下命令以启动 Meta 节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

</StepContent>
<StepContent number="2" title="检查 Meta 节点">

运行以下命令以检查 Meta 节点是否成功启动：

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

</StepContent>
</StepsWrap>

### 步骤 2：部署查询节点

按照以下说明部署查询节点：

<StepsWrap>

<StepContent number="1" title="配置查询节点">

1. 在文件夹 `/usr/local/databend/configs` 中找到文件 `databend-query.toml`。
2. 在文件 `databend-query.toml` 中，设置 [storage] 块中的参数 *type* 并配置访问凭证和端点 URL 以连接到您的对象存储。

要配置您的存储设置，请通过在每行前添加 `#` 来注释掉 [storage.fs] 部分。然后，通过删除 `#` 符号来取消注释您的对象存储提供商的相关部分，并填写您的值。

<Tabs groupId="operating-systems">

<TabItem value="Amazon S3" label="Amazon S3">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
# https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html
bucket = "my_bucket"
endpoint_url = "https://s3.amazonaws.com"

# 如何获取 access_key_id 和 secret_access_key:
# https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

对于 `credential` 参数，请粘贴在步骤 [设置您的对象存储](#setting-up-your-object-storage) 中获得的 Base64 编码字符串（用双引号括起来）。

```toml title='databend-query.toml'
[storage]
# gcs
type = "gcs"

[storage.gcs]
bucket = "my_bucket"

# endpoint_url 默认为 "https://storage.googleapis.com"

credential = "<your-credential>"
```

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

```toml title='databend-query.toml'
[storage]
# azblob
type = "azblob"

[storage.azblob]
endpoint_url = "https://<your-storage-account-name>.blob.core.windows.net"

# https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container
container = "my_bucket"
account_name = "<your-storage-account-name>"

# https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys
account_key = "<your-account-key>"
```

</TabItem>


<TabItem value="Tencent COS" label="Tencent COS">

在指定 `endpoint_url` 参数时，请确保从您的存储桶端点中排除 `<BucketName-APPID>` 部分。例如，如果您的存储桶端点为 `https://databend-xxxxxxxxxx.cos.ap-beijing.myqcloud.com`，请使用 `https://cos.ap-beijing.myqcloud.com`。有关各个地区的腾讯 COS 端点，请参考 https://www.tencentcloud.com/document/product/436/6224。

```toml title='databend-query.toml'
[storage]
# s3
type = "cos"

[storage.cos]
# 如何创建存储桶:
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "my_bucket"

# 以下是一个区域为北京（ap-beijing）的示例。
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# 如何获取 secret_id 和 secret_key:
# https://cloud.tencent.com/document/product/436/68282
// highlight-next-line
secret_id = "<your-secret-id>"
// highlight-next-line
secret_key = "<your-secret-key>"
```
</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

```toml title='databend-query.toml'
[storage]
type = "oss"

[storage.oss]
// highlight-next-line
bucket = "my_bucket"

# 您可以从存储桶详情页面获取 URL。
// highlight-next-line
# https://help.aliyun.com/document_detail/31837.htm
// highlight-next-line
# https://<bucket-name>.<region-id>[-internal].aliyuncs.com
// highlight-next-line
# 此示例使用 OSS 区域 id: oss-cn-beijing-internal。
endpoint_url = "https://oss-cn-beijing-internal.aliyuncs.com"
# enable_virtual_host_style = true

# 如何获取 access_key_id 和 secret_access_key:
# https://help.aliyun.com/document_detail/53045.htm
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

Databend 企业版支持在 OSS 中启用服务器端加密。此功能允许您通过为存储在 OSS 中的数据激活服务器端加密来增强数据安全性和隐私性。您可以选择最适合您需求的加密方法。请注意，您必须拥有有效的 Databend 企业版许可证才能使用此功能。要获取一个，请参见 [许可 Databend](../../../00-overview/00-editions/01-dee/20-license.md)。

要在 Databend 中启用服务器端加密，请在 [storage.oss] 部分添加以下参数：



| 参数                             | 描述                                                                                                                                                                                     | 可用值                                                  |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| server_side_encryption        | 指定OSS数据的服务器端加密方法。“AES256”使用OSS管理的AES256密钥进行加密，而“KMS”则使用在server_side_encryption_key_id中定义的密钥。                                                         | “AES256”或“KMS”                                       |
| server_side_encryption_key_id | 当server_side_encryption设置为“KMS”时，此参数用于指定OSS的服务器端加密密钥ID。仅在使用KMS加密模式时适用。                                                                                       | 字符串，KMS加密密钥的唯一标识符。                         |
</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

# 您可以从以下链接获取URL：
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

3. 使用[query.users]部分配置管理员用户。更多信息，请参见[配置管理员用户](../../04-references/01-admin-users.md)。要使用默认的root用户和“no_password”认证类型，请确保在`databend-query.toml`文件中删除以下行前的‘#’字符：

:::caution
在本教程中使用“no_password”认证类型为root用户仅作为示例，并不推荐用于生产环境，因为可能存在安全风险。
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

</StepContent>

<StepContent number="2" title="启动查询节点">

1. 打开终端窗口并导航到文件夹`/usr/local/databend/bin`。
2. 运行以下命令以启动查询节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3" title="检查查询节点">

运行以下命令以检查查询节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### 第3步：验证部署

在此步骤中，您将使用[BendSQL](https://github.com/datafuselabs/BendSQL)对Databend运行一个简单的查询以验证部署。

<StepsWrap>

<StepContent number="1" title="安装BendSQL">

遵循[安装BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql)在您的机器上安装BendSQL。

</StepContent>

<StepContent number="2" title="连接到Databend">

遵循[使用BendSQL连接到Databend](../../../30-sql-clients/00-bendsql/00-connect-to-databend.md)启动BendSQL并检索当前时间以进行验证。

</StepContent>
</StepsWrap>

### 启动/停止Databend

每次您启动或停止Databend时，无需单独管理Meta和查询节点。执行`/usr/local/databend/scripts`目录中的脚本以一次性处理两个节点：

```shell
# 启动Databend
./scripts/start.sh

# 停止Databend
# 此脚本使用KILLALL命令。如果未安装，请为您的系统安装psmisc包。
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
Databend Query启动失败，原因：Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```
运行以下命令然后再次尝试启动Databend：

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

### 下一步

在部署Databend之后，您可能需要了解以下主题：

- [加载和卸载数据](/guides/load-data)：在Databend中管理数据导入/导出。
- [可视化](/guides/visualize)：将Databend与可视化工具集成以获得洞察。