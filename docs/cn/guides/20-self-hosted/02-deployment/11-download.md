---
title: 下载 Databend
sidebar_label: 下载 Databend
---

Databend 为您提供以下选项来下载安装包：

- [手动下载](#manual-download)：您可以直接从 Databend 网站下载适用于您平台的安装包。
- [APT 包管理器](#apt-package-manager)：您可以使用 APT 包管理器在 Ubuntu 或 Debian 上下载并安装 Databend。
- [Docker](#docker)：您可以使用 Docker 在容器化环境中下载并运行 Databend。

## 手动下载

Databend 的主要分发包是 `.tar.gz` 压缩包，其中包含单个可执行文件，您可以从 [下载](https://www.databend.com/download) 页面下载这些文件，并将它们解压到系统上的任何位置。

:::note
**Linux Generic (Arm, 64-bit)** 适用于使用 musl 作为标准 C 库的 Linux 发行版；**Linux Generic (x86, 64-bit)** 适用于使用 GNU C 且 GLIBC 最低版本为 2.29 的 Linux 发行版。
:::

## APT 包管理器

Databend 为 Debian 和 Ubuntu 系统提供软件包存储库，允许您使用 apt install 命令或任何其他 APT 前端安装 Databend。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="distributions">
<TabItem value="deb-old" label="Ubuntu/Debian">

```shell
sudo curl -L -o /usr/share/keyrings/databend-keyring.gpg https://repo.databend.com/deb/databend.gpg
sudo curl -L -o /etc/apt/sources.list.d/databend.list https://repo.databend.com/deb/databend.list

sudo apt update

sudo apt install databend
```

</TabItem>

<TabItem value="deb-new" label="Ubuntu/Debian(DEB822-STYLE FORMAT)">

:::note
可用平台：

- Ubuntu Jammy (22.04) 及更高版本
- Debian Bookworm(12) 及更高版本

:::

```shell
sudo curl -L -o /etc/apt/sources.list.d/databend.sources https://repo.databend.com/deb/databend.sources

sudo apt update

sudo apt install databend
```

</TabItem>
</Tabs>

:::tip
要在安装后启动 Databend，请运行以下命令：

```shell
sudo systemctl start databend-meta
sudo systemctl start databend-query
```

:::

## Docker

Databend 在 Docker Hub 上提供以下类型的安装镜像：

- [Databend All-in-One Docker Image](https://hub.docker.com/r/datafuselabs/databend)：专为本地测试、CI 等构建。
- 分离镜像：专为生产环境、Kubernetes 和 [Helm Charts](https://github.com/databendlabs/helm-charts) 构建。
  - [databend-meta](https://hub.docker.com/r/datafuselabs/databend-meta)
  - [databend-query](https://hub.docker.com/r/datafuselabs/databend-query)

单击上面的链接获取其详细说明。