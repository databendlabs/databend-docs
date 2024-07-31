---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) 是一个专为 Databend 设计的命令行工具。它允许用户与 Databend 建立连接，并直接从 CLI 窗口执行查询。

BendSQL 特别适用于那些偏好命令行界面并需要经常与 Databend 打交道的用户。通过 BendSQL，用户可以轻松高效地管理其数据库、表和数据，并轻松执行广泛的查询和操作。

## 安装 BendSQL

BendSQL 可以通过不同的包管理器安装在各种平台上。以下部分概述了使用 Homebrew（适用于 macOS）、Apt（适用于 Ubuntu/Debian）和 Cargo（Rust 包管理器）安装 BendSQL 的步骤。或者，您可以从 GitHub 上的 [BendSQL 发布页面](https://github.com/datafuselabs/BendSQL/releases)下载安装包并手动安装 BendSQL。

### Homebrew（适用于 macOS）

BendSQL 可以通过 Homebrew 在 macOS 上轻松安装，只需一个简单的命令：

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt（适用于 Ubuntu/Debian）

在 Ubuntu 和 Debian 系统上，BendSQL 可以通过 Apt 包管理器安装。根据发行版本选择合适的说明。

#### DEB822-STYLE 格式（Ubuntu-22.04/Debian-12 及更高版本）

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.com/deb/datafuselabs.sources
```

#### 旧格式（Ubuntu-20.04/Debian-11 及更早版本）

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.com/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.com/deb/datafuselabs.list
```

最后，更新包列表并安装 BendSQL：

```bash
sudo apt update
sudo apt install bendsql
```

### Cargo（Rust 包管理器）

要使用 Cargo 安装 BendSQL，可以使用 `cargo-binstall` 工具或通过提供的命令从源代码构建。

:::note
在使用 Cargo 安装之前，请确保您的计算机上已安装完整的 Rust 工具链和 `cargo` 命令。如果没有，请按照 [https://rustup.rs/](https://rustup.rs/) 上的安装指南进行操作。
:::

**使用 cargo-binstall**

请参考 [Cargo B(inary)Install - 安装](https://github.com/cargo-bins/cargo-binstall#installation) 来安装 `cargo-binstall` 并启用 `cargo binstall <crate-name>` 子命令。

```bash
cargo binstall bendsql
```

**从源代码构建**

从源代码构建时，某些依赖项可能涉及编译 C/C++ 代码。请确保您的计算机上已安装 GCC/G++ 或 Clang 工具链。

```bash
cargo install bendsql
```

## 用户认证

如果您连接到自托管的 Databend 实例，可以使用 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中指定的管理员用户，或者使用通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户进行连接。

对于连接到 Databend Cloud，您可以使用默认的 `cloudapp` 用户或通过 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 命令创建的 SQL 用户。请注意，您用于登录 [Databend Cloud 控制台](https://app.databend.com/) 的用户账户不能用于连接到 Databend Cloud。

## 教程

- [使用 BendSQL 连接到自托管的 Databend](/tutorials/)
- [使用 BendSQL 连接到 Databend Cloud](/tutorials/connect/connect-to-databendcloud-bendsql)

## BendSQL 设置

BendSQL 提供了一系列设置，允许您定义查询结果的呈现方式：

| 设置               | 描述                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------- |
| `display_pretty_sql` | 当设置为 `true` 时，SQL 查询将以视觉上吸引人的方式格式化，使其更易于阅读和理解。                |
| `prompt`             | 命令行界面中显示的提示，通常指示正在访问的用户、仓库和数据库。                                  |
| `progress_color`     | 指定用于进度指示器的颜色，例如在执行需要一些时间完成的查询时。                                  |
| `show_progress`      | 当设置为 `true` 时，将显示进度指示器，以显示长时间运行的查询或操作的进度。                      |
| `show_stats`         | 如果为 `true`，执行每个查询后将显示查询统计信息，如执行时间、读取的行数和处理的字节数。          |
| `max_display_rows`   | 设置查询结果输出中将显示的最大行数。                                                            |
| `max_col_width`      | 设置每个列显示渲染的最大宽度（以字符为单位）。小于 3 的值将禁用限制。                            |
| `max_width`          | 设置整个显示输出的最大宽度（以字符为单位）。值为 0 时默认为终端窗口的宽度。                      |
| `output_format`      | 设置用于显示查询结果的格式（`table`、`csv`、`tsv`、`null`）。                                   |
| `expand`             | 控制查询输出的显示方式是作为单独的记录还是以表格格式显示。可用值：`on`、`off` 和 `auto`。       |
| `multi_line`         | 确定是否允许多行输入 SQL 查询。当设置为 `true` 时，查询可以跨越多行，以提高可读性。             |
| `replace_newline`    | 指定查询结果输出中的换行符是否应替换为空格。这可以防止显示中出现意外的换行。                    |

有关每个设置的详细信息，请参阅以下参考信息：

#### `display_pretty_sql`

`display_pretty_sql` 设置控制 SQL 查询是否以视觉格式化的方式显示。当设置为 `false` 时，如第一个查询所示，SQL 查询不会格式化为视觉上吸引人的方式。相反，当设置为 `true` 时，如第二个查询所示，SQL 查询将以视觉上吸引人的方式格式化，使其更易于阅读和理解。

```shell title='示例:'
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

`prompt` 设置控制命令行界面提示的格式。在下面的示例中，它最初设置为显示用户和仓库（`{user}@{warehouse}`）。更新为 `{user}@{warehouse}/{database}` 后，提示现在包括用户、仓库和数据库。

```shell title='示例:'
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

`progress_color` 设置控制查询执行期间进度指示器的颜色。在此示例中，颜色已设置为 `blue`：

```shell title='示例:'
// highlight-next-line
root@localhost:8000/default> !set progress_color blue
```

#### `show_progress`

当设置为 `true` 时，执行查询期间会显示进度信息。进度信息包括已处理的行数、查询中的总行数、处理速度（行/秒）、已处理的内存量和处理速度（内存/秒）。

```shell title='示例:'
// highlight-next-line
root@localhost:8000/default> !set show_progress true
root@localhost:8000/default> select * from numbers(1000000000000000);
⠁ [00:00:08] Processing 18.02 million/1 quadrillion (2.21 million rows/s), 137.50 MiB/7.11 PiB (16.88 MiB/s) ░
```

#### `show_stats`

`show_stats` 设置控制执行每个查询后是否显示查询统计信息。当设置为 `false` 时，如第一个查询在下面的示例中所示，查询统计信息不会显示。相反，当设置为 `true` 时，如第二个查询所示，执行每个查询后将显示查询统计信息，如执行时间、读取的行数和处理的字节数。

```shell title='示例:'
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

`max_display_rows` 设置控制查询结果输出中显示的最大行数。当设置为 `5` 时，如以下示例所示，查询结果中仅显示最多 5 行。剩余的行会用 (5 shown) 表示。

```shell title='示例:'
// highlight-next-line
root@localhost:8000/default> !set max_display_rows 5
root@localhost:8000/default> select * from numbers(10);
┌─────┐
│ col │
│ Int │
├─────┤
│   0 │
│   1 │
│   2 │
│   3 │
│   4 │
└─────┘
(5 shown)
```

```shell title='示例:'
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

设置 `max_col_width` 和 `max_width` 分别指定单个列和整个显示输出的最大允许宽度（以字符为单位）。以下示例将列显示宽度设置为10个字符，整个显示宽度设置为100个字符：

```sql title='示例:'
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

通过将 `output_format` 设置为 `table`、`csv`、`tsv` 或 `null`，您可以控制查询结果的格式。`table` 格式以带有列标题的表格格式呈现结果，而 `csv` 和 `tsv` 格式分别提供逗号分隔值和制表符分隔值，`null` 格式则完全抑制输出格式。

```shell title='示例:'
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

`expand` 设置控制查询输出的显示方式是作为单独的记录还是以表格格式显示。当 `expand` 设置为 `auto` 时，系统会根据查询返回的行数自动决定如何显示输出。如果查询仅返回一行，则输出显示为单个记录。

```shell title='示例:'
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

当 `multi_line` 设置为 `true` 时，允许输入跨越多行。因此，SQL 查询以每个子句在单独的行上输入，以提高可读性和组织性。

```shell title='示例:'
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

`replace_newline` 设置决定是否将换行符 (\n) 替换为字面字符串 (\\n) 在输出中。在下面的示例中，`replace_newline` 设置为 `true`。因此，当选择字符串 'Hello\nWorld' 时，换行符 (\n) 被替换为字面字符串 (\\n)。所以，输出显示 'Hello\nWorld' 为 'Hello\\nWorld'，而不是显示换行符：

```shell title='示例:'
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

```

```markdown
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

您可以通过以下方式配置 BendSQL 设置：

- 使用 `!set <setting> <value>` 命令。更多信息，请参阅 [实用命令](#utility-commands)。

- 在配置文件 `~/.config/bendsql/config.toml` 中添加和配置设置。打开文件并在 `[settings]` 部分下添加您的设置。以下示例将 `max_display_rows` 设置为 10，将 `max_width` 设置为 100：

```toml title='示例：'
...
[settings]
max_display_rows = 10
max_width = 100
...
```

- 在运行时通过启动 BendSQL 并指定格式为 `.<setting> <value>` 的设置来配置。请注意，这种方式配置的设置仅在当前会话中生效。

```shell title='示例：'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> .max_width 100
```

## 实用命令

BendSQL 为用户提供了一系列命令，以简化其工作流程并自定义其体验。以下是 BendSQL 中可用的命令概览：

| 命令                     | 描述                         |
| ------------------------ | ---------------------------- |
| `!exit`                  | 退出 BendSQL。                |
| `!quit`                  | 退出 BendSQL。                |
| `!configs`               | 显示当前 BendSQL 设置。       |
| `!set <setting> <value>`  | 修改 BendSQL 设置。           |
| `!source <sql_file>`     | 执行 SQL 文件。               |

有关每个命令的示例，请参阅下面的参考信息：

#### `!exit`

断开与 Databend 的连接并退出 BendSQL。

```shell title='示例：'
➜  ~ bendsql
欢迎使用 BendSQL 0.17.0-homebrew。
正在连接到 localhost:8000 作为用户 root。
已连接到 Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !exit
再见~
```

#### `!quit`

断开与 Databend 的连接并退出 BendSQL。

```shell title='示例：'
➜  ~ bendsql
欢迎使用 BendSQL 0.17.0-homebrew。
正在连接到 localhost:8000 作为用户 root。
已连接到 Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !quit
再见~
➜  ~
```

#### `!configs`

显示当前 BendSQL 设置。

```shell title='示例：'
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

```shell title='示例：'
root@localhost:8000/default> !set display_pretty_sql false
```

#### `!source <sql_file>`

执行 SQL 文件。

```shell title='示例：'
➜  ~ more ./desktop/test.sql
CREATE TABLE test_table (
    id INT,
    name VARCHAR(50)
);

INSERT INTO test_table (id, name) VALUES (1, 'Alice');
INSERT INTO test_table (id, name) VALUES (2, 'Bob');
INSERT INTO test_table (id, name) VALUES (3, 'Charlie');
➜  ~ bendsql
欢迎使用 BendSQL 0.17.0-homebrew。
正在连接到 localhost:8000 作为用户 root。
已连接到 Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

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