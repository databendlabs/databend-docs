---
title: 下载 Databend
sidebar_label: 下载 Databend
---

Databend 提供以下选项来下载安装包：

- [手动下载](#手动下载)：您可以直接从 Databend 网站下载适用于您平台的安装包。
- [APT 包管理器](#apt-包管理器)：您可以使用 APT 包管理器在 Ubuntu 或 Debian 上下载并安装 Databend。
- [Docker](#docker)：您可以使用 Docker 下载并在容器化环境中运行 Databend。

## 手动下载

Databend 的主要分发包是 `.tar.gz` 格式的归档文件，包含单一可执行文件。您可以从 [下载页面](https://www.databend.com/download) 下载并将其解压到系统上的任意位置。

:::note
**Linux Generic (Arm, 64-bit)** 适用于使用 musl 作为标准 C 库的 Linux 发行版；**Linux Generic (x86, 64-bit)** 适用于使用 GNU C 库且 GLIBC 最低版本为 2.29 的 Linux 发行版。
:::

## APT 包管理器

Databend 为 Debian 和 Ubuntu 系统提供了包仓库，允许您使用 `apt install` 命令或其他 APT 前端工具安装 Databend。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="distributions">
<TabItem value="deb-old" label="Ubuntu/Debian">

```shell
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.com/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.com/deb/datafuselabs.list

sudo apt update

sudo apt install databend
```

</TabItem>

<TabItem value="deb-new" label="Ubuntu/Debian(DEB822-STYLE FORMAT)">

:::note
支持的平台：
• Ubuntu Jammy (22.04) 及以上
• Debian Bookworm(12) 及以上

:::

```shell
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.com/deb/datafuselabs.sources

sudo apt update

sudo apt install databend
```

</TabItem>
</Tabs>

:::tip
安装完成后，可以运行以下命令启动 Databend：

```shell
sudo systemctl start databend-meta
sudo systemctl start databend-query
```

:::

## Docker

Databend 在 Docker Hub 上提供以下类型的安装镜像：

- [ Databend 一体化镜像](https://hub.docker.com/r/datafuselabs/databend): 适用于本地测试、CI 等场景。
- 独立镜像：适用于生产环境、Kubernetes 和 [Helm Charts](https://github.com/databendlabs/helm-charts).
- [databend-meta](https://hub.docker.com/r/datafuselabs/databend-meta)
- [databend-query](https://hub.docker.com/r/datafuselabs/databend-query)

点击以上链接查看详细安装说明。
