---
title: 使用对象存储部署
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import DetailsWrap from '@site/src/components/DetailsWrap';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';
import Version from '@site/src/components/Version';

<FunctionDescription description="引入或更新: v1.2.168"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='存储加密'/>

本主题介绍如何使用您的对象存储部署 Databend。有关支持的对象存储解决方案列表，请参阅[了解部署模式](../00-understanding-deployment-modes.md)。

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
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

1. 按照 Google 文档中的主题 [创建新存储桶](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket) 创建一个名为 `my_bucket` 的存储桶。
2. 按照 Google 文档中的主题 [创建服务账户密钥](https://cloud.google.com/iam/docs/keys-create-delete#creating) 创建并下载服务账户密钥文件。
3. 使用 Base64 编码将服务账户密钥文件的内容转换为 Base64 编码字符串。例如，

```bash
base64 -i <path-to-your-key-file> -o ~/Desktop/base64-encoded-key.txt
```

上述命令将生成一个名为 `base64-encoded-key.txt` 的文件，其中包含您随后将在 `databend-query.toml` 配置文件中用于配置连接的凭证。

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
- [https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://cloud.tencent.com/document/product/436/13309](https://cloud.tencent.com/document/product/436/13309)
- [https://cloud.tencent.com/document/product/436/68282](https://cloud.tencent.com/document/product/436/68282)

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2](https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2)
- [https://help.aliyun.com/document_detail/53045.htm](https://help.aliyun.com/document_detail/53045.htm)

</TabItem>

<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
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
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理云对象存储的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://docs.wasabi.com/docs/creating-a-bucket](https://docs.wasabi.com/docs/creating-a-bucket)
- [https://docs.wasabi.com/docs/access-keys-1](https://docs.wasabi.com/docs/access-keys-1)

</TabItem>

<TabItem value="MinIO" label="MinIO">

1. 创建一个名为 `my_bucket` 的存储桶或容器。
2. 获取连接到您创建的存储桶或容器的端点 URL。
3. 获取您账户的访问密钥 ID 和秘密访问密钥。

有关如何管理 MinIO 的存储桶和访问密钥的信息，请参阅解决方案提供商的用户手册。以下是一些可能有用的链接：

- [https://min.io/docs/minio/container/index.html](https://min.io/docs/minio/container/index.html)
- [https://min.io/docs/minio/container/administration/console/managing-objects.html](https://min.io/docs/minio/container/administration/console/managing-objects.html)
- [https://min.io/docs/minio/container/administration/console/security-and-access.html](https://min.io/docs/minio/container/administration/console/security-and-access.html)

</TabItem>
<TabItem value="CubeFS" label="CubeFS">

1. 启动 ObjectNode 对象网关。
2. 创建一个名为 `my_bucket` 的存储桶或容器。
3. 获取连接到您创建的存储桶或容器的端点 URL。
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

1. 在目录 `/usr/local` 中创建一个名为 `databend` 的文件夹。
2. 从 [GitHub Release](https://github.com/datafuselabs/databend/releases) 下载并提取适用于您平台的最新 Databend 版本：

<Tabs>
<TabItem value="linux-x86_64" label="Linux(x86)">

<Version>
```shell
curl -LJO https://repo.databend.com/databend/[version]/databend-[version]-x86_64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-[version]-x86_64-unknown-linux-musl.tar.gz
```

</Version>

</TabItem>
<TabItem value="linux-arm64" label="Linux(Arm)">

<Version>
```shell
curl -LJO https://repo.databend.com/databend/[version]/databend-[version]-aarch64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-[version]-aarch64-unknown-linux-musl.tar.gz
```

</Version>
</TabItem>
</Tabs>

3. 将提取的文件夹 `bin`、`configs` 和 `scripts` 移动到文件夹 `/usr/local/databend`。

</StepContent>

</StepsWrap>

### 步骤 1：部署 Meta 节点

按照以下说明部署 Meta 节点：

<StepsWrap>
<StepContent number="1">

### 启动 Meta 节点

1. 打开终端窗口并导航到文件夹 `/usr/local/databend/bin`。
2. 运行以下命令以启动 Meta 节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

</StepContent>
<StepContent number="2">

### 检查 Meta 节点

运行以下命令以检查 Meta 节点是否成功启动：

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
2. 在文件 `databend-query.toml` 中，设置 [storage] 块中的参数 *type*，并配置连接到您的对象存储的访问凭证和端点 URL。

要配置您的存储设置，请通过在每行开头添加 `#` 来注释掉 [storage.fs] 部分。然后，通过删除 `#` 符号来取消注释适用于您的对象存储提供商的相关部分，并填写您的值。

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

对于 `credential` 参数，粘贴在步骤[设置您的对象存储](#setting-up-your-object-storage)中获得的 Base64 编码字符串（用双引号括起来）。

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

在指定 `endpoint_url` 参数时，请确保从您的存储桶端点中排除 `<BucketName-APPID>` 部分。例如，如果您的存储桶端点是 `https://databend-xxxxxxxxxx.cos.ap-beijing.myqcloud.com`，请使用 `https://cos.ap-beijing.myqcloud.com`。有关腾讯云 COS 在各个区域的端点，请参阅 https://www.tencentcloud.com/document/product/436/6224。

```toml title='databend-query.toml'
[storage]
# s3
type = "cos"

[storage.cos]
# 如何创建存储桶：
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "my_bucket"

# 以下是区域为北京 (ap-beijing) 的示例。
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
# 此示例使用 OSS 区域 ID: oss-cn-beijing-internal。
endpoint_url = "https://oss-cn-beijing-internal.aliyuncs.com"
# enable_virtual_host_style = true

# 如何获取 access_key_id 和 secret_access_key:
# https://help.aliyun.com/document_detail/53045.htm
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

Databend 企业版支持 OSS 中的服务器端加密。此功能使您能够通过为存储在 OSS 中的数据激活服务器端加密来增强数据安全性和隐私。您可以选择最适合您需求的加密方法。请注意，您必须拥有有效的 Databend 企业版许可证才能使用此功能。要获取许可证，请参阅 [Licensing Databend](../../../00-overview/00-editions/01-dee/20-license.md)。

要在 Databend 中启用服务器端加密，请将以下参数添加到 [storage.oss] 部分：

| 参数                          | 描述                                                                                                                                                                              | 可用值                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| server_side_encryption        | 指定 OSS 数据的服务器端加密方法。"AES256" 使用 OSS 管理的 AES256 密钥进行加密，而 "KMS" 使用 server_side_encryption_key_id 中定义的密钥。 | "AES256" 或 "KMS"                                       |
| server_side_encryption_key_id | 当 server_side_encryption 设置为 "KMS" 时，此参数用于指定 OSS 的服务器端加密密钥 ID。它仅在使用 KMS 加密模式时适用。      | 字符串，KMS 加密密钥的唯一标识符。 |

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
# 使用与 AWS S3 兼容的 API。您需要在域名前添加 s3 子域，例如 https://s3.<zone-id>.qingstor.com
// highlight-next-line
endpoint_url = "https://s3.pek3b.qingstor.com"

# 如何获取 access_key_id 和 secret_access_key:
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
# 您可以从存储桶详情页面获取 URL。
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

# 您可以从以下链接获取 URL:
# https://wasabi-support.zendesk.com/hc/en-us/articles/360015106031-What-are-the-service-URLs-for-Wasabi-s-different-regions-
// highlight-next-line
endpoint_url = "https://s3.us-east-2.wasabisys.com"

# 如何获取 access_key_id 和 secret_access_key:
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

3. 使用 [query.users] 部分配置管理员用户。有关更多信息，请参阅 [配置管理员用户](../../04-references/01-admin-users.md)。要继续使用默认的 root 用户和 "no_password" 认证类型，请确保在文件 `databend-query.toml` 中删除以下行前的 '#' 字符：

:::caution
在本教程中使用 "no_password" 认证的 root 用户只是一个示例，不建议在生产环境中使用，因为可能存在安全风险。
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

1. 打开终端窗口并导航到文件夹 `/usr/local/databend/bin`。
2. 运行以下命令以启动查询节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

</StepContent>

<StepContent number="3">

### 检查查询节点

运行以下命令以检查查询节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### 步骤 3：验证部署

在此步骤中，您将使用 [BendSQL](https://github.com/datafuselabs/BendSQL) 对 Databend 运行简单查询以验证部署。

<StepsWrap>

<StepContent number="1">

### 安装 BendSQL

按照 [安装 BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql) 在您的机器上安装 BendSQL。

</StepContent>

<StepContent number="2">

### 连接到 Databend

启动 BendSQL 并检索当前时间以进行验证。

</StepContent>
</StepsWrap>

### 启动/停止 Databend

每次启动或停止 Databend 时，无需单独管理 Meta 和 Query 节点。执行 `/usr/local/databend/scripts` 目录中的脚本，以一次性处理两个节点：

```shell
# 启动 Databend
./scripts/start.sh

# 停止 Databend
# 此脚本使用 KILLALL 命令。如果未安装，请为您的系统安装 psmisc 包。
# 例如，在 CentOS 上：yum install psmisc
./scripts/stop.sh
```

<DetailsWrap>
<details>
  <summary>权限被拒绝？</summary>
  <div>
    如果您在尝试启动 Databend 时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```

运行以下命令并再次尝试启动 Databend：

```shell
sudo mkdir /var/log/databend
sudo mkdir /var/lib/databend
sudo chown -R $USER /var/log/databend
sudo chown -R $USER /var/lib/databend
```

  </div>
</details>
</DetailsWrap>

### 下一步

部署 Databend 后，您可能需要了解以下主题：

- [加载 & 卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取洞察。