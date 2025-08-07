---
title: 准备软件包环境
---

## 前提条件

- 基于 Linux 的操作系统
- 用于下载文件的 `wget` 或 `curl`
- 用于解压软件包的 `tar`
- 用于系统级安装的 `sudo` 权限

## 检查系统架构

1. 检查系统架构：

   ```bash
   uname -m
   ```

   输出将帮助您确定要下载的软件包：

   - 若输出为 `x86_64`，请下载 x86_64 软件包
   - 若输出为 `aarch64`，请下载 aarch64 软件包

## 下载软件包

1. 访问 [Databend GitHub Releases](https://github.com/databendlabs/databend/releases) 页面。

2. 选择最新的稳定版本。例如，若要安装 v1.2.755-nightly，需下载：

   - `databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz`（适用于 x86_64 Linux 系统）
   - `databend-v1.2.755-nightly-aarch64-unknown-linux-gnu.tar.gz`（适用于 aarch64 Linux 系统）

3. 使用 wget 下载软件包（将 `v1.2.755-nightly` 替换为目标版本）：

   ```bash
   wget https://github.com/databendlabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   或使用 curl（将 `v1.2.755-nightly` 替换为目标版本）：

   ```bash
   curl -L -O https://github.com/databendlabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   注意：请务必将 URL 和文件名中的 `v1.2.755-nightly` 替换为目标版本号。

## 解压软件包

1. 在当前目录解压软件包：
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## 验证安装

1. 检查解压后的文件：

   ```bash
   ls --tree
   ```

   应看到以下目录结构：

   ```
   .
   ├── bin
   │   ├── bendsql
   │   ├── databend-bendsave
   │   ├── databend-meta
   │   ├── databend-metactl
   │   └── databend-query
   ├── configs
   │   ├── databend-meta.toml
   │   └── databend-query.toml
   ├── readme.txt
   ├── scripts
   │   ├── postinstall.sh
   │   └── preinstall.sh
   └── systemd
       ├── databend-meta.default
       ├── databend-meta.service
       ├── databend-query.default
       └── databend-query.service
   ```

2. 验证二进制文件是否可执行：
   ```bash
   ./bin/databend-meta --version
   ./bin/databend-metactl --version
   ./bin/databend-query --version
   ./bin/bendsql --version
   ```

## 创建 Databend 用户

1. 运行预安装脚本以创建 databend 用户和组：

   ```bash
   sudo ./scripts/preinstall.sh
   ```

   该脚本将：

   - 若不存在，则创建 databend 用户和组
   - 设置必要的系统配置
   - 创建所需目录并赋予适当权限

## 下一步

环境准备就绪后，可继续：

- [部署 Meta 服务](02-deploy-metasrv.md)
- [部署 Query 服务](03-deploy-query.md)