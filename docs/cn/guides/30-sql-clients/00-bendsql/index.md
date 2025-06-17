---
title: BendSQL
---

[BendSQL](https://github.com/databendlabs/bendsql) 是一款专为 Databend 设计的命令行工具。它允许用户与 Databend 建立连接，并直接从命令行界面（CLI）窗口执行查询。

对于偏好命令行界面且需定期使用 Databend 的用户而言，BendSQL 尤为实用。借助该工具，用户可高效管理数据库、表和数据，轻松执行各类查询与操作。

## 安装 BendSQL

BendSQL 提供多种安装选项以适应不同平台需求。请从以下方式选择，或从 [BendSQL 发布页面](https://github.com/databendlabs/bendsql/releases) 手动下载安装包。

### Shell 脚本

BendSQL 提供便捷的 Shell 安装脚本，支持两种模式：

#### 默认安装

安装至用户主目录（~/.bendsql）：

```bash
curl -fsSL https://repo.databend.cn/install/bendsql.sh | bash
```

```bash title='示例:'
# highlight-next-line
curl -fsSL https://repo.databend.cn/install/bendsql.sh | bash

                                  B E N D S Q L
                                    Installer

--------------------------------------------------------------------------------
Website: https://databend.cn
Docs: https://docs.databend.cn
Github: https://github.com/databendlabs/bendsql
--------------------------------------------------------------------------------

>>> We'll be installing BendSQL via a pre-built archive at https://repo.databend.cn/bendsql/v0.22.2/
>>> Ready to proceed? (y/n)

>>> Please enter y or n.
>>> y

--------------------------------------------------------------------------------

>>> Downloading BendSQL via https://repo.databend.cn/bendsql/v0.22.2/bendsql-aarch64-apple-darwin.tar.gz ✓
>>> Unpacking archive to /Users/eric/.bendsql ... ✓
>>> Adding BendSQL path to /Users/eric/.zprofile ✓
>>> Adding BendSQL path to /Users/eric/.profile ✓
>>> Install succeeded! 🚀
>>> To start BendSQL:

    bendsql --help

>>> More information at https://github.com/databendlabs/bendsql
```

#### 使用 `--prefix` 自定义安装

安装至指定目录（如 /usr/local）：

```bash
curl -fsSL https://repo.databend.cn/install/bendsql.sh | bash -s -- -y --prefix /usr/local
```

```bash title='示例:'
# highlight-next-line
curl -fsSL https://repo.databend.cn/install/bendsql.sh | bash -s -- -y --prefix /usr/local
                                  B E N D S Q L
                                    Installer

--------------------------------------------------------------------------------
Website: https://databend.cn
Docs: https://docs.databend.cn
Github: https://github.com/databendlabs/bendsql
--------------------------------------------------------------------------------

>>> Downloading BendSQL via https://repo.databend.cn/bendsql/v0.22.2/bendsql-aarch64-apple-darwin.tar.gz ✓
>>> Unpacking archive to /usr/local ... ✓
>>> Install succeeded! 🚀
>>> To start BendSQL:

    bendsql --help

>>> More information at https://github.com/databendlabs/bendsql
```

### Homebrew (macOS 系统)

通过 Homebrew 一键安装：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt (Ubuntu/Debian 系统)

根据系统版本选择对应安装方式：

#### DEB822-STYLE 格式 (Ubuntu-22.04/Debian-12 及以上)

```bash
sudo curl -L -o /etc/apt/sources.list.d/databend.sources https://repo.databend.cn/deb/databend.sources
```

#### 旧格式 (Ubuntu-20.04/Debian-11 及更早版本)

```bash
sudo curl -L -o /usr/share/keyrings/databend-keyring.gpg https://repo.databend.cn/deb/databend.gpg
sudo curl -L -o /etc/apt/sources.list.d/databend.list https://repo.databend.cn/deb/databend.list
```

更新并安装：

```bash
sudo apt update
sudo apt install bendsql
```

### Cargo (Rust 包管理器)

通过 `cargo-binstall` 或源码编译安装：

:::note
安装前需确保已安装完整 Rust 工具链。参考 [https://rustup.rs/](https://rustup.rs/) 完成安装。
:::

**使用 cargo-binstall**

按 [Cargo B(inary)Install 指南](https://github.com/cargo-bins/cargo-binstall#installation) 安装后执行：

```bash
cargo binstall bendsql
```

**源码编译**

需提前安装 GCC/G++ 或 Clang 工具链：

```bash
cargo install bendsql
```

## 用户认证

* **自托管实例**：使用 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中的管理员账户或 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 创建的 SQL 用户
* **Databend Cloud**：使用默认 `cloudapp` 用户或 SQL 用户（控制台登录账户不可用于直连）

## 连接方式

### DSN 定制化连接

通过 URI 格式字符串配置连接参数：

#### DSN 格式与参数

```bash title='DSN 格式'
databend[+flight]://user[:password]@host[:port]/[database][?sslmode=disable][&arg1=value1]
```

| 通用参数          | 描述                          |
|-------------------|-------------------------------|
| `tenant`          | 租户 ID（仅 Cloud）           |
| `warehouse`       | 计算集群名称（仅 Cloud）      |
| `sslmode`         | 禁用 TLS 时设为 `disable`     |
| `tls_ca_file`     | 自定义根 CA 证书路径          |
| `connect_timeout` | 连接超时（秒）                |

| RestAPI 参数             | 描述                                                                 |
|--------------------------|----------------------------------------------------------------------|
| `wait_time_secs`         | 页面请求等待时间（默认 `1`）                                        |
| `max_rows_in_buffer`     | 页面缓冲区最大行数                                                  |
| `max_rows_per_page`      | 单页最大响应行数                                                    |
| `page_request_timeout_secs` | 单页请求超时（默认 `30`）                                         |
| `presign`                | 数据加载预签名（选项：`auto`/`detect`/`on`/`off`，默认 `auto` 仅 Cloud） |

| FlightSQL 参数          | 描述                                                          |
|-------------------------|---------------------------------------------------------------|
| `query_timeout`         | 查询超时（秒）                                                |
| `tcp_nodelay`           | 默认 `true`                                                   |
| `tcp_keepalive`         | TCP 保活时间（默认 `3600`，`0` 禁用）                         |
| `http2_keep_alive_interval` | Keep-alive 间隔（秒，默认 `300`）                          |
| `keep_alive_timeout`    | Keep-alive 超时（秒，默认 `20`）                              |
| `keep_alive_while_idle` | 默认 `true`                                                   |

#### DSN 示例

```bash
# 本地 HTTP 连接（预签名检测）
databend://root:@localhost:8000/?sslmode=disable&presign=detect

# Cloud 连接（含租户与计算集群）
databend://user1:password1@tnxxxx--default.gw.aws-us-east-2.default.databend.cn:443/benchmark?enable_dphyp=1

# 本地 FlightSQL 连接
databend+flight://root:@localhost:8900/database1?connect_timeout=10
```

### 连接 Databend Cloud

最佳实践：从控制台获取 DSN 并导出为环境变量：

1. 登录后进入 **概览** > **连接**
2. 选择数据库与计算集群
3. 复制自动生成的 DSN 导出命令：

```bash title='示例'
export BENDSQL_DSN="databend://cloudapp:******@tn3ftqihs.gw.aws-us-east-2.default.databend.cn:443/information_schema?warehouse=small-xy2t"
bendsql
```

### 连接自托管实例

#### 选项 1：命令行参数

```bash
bendsql --host <主机> --port <端口> --user <用户> --password <密码> --database <数据库>
```

```bash title='示例'
bendsql --host 127.0.0.1 --port 8000 --user eric --password abc123
```

#### 选项 2：DSN 环境变量

```bash title='示例'
export BENDSQL_DSN="databend://eric:abc123@localhost:8000/?sslmode=disable"
bendsql
```

## 教程指南

- [通过 BendSQL 连接自托管实例](/tutorials/)
- [通过 BendSQL 连接 Databend Cloud](/tutorials/connect/connect-to-databendcloud-bendsql)

## 配置设置

| 设置项                | 描述                                                                 |
|-----------------------|----------------------------------------------------------------------|
| `display_pretty_sql`  | 启用 SQL 美化输出（默认 `true`）                                    |
| `prompt`              | 命令行提示符格式（支持 `{user}`/`{warehouse}`/`{database}` 变量）   |
| `progress_color`      | 进度指示器颜色（如 `blue`/`cyan`）                                  |
| `show_progress`       | 显示长时操作进度（默认 `true`）                                     |
| `show_stats`          | 显示查询统计信息（默认 `true`）                                     |
| `max_display_rows`    | 结果最大显示行数（默认 `40`）                                       |
| `max_col_width`       | 单列最大宽度（字符数，小于 `3` 禁用）                               |
| `max_width`           | 输出总宽度（字符数，`0` 为终端宽度）                                |
| `output_format`       | 输出格式（`table`/`csv`/`tsv`/`null`）                             |
| `expand`              | 结果展开模式（`on`/`off`/`auto`）                                  |
| `multi_line`          | 启用多行 SQL 输入（默认 `true`）                                    |
| `replace_newline`     | 替换输出中的换行符（默认 `true`）                                   |

### 配置方式

#### 会话命令

```bash
!set <设置项> <值>  # 例如 !set max_display_rows 10
.<设置项> <值>     # 例如 .max_width 100（仅当前会话生效）
```

#### 配置文件

编辑 `~/.config/bendsql/config.toml`：

```toml title='示例'
[settings]
max_display_rows = 10
max_width = 100
```

## 实用命令

| 命令                     | 功能                     |
|--------------------------|--------------------------|
| `!exit` / `!quit`        | 退出 BendSQL             |
| `!configs`               | 查看当前配置             |
| `!set <设置项> <值>`     | 修改配置                 |
| `!source <SQL文件>`      | 执行 SQL 文件            |

```shell title='!source 示例'
➜  ~ more test.sql
CREATE TABLE test(id INT, name VARCHAR);
INSERT INTO test VALUES (1, 'Alice'), (2, 'Bob');

➜  ~ bendsql
// highlight-next-line
root@localhost:8000/default> !source test.sql
```