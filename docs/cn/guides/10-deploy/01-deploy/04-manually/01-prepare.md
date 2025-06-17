---
title: 准备安装包环境
---

## 前提条件

- 一个基于 Linux 的操作系统
- 需要 `wget` 或 `curl` 来下载文件
- 需要 `tar` 来解压安装包
- 需要 `sudo` 权限以进行系统级安装

## 检查系统架构

1. 检查你的系统架构：
   ```bash
   uname -m
   ```

   输出将帮助你确定要下载哪个安装包：
   - 如果输出是 `x86_64`，请下载 x86_64 安装包
   - 如果输出是 `aarch64`，请下载 aarch64 安装包

## 下载安装包

1. 访问 [Databend GitHub Releases](https://github.com/datafuselabs/databend/releases) 页面。

2. 选择最新的稳定发布版本。例如，如果你想安装 v1.2.755-nightly 版本，你需要下载：
   - `databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz` 适用于 x86_64 Linux 系统
   - `databend-v1.2.755-nightly-aarch64-unknown-linux-gnu.tar.gz` 适用于 aarch64 Linux 系统

3. 使用 wget 下载安装包（请将 `v1.2.755-nightly` 替换为你想要的版本）：
   ```bash
   wget https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   或者使用 curl 下载（请将 `v1.2.755-nightly` 替换为你想要的版本）：
   ```bash
   curl -L -O https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   注意：请确保将 URL 和文件名中的 `v1.2.755-nightly` 替换为你想要的版本号。

## 解压安装包

1. 在当前目录解压安装包：
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## 验证安装

1. 检查解压后的文件：
   ```bash
   ls --tree
   ```

   你应该会看到以下目录结构：
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

1. 运行预安装脚本以创建 databend 用户和用户组：
   ```bash
   sudo ./scripts/preinstall.sh
   ```

   该脚本将：
   - 若 `databend` 用户和用户组不存在，则创建它们
   - 设置必要的系统配置
   - 创建具有适当权限的所需目录

## 下一步

现在你已经准备好了环境，可以继续进行以下操作：
- [部署 Meta 服务](02-deploy-metasrv.md)
-