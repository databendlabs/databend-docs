---
title: 使用 HDFS 部署
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Version from '@site/src/components/Version';

<FunctionDescription description="引入或更新：v1.2.168"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 也可以与 Hadoop 分布式文件系统（HDFS）一起使用。本主题介绍如何使用 HDFS 部署 Databend。有关其他支持的对象存储解决方案的列表，请参阅 [了解部署模式](../00-understanding-deployment-modes.md)。

### 设置你的 HDFS

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="operating-systems">

<TabItem value="HDFS" label="HDFS">

在部署 Databend 之前，请确保已成功设置 Hadoop 环境，并完成以下任务：

- 你的系统已经安装了支持 JVM 的 Java SDK。
- 获取用于连接到 HDFS 的名称节点 URL。
- 你已经将 Hadoop 发布版本下载到你的系统，并且可以访问该版本中的 JAR 包。

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

### 下载 Databend

a. 在目录 `/usr/local` 中创建一个名为 `databend` 的文件夹。

b. 从 [GitHub Release](https://github.com/databendlabs/databend/releases) 下载并提取适用于你的平台的最新 Databend 版本：

:::note
要使用 HDFS 作为存储后端，请下载文件名格式为 `databend-hdfs-${version}-${target-platform}.tar.gz` 的版本。
:::

<Tabs>

<TabItem value="linux-x86_64" label="Linux(x86)">

<Version>
```shell
curl -LJO https://repo.databend.com/databend/[version]/databend-hdfs-[version]-x86_64-unknown-linux-gnu.tar.gz
```

```shell
tar xzvf databend-hdfs-[version]-x86_64-unknown-linux-gnu.tar.gz
```

</Version>
</TabItem>

</Tabs>

c. 将提取的文件夹 `bin`、`configs` 和 `scripts` 移动到文件夹 `/usr/local/databend`。

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

在部署 Databend 之前，请确保已成功设置 Hadoop 环境，并完成以下任务：

- 在 Hadoop 上启用 WebHDFS 支持。
- 获取用于连接到 WebHDFS 的端点 URL。
- 获取用于身份验证的委托令牌（如果需要）。

有关如何在 Apache Hadoop 上启用和管理 WebHDFS 的信息，请参阅 WebHDFS 的手册。以下是一些你可能会觉得有用的链接：

- [https://hadoop.apache.org/docs/r3.3.2/hadoop-project-dist/hadoop-hdfs/WebHDFS.html](https://hadoop.apache.org/docs/r3.3.2/hadoop-project-dist/hadoop-hdfs/WebHDFS.html)

### 下载 Databend

a. 在目录 `/usr/local` 中创建一个名为 `databend` 的文件夹。

b. 从 [GitHub Release](https://github.com/databendlabs/databend/releases) 下载并提取适用于你的平台的最新 Databend 版本：

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

c. 将提取的文件夹 `bin`、`configs` 和 `scripts` 移动到文件夹 `/usr/local/databend`。

</TabItem>
</Tabs>

### 部署 Meta 节点

a. 打开文件夹 `/usr/local/databend/configs` 中的文件 `databend-meta.toml`，并将整个文件中的 `127.0.0.1` 替换为 `0.0.0.0`。

b. 打开一个终端窗口，并导航到文件夹 `/usr/local/databend/bin`。

c. 运行以下命令以启动 Meta 节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

d. 运行以下命令以检查 Meta 节点是否已成功启动：

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

### 部署 Query 节点

a. 找到文件夹 `/usr/local/databend/configs` 中的文件 `databend-query.toml`。

b. 在文件 `databend-query.toml` 中，设置 [storage] 块中的参数 *type*，并配置用于连接到你的 HDFS 的访问凭据和端点 URL。

要配置你的存储设置，请通过在每行开头添加 '#' 来注释掉 [storage.fs] 部分，然后通过删除 '#' 符号来取消注释适用于你的 HDFS 提供程序的相应部分，并填写必要的值。你可以复制并粘贴下面的相应模板到文件中，并进行相应的配置。

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

c. 使用 [query.users] 部分配置管理员用户。有关更多信息，请参阅 [配置管理员用户](../../04-references/01-admin-users.md)。要继续使用默认的 root 用户和 "no_password" 身份验证类型，请确保删除文件 `databend-query.toml` 中以下行之前的 '#' 字符：

:::caution
在本教程中使用 "no_password" 身份验证作为 root 用户只是一个示例，由于潜在的安全风险，不建议在生产环境中使用。
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

d. 打开一个终端窗口，并导航到文件夹 `/usr/local/databend/bin`。

e. 运行以下命令以启动 Query 节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

f. 运行以下命令以检查 Query 节点是否已成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

### 验证部署

在本节中，我们将使用 [BendSQL](https://github.com/databendlabs/BendSQL) 针对 Databend 运行一个简单的查询，以验证部署。

a. 按照 [安装 BendSQL](../../../30-sql-clients/00-bendsql/index.md#installing-bendsql) 在你的机器上安装 BendSQL。

b. 启动 BendSQL 并检索当前时间以进行验证。

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

## 后续步骤

部署 Databend 后，你可能需要了解以下主题：

- [加载和卸载数据](/guides/load-data)：管理 Databend 中的数据导入/导出。
- [可视化](/guides/visualize)：将 Databend 与可视化工具集成以获取见解。
