---
title: 准备安装包环境
---

## 前提条件

- 基于 Linux 的操作系统
- 用于下载文件的 `wget` 或 `curl`
- 用于解压安装包的 `tar`
- 系统级安装所需的 `sudo` 权限

## 检查系统架构

1. 检查系统架构：
   ```bash
   uname -m
   ```

   输出结果决定需下载的安装包类型：
   - 若输出 `x86_64`，下载 x86_64 安装包
   - 若输出 `aarch64`，下载 aarch64 安装包

## 下载安装包

1. 访问 [Databend GitHub Releases](https://github.com/datafuselabs/databend/releases) 页面

2. 选择最新稳定版本（如 v1.2.755-nightly），需下载对应文件：
   - `databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz`（x86_64 Linux 系统）
   - `databend-v1.2.755-nightly-aarch64-unknown-linux-gnu.tar.gz`（aarch64 Linux 系统）

3. 使用 wget 下载（替换 `v1.2.755-nightly` 为目标版本）：
   ```bash
   wget https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   或使用 curl（替换 `v1.2.755-nightly` 为目标版本）：
   ```bash
   curl -L -O https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   注意：需同步替换 URL 和文件名中的 `v1.2.755-nightly` 版本号

## 解压安装包

1. 当前目录解压安装包：
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## 验证安装

1. 检查解压文件结构：
   ```bash
   ls --tree
   ```

   应显示以下目录结构：
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

2. 验证二进制文件可执行性：
   ```bash
   ./bin/databend-meta --version
   ./bin/databend-metactl --version
   ./bin/databend-query --version
   ./bin/bendsql --version
   ```

## 创建 Databend 用户

1. 执行预安装脚本创建用户和组：
   ```bash
   sudo ./scripts/preinstall.sh
   ```

   此脚本将：
   - 创建不存在的 `databend` 用户及用户组
   - 配置必要系统参数
   - 创建权限合规的目录结构

## 下一步

环境准备完成后，继续执行：
- [部署 Meta 服务 (Meta Service)](02-deploy-metasrv.md)
- [部署 Query 服务 (Query Service)](03-deploy-query.md)