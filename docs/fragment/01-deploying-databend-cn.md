import FunctionDescription from '@site/src/components/FunctionDescription';
import DetailsWrap from '@site/src/components/DetailsWrap';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';
import Version from '@site/src/components/Version';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="引入或更新：v1.2.168"/>

本主题介绍如何使用对象存储部署 Databend。有关支持的对象存储解决方案的列表，请参见 [了解部署模式](/guides/deploy/deploy/understanding-deployment-modes)。

### 开始之前

在部署 Databend 之前，请确保您已成功设置对象存储并下载了最新版本的 Databend。

<StepsWrap>
<StepContent number="1">

### 设置对象存储

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

1. 按照 Google 文档中的主题 [创建新存储桶](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket) 创建一个名为 `my_bucket` 的存储桶。
2. 按照 Google 文档中的主题 [创建服务帐号密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 创建并下载服务帐号密钥文件。
3. 使用 Base64 编码将服务帐号密钥文件的内容转换为 Base64 编码的字符串。例如，

```bash
base64 -i <path-to-your-key-file> -o ~/Desktop/base64-encoded-key.txt
```

上面的命令将生成一个名为 `base64-encoded-key.txt` 的文件，其中包含您随后将在 `databend-query.toml` 配置文件中用于配置连接的凭据。

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
- [https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://cloud.tencent.com/document/product/436/13309](https://cloud.tencent.com/document/product/436/13309)
- [https://cloud.tencent.com/document/product/436/68282](https://cloud.tencent.com/document/product/436/68282)

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2](https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2)
- [https://help.aliyun.com/document_detail/53045.htm](https://help.aliyun.com/document_detail/53045.htm)

</TabItem>

<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docsv3.qingcloud.com/storage/object-storage/manual/console/bucket_manage/basic_opt/](https://docsv3.qingcloud.com/storage/object-storage/manual/console/bucket_manage/basic_opt/)
- [https://docsv3.qingcloud.com/development_docs/api/overview/](https://docsv3.qingcloud.com/development_docs/api/overview/)

</TabItem>

<TabItem value="Huawei OBS" label="Huawei OBS">
1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://support.huaweicloud.com/intl/zh-cn/usermanual-obs/zh-cn_topic_0045829088.html](https://support.huaweicloud.com/intl/zh-cn/usermanual-obs/zh-cn_topic_0045829088.html)
- [https://support.huaweicloud.com/intl/zh-cn/api-obs/obs_04_0116.html](https://support.huaweicloud.com/intl/zh-cn/api-obs/obs_04_0116.html)

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.wasabi.com/docs/creating-a-bucket](https://docs.wasabi.com/docs/creating-a-bucket)
- [https://docs.wasabi.com/docs/access-keys-1](https://docs.wasabi.com/docs/access-keys-1)

</TabItem>

<TabItem value="MinIO" label="MinIO">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取用于连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理 MinIO 的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://min.io/docs/minio/container/index.html](https://min.io/docs/minio/container/index.html)
- [https://min.io/docs/minio/container/administration/console/managing-objects.html](https://min.io/docs/minio/container/administration/console/managing-objects.html)
- [https://min.io/docs/minio/container/administration/console/security-and-access.html](https://min.io/docs/minio/container/administration/console/security-and-access.html)

</TabItem>

<TabItem value="CubeFS" label="CubeFS">

1. 启动 ObjectNode 对象网关。
2. 创建一个名为 `my_bucket` 的存储桶或容器。
3. 获取用于连接到您创建的存储桶或容器的端点 URL。
4. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理 CubeFS 的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://cubefs.io/docs/master/quick-start/node.html](https://cubefs.io/docs/master/quick-start/node.html)
- [https://cubefs.io/docs/master/user-guide/objectnode.html](https://cubefs.io/docs/master/user-guide/objectnode.html)
- [https://cubefs.io/docs/master/maintenance/admin-api/master/user.html](https://cubefs.io/docs/master/maintenance/admin-api/master/user.html)

</TabItem>
</Tabs>

</StepContent>

<StepContent number="2">

### 下载 Databend

1. 在 `/usr/local` 目录中创建一个名为 `databend` 的文件夹。
2. 从 [GitHub Release](https://github.com/databendlabs/databend/releases) 页面下载适用于您的平台（Linux `aarch64` 或 `x86_64`）的最新 Databend 版本。
3. 将下载的软件包解压到 `/usr/local/databend`。

</StepContent>

</StepsWrap>

### 步骤 1：部署 Meta 节点

按照以下说明部署 Meta 节点：

<StepsWrap>
<StepContent number="1">

### 启动 Meta 节点

1. 打开一个终端窗口，然后导航到文件夹 `/usr/local/databend/bin`。
2. 运行以下命令以启动 Meta 节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

</StepContent>
<StepContent number="2">

### 检查 Meta 节点

运行以下命令以检查 Meta 节点是否已成功启动：

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

</StepContent>
</StepsWrap>

### 步骤 2：部署 Query 节点

按照以下说明部署 Query 节点：

<StepsWrap>

<StepContent number="1">

### 配置 Query 节点

1. 在文件夹 `/usr/local/databend/configs` 中找到文件 `databend-query.toml`。
2. 在文件 `databend-query.toml` 中，设置 [storage] 块中的参数 _type_，并配置用于连接到对象存储的访问凭据和端点 URL。

要配置存储设置，请通过在每行开头添加 `#` 来注释掉 [storage.fs] 部分。然后，通过删除 `#` 符号来取消注释对象存储提供商的相关部分，并填写您的值。

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

对于 `credential` 参数，粘贴在步骤 [设置对象存储](#setting-up-your-object-storage) 中获得的 Base64 编码的字符串（用双引号括起来）。

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

<TabItem value="Tencent COS" label="Tencent COS">

当指定 `endpoint_url` 参数时，请确保从存储桶的 endpoint 中排除 `<BucketName-APPID>` 部分。例如，如果您的存储桶 endpoint 是 `https://databend-xxxxxxxxxx.cos.ap-beijing.myqcloud.com`，请使用 `https://cos.ap-beijing.myqcloud.com`。有关各个区域中腾讯 COS endpoint 的信息，请参阅 https://www.tencentcloud.com/document/product/436/6224。

```toml title='databend-query.toml'
[storage]
# s3
type = "cos"

[storage.cos]
# 如何创建存储桶：
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "my_bucket"

# 以下示例中，区域为北京 (ap-beijing)。
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# 如何获取 secret_id 和 secret_key：
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
# 此示例使用 OSS 区域 ID：oss-cn-beijing-internal。
endpoint_url = "https://oss-cn-beijing-internal.aliyuncs.com"
# enable_virtual_host_style = true

# 如何获取 access_key_id 和 secret_access_key：
# https://help.aliyun.com/document_detail/53045.htm
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
access_key_secret = "<your-access-key>"
```

Databend 企业版支持 OSS 中的服务器端加密。此功能使您能够通过为存储在 OSS 中的数据激活服务器端加密来增强数据安全性和隐私。您可以选择最适合您需求的加密方法。请注意，您必须拥有有效的 Databend 企业版许可证才能使用此功能。要获取许可证，请参阅 [Databend 授权](/guides/products/dee/license)。

要在 Databend 中启用服务器端加密，请将以下参数添加到 [storage.oss] 部分：

| Parameter                     | Description                                                                                                                                 | Available Values                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| server_side_encryption        | 指定 OSS 数据的服务器端加密方法。"AES256" 使用 OSS 管理的 AES256 密钥进行加密，而 "KMS" 使用在 server_side_encryption_key_id 中定义的密钥。 | "AES256" 或 "KMS"                  |
| server_side_encryption_key_id | 当 server_side_encryption 设置为 "KMS" 时，此参数用于指定 OSS 的服务器端加密密钥 ID。它仅在使用 KMS 加密模式时适用。                        | 字符串，KMS 加密密钥的唯一标识符。 |

</TabItem>

<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

```toml title='databend-query.toml'
[storage]
# s3
type = "s3"

[storage.s3]
// highlight-next-line
bucket = "my_bucket"

# 您可以从存储桶详情页面获取 URL。
# https://docsv3.qingcloud.com/storage/object-storage/intro/object-storage/#zone
# 使用与 AWS S3 兼容的 API。您需要在域名中添加一个 s3 子域名，例如 https://s3.<zone-id>.qingstor.com
// highlight-next-line
endpoint_url = "https://s3.pek3b.qingstor.com"

# 如何获取 access_key_id 和 secret_access_key：
# https://docsv3.qingcloud.com/development_docs/api/overview/
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="Huawei OBS" label="Huawei OBS">

```toml title='databend-query.toml'
[storage]
# obs
type = "obs"
[storage.obs]
// highlight-next-line
bucket = "my_bucket"
# 您可以从存储桶详情页面获取 URL
// highlight-next-line
endpoint_url = "https://obs.<obs-region>.myhuaweicloud.com"
# 如何获取 access_key_id 和 secret_access_key:
# https://support.huaweicloud.com/intl/zh-cn/api-obs/obs_04_0116.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
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

# 您可以从以下位置获取 URL：
# https://wasabi-support.zendesk.com/hc/en-us/articles/360015106031-What-are-the-service-URLs-for-Wasabi-s-different-regions-
// highlight-next-line
endpoint_url = "https://s3.us-east-2.wasabisys.com"

# 如何获取 access_key_id 和 secret_access_key：
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

3. 使用 [query.users] 部分配置管理员用户。有关更多信息，请参阅 [配置管理员用户](/guides/deploy/references/admin-users)。要继续使用默认的 root 用户和 "no_password" 身份验证类型，请确保删除文件 `databend-query.toml` 中以下行之前的 '#' 字符：

:::caution
在本教程中使用 "no_password" 身份验证 root 用户只是一个示例，由于潜在的安全风险，不建议在生产环境中使用。
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

1. 打开一个终端窗口，导航到文件夹 `/usr/local/databend/bin`。
2. 运行以下命令以启动 Query 节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3">

### 检查 Query 节点

运行以下命令以检查 Query 节点是否已成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### 步骤 3：验证部署

在此步骤中，您将使用 [BendSQL](https://github.com/databendlabs/BendSQL) 针对 Databend 运行一个简单的查询，以验证部署。

<StepsWrap>

<StepContent number="1">

### 安装 BendSQL

按照 [安装 BendSQL](/guides/sql-clients/bendsql/#installing-bendsql) 在您的机器上安装 BendSQL。

</StepContent>

<StepContent number="2">

### 连接到 Databend

启动 BendSQL 并检索当前时间以进行验证。

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

部署 Databend 后，您可能需要了解以下主题：

- [加载和卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取见解。
