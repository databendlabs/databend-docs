---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) 是为 Databend 设计的命令行工具。它允许用户与 Databend 建立连接，并直接从 CLI 窗口执行查询。

BendSQL 特别适用于那些更喜欢命令行界面并需要定期与 Databend 工作的用户。通过 BendSQL，用户可以轻松高效地管理数据库、表和数据，并轻松执行各种查询和操作。

## 安装 BendSQL

BendSQL 可以使用不同的包管理器在各种平台上安装。以下部分概述了使用 Cargo（Rust 包管理器）、Homebrew（适用于 macOS）和 Apt（适用于 Ubuntu/Debian）安装 BendSQL 的步骤。或者，您可以从 GitHub 的 [BendSQL 发布页面](https://github.com/datafuselabs/BendSQL/releases)下载安装包，并手动安装 BendSQL。

### Cargo（Rust 包管理器）

要使用 Cargo 安装 BendSQL，请利用 `cargo-binstall` 工具或使用提供的命令从源码构建。

```bash
# 使用 cargo-binstall
cargo binstall bendsql

# 或者，从源码构建
cargo install bendsql
```

### Homebrew（适用于 macOS）

可以使用 Homebrew 在 macOS 上通过简单的命令轻松安装 BendSQL：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt（适用于 Ubuntu/Debian）

在 Ubuntu 和 Debian 系统上，可以通过 Apt 包管理器安装 BendSQL。根据发行版的版本选择适当的指令。

#### DEB822 格式（Ubuntu-22.04/Debian-12 及以后版本）

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

#### 旧格式（Ubuntu-20.04/Debian-11 及以前版本）

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.rs/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.rs/deb/datafuselabs.list
```

最后，更新软件包列表并安装 BendSQL：

```bash
sudo apt update
sudo apt install bendsql
```

## 连接到 Databend

- [教程-1：使用 BendSQL 连接到 Databend](00-connect-to-databend.md)
- [教程-2：使用 BendSQL 连接到 Databend Cloud](01-connect-to-databend-cloud.md)

**相关视频：**

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/3cFmGvtU-ws" title="YouTube 视频播放器" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>