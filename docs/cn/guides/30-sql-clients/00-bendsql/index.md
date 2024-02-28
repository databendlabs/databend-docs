---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) 是一个专为 Databend 设计的命令行工具。它允许用户建立与 Databend 的连接，并直接从 CLI 窗口执行查询。

BendSQL 对于那些偏好命令行界面并需要定期与 Databend 工作的用户特别有用。通过 BendSQL，用户可以轻松高效地管理他们的数据库、表和数据，并轻松执行广泛的查询和操作。

## 安装 BendSQL

BendSQL 可以使用不同的包管理器在各种平台上安装。以下部分概述了使用 Homebrew（适用于 macOS）、Apt（适用于 Ubuntu/Debian）和 Cargo（Rust 包管理器）安装 BendSQL 的步骤。或者，您可以从 GitHub 上的 [BendSQL 发布页面](https://github.com/datafuselabs/BendSQL/releases) 下载安装包并手动安装 BendSQL。

### Homebrew（适用于 macOS）

BendSQL 可以使用 Homebrew 在 macOS 上轻松安装，只需一个简单的命令：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt（适用于 Ubuntu/Debian）

在 Ubuntu 和 Debian 系统上，可以通过 Apt 包管理器安装 BendSQL。根据发行版版本选择适当的说明。

#### DEB822-STYLE 格式（Ubuntu-22.04/Debian-12 及以后版本）

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

#### 旧格式（Ubuntu-20.04/Debian-11 及以前版本）

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.rs/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.rs/deb/datafuselabs.list
```

最后，更新包列表并安装 BendSQL：

```bash
sudo apt update
sudo apt install bendsql
```

### Cargo（Rust 包管理器）

使用 Cargo 安装 BendSQL，可以使用 `cargo-binstall` 工具或使用提供的命令从源代码构建。

:::note
在使用 Cargo 安装之前，请确保您的计算机上安装了完整的 Rust 工具链和 `cargo` 命令。如果没有，请按照 [https://rustup.rs/](https://rustup.rs/) 上的安装指南进行安装。
:::

**使用 cargo-binstall**

请参考 [Cargo B(inary)Install - 安装](https://github.com/cargo-bins/cargo-binstall#installation) 来安装 `cargo-binstall` 并启用 `cargo binstall <crate-name>` 子命令。

```bash
cargo binstall bendsql
```

**从源代码构建**

从源代码构建时，一些依赖项可能涉及编译 C/C++ 代码。确保您的计算机上安装了 GCC/G++ 或 Clang 工具链。

```bash
cargo install bendsql
```

## 连接到 Databend

- [教程-1：使用 BendSQL 连接到 Databend](00-connect-to-databend.md)
- [教程-2：使用 BendSQL 连接到 Databend Cloud](01-connect-to-databend-cloud.md)

**相关视频：**

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/3cFmGvtU-ws" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>