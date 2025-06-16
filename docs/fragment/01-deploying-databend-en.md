import FunctionDescription from '@site/src/components/FunctionDescription';
import DetailsWrap from '@site/src/components/DetailsWrap';
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';
import Version from '@site/src/components/Version';
import LanguageDocs from '@site/src/components/LanguageDocs';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

This topic explains how to deploy Databend with your object storage. For a list of supported object storage solutions, see [Understanding Deployment Modes](/guides/deploy/deploy/understanding-deployment-modes).

### Before You start

Before deploying Databend, ensure that you have successfully set up your object storage and downloaded the latest version of Databend.

<StepsWrap>
<StepContent number="1">

### Set up object storage

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">
<TabItem value="Amazon S3" label="Amazon S3">

1. Create a bucket or container named `my_bucket`.
2. Get the endpoint URL for connecting to the bucket or container you created.
3. Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- [https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)

</TabItem>

<TabItem value="Google GCS" label="Google GCS">

1. Follow the topic [Create a new bucket](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket) from the Google documentation to create a bucket named `my_bucket`.
2. Follow the topic [Create a service account key](https://cloud.google.com/iam/docs/keys-create-delete#creating) from the Google documentation to create and download a service account key file.
3. Utilize Base64 encoding to convert the contents of the service account key file into a Base64-encoded string. For example,

```bash
base64 -i <path-to-your-key-file> -o ~/Desktop/base64-encoded-key.txt
```

The command above will generate a file named `base64-encoded-key.txt` containing the credentials that you will subsequently use to configure the connection in the `databend-query.toml` configuration file.

</TabItem>

<TabItem value="Azure Blob" label="Azure Blob">

1. Create a bucket or container named `my_bucket`.
2. Get the endpoint URL for connecting to the bucket or container you created.
3. Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- [https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
- [https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal#view-account-access-keys)

</TabItem>

<TabItem value="Wasabi" label="Wasabi">

1. Create a bucket or container named `my_bucket`.
2. Get the endpoint URL for connecting to the bucket or container you created.
3. Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your cloud object storage, refer to the user manual from the solution provider. Here are some useful links you may need:

- [https://docs.wasabi.com/docs/creating-a-bucket](https://docs.wasabi.com/docs/creating-a-bucket)
- [https://docs.wasabi.com/docs/access-keys-1](https://docs.wasabi.com/docs/access-keys-1)

</TabItem>

<TabItem value="MinIO" label="MinIO">

1. Create a bucket or container named `my_bucket`.
2. Get the endpoint URL for connecting to the bucket or container you created.
3. Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your MinIO, refer to the user manual from the solution provider. Here are some useful links you may need:

- [https://min.io/docs/minio/container/index.html](https://min.io/docs/minio/container/index.html)
- [https://min.io/docs/minio/container/administration/console/managing-objects.html](https://min.io/docs/minio/container/administration/console/managing-objects.html)
- [https://min.io/docs/minio/container/administration/console/security-and-access.html](https://min.io/docs/minio/container/administration/console/security-and-access.html)

</TabItem>

<TabItem value="CubeFS" label="CubeFS">

1. Start the ObjectNode object gateway.
2. Create a bucket or container named `my_bucket`.
3. Get the endpoint URL for connecting to the bucket or container you created.
4. Get the Access Key ID and Secret Access Key for your account.

For information about how to manage buckets and Access Keys for your CubeFS, refer to the user manual from the solution provider. Here are some useful links you may need:

- [https://cubefs.io/docs/master/quick-start/node.html](https://cubefs.io/docs/master/quick-start/node.html)
- [https://cubefs.io/docs/master/user-guide/objectnode.html](https://cubefs.io/docs/master/user-guide/objectnode.html)
- [https://cubefs.io/docs/master/maintenance/admin-api/master/user.html](https://cubefs.io/docs/master/maintenance/admin-api/master/user.html)

</TabItem>
</Tabs>

</StepContent>

<StepContent number="2">

### Download Databend

1. Create a folder named `databend` in the `/usr/local` directory.
2. Download the latest Databend release for your platform (Linux `aarch64` or `x86_64`) from the [GitHub Release](https://github.com/databendlabs/databend/releases) page.
3. Extract the downloaded package into `/usr/local/databend`.

</StepContent>

</StepsWrap>

### Step 1: Deploying Meta Node

Follow the instructions below to deploy a Meta node:

<StepsWrap>
<StepContent number="1">

### Start Meta Node

1. Open a terminal window and navigate to the folder `/usr/local/databend/bin`.
2. Run the following command to start the Meta node:

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

</StepContent>
<StepContent number="2">

### Check Meta Node

Run the following command to check if the Meta node was started successfully:

```shell
curl -I  http://127.0.0.1:28002/v1/health
```

</StepContent>
</StepsWrap>

### Step 2: Deploying Query Node

Follow the instructions below to deploy a Query node:

<StepsWrap>

<StepContent number="1">

### Configure Query Node

1. Locate the file `databend-query.toml` in the folder `/usr/local/databend/configs`.
2. In the file `databend-query.toml`, set the parameter *type* in the [storage] block and configure the access credentials and endpoint URL for connecting to your object storage.

To configure your storage settings, comment out the [storage.fs] section by adding `#` at the beginning of each line. Then, uncomment the relevant section for your object storage provider by removing the `#` symbol and fill in your values.

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

For the `credential` parameter, paste the Base64-encoded string obtained in Step [Setting up Your Object Storage](#setting-up-your-object-storage) (enclosed in double quotation marks).

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

3. Configure an admin user with the [query.users] sections. For more information, see [Configuring Admin Users](/guides/deploy/references/admin-users). To proceed with the default root user and the authentication type "no_password", ensure that you remove the '#' character before the following lines in the file `databend-query.toml`:

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
curl -I  http://127.0.0.1:8080/v1/health
```

</StepContent>

</StepsWrap>

### Step 3: Verifying Deployment

In this step, you will run a simple query against Databend using [BendSQL](https://github.com/databendlabs/BendSQL) to verify the deployment.

<StepsWrap>

<StepContent number="1">

### Install BendSQL

Follow [Installing BendSQL](/guides/sql-clients/bendsql/#installing-bendsql) to install BendSQL on your machine.

</StepContent>

<StepContent number="2">

### Connect to Databend

Launch BendSQL and retrieve the current time for verification.

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

### Next Steps

After deploying Databend, you might need to learn about the following topics:

- [Load & Unload Data](/guides/load-data): Manage data import/export in Databend.
- [Visualize](/guides/visualize): Integrate Databend with visualization tools for insights.
