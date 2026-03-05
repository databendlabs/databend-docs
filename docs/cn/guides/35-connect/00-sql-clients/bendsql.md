---
title: BendSQL
---

[BendSQL](https://github.com/databendlabs/bendsql) 是一个专门为 Databend 设计的命令行工具。它允许用户建立与 Databend 的连接，并直接从 CLI 窗口执行查询。

BendSQL 对于那些喜欢命令行界面并且需要定期使用 Databend 的用户特别有用。借助 BendSQL，用户可以轻松高效地管理他们的数据库、表和数据，并轻松执行各种查询和操作。

## 安装 BendSQL

BendSQL 提供了多种安装选项，以适应不同的平台和偏好。从下面的部分中选择您喜欢的方法，或者从 [BendSQL 发布页面](https://github.com/databendlabs/bendsql/releases) 下载安装包手动安装。

### Shell 脚本

BendSQL 提供了一个方便的 Shell 脚本用于安装。您可以在两个选项之间进行选择：

#### 默认安装

将 BendSQL 安装到用户的 home 目录（~/.bendsql）：

```bash
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash
```

```bash title='Example:'
# highlight-next-line
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash

                                  B E N D S Q L
                                    Installer

--------------------------------------------------------------------------------
Website: https://databend.com
Docs: https://docs.databend.com
Github: https://github.com/databendlabs/bendsql
--------------------------------------------------------------------------------

>>> We'll be installing BendSQL via a pre-built archive at https://repo.databend.com/bendsql/v0.22.2/
>>> Ready to proceed? (y/n)

>>> Please enter y or n.
>>> y

--------------------------------------------------------------------------------

>>> Downloading BendSQL via https://repo.databend.com/bendsql/v0.22.2/bendsql-aarch64-apple-darwin.tar.gz ✓
>>> Unpacking archive to /Users/eric/.bendsql ... ✓
>>> Adding BendSQL path to /Users/eric/.zprofile ✓
>>> Adding BendSQL path to /Users/eric/.profile ✓
>>> Install succeeded! 🚀
>>> To start BendSQL:

    bendsql --help

>>> More information at https://github.com/databendlabs/bendsql
```

#### 使用 `--prefix` 进行自定义安装

将 BendSQL 安装到指定的目录（例如，/usr/local）：

```bash
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash -s -- -y --prefix /usr/local
```

```bash title='Example:'
# highlight-next-line
curl -fsSL https://repo.databend.com/install/bendsql.sh | bash -s -- -y --prefix /usr/local
                                  B E N D S Q L
                                    Installer

--------------------------------------------------------------------------------
Website: https://databend.com
Docs: https://docs.databend.com
Github: https://github.com/databendlabs/bendsql
--------------------------------------------------------------------------------

>>> Downloading BendSQL via https://repo.databend.com/bendsql/v0.22.2/bendsql-aarch64-apple-darwin.tar.gz ✓
>>> Unpacking archive to /usr/local ... ✓
>>> Install succeeded! 🚀
>>> To start BendSQL:

    bendsql --help

>>> More information at https://github.com/databendlabs/bendsql
```

### Homebrew (适用于 macOS)

可以使用一个简单的命令在 macOS 上使用 Homebrew 轻松安装 BendSQL：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt (适用于 Ubuntu/Debian)

在 Ubuntu 和 Debian 系统上，可以通过 Apt 包管理器安装 BendSQL。根据发行版版本选择适当的说明。

#### DEB822-STYLE 格式 (Ubuntu-22.04/Debian-12 及更高版本)

```bash
sudo curl -L -o /etc/apt/sources.list.d/databend.sources https://repo.databend.com/deb/databend.sources
```

#### 旧格式 (Ubuntu-20.04/Debian-11 及更早版本)

```bash
sudo curl -L -o /usr/share/keyrings/databend-keyring.gpg https://repo.databend.com/deb/databend.gpg
sudo curl -L -o /etc/apt/sources.list.d/databend.list https://repo.databend.com/deb/databend.list
```

最后，更新包列表并安装 BendSQL：

```bash
sudo apt update
sudo apt install bendsql
```

### Cargo (Rust 包管理器)

要使用 Cargo 安装 BendSQL，请使用 `cargo-binstall` 工具或使用提供的命令从源代码构建。

:::note
在使用 Cargo 安装之前，请确保您的计算机上已安装完整的 Rust 工具链和 `cargo` 命令。如果没有，请按照 [https://rustup.rs/](https://rustup.rs/) 上的安装指南进行操作。
:::

**使用 cargo-binstall**

请参阅 [Cargo B(inary)Install - Installation](https://github.com/cargo-bins/cargo-binstall#installation) 安装 `cargo-binstall` 并启用 `cargo binstall <crate-name>` 子命令。

```bash
cargo binstall bendsql
```

**从源代码构建**

从源代码构建时，某些依赖项可能涉及编译 C/C++ 代码。确保您的计算机上已安装 GCC/G++ 或 Clang 工具链。

```bash
cargo install bendsql
```

## 用户身份验证

如果您连接到私有化部署的 Databend 实例，则可以使用 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中指定的管理员用户，或者可以使用使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户进行连接。

对于与 Databend Cloud 的连接，您可以使用默认的 `cloudapp` 用户或使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户。请注意，您用于登录 [Databend Cloud 控制台](https://app.databend.com) 的用户帐户不能用于连接到 Databend Cloud。

## 使用 BendSQL 连接

BendSQL 允许您连接到 Databend Cloud 和私有化部署的 Databend 实例。

### 使用 DSN 自定义连接

DSN（数据源名称）是一种简单而强大的方式，可以使用单个 URI 样式的字符串在 BendSQL 中配置和管理您的 Databend 连接。此方法允许您将凭据和连接设置直接嵌入到您的环境中，从而简化连接过程。

#### DSN 格式和参数

```bash title='DSN Format'
databend[+flight]://user[:password]@host[:port]/[database][?sslmode=disable][&arg1=value1]
```

| 通用 DSN 参数     | 描述                                 |
| ----------------- | ------------------------------------ |
| `tenant`          | 租户 ID，仅限 Databend Cloud。       |
| `warehouse`       | 计算集群名称，仅限 Databend Cloud。  |
| `sslmode`         | 如果不使用 TLS，则设置为 `disable`。 |
| `tls_ca_file`     | 自定义根 CA 证书路径。               |
| `connect_timeout` | 连接超时时间（秒）。                 |

| RestAPI 客户端参数          | 描述                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `wait_time_secs`            | 页面请求等待时间，默认为 `1`。                                                                         |
| `max_rows_in_buffer`        | 页面缓冲区中的最大行数。                                                                               |
| `max_rows_per_page`         | 单个页面的最大响应行数。                                                                               |
| `page_request_timeout_secs` | 单个页面请求的超时时间，默认为 `30`。                                                                  |
| `presign`                   | 启用数据加载的预签名。选项：`auto`、`detect`、`on`、`off`。默认为 `auto`（仅对 Databend Cloud 启用）。 |

| FlightSQL 客户端参数        | 描述                                                           |
| --------------------------- | -------------------------------------------------------------- |
| `query_timeout`             | 查询超时时间（秒）。                                           |
| `tcp_nodelay`               | 默认为 `true`。                                                |
| `tcp_keepalive`             | TCP keepalive 时间（秒）（默认为 `3600`，设置为 `0` 以禁用）。 |
| `http2_keep_alive_interval` | Keep-alive 间隔时间（秒），默认为 `300`。                      |
| `keep_alive_timeout`        | Keep-alive 超时时间（秒），默认为 `20`。                       |
| `keep_alive_while_idle`     | 默认为 `true`。                                                |

#### DSN 示例

```bash
# 使用 HTTP API 和预签名检测的本地连接
databend://root:@localhost:8000/?sslmode=disable&presign=detect

# 包含租户和计算集群信息的 Databend Cloud 连接
databend://user1:password1@tnxxxx--default.gw.aws-us-east-2.default.databend.com:443/benchmark?enable_dphyp=1

# 使用 FlightSQL API 的本地连接
databend+flight://root:@localhost:8900/database1?connect_timeout=10
```

### 连接到 Databend Cloud

连接到 Databend Cloud 的最佳实践是从 Databend Cloud 获取您的 DSN 并将其导出为环境变量。要获取您的 DSN：

1. 登录到 Databend Cloud，然后单击 **Overview** 页面上的 **Connect**。

2. 选择要连接的数据库和计算集群。

3. 您的 DSN 将在 **Examples** 部分中自动生成。在 DSN 下方，您会找到一个 BendSQL 代码段，该代码段将 DSN 导出为名为 `BENDSQL_DSN` 的环境变量，并使用正确的配置启动 BendSQL。您可以直接将其复制并粘贴到您的终端中。

```bash title='Example'
export BENDSQL_DSN="databend://cloudapp:******@tn3ftqihs.gw.aws-us-east-2.default.databend.com:443/information_schema?warehouse=small-xy2t"
bendsql
```

### 连接到私有化部署的 Databend

您可以使用 BendSQL 命令行参数或 DSN 连接到私有化部署的 Databend 实例。

#### 选项 1：使用 BendSQL 参数

```bash
bendsql --host <HOST> --port <PORT> --user <USER> --password <PASSWORD> --database <DATABASE>
```

此示例使用 `eric` 作为用户连接到在端口 `8000` 上本地运行的 Databend 实例：

```bash title='Example'
bendsql --host 127.0.0.1 --port 8000 --user eric --password abc123
```

#### 选项 2：使用 DSN

您还可以使用 DSN 定义连接，并将其导出为 `BENDSQL_DSN` 环境变量：

```bash title='Example'
export BENDSQL_DSN="databend://eric:abc123@localhost:8000/?sslmode=disable"
bendsql
```

## 教程

- [使用 BendSQL 连接到私有化部署的 Databend](/tutorials/)
- [使用 BendSQL 连接到 Databend Cloud](/tutorials/getting-started/connect-to-databend-bendsql)

## BendSQL 设置

BendSQL 提供了一系列设置，允许您定义查询结果的呈现方式：

| 设置项               | 描述                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `display_pretty_sql` | 设置为 `true` 时，SQL 查询将以视觉上吸引人的方式进行格式化，使其更易于阅读和理解。              |
| `prompt`             | 命令行界面中显示的提示符，通常指示正在访问的用户、计算集群和数据库。                            |
| `progress_color`     | 指定用于进度指示器的颜色，例如在执行需要一些时间才能完成的查询时。                              |
| `show_progress`      | 设置为 `true` 时，将显示进度指示器以显示长时间运行的查询或操作的进度。                          |
| `show_stats`         | 如果为 `true`，则在执行每个查询后，将显示查询统计信息，例如执行时间、读取的行数和处理的字节数。 |
| `max_display_rows`   | 设置查询结果输出中将显示的最大行数。                                                            |
| `max_col_width`      | 设置每列显示渲染的最大字符宽度。小于 3 的值将禁用此限制。                                       |
| `max_width`          | 设置整个显示输出的最大字符宽度。值为 0 时，默认为终端窗口的宽度。                               |
| `output_format`      | 设置用于显示查询结果的格式 (`table`、`csv`、`tsv`、`null`)。                                    |
| `expand`             | 控制查询的输出是显示为单独的记录还是以表格格式显示。可用值：`on`、`off` 和 `auto`。             |
| `multi_line`         | 确定是否允许多行输入 SQL 查询。设置为 `true` 时，查询可以跨越多行以提高可读性。                 |
| `replace_newline`    | 指定是否应将查询结果输出中的换行符替换为空格。这可以防止显示中出现意外的换行。                  |

有关每个设置的详细信息，请参阅以下参考信息：

#### `display_pretty_sql`

`display_pretty_sql` 设置控制 SQL 查询是否以可视格式化的方式显示。当设置为 `false` 时，如下面的第一个查询所示，SQL 查询不会为了视觉吸引力而进行格式化。相反，当设置为 `true` 时，如下面的第二个查询所示，SQL 查询会以视觉上吸引人的方式进行格式化，使其更易于阅读和理解。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set display_pretty_sql false
root@localhost:8000/default> SELECT TO_STRING(ST_ASGEOJSON(ST_GEOMETRYFROMWKT('SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'))) AS pipeline_geojson;
┌─────────────────────────────────────────────────────────────────────────┐
│                             pipeline_geojson                            │
│                                  String                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ {"coordinates":[[400000,6000000],[401000,6010000]],"type":"LineString"} │
└─────────────────────────────────────────────────────────────────────────┘
1 row read in 0.063 sec. Processed 1 row, 1 B (15.76 rows/s, 15 B/s)

// highlight-next-line
root@localhost:8000/default> !set display_pretty_sql true
root@localhost:8000/default> SELECT TO_STRING(ST_ASGEOJSON(ST_GEOMETRYFROMWKT('SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'))) AS pipeline_geojson;

SELECT
  TO_STRING(
    ST_ASGEOJSON(
      ST_GEOMETRYFROMWKT(
        'SRID=4326;LINESTRING(400000 6000000, 401000 6010000)'
      )
    )
  ) AS pipeline_geojson

┌─────────────────────────────────────────────────────────────────────────┐
│                             pipeline_geojson                            │
│                                  String                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ {"coordinates":[[400000,6000000],[401000,6010000]],"type":"LineString"} │
└─────────────────────────────────────────────────────────────────────────┘
1 row read in 0.087 sec. Processed 1 row, 1 B (11.44 rows/s, 11 B/s)
```

#### `prompt`

`prompt` 设置控制命令行界面提示符的格式。在下面的示例中，它最初设置为显示用户和计算集群 (`{user}@{warehouse}`)。在将其更新为 `{user}@{warehouse}/{database}` 后，提示符现在包括用户、计算集群和数据库。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set prompt {user}@{warehouse}
root@localhost:8000 !configs
Settings {
    display_pretty_sql: true,
    prompt: "{user}@{warehouse}",
    progress_color: "cyan",
    show_progress: true,
    show_stats: true,
    max_display_rows: 40,
    max_col_width: 1048576,
    max_width: 1048576,
    output_format: Table,
    quote_style: Necessary,
    expand: Off,
    time: None,
    multi_line: true,
    replace_newline: true,
}
// highlight-next-line
root@localhost:8000 !set prompt {user}@{warehouse}/{database}
root@localhost:8000/default
```

#### `progress_color`

`progress_color` 设置控制查询执行期间用于进度指示器的颜色。在此示例中，颜色已设置为 `blue`：

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set progress_color blue
```

#### `show_progress`

设置为 `true` 时，在查询执行期间会显示进度信息。进度信息包括已处理的行数、查询中的总行数、每秒处理速度（行数）、已处理的内存量以及每秒处理速度（内存）。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set show_progress true
root@localhost:8000/default> select * from numbers(1000000000000000);
⠁ [00:00:08] Processing 18.02 million/1 quadrillion (2.21 million rows/s), 137.50 MiB/7.11 PiB (16.88 MiB/s) ░
```

#### `show_stats`

`show_stats` 设置控制在执行每个查询后是否显示查询统计信息。当设置为 `false` 时，如下面示例中的第一个查询所示，不显示查询统计信息。相反，当设置为 `true` 时，如下面的第二个查询所示，在执行每个查询后，将显示查询统计信息，例如执行时间、读取的行数和处理的字节数。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set show_stats false
root@localhost:8000/default> select now();
┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2024-04-23 23:27:11.538673 │
└────────────────────────────┘
// highlight-next-line
root@localhost:8000/default> !set show_stats true
root@localhost:8000/default> select now();
┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2024-04-23 23:49:04.754296 │
└────────────────────────────┘
1 row read in 0.045 sec. Processed 1 row, 1 B (22.26 rows/s, 22 B/s)
```

#### `max_display_rows`

`max_display_rows` 设置控制查询结果输出中显示的最大行数。在下面的示例中，当设置为 `5` 时，查询结果中最多显示 5 行。剩余的行用 (5 shown) 表示。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set max_display_rows 5
root@localhost:8000/default> SELECT * FROM system.configs;
┌──────────────────────────────────────────────────────┐
│   group   │       name       │  value  │ description │
│   String  │      String      │  String │    String   │
├───────────┼──────────────────┼─────────┼─────────────┤
│ query     │ tenant_id        │ default │             │
│ query     │ cluster_id       │ default │             │
│ query     │ num_cpus         │ 0       │             │
│ ·         │ ·                │ ·       │ ·           │
│ ·         │ ·                │ ·       │ ·           │
│ ·         │ ·                │ ·       │ ·           │
│ storage   │ cos.endpoint_url │         │             │
│ storage   │ cos.root         │         │             │
│ 176 rows  │                  │         │             │
│ (5 shown) │                  │         │             │
└──────────────────────────────────────────────────────┘
176 rows read in 0.059 sec. Processed 176 rows, 10.36 KiB (2.98 thousand rows/s, 175.46 KiB/s)
```

#### `max_col_width` & `max_width`

`max_col_width` 和 `max_width` 设置分别指定单个列和整个显示输出中允许的最大字符宽度。以下示例将列显示宽度设置为 10 个字符，并将整个显示宽度设置为 100 个字符：

```sql title='Example:'
// highlight-next-line
root@localhost:8000/default> .max_col_width 10
// highlight-next-line
root@localhost:8000/default> .max_width 100
root@localhost:8000/default> select * from system.settings;
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

#### `output_format`

通过将 `output_format` 设置为 `table`、`csv`、`tsv` 或 `null`，您可以控制查询结果的格式。`table` 格式以表格格式显示结果，带有列标题，而 `csv` 和 `tsv` 格式分别提供逗号分隔值和制表符分隔值，`null` 格式完全禁止输出格式。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set output_format table
root@localhost:8000/default> show users;
┌────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │  auth_type  │ is_configured │  default_role │ disabled │
│ String │  String  │    String   │     String    │     String    │  Boolean │
├────────┼──────────┼─────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password │ YES           │ account_admin │ false    │
└────────────────────────────────────────────────────────────────────────────┘
1 row read in 0.032 sec. Processed 1 row, 113 B (31.02 rows/s, 3.42 KiB/s)

// highlight-next-line
root@localhost:8000/default> !set output_format csv
root@localhost:8000/default> show users;
root,%,no_password,YES,account_admin,false
1 row read in 0.062 sec. Processed 1 row, 113 B (16.03 rows/s, 1.77 KiB/s)

// highlight-next-line
root@localhost:8000/default> !set output_format tsv
root@localhost:8000/default> show users;
root	%	no_password	YES	account_admin	false
1 row read in 0.076 sec. Processed 1 row, 113 B (13.16 rows/s, 1.45 KiB/s)

// highlight-next-line
root@localhost:8000/default> !set output_format null
root@localhost:8000/default> show users;
1 row read in 0.036 sec. Processed 1 row, 113 B (28.1 rows/s, 3.10 KiB/s)
```

#### `expand`

`expand` 设置控制查询的输出是显示为单独的记录还是以表格格式显示。当 `expand` 设置为 `auto` 时，系统会自动根据查询返回的行数确定如何显示输出。如果查询只返回一行，则输出显示为单个记录。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set expand on
root@localhost:8000/default> show users;
-[ RECORD 1 ]-----------------------------------
         name: root
     hostname: %
    auth_type: no_password
is_configured: YES
 default_role: account_admin
     disabled: false

1 row read in 0.055 sec. Processed 1 row, 113 B (18.34 rows/s, 2.02 KiB/s)

// highlight-next-line
root@localhost:8000/default> !set expand off
root@localhost:8000/default> show users;
┌────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │  auth_type  │ is_configured │  default_role │ disabled │
│ String │  String  │    String   │     String    │     String    │  Boolean │
├────────┼──────────┼─────────────┼───────────────┼───────────────┼──────────┤
│ root   │ %        │ no_password │ YES           │ account_admin │ false    │
└────────────────────────────────────────────────────────────────────────────┘
1 row read in 0.046 sec. Processed 1 row, 113 B (21.62 rows/s, 2.39 KiB/s)

// highlight-next-line
root@localhost:8000/default> !set expand auto
root@localhost:8000/default> show users;
-[ RECORD 1 ]-----------------------------------
         name: root
     hostname: %
    auth_type: no_password
is_configured: YES
 default_role: account_admin
     disabled: false

1 row read in 0.037 sec. Processed 1 row, 113 B (26.75 rows/s, 2.95 KiB/s)
```

#### `multi_line`

当 `multi_line` 设置为 `true` 时，允许跨多行输入。因此，SQL 查询的每个子句都单独输入一行，以提高可读性和组织性。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set multi_line true;
root@localhost:8000/default> SELECT *
> FROM system.configs;
┌──────────────────────────────────────────────────────┐
│   group   │       name       │  value  │ description │
│   String  │      String      │  String │    String   │
├───────────┼──────────────────┼─────────┼─────────────┤
│ query     │ tenant_id        │ default │             │
│ query     │ cluster_id       │ default │             │
│ query     │ num_cpus         │ 0       │             │
│ ·         │ ·                │ ·       │ ·           │
│ ·         │ ·                │ ·       │ ·           │
│ ·         │ ·                │ ·       │ ·           │
│ storage   │ cos.endpoint_url │         │             │
│ storage   │ cos.root         │         │             │
│ 176 rows  │                  │         │             │
│ (5 shown) │                  │         │             │
└──────────────────────────────────────────────────────┘
176 rows read in 0.060 sec. Processed 176 rows, 10.36 KiB (2.91 thousand rows/s, 171.39 KiB/s)
```

#### `replace_newline`

`replace_newline` 设置确定是否将换行符 (\n) 替换为输出中的文字字符串 (\\n)。在下面的示例中，`replace_newline` 设置为 `true`。因此，当选择字符串 'Hello\nWorld' 时，换行符 (\n) 将被替换为文字字符串 (\\n)。因此，输出不会显示换行符，而是将 'Hello\nWorld' 显示为 'Hello\\nWorld'：

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set replace_newline true
root@localhost:8000/default> SELECT 'Hello\nWorld' AS message;
┌──────────────┐
│    message   │
│    String    │
├──────────────┤
│ Hello\nWorld │
└──────────────┘
1 row read in 0.056 sec. Processed 1 row, 1 B (18 rows/s, 17 B/s)

// highlight-next-line
root@localhost:8000/default> !set replace_newline false;
root@localhost:8000/default> SELECT 'Hello\nWorld' AS message;
┌─────────┐
│ message │
│  String │
├─────────┤
│ Hello   │
│ World   │
└─────────┘
1 row read in 0.067 sec. Processed 1 row, 1 B (14.87 rows/s, 14 B/s)
```

### 配置 BendSQL 设置

您可以通过以下选项来配置 BendSQL 设置：

- 使用 `!set <setting> <value>` 命令。有关更多信息，请参见 [实用程序命令](#utility-commands)。

- 在配置文件 `~/.config/bendsql/config.toml` 中添加和配置设置。为此，请打开该文件并在 `[settings]` 部分下添加您的设置。以下示例将 `max_display_rows` 设置为 10，将 `max_width` 设置为 100：

```toml title='Example:'
...
[settings]
max_display_rows = 10
max_width = 100
...
```

- 通过启动 BendSQL 并在运行时以 `.<setting> <value>` 格式指定设置来配置设置。请注意，以这种方式配置的设置仅在当前会话中生效。

```shell title='Example:'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> .max_width 100
```

## 实用程序命令

BendSQL 为用户提供了各种命令，以简化其工作流程并自定义其体验。以下是 BendSQL 中可用命令的概述：

| 命令                     | 描述                      |
| ------------------------ | ------------------------- |
| `!exit`                  | 退出 BendSQL。            |
| `!quit`                  | 退出 BendSQL。            |
| `!configs`               | 显示当前的 BendSQL 设置。 |
| `!set <setting> <value>` | 修改 BendSQL 设置。       |
| `!source <sql_file>`     | 执行 SQL 文件。           |

有关每个命令的示例，请参阅下面的参考信息：

#### `!exit`

断开与 Databend 的连接并退出 BendSQL。

```shell title='Example:'
➜  ~ bendsql
Welcome to BendSQL 0.17.0-homebrew.
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)
```

```
root@localhost:8000/default> !exit
Bye~
```

#### `!quit`

断开与 Databend 的连接并退出 BendSQL。

```shell title='Example:'
➜  ~ bendsql
Welcome to BendSQL 0.17.0-homebrew.
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !quit
Bye~
➜  ~
```

#### `!configs`

显示当前的 BendSQL 设置。

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !configs
Settings {
    display_pretty_sql: true,
    prompt: "{user}@{warehouse}/{database}> ",
    progress_color: "cyan",
    show_progress: true,
    show_stats: true,
    max_display_rows: 40,
    max_col_width: 1048576,
    max_width: 1048576,
    output_format: Table,
    quote_style: Necessary,
    expand: Off,
    time: None,
    multi_line: true,
    replace_newline: true,
}
```

#### `!set <setting> <value>`

修改 BendSQL 设置。

```shell title='Example:'
root@localhost:8000/default> !set display_pretty_sql false
```

#### `!source <sql_file>`

执行 SQL 文件。

```shell title='Example:'
➜  ~ more ./desktop/test.sql
CREATE TABLE test_table (
    id INT,
    name VARCHAR(50)
);

INSERT INTO test_table (id, name) VALUES (1, 'Alice');
INSERT INTO test_table (id, name) VALUES (2, 'Bob');
INSERT INTO test_table (id, name) VALUES (3, 'Charlie');
➜  ~ bendsql
Welcome to BendSQL 0.17.0-homebrew.
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !source ./desktop/test.sql
root@localhost:8000/default> SELECT * FROM test_table;

SELECT
  *
FROM
  test_table

┌────────────────────────────────────┐
│        id       │       name       │
│ Nullable(Int32) │ Nullable(String) │
├─────────────────┼──────────────────┤
│               1 │ Alice            │
│               2 │ Bob              │
│               3 │ Charlie          │
└────────────────────────────────────┘
3 rows read in 0.064 sec. Processed 3 rows, 81 B (46.79 rows/s, 1.23 KiB/s)
```
