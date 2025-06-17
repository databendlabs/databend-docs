import FunctionDescription from '@site/src/components/FunctionDescription';
import DetailsWrap from '@site/src/components/DetailsWrap';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';
import Version from '@site/src/components/Version';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新于：v1.2.168"/>

本主题介绍如何使用你自己的对象存储（Object Storage）来部署 Databend。有关支持的对象存储解决方案列表，请参见 [了解部署模式](/guides/deploy/deploy/understanding-deployment-modes)。

### 准备工作

在部署 Databend 之前，请确保你已成功设置好对象存储并下载了最新版本的 Databend。

<StepsWrap>
<StepContent number="1">

### 设置对象存储

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

1. 创建一个名为 `my_bucket` 的存储桶（Bucket）或容器（Container）。
2. 获取用于连接到你所创建的存储桶或容器的端点 URL（Endpoint URL）。
3. 获取你账户的访问密钥 ID（Access Key ID）和私有访问密钥（Secret Access Key）。

有关如何为你的云对象存储管理存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些你可能需要的有用链接：

- [https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

1. 遵循 Google 文档中的 [Create a new bucket](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket) 主题，创建一个名为 `my_bucket` 的存储桶（Bucket）。
2. 遵循 Google 文档中的 [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) 主题，创建并下载一个服务账户密钥（Service Account Key）文件。
3. 使用 Base64 编码将服务账户密钥文件的内容转换为 Base64 编码的字符串。例如：

```bash
base64 -i <path-to-your-key-file> -o ~/Desktop/base64-encoded-key.txt
```

上述命令将生成一个名为 `base64-encoded-key.txt` 的文件，其中包含你稍后将在 `databend-query.toml` 配置文件中用于配置连接的凭据。

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

1. 创建一个名为 `my_bucket` 的存储桶（Bucket）或容器（Container）。
2. 获取用于连接到你所创建的存储桶或容器的端点 URL（Endpoint URL）。
3. 获取你账户的访问密钥 ID（Access Key ID）和私有访问密钥（Secret Access Key）。

有关如何为你的云对象存储管理存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些你可能需要的有用链接：

- [https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
- [https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

1. 创建一个名为 `my_bucket` 的存储桶（Bucket）或容器（Container）。
2. 获取用于连接到你所创建的存储桶或容器的端点 URL（Endpoint URL）。
3. 获取你账户的访问密钥 ID（Access Key ID）和私有访问密钥（Secret Access Key）。

有关如何为你的云对象存储管理存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些你可能需要的有用链接：

- [https://docs.wasabi.com/docs/creating-a-bucket](https://docs.wasabi.com/docs/creating-a-bucket)
- [https://docs.wasabi.com/docs/access-keys-1](https://docs.wasabi.com/docs/access-keys-1)

</TabItem>

<TabItem value="MinIO" label="MinIO">

1. 创建一个名为 `my_bucket` 的存储桶（Bucket）或容器（Container）。
2. 获取用于连接到你所创建的存储桶或容器的端点 URL（Endpoint URL）。
3. 获取你账户的访问密钥 ID（Access Key ID）和私有访问密钥（Secret Access Key）。

有关如何为你的 MinIO 管理存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些你可能需要的有用链接：

- [https://min.io/docs/minio/container/index.html](https://min.io/docs/minio/container/index.html)
- [https://min.io/docs/minio/container/administration/console/managing-objects.html](https://min.io/docs/minio/container/administration/console/managing-objects.html)
- [https://min.io/docs/minio/container/administration/console/security-and-access.html](https://min.io/docs/minio/container/administration/console/security-and-access.html)

</TabItem>

<TabItem value="CubeFS" label="CubeFS">

1. 启动 ObjectNode 对象网关。
2. 创建一个名为 `my_bucket` 的存储桶（Bucket）或容器（Container）。
3. 获取用于连接到你所创建的存储桶或容器的端点 URL（Endpoint URL）。
4. 获取你账户的访问密钥 ID（Access Key ID）和私有访问密钥（Secret Access Key）。

有关如何为你的 CubeFS 管理存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些你可能需要的有用链接：

- [https://cubefs.io/docs/master/quick-start/node.html](https://cubefs.io/docs/master/quick-start/node.html)
- [https://cubefs.io/docs/master/user-guide/objectnode.html](https://cubefs.io/docs/master/user-guide/objectnode.html)
- [https://cubefs.io/docs/master/maintenance/admin-api/master/user.html](https://cubefs.io/docs/master/maintenance/admin-api/master/user.html)

</TabItem>
</Tabs>

</StepContent>

<StepContent number="2">

### 下载 Databend

1. 在 `/usr/local` 目录下创建一个名为 `databend` 的文件夹。
2. 从 [GitHub Release](https://github.com/databendlabs/databend/releases) 页面为你的平台（Linux `aarch64` 或 `x86_64`）下载最新的 Databend 版本。
3. 将下载的包解压到 `/usr/local/databend`。

</StepContent>

</StepsWrap>

### 步骤 1：部署 Meta 节点（Meta Node）

请按照以下说明部署 Meta 节点：

<StepsWrap>
<StepContent number="1">

### 启动 Meta 节点

1. 打开一个终端窗口，并导航到 `/usr/local/databend/bin` 文件夹。
2. 运行以下命令启动 Meta 节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

</StepContent>
<StepContent number="2">

### 检查 Meta 节点

运行以下命令检查 Meta 节点是否成功启动：

```shell
curl -I  http://127.0.0.1:28002/v1/health
```

</StepContent>
</StepsWrap>

### 步骤 2：部署 Query 节点（Query Node）

请按照以下说明部署 Query 节点：

<StepsWrap>

<StepContent number="1">

### 配置 Query 节点

1. 在 `/usr/local/databend/configs` 文件夹中找到 `databend-query.toml` 文件。
2. 在 `databend-query.toml` 文件中，设置 [storage] 块中的参数 *type*，并配置用于连接到你的对象存储的访问凭据（Access Credentials）和端点 URL。

要配置你的存储设置，请在每行开头添加 `#` 来注释掉 [storage.fs] 部分。然后，通过删除 `#` 符号来取消注释与你的对象存储提供商相关的部分，并填写你的值。

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

# How to get access_key_id and secret_access_key:
# https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

对于 `credential` 参数，请粘贴在[设置对象存储](#设置对象存储)步骤中获取的 Base64 编码字符串（用双引号括起来）。

```toml title='databend-query.toml'
[storage]
# gcs
type = "gcs"

[storage.gcs]
bucket = "my_bucket"

# endpoint_url defaults to "https://storage.googleapis.com"
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

<TabItem value="Wasabi" label="Wasabi">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

# You can get the URL from:
# https://wasabi-support.zendesk.com/hc/en-us/articles/360015106031-What-are-the-service-URLs-for-Wasabi-s-different-regions-
// highlight-next-line
endpoint_url = "https://s3.us-east-2.wasabisys.com"

# How to get access_key_id and secret_access_key:
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

3. 使用 [query.users] 部分配置一个管理员用户。更多信息，请参见[配置管理员用户](/guides/deploy/references/admin-users)。要继续使用默认的 root 用户和 "no_password" 认证类型，请确保在 `databend-query.toml` 文件中删除以下行之前的 '#' 字符：

:::caution
在本教程中为 root 用户使用 "no_password" 认证仅为示例，由于潜在的安全风险，不建议在生产环境中使用。
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

### 启动 Query 节点

1. 打开一个终端窗口，并导航到 `/usr/local/databend/bin` 文件夹。
2. 运行以下命令启动 Query 节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3">

### 检查 Query 节点

运行以下命令检查 Query 节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### 步骤 3：验证部署

在此步骤中，你将使用 [BendSQL](https://github.com/databendlabs/BendSQL) 对 Databend 运行一个简单的查询（Query）以验证部署。

<StepsWrap>

<StepContent number="1">

### 安装 BendSQL

请按照 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql) 在你的机器上安装 BendSQL。

</StepContent>

<StepContent number="2">

### 连接到 Databend

启动 BendSQL 并获取当前时间以进行验证。

```bash
➜  ~ bendsql
Welcome to BendSQL 0.24.7-ff9563a(2024-12-27T03:23:17.723492000Z).
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.714-nightly-59a3e4bd20(rust-1.85.0-nightly-2025-03-30T09:36:19.609323900Z)
Loaded 1406 auto complete keywords from server.
Started web server at 127.0.0.1:8080

root@localhost:8000/default> SELECT NOW();

SELECT NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2025-04-11 02:36:18.343596 │
└────────────────────────────┘
1 row read in 0.004 sec. Processed 1 row, 1 B (250 rows/s, 250 B/s)

root@localhost:8000/default>
```

</StepContent>
</StepsWrap>

### 后续步骤

部署 Databend 后，你可能需要了解以下主题：

- [加载和卸载数据](/guides/load-data)：在 Databend 中管理数据的导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取洞察。