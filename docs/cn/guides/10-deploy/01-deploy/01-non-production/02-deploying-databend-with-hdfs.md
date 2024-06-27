---
title: 使用HDFS部署
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.168"/>

import GetLatest from '@site/src/components/GetLatest';
import DetailsWrap from '@site/src/components/DetailsWrap';


Databend也支持与Hadoop分布式文件系统（HDFS）配合使用。本主题将解释如何使用HDFS部署Databend。有关其他支持的对象存储解决方案列表，请参阅[理解部署模式](../00-understanding-deployment-modes.md)。

### 设置您的HDFS

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CommonDownloadDesc from '@site/docs/public/templates/deploying-databend-common.md';

<Tabs groupId="operating-systems">

<TabItem value="HDFS" label="HDFS">

在部署Databend之前，请确保您已成功设置Hadoop环境，并完成了以下任务：

- 您的系统已安装支持JVM的Java SDK。
- 获取连接到HDFS的名称节点URL。
- 您已将Hadoop发行版下载到您的系统，并可以访问发行版中的JAR包。

:::note
当使用HDFS作为存储后端时，请确保设置以下环境变量：

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

### 下载Databend

a. 在目录`/usr/local`中创建一个名为`databend`的文件夹。

b. 从[GitHub Release](https://github.com/datafuselabs/databend/releases)下载并提取适用于您平台的最新Databend发行版：

:::note
要使用HDFS作为存储后端，请下载文件名为`databend-hdfs-${version}-${target-platform}.tar.gz`的发行版。
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

c. 将提取的文件夹`bin`、`configs`和`scripts`移动到`/usr/local/databend`文件夹中。

</TabItem>

<TabItem value="WebHDFS" label="WebHDFS">

在部署Databend之前，请确保您已成功设置Hadoop环境，并完成了以下任务：

- 在Hadoop上启用WebHDFS支持。
- 获取连接到WebHDFS的端点URL。
- 获取用于认证的委托令牌（如果需要）。

有关如何在Apache Hadoop上启用和管理WebHDFS的信息，请参阅WebHDFS手册。以下是一些可能有用的链接：

- <https://hadoop.apache.org/docs/r3.3.2/hadoop-project-dist/hadoop-hdfs/WebHDFS.html>

<CommonDownloadDesc />

</TabItem>
</Tabs>

### 部署元数据节点

a. 打开位于`/usr/local/databend/configs`文件夹中的文件`databend-meta.toml`，并在整个文件中将`127.0.0.1`替换为`0.0.0.0`。

b. 打开一个终端窗口，导航到`/usr/local/databend/bin`文件夹。

c. 运行以下命令以启动元数据节点：

```shell
./databend-meta -c ../configs/databend-meta.toml > meta.log 2>&1 &
```

d. 运行以下命令以检查元数据节点是否成功启动：

```shell
curl -I  http://127.0.0.1:28101/v1/health
```

### 部署查询节点

a. 定位位于`/usr/local/databend/configs`文件夹中的文件`databend-query.toml`。

b. 在文件`databend-query.toml`中，设置[storage]块中的参数*type*，并配置连接到您的HDFS的访问凭据和端点URL。

要配置存储设置，请通过在每行前面添加`#`来注释掉[storage.fs]部分，然后通过删除`#`符号来取消注释适合您的HDFS提供商的部分，并填写必要的值。您可以复制并粘贴下面的相应模板到文件中，并相应地进行配置。

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
# 如果您的webhdfs需要认证，请取消注释并设置您的值
# delegation = "<delegation-token>"
```

</TabItem>
</Tabs>

c. 使用[query.users]部分配置管理员用户。有关更多信息，请参阅[配置管理员用户](../../04-references/01-admin-users.md)。为了使用默认的root用户和认证类型“no_password”，请确保在文件`databend-query.toml`中删除以下行前面的`#`字符：

:::caution
在本教程中使用“no_password”认证的root用户仅作为示例，由于潜在的安全风险，不建议在生产环境中使用。
:::

```toml title='databend-query.toml'
...
[[query.users]]
name = "root"
auth_type = "no_password"
...
```

d. 打开一个终端窗口，导航到`/usr/local/databend/bin`文件夹。

e. 运行以下命令以启动查询节点：

```shell
./databend-query -c ../configs/databend-query.toml > query.log 2>&1 &
```

f. 运行以下命令以检查查询节点是否成功启动：

```shell
curl -I  http://127.0.0.1:8080/v1/health
```

### 验证部署

在本节中，我们将使用[BendSQL](https://github.com/datafuselabs/BendSQL)对Databend运行一个简单的查询来验证部署。

a. 按照[安装BendSQL](../../../30-sql-clients/00-bendsql/index.md#安装BendSQL)在您的机器上安装BendSQL。

b. 启动BendSQL并检索当前时间以进行验证。

### 启动和停止Databend

每次启动和停止Databend时，只需在`/usr/local/databend/scripts`文件夹中运行脚本：

```shell
# 启动Databend
./scripts/start.sh

# 停止Databend
./scripts/stop.sh
```

<DetailsWrap>
<details>
  <summary>权限被拒绝？</summary>
  <div>
    如果在尝试启动Databend时遇到以下错误消息：

```shell
==> query.log <==
: No getcpu support: percpu_arena:percpu
: option background_thread currently supports pthread only
Databend Query start failure, cause: Code: 1104, Text = failed to create appender: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }.
```

运行以下命令并尝试再次启动Databend：

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

部署Databend后，您可能需要了解以下主题：

- [加载与卸载数据](/guides/load-data)：管理Databend中的数据导入/导出。
- [可视化](/guides/visualize)：将Databend与可视化工具集成以获取洞察。