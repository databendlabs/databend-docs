---
title: 部署独立的 Databend
sidebar_label: 部署独立的 Databend
description: 部署独立的 Databend
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='存储加密'/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';

## 部署独立的 Databend

Databend 既支持自托管也支持云对象存储解决方案。本主题将解释如何利用对象存储部署 Databend 。有关支持的对象存储解决方案列表，请参见[了解部署模式](./00-understanding-deployment-modes.md)。

:::note
不建议在 MinIO 上部署 Databend 用于生产环境或性能测试。
:::

### 设置您的对象存储

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">

<TabItem value="Amazon S3" label="Amazon S3">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html>
- <https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶。
- 获取您账户的 Google Cloud Storage OAuth2 凭证。

有关如何在 Google Cloud Storage 中管理存储桶和 OAuth2 凭证的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://cloud.google.com/storage/docs/creating-buckets>
- <https://cloud.google.com/storage/docs/authentication#apiauth>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container>
- <https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://cloud.tencent.com/document/product/436/13309>
- <https://cloud.tencent.com/document/product/436/68282>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba OSS">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2>
- <https://help.aliyun.com/document_detail/53045.htm>

<CommonDownloadDesc />

</TabItem>

<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://docsv3.qingcloud.com/storage/object-storage/manual/console/bucket_manage/basic_opt/>
- <https://docsv3.qingcloud.com/development_docs/api/overview/>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

在部署 Databend 之前，请确保您已经在云中成功设置了对象存储环境，并且已经完成以下任务：

- 创建一个名为 `databend` 的存储桶或容器。
- 获取用于连接到您创建的存储桶或容器的端点 URL。
- 获取您账户的 Access Key ID 和 Secret Access Key。

有关如何管理云对象存储的存储桶和 Access Keys 的信息，请参考解决方案提供商的用户手册。以下是您可能需要的一些有用链接：

- <https://docs.wasabi.com/docs/creating-a-bucket>
- <https://docs.wasabi.com/docs/access-keys-1>

<CommonDownloadDesc />

</TabItem>

<TabItem value="MinIO" label="MinIO">

a. 按照 [MinIO 快速入门指南](https://docs.min.io/docs/minio-quickstart-guide.html) 下载并安装 MinIO 包到您的本地机器。

b. 打开一个终端窗口并导航到存储 MinIO 的文件夹。

c. 运行命令 `vim server.sh` 创建一个包含以下内容的文件：

```shell
~/minio$ cat server.sh
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin
./minio server --address :9900 ./data
```

d. 运行以下命令以启动 MinIO 服务器：

```shell
chmod +x server.sh
./server.sh
```

e. 在浏览器中，访问 <http://127.0.0.1:9900> 并输入凭证（`minioadmin` / `minioadmin`）登录 MinIO 控制台。

f. 在 MinIO 控制台中，创建一个名为 `databend` 的存储桶。

<CommonDownloadDesc />

</TabItem>

<TabItem value="HDFS" label="HDFS">

在部署 Databend 之前，请确保您已经成功设置了 Hadoop 环境，并完成了以下任务：

- 您的系统已经安装了支持 JVM 的 Java SDK。
- 获取连接到 HDFS 的名称节点 URL。
- 您已经下载了 Hadoop 发行版到您的系统，并且可以访问发行版中的 JAR 包。

### 下载 Databend

a. 在目录`/usr/local`中创建一个名为`databend`的文件夹。

b. 从[GitHub Release](https://github.com/datafuselabs/databend/releases)下载并解压您平台上的最新 Databend 发行版：

:::note
要使用 HDFS 作为存储后端，请下载文件名格式为`databend-hdfs-${version}-${target-platform}.tar.gz`的发行版。
:::

<Tabs>

<TabItem value="linux-x86_64" label="Linux(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-hdfs-${version}-x86_64-unknown-linux-gnu.tar.gz
```

```shell
tar xzvf databend-hdfs-${version}-x86_64-unknown-linux-gnu.tar.gz
```

</TabItem>

</Tabs>

c. 将解压出的`bin`、`configs`和`scripts`文件夹移动到`/usr/local/databend`文件夹中。

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

在部署 Databend 之前，请确保您已经成功设置了 Hadoop 环境，并且已经完成以下任务：

- 在 Hadoop 上启用 WebHDFS 支持。
- 获取连接到 WebHDFS 的端点 URL。
- 获取用于认证的委托令牌（如果需要）。

有关如何在 Apache Hadoop 上启用和管理 WebHDFS 的信息，请参考 WebHDFS 的手册。以下是一些您可能会觉得有用的链接：

- <https://hadoop.apache.org/docs/r3.3.2/hadoop-project-dist/hadoop-hdfs/WebHDFS.html>

<CommonDownloadDesc />

</TabItem>
</Tabs>

### 部署元节点

a. 打开文件夹`/usr/local/databend/configs`中的文件`databend-meta.toml`，并将整个文件中的`127.0.0.1`替换为`0.0.0.0`。

b. 打开一个终端窗口并导航到文件夹`/usr/local/databend/bin`。

c. 运行以下命令以启动元节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

d. 运行以下命令以检查元节点是否成功启动：

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

### 部署查询节点

a. 打开文件夹`/usr/local/databend/configs`中的文件`databend-query.toml`，并将整个文件中的`127.0.0.1`替换为`0.0.0.0`。

b. 在文件`databend-query.toml`中，设置[storage]块中的参数*type*，并配置访问凭证和端点 URL 以连接到您的对象存储。

要配置您的存储设置，请通过在每行前添加'#'来注释掉[storage.fs]部分，然后通过移除'#'符号来取消注释适合您的对象存储提供商的相应部分，并填写必要的值。如果您希望的存储提供商未列出，您可以将下面的相应模板复制并粘贴到文件中，并相应地配置它。

<Tabs groupId="operating-systems">

<TabItem value="Amazon S3" label="Amazon S3">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
# https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html
bucket = "databend"
endpoint_url = "https://s3.amazonaws.com"

# 如何获取 access_key_id 和 secret_access_key：
# https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

```toml
[storage]
# gcs
type = "gcs"

[storage.gcs]
# 如何创建存储桶：
# https://cloud.google.com/storage/docs/creating-buckets
// highlight-next-line
bucket = "databend"

# GCS 也支持更改端点 URL
# 但端点应该与 GCS 的 JSON API 兼容
# 默认：
# endpoint_url = "https://storage.googleapis.com"

# GCS 的工作目录
# 默认：
# root = "/"

// highlight-next-line
credential = "<your-credential>"
```

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

```toml
[storage]
# azblob
type = "azblob"

[storage.azblob]
endpoint_url = "https://<your-storage-account-name>.blob.core.windows.net"

# https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container
container = "<your-azure-storage-container-name>"
account_name = "<your-storage-account-name>"

# https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys
account_key = "<your-account-key>"
```

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

```toml
[storage]
# s3
type = "cos"

[storage.cos]
# 您可以从存储桶详情页面获取 URL。
# 以下是一个区域为北京（ap-beijing）的示例：
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# 如何创建存储桶：
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "databend"

# 如何获取 secret_id 和 secret_key：
# https://cloud.tencent.com/document/product/436/68282
// highlight-next-line
secret_id = "<your-secret-id>"
// highlight-next-line
secret_key = "<your-secret-key>"
root = "<your-root-path>"
```

腾讯 COS 还支持从环境变量加载配置值。这意味着，您可以不必在配置文件中直接指定配置值，而是通过设置相应的环境变量（TENCENTCLOUD_SECRETID、TENCENTCLOUD_SECRETKEY 和 USER_CODE_ROOT）来配置 COS 存储。

为此，您仍然可以在配置文件中使用相同的[storage.cos]部分，但省略 secret_id、secret_key 和 root 的设置。相反，设置相应的环境变量（TENCENTCLOUD_SECRETID、TENCENTCLOUD_SECRETKEY 和 USER_CODE_ROOT）为所需的值。

```toml
[storage]
# s3
type = "cos"

[storage.cos]
# 您可以从存储桶详情页面获取 URL。
# 以下是一个区域为 ap-beijing 的示例：
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# 如何创建存储桶：
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "databend"
```

````

```toml
<TabItem value="Alibaba OSS" label="阿里云 OSS">

```toml
[storage]
type = "oss"

[storage.oss]
// 高亮下一行
bucket = "databend"

# 您可以从存储桶详情页面获取 URL。
// 高亮下一行
# https://help.aliyun.com/document_detail/31837.htm
// 高亮下一行
# https://<bucket-name>.<region-id>[-internal].aliyuncs.com
// 高亮下一行
# 此示例使用的 OSS 区域 ID 为：oss-cn-beijing-internal。
endpoint_url = "https://oss-cn-beijing-internal.aliyuncs.com"
# enable_virtual_host_style = true

# 如何获取 access_key_id 和 secret_access_key：
# https://help.aliyun.com/document_detail/53045.htm
// 高亮下一行
access_key_id = "<your-key-id>"
// 高亮下一行
secret_access_key = "<your-access-key>"
````

Databend 企业版支持在 OSS 中进行服务器端加密。此功能使您能够通过激活 OSS 中存储数据的服务器端加密来增强数据安全性和隐私性。您可以选择最适合您需求的加密方法。请注意，您必须拥有有效的 Databend 企业版许可证才能使用此功能。要获取许可证，请参阅[许可 Databend](../00-overview/00-editions/01-dee/20-license.md)。

要在 Databend 中启用服务器端加密，请在[storage.oss]部分添加以下参数：

| 参数                          | 描述                                                                                                                                       | 可用值                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| server_side_encryption        | 指定 OSS 数据的服务器端加密方法。"AES256"使用 OSS 管理的 AES256 密钥进行加密，而"KMS"则使用在 server_side_encryption_key_id 中定义的密钥。 | "AES256" 或 "KMS"                  |
| server_side_encryption_key_id | 当 server_side_encryption 设置为"KMS"时，此参数用于指定 OSS 的服务器端加密密钥 ID。仅在使用 KMS 加密模式时适用。                           | 字符串，KMS 加密密钥的唯一标识符。 |

</TabItem>

<TabItem value="QingCloud QingStor" label="青云 QingStor">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
bucket = "databend"

# 您可以从存储桶详情页面获取 URL。
# https://docsv3.qingcloud.com/storage/object-storage/intro/object-storage/#zone
endpoint_url = "https://s3.pek3b.qingstor.com"

# 如何获取 access_key_id 和 secret_access_key：
# https://docsv3.qingcloud.com/development_docs/api/overview/
access_key_id = "<your-key-id>"
secret_access_key = "<your-access-key>"
```

:::tip
此示例中的 QingStor 区域为`pek3b`。
:::

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
# 如何创建存储桶：
// 高亮下一行
bucket = "<your-bucket>"

# 您可以从以下位置获取 URL：
# https://wasabi-support.zendesk.com/hc/en-us/articles/360015106031-What-are-the-service-URLs-for-Wasabi-s-different-regions-
// 高亮下一行
endpoint_url = "https://s3.us-east-2.wasabisys.com"

# 如何获取 access_key_id 和 secret_access_key：
// 高亮下一行
access_key_id = "<your-key-id>"
// 高亮下一行
secret_access_key = "<your-access-key>"
```

:::tip
此示例中的 Wasabi 区域为`us-east-2`。
:::

</TabItem>

<TabItem value="MinIO" label="MinIO">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
bucket = "databend"
endpoint_url = "http://127.0.0.1:9900"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
```

</TabItem>

<TabItem value="HDFS" label="HDFS">

```toml
[storage]
type = "hdfs"
[storage.hdfs]
name_node = "hdfs://hadoop.example.com:8020"
root = "/analyses/databend/storage"
```

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

```toml
[storage]
type = "webhdfs"
[storage.webhdfs]
endpoint_url = "https://hadoop.example.com:9870"
root = "/analyses/databend/storage"
# 如果您的 webhdfs 需要认证，请取消注释并设置您的值
# delegation = "<delegation-token>"
```

</TabItem>
</Tabs>

c. 使用[query.users]部分配置管理员用户。更多信息，请参阅[配置管理员用户](04-admin-users.md)。要使用默认的 root 用户和认证类型"no_password"继续操作，请确保在文件`databend-query.toml`中删除以下行前的'#'字符：

:::caution
在本教程中使用"no_password"认证的 root 用户仅是一个示例，在生产环境中不推荐使用，因为可能存在安全风险。
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

d. 打开一个终端窗口并导航到文件夹`/usr/local/databend/bin`。

e. 运行以下命令以启动查询节点：

:::note
当使用 HDFS 作为存储后端时，请确保设置以下环境变量：

```bash
export JAVA_HOME=/path/to/java
export LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}
export HADOOP_HOME=/path/to/hadoop
export CLASSPATH=/all/hadoop/jar/files
```

以下是一个示例：

```bash
export JAVA_HOME=/usr/lib/jvm/java-21-jdk
export LD_LIBRARY_PATH={$JAVA_HOME}/lib/server/
export HADOOP_HOME={$HOME}/hadoop-3.3.6
export CLASSPATH=$(find $HADOOP_HOME -iname "*.jar" | xargs echo | tr ' ' ':')
```
:::

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

f. 运行以下命令以检查 Query 节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

### 验证部署

在本节中，我们将对 Databend 运行一些查询以验证部署。

a. 在您的本地机器上下载并安装 MySQL 客户端。

b. 从您的 SQL 客户端创建一个连接到 127.0.0.1。在连接中，将端口设置为 `3307`，并将用户名设置为 `root`。

c. 运行以下命令并检查查询是否成功：

```sql
CREATE TABLE t1(a int);

INSERT INTO t1 VALUES(1), (2);

SELECT * FROM t1;
```

### 启动和停止 Databend

每次启动和停止 Databend 时，只需运行文件夹 `/usr/local/databend/scripts` 中的脚本：

```shell
# 启动 Databend
./scripts/start.sh

# 停止 Databend
./scripts/stop.sh
```

<DetailsWrap>
<details>
  <summary>权限被拒绝？</summary>
  <div>
    如果在尝试启动 Databend 时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```

运行以下命令然后再次尝试启动 Databend：

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

## 下一步

在部署 Databend 之后，您可能需要了解以下主题：

- [管理设置](/sql/sql-reference/manage-settings)：根据您的需求优化 Databend。
- [加载和卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获得洞察力。
