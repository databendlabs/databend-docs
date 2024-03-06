---
title: Deploying with HDFS
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';


Databend also works with Hadoop Distributed File System (HDFS). This topic explains how to deploy Databend with HDFS. For a list of other supported object storage solutions, see [Understanding Deployment Modes](../00-understanding-deployment-modes.md).

### Setting up Your HDFS

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">

<TabItem value="HDFS" label="HDFS">

Before deploying Databend, make sure you have successfully set up your Hadoop environment, and completed the following tasks:

- Your system already has a Java SDK installed with JVM support.
- Get the name node URL for connecting to HDFS.
- You have already downloaded the Hadoop release to your system, and you can access the JAR packages in the release.

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

### Downloading Databend

a. Create a folder named `databend` in the directory `/usr/local`.

b. Download and extract the latest Databend release for your platform from [GitHub Release](https://github.com/datafuselabs/databend/releases):

:::note
To use HDFS as the storage backend, download a release with a file name formatted as `databend-hdfs-${version}-${target-platform}.tar.gz`.
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

a. Locate the file `databend-query.toml` in the folder `/usr/local/databend/configs`.

b. In the file `databend-query.toml`, set the parameter *type* in the [storage] block and configure the access credentials and endpoint URL for connecting to your HDFS.

To configure your storage settings, please comment out the [storage.fs] section by adding '#' at the beginning of each line, and then uncomment the appropriate section for your HDFS provider by removing the '#' symbol, and fill in the necessary values. You can copy and paste the corresponding template below to the file and configure it accordingly.

<Tabs groupId="operating-systems">

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
