---
title: Deploying a Standalone Databend
sidebar_label: Deploying a Standalone Databend
description: Deploying a Standalone Databend
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Storage Encryption'/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';

## Deploying a Standalone Databend

Databend works with both self-hosted and cloud object storage solutions. This topic explains how to deploy Databend with your object storage. For a list of supported object storage solutions, see [Understanding Deployment Modes](./00-understanding-deployment-modes.md).

:::note
It is not recommended to deploy Databend on top of MinIO for production environments or performance testing.
:::

### Setting up Your Object Storage

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">


<TabItem value="Amazon S3" label="Amazon S3">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html>
- <https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket named `databend`.
- Get the Google Cloud Storage OAuth2 credential of your account.

For information about how to manage buckets and OAuth2 credentials in Google Cloud Storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://cloud.google.com/storage/docs/creating-buckets>
- <https://cloud.google.com/storage/docs/authentication#apiauth>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container>
- <https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://cloud.tencent.com/document/product/436/13309>
- <https://cloud.tencent.com/document/product/436/68282>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba OSS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2>
- <https://help.aliyun.com/document_detail/53045.htm>

<CommonDownloadDesc />

</TabItem>


<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docsv3.qingcloud.com/storage/object-storage/manual/console/bucket_manage/basic_opt/>
- <https://docs.qingcloud.com/product/api/common/overview.html>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `databend`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.wasabi.com/docs/creating-a-bucket>
- <https://docs.wasabi.com/docs/access-keys-1>

<CommonDownloadDesc />

</TabItem>

<TabItem value="MinIO" label="MinIO">

a. Follow the [MinIO Quickstart Guide](https://docs.min.io/docs/minio-quickstart-guide.html) to download and install the MinIO package to your local machine.

b. Open a terminal window and navigate to the folder where MinIO is stored.

c. Run the command `vim server.sh` to create a file with the following content:

```shell
~/minio$ cat server.sh
export MINIO_ROOT_USER=minioadmin
export MINIO_ROOT_PASSWORD=minioadmin
./minio server --address :9900 ./data
```

d. Run the following commands to start the MinIO server:

```shell
chmod +x server.sh
./server.sh
```

e. In your browser, go to <http://127.0.0.1:9900> and enter the credentials (`minioadmin` / `minioadmin`) to log into the MinIO Console.

f. In the MinIO Console, create a bucket named `databend`.

<CommonDownloadDesc />

</TabItem>

<TabItem value="HDFS" label="HDFS">

Before deploying Databend, make sure you have successfully set up your Hadoop environment, and completed the following tasks:

- Your system already has a Java SDK installed with JVM support.
- Get the name node URL for connecting to HDFS.
- You have already downloaded the Hadoop release to your system, and you can access the JAR packages in the release.

### Downloading Databend

a. Create a folder named `databend` in the directory `/usr/local`.

b. Download and extract the latest Databend release for your platform from [GitHub Release](https://github.com/datafuselabs/databend/releases):

:::note
To use HDFS as the storage backend, download a release with a file name formatted as `databend-hdfs-${version}-${target-platform}.tar.gz`.
:::

<Tabs>

<TabItem value="linux-x86_64" label="Linux(x86)">

```shell
curl -LJO https://github.com/datafuselabs/databend/releases/download/${version}/databend-hdfs-${version}-x86_64-unknown-linux-gnu.tar.gz
```

```shell
tar xzvf databend-hdfs-${version}-x86_64-unknown-linux-gnu.tar.gz
```

</TabItem>

</Tabs>

c. Move the extracted folders `bin`, `configs`, and `scripts` to the folder `/usr/local/databend`.

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

Before deploying Databend, make sure you have successfully set up your Hadoop environment, and the following tasks have been completed:

- Enable the WebHDFS support on Hadoop.
- Get the endpoint URL for connecting to WebHDFS.
- Get the delegation token used for authentication (if needed).

For information about how to enable and manage WebHDFS on Apache Hadoop, please refer to the manual of WebHDFS. Here are some links you may find useful:

- <https://hadoop.apache.org/docs/r3.3.2/hadoop-project-dist/hadoop-hdfs/WebHDFS.html>

<CommonDownloadDesc />

</TabItem>
</Tabs>

### Deploying a Meta Node

a. Open the file `databend-meta.toml` in the folder `/usr/local/databend/configs`, and replace `127.0.0.1` with `0.0.0.0` within the whole file.

b. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.

c. Run the following command to start the Meta node:

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

d. Run the following command to check if the Meta node was started successfully:

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

### Deploying a Query Node

a. Open the file `databend-query.toml` in the folder `/usr/local/databend/configs`, and replace `127.0.0.1` with `0.0.0.0` within the whole file.

b. In the file `databend-query.toml`, set the parameter *type* in the [storage] block and configure the access credentials and endpoint URL for connecting to your object storage. 

To configure your storage settings, please comment out the [storage.fs] section by adding '#' at the beginning of each line, and then uncomment the appropriate section for your object storage provider by removing the '#' symbol, and fill in the necessary values. If your desired storage provider is not listed, you can copy and paste the corresponding template below to the file and configure it accordingly.

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

# How to get access_key_id and secret_access_key:
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
# How to create a bucket:
# https://cloud.google.com/storage/docs/creating-buckets
// highlight-next-line
bucket = "databend"

# GCS also supports changing the endpoint URL
# but the endpoint should be compatible with GCS's JSON API
# default:
# endpoint_url = "https://storage.googleapis.com"

# working directory of GCS
# default:
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
# You can get the URL from the bucket detail page.
# The following is an example where the region is Beijing (ap-beijing):
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# How to create a bucket:
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "databend"

# How to get secret_id and secret_key:
# https://cloud.tencent.com/document/product/436/68282
// highlight-next-line
secret_id = "<your-secret-id>"
// highlight-next-line
secret_key = "<your-secret-key>"
root = "<your-root-path>"
```
Tencent COS also supports loading configuration values from environment variables. This means that instead of specifying the configuration values directly in the configuration file, you can configure COS storage by setting the corresponding environment variables.

To do this, you can still use the same [storage.cos] section in the configuration file, but omit the settings secret_id, secret_key, and root. Instead, set the corresponding environment variables (TENCENTCLOUD_SECRETID, TENCENTCLOUD_SECRETKEY, and USER_CODE_ROOT) with the desired values.

```toml
[storage]
# s3
type = "cos"

[storage.cos]
# You can get the URL from the bucket detail page.
# The following is an example where the region is ap-beijing:
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# How to create a bucket:
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "databend"
```

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba OSS">

```toml
[storage]
type = "oss"

[storage.oss]
// highlight-next-line
bucket = "databend"

# You can get the URL from the bucket detail page.
// highlight-next-line
# https://help.aliyun.com/document_detail/31837.htm
// highlight-next-line
# https://<bucket-name>.<region-id>[-internal].aliyuncs.com
// highlight-next-line
# This example uses OSS region id: oss-cn-beijing-internal.
endpoint_url = "https://oss-cn-beijing-internal.aliyuncs.com"
# enable_virtual_host_style = true

# How to get access_key_id and secret_access_key:
# https://help.aliyun.com/document_detail/53045.htm
// highlight-next-line
access_key_id = "<your-key-id>"
// highlight-next-line
secret_access_key = "<your-access-key>"
```

Databend Enterprise Edition supports server-side encryption in OSS. This feature enables you to enhance data security and privacy by activating server-side encryption for data stored in OSS. You can choose the encryption method that best suits your needs. Please note that you must have a valid Databend Enterprise Edition license to utilize this feature. To obtain one, see [Licensing Databend](../00-overview/00-editions/01-dee/20-license.md).

To enable server-side encryption in Databend, add the following parameters to the [storage.oss] section:

| Parameter                     | Description                                                                                                                                                                               | Available Values                                        |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| server_side_encryption        | Specifies the server-side encryption method for OSS data. "AES256" uses an OSS-managed AES256 key for encryption, while "KMS" utilizes the key defined in server_side_encryption_key_id. | "AES256" or "KMS"                                       |
| server_side_encryption_key_id | When server_side_encryption is set to "KMS," this parameter is used to specify the server-side encryption key ID for OSS. It is only applicable when using the KMS encryption mode.       | String, a unique identifier for the KMS encryption key. |
</TabItem>


<TabItem value="QingCloud QingStor" label="QingCloud QingStor">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
bucket = "databend"

# You can get the URL from the bucket detail page.
# https://docsv3.qingcloud.com/storage/object-storage/intro/object-storage/#zone
endpoint_url = "https://s3.pek3b.qingstor.com"

# How to get access_key_id and secret_access_key:
# https://docs.qingcloud.com/product/api/common/overview.html
access_key_id = "<your-key-id>"
secret_access_key = "<your-access-key>"
```

:::tip
In this example QingStor region is `pek3b`.
:::

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml
[storage]
# s3
type = "s3"

[storage.s3]
# How to create a bucket:
// highlight-next-line
bucket = "<your-bucket>"

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

:::tip
In this example Wasabi region is `us-east-2`.
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
# if your webhdfs needs authentication, uncomment and set with your value
# delegation = "<delegation-token>"
```

</TabItem>
</Tabs>

c. Configure an admin user with the [query.users] sections. For more information, see [Configuring Admin Users](04-admin-users.md). To proceed with the default root user and the authentication type "no_password", ensure that you remove the '#' character before the following lines in the file `databend-query.toml`:

:::caution
Using "no_password" authentication for the root user in this tutorial is just an example and not recommended for production due to potential security risks.
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

d. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.

e. Run the following command to start the Query node:

:::note
When using HDFS as the storage backend, ensure to set the following environment variables:

```bash
export JAVA_HOME=/path/to/java
export LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}
export HADOOP_HOME=/path/to/hadoop
export CLASSPATH=/all/hadoop/jar/files
```

The following is an example:

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

f. Run the following command to check if the Query node was started successfully:

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

### Verifying Deployment

In this section, we will run some queries against Databend to verify the deployment.

a. Download and install a MySQL client on your local machine.

b. Create a connection to 127.0.0.1 from your SQL client. In the connection, set the port to `3307`, and set the username to `root`.

c. Run the following commands and check if the query is successful:

```sql
CREATE TABLE t1(a int);

INSERT INTO t1 VALUES(1), (2);

SELECT * FROM t1;
```

### Starting and Stopping Databend

Each time you start and stop Databend, simply run the scripts in the folder `/usr/local/databend/scripts`:

```shell
# Start Databend
./scripts/start.sh

# Stop Databend
./scripts/stop.sh
```

<DetailsWrap>
<details>
  <summary>Permission denied?</summary>
  <div>
    If you encounter the subsequent error messages while attempting to start Databend:

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```
Run the following commands and try starting Databend again:

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

## Next Steps

After deploying Databend, you might need to learn about the following topics:

- [Manage Settings](/sql/sql-reference/manage-settings): Optimize Databend for your needs.
- [Load & Unload Data](/guides/load-data): Manage data import/export in Databend.
- [Visualize](/guides/visualize): Integrate Databend with visualization tools for insights.

