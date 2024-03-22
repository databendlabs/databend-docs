---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) 是一个专为 Databend 设计的命令行工具。它允许用户与 Databend 建立连接，并直接从 CLI 窗口执行查询。

BendSQL 特别适用于那些偏好命令行界面并需要定期与 Databend 工作的用户。通过 BendSQL，用户可以轻松高效地管理他们的数据库、表和数据，并轻松执行广泛的查询和操作。

## 安装 BendSQL

BendSQL 可以使用不同的包管理器在各种平台上安装。以下部分概述了使用 Homebrew（适用于 macOS）、Apt（适用于 Ubuntu/Debian）和 Cargo（Rust 包管理器）安装 BendSQL 的步骤。或者，您可以从 GitHub 上的 [BendSQL 发布页面](https://github.com/datafuselabs/BendSQL/releases) 下载安装包，并手动安装 BendSQL。

### Homebrew（适用于 macOS）

可以使用 Homebrew 在 macOS 上轻松安装 BendSQL，只需一个简单的命令：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt（适用于 Ubuntu/Debian）

在 Ubuntu 和 Debian 系统上，可以通过 Apt 包管理器安装 BendSQL。根据发行版版本选择适当的说明。

#### DEB822-STYLE 格式（Ubuntu-22.04/Debian-12 及更高版本）

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

#### 旧格式（Ubuntu-20.04/Debian-11 及更早版本）

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

## 自定义 BendSQL

BendSQL 提供了一系列设置，允许您定义如何呈现查询结果。有关特定设置和自定义方法，请参考文档：https://github.com/datafuselabs/bendsql/blob/main/README.md

您有以下方法为 BendSQL 配置设置：

- 在配置文件 `~/.config/bendsql/config.toml` 中添加和配置设置。为此，请打开文件并在 `[settings]` 部分下添加您的设置。以下示例将 `max_display_rows` 设置为 10 和 `max_width` 设置为 100：

```toml title='示例：'
...
[settings]
max_display_rows = 10
max_width = 100
...
```

- 通过启动 BendSQL 然后以 `.<setting> <value>` 的格式指定设置来在运行时配置设置。请注意，以这种方式配置的设置仅在当前会话中生效。

```shell title='示例：'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> .max_width 100
```

### 管理行可见性

`max_display_rows` 设置用于设置在呈现查询结果时输出格式中显示的最大行数。默认情况下，它将显示限制为 40 行。以下示例演示了将显示的最大行数设置为 10，仅展示总共 96 行中的 10 行子集：

```sql title='示例：'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> select * from system.settings;

SELECT
  *
FROM
  system.settings



```markdown
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     名称                    │  值  │ 默认值 │   范围  │  级别  │                                                                     描述                                                                    │  类型  │
│                    字符串                   │ 字符串 │ 字符串 │ 字符串 │ 字符串 │                                                                       字符串                                                                       │ 字符串 │
├─────────────────────────────────────────────┼─────────┼─────────┼──────────┼─────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────┤
│ acquire_lock_timeout                        │ 15      │ 15      │ 无       │ 默认    │ 设置获取锁的最大超时时间（秒）。                                                                                                               │ UInt64 │
│ aggregate_spilling_bytes_threshold_per_proc │ 0       │ 0       │ 无       │ 默认    │ 设置聚合器在查询执行期间将数据溢写到存储之前，可以使用的最大内存量（字节）。                                                                      │ UInt64 │
│ aggregate_spilling_memory_ratio             │ 0       │ 0       │ [0, 100] │ 默认    │ 设置聚合器在查询执行期间将数据溢写到存储之前，可以使用的最大内存比例（字节）。                                                                    │ UInt64 │
│ auto_compaction_imperfect_blocks_threshold  │ 50      │ 50      │ 无       │ 默认    │ 触发自动压缩的阈值。当快照中不完美的块数量在写操作后超过此值时发生。                                                                         │ UInt64 │
│ collation                                   │ utf8    │ utf8    │ ["utf8"] │ 默认    │ 设置字符排序规则。可用值包括 "utf8"。                                                                                                           │ 字符串 │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                              │ ·      │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                              │ ·      │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                              │ ·      │
│ storage_read_buffer_size                    │ 1048576 │ 1048576 │ 无       │ 默认    │ 设置用于将数据读入内存的缓冲区的字节大小。                                                                                                      │ UInt64 │
│ table_lock_expire_secs                      │ 10      │ 10      │ 无       │ 默认    │ 设置表锁过期的秒数。                                                                                                                           │ UInt64 │
│ timezone                                    │ UTC     │ UTC     │ 无       │ 默认    │ 设置时区。                                                                                                                                     │ 字符串 │
│ unquoted_ident_case_sensitive               │ 0       │ 0       │ 无       │ 默认    │ 确定 Databend 是否将未加引号的标识符视为区分大小写。                                                                                             │ UInt64 │
│ use_parquet2                                │ 0       │ 0       │ [0, 1]   │ 默认    │ 此设置已弃用                                                                                                                                   │ UInt64 │
│ 96 行                                       │         │         │          │         │                                                                                                                                                │        │
│ （显示 10 行）                                │         │         │          │         │                                                                                                                                                │        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
96 行读取于 0.022 秒。处理了 96 行，16.52 KiB（4.45 千行/秒，766.10 KiB/秒）
```

### 调整列和表宽度 {#adjusting-column-and-table-widths}

参数 `max_col_width` 和 `max_width` 分别指定单个列和整个显示输出的最大允许宽度（以字符为单位）。

| 设置           | 描述                                                                                                     | 默认值      |
|---------------|----------------------------------------------------------------------------------------------------------|------------|
| max_width     | 设置整个显示输出的最大宽度（以字符为单位）。值为 0 时默认为终端窗口的宽度。                                | 1048576    |
| max_col_width | 设置每列显示渲染的最大宽度（以字符为单位）。小于 3 的值会禁用此限制。                                      | 1048576    |

以下示例将列显示宽度设置为 10 个字符，整个显示宽度设置为 100 个字符：

```sql title='示例：'
root@localhost:8000/default> .max_col_width 10
root@localhost:8000/default> .max_width 100
root@localhost:8000/default> select * from system.settings;

SELECT
  *
FROM
  system.settings

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│    name    │  value  │ default │   range  │  level  │            description            │  type  │
│   String   │  String │  String │  String  │  String │               String              │ String │
├────────────┼─────────┼─────────┼──────────┼─────────┼───────────────────────────────────┼────────┤
│ acquire... │ 15      │ 15      │ None     │ DEFAULT │ Sets the maximum timeout in se... │ UInt64 │
│ aggrega... │ 0       │ 0       │ None     │ DEFAULT │ Sets the maximum amount of mem... │ UInt64 │
│ aggrega... │ 0       │ 0       │ [0, 100] │ DEFAULT │ Sets the maximum memory ratio ... │ UInt64 │
│ auto_co... │ 50      │ 50      │ None     │ DEFAULT │ Threshold for triggering auto ... │ UInt64 │
│ collation  │ utf8    │ utf8    │ ["utf8"] │ DEFAULT │ Sets the character collation. ... │ String │
│ ·          │ ·       │ ·       │ ·        │ ·       │ ·                                 │ ·      │
│ ·          │ ·       │ ·       │ ·        │ ·       │ ·                                 │ ·      │
│ ·          │ ·       │ ·       │ ·        │ ·       │ ·                                 │ ·      │
│ storage... │ 1048576 │ 1048576 │ None     │ DEFAULT │ Sets the byte size of the buff... │ UInt64 │
│ table_l... │ 10      │ 10      │ None     │ DEFAULT │ Sets the seconds that the tabl... │ UInt64 │
│ timezone   │ UTC     │ UTC     │ None     │ DEFAULT │ Sets the timezone.                │ String │
│ unquote... │ 0       │ 0       │ None     │ DEFAULT │ Determines whether Databend tr... │ UInt64 │
│ use_par... │ 0       │ 0       │ [0, 1]   │ DEFAULT │ This setting is deprecated        │ UInt64 │
│ 96 rows    │         │         │          │         │                                   │        │
│ (10 shown) │         │         │          │         │                                   │        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
96 rows read in 0.040 sec. Processed 96 rows, 16.52 KiB (2.38 thousand rows/s, 410.18 KiB/s)
```

## 连接到 Databend

- [教程-1：使用 BendSQL 连接到 Databend](00-connect-to-databend.md)
- [教程-2：使用 BendSQL 连接到 Databend Cloud](01-connect-to-databend-cloud.md)

**相关视频：**

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/3cFmGvtU-ws" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>