---
title: Deploying with Object Storage
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Storage Encryption'/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';

This topic explains how to deploy Databend with your object storage. For a list of supported object storage solutions, see [Understanding Deployment Modes](../00-understanding-deployment-modes.md).

### Setting up Your Object Storage

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">


<TabItem value="Amazon S3" label="Amazon S3">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `my_bucket`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html>
- <https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

1. Follow the topic [Create a new bucket](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket) from the Google documentation to create a bucket named `my_bucket`.
2. Follow the topic [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) from the Google documentation to create and download a service account key file.
3. Utilize Base64 encoding to convert the contents of the service account key file into a Base64-encoded string. For example, 

```bash
base64 -i <path-to-your-key-file> -o ~/Desktop/base64-encoded-key.txt
```

The command above will generate a file named `base64-encoded-key.txt` containing the credentials that you will subsequently use to configure the connection in the `databend-query.toml` configuration file.


<CommonDownloadDesc />

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `my_bucket`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container>
- <https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Tencent COS" label="Tencent COS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `my_bucket`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://cloud.tencent.com/document/product/436/13309>
- <https://cloud.tencent.com/document/product/436/68282>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `my_bucket`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://www.alibabacloud.com/help/zh/object-storage-service/latest/create-buckets-2>
- <https://help.aliyun.com/document_detail/53045.htm>

<CommonDownloadDesc />

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

Before deploying Databend, make sure you have successfully set up your object storage environment in the cloud, and the following tasks have been completed:

- Create a bucket or container named `my_bucket`.
- Get the endpoint URL for connecting to the bucket or container you created.
- Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- <https://docs.wasabi.com/docs/creating-a-bucket>
- <https://docs.wasabi.com/docs/access-keys-1>

<CommonDownloadDesc />

</TabItem>

</Tabs>

### Deploying a Meta Node

a. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.

b. Run the following command to start the Meta node:

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

c. Run the following command to check if the Meta node was started successfully:

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

### Deploying a Query Node

a. Locate the file `databend-query.toml` in the folder `/usr/local/databend/configs`.

b. In the file `databend-query.toml`, set the parameter *type* in the [storage] block and configure the access credentials and endpoint URL for connecting to your object storage. 

To configure your storage settings, comment out the [storage.fs] section by adding `#` at the beginning of each line. Then, uncomment the relevant section for your object storage provider by removing the `#` symbol and fill in your values.

<Tabs groupId="operating-systems">

<TabItem value="Amazon S3" label="Amazon S3">

```toml
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

For the `credential` parameter, paste the Base64-encoded string obtained in Step [Setting up Your Object Storage](#setting-up-your-object-storage) (enclosed in double quotation marks).

```toml
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

```toml
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

When specifying the `endpoint_url` parameter, ensure to exclude the `<BucketName-APPID>` portion from your bucket's endpoint. For instance, if your bucket endpoint is `https://databend-xxxxxxxxxx.cos.ap-beijing.myqcloud.com`, use `https://cos.ap-beijing.myqcloud.com`. For Tencent COS endpoints in various regions, refer to https://www.tencentcloud.com/document/product/436/6224.

```toml
[storage]
# s3
type = "cos"

[storage.cos]
# How to create a bucket:
# https://cloud.tencent.com/document/product/436/13309
// highlight-next-line
bucket = "my_bucket"

# The following is an example where the region is Beijing (ap-beijing).
// highlight-next-line
endpoint_url = "https://cos.ap-beijing.myqcloud.com"

# How to get secret_id and secret_key:
# https://cloud.tencent.com/document/product/436/68282
// highlight-next-line
secret_id = "<your-secret-id>"
// highlight-next-line
secret_key = "<your-secret-key>"
```
</TabItem>

<TabItem value="Alibaba OSS" label="Alibaba Cloud OSS">

```toml
[storage]
type = "oss"

[storage.oss]
// highlight-next-line
bucket = "my_bucket"

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

Databend Enterprise Edition supports server-side encryption in OSS. This feature enables you to enhance data security and privacy by activating server-side encryption for data stored in OSS. You can choose the encryption method that best suits your needs. Please note that you must have a valid Databend Enterprise Edition license to utilize this feature. To obtain one, see [Licensing Databend](../../../00-overview/00-editions/01-dee/20-license.md).

To enable server-side encryption in Databend, add the following parameters to the [storage.oss] section:

| Parameter                     | Description                                                                                                                                                                               | Available Values                                        |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| server_side_encryption        | Specifies the server-side encryption method for OSS data. "AES256" uses an OSS-managed AES256 key for encryption, while "KMS" utilizes the key defined in server_side_encryption_key_id. | "AES256" or "KMS"                                       |
| server_side_encryption_key_id | When server_side_encryption is set to "KMS," this parameter is used to specify the server-side encryption key ID for OSS. It is only applicable when using the KMS encryption mode.       | String, a unique identifier for the KMS encryption key. |
</TabItem>

<TabItem value="Wasabi" label="Wasabi">

```toml
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

:::tip
In this example Wasabi region is `us-east-2`.
:::

</TabItem>

</Tabs>

c. Configure an admin user with the [query.users] sections. For more information, see [Configuring Admin Users](../../04-references/01-admin-users.md). To proceed with the default root user and the authentication type "no_password", ensure that you remove the '#' character before the following lines in the file `databend-query.toml`:

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

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

f. Run the following command to check if the Query node was started successfully:

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

### Verifying Deployment

In this section, we will run a simple query against Databend using [BendSQL](https://github.com/datafuselabs/BendSQL) to verify the deployment.

a. Follow [Installing BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql) to install BendSQL on your machine.

b. Follow [Connecting to Databend using BendSQL](../../../30-sql-clients/00-bendsql/00-connect-to-databend.md) to launch BendSQL and retrieve the current time for verification.

### Starting and Stopping Databend

Each time you start and stop Databend, simply run the scripts in the folder `/usr/local/databend/scripts`:

```shell
# Start Databend
./scripts/start.sh

# Stop Databend
./scripts/stop.sh
```

:::note
This script uses the killall command. If you have not installed this command, please install the [`psmisc`](https://gitlab.com/psmisc/psmisc) package suitable for your system environment. For example, on CentOS: `yum install psmisc`.
:::

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

- [Load & Unload Data](/guides/load-data): Manage data import/export in Databend.
- [Visualize](/guides/visualize): Integrate Databend with visualization tools for insights.

