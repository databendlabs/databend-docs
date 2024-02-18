---
title: 部署独立的 Databend（HDFS）
sidebar_label: 部署独立的 Databend（HDFS）
description: 部署独立的 Databend
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.168"/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';

## 部署独立的 Databend

Databend 同样也支持将 HDFS 存储系统作为存储后端。本主题将解释如何利用 HDFS 部署 Databend 。如需了解 Databend 支持的其他对象存储解决方案列表，请参见[了解部署模式](./00-understanding-deployment-modes.md)。

### 设置您的 HDFS 存储系统

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">

<TabItem value="HDFS" label="HDFS">

在部署 Databend 之前，请确保您已经成功设置了 Hadoop 环境，并完成了以下任务：

- 您的系统已经安装了支持 JVM 的 Java SDK。
- 获取连接到 HDFS 的名称节点 URL。
- 您已经下载了 Hadoop 发行版到您的系统，并且可以访问发行版中的 JAR 包。

:::note
当使用 HDFS 作为存储后端时，请确保正确设置以下环境变量：

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

:::note
如果您使用云厂商提供的完全托管的 HDFS 存储系统，请确认该厂商是否提供或允许开启 WebHDFS 支持。
:::

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

b. 在文件`databend-query.toml`中，设置 `[storage]` 块中的参数 *type* ，并配置访问凭证和端点 URL 以连接到您的 HDFS 存储系统。

要配置您的存储设置，请通过在每行前添加 `'#'` 来注释掉 `[storage.fs]` 部分，然后通过移除 `'#'` 符号来取消注释适合您的 HDFS 存储提供商的相应部分，并填写必要的值。您也可以将下面的相应模板复制并粘贴到文件中，并相应地配置它。

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
