---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) is a command line tool that has been designed specifically for Databend. It allows users to establish a connection with Databend and execute queries directly from a CLI window.

BendSQL is particularly useful for those who prefer a command line interface and need to work with Databend on a regular basis. With BendSQL, users can easily and efficiently manage their databases, tables, and data, and perform a wide range of queries and operations with ease.

## Installing BendSQL

BendSQL can be installed on various platforms using different package managers. The following sections outline the installation steps for BendSQL using Homebrew (for macOS), Apt (for Ubuntu/Debian), and Cargo (Rust Package Manager). Alternatively, you can download the installation package from the [BendSQL release page](https://github.com/datafuselabs/BendSQL/releases) on GitHub and install BendSQL manually.

### Homebrew (for macOS)

BendSQL can be easily installed on macOS using Homebrew with a simple command:

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt (for Ubuntu/Debian)

On Ubuntu and Debian systems, BendSQL can be installed via the Apt package manager. Choose the appropriate instructions based on the distribution version.

#### DEB822-STYLE format (Ubuntu-22.04/Debian-12 and later)

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

#### Old format (Ubuntu-20.04/Debian-11 and earlier)

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.rs/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.rs/deb/datafuselabs.list
```

Finally, update the package list and install BendSQL:

```bash
sudo apt update
sudo apt install bendsql
```

### Cargo（Rust Package Manager）

To install BendSQL using Cargo, utilize the `cargo-binstall` tool or build from source using the provided command.

:::note
Before installing with Cargo, make sure you have the full Rust toolchain and the `cargo` command installed on your computer. If you don't, follow the installation guide at [https://rustup.rs/](https://rustup.rs/).
:::

**Using cargo-binstall**

Please refer to [Cargo B(inary)Install - Installation](https://github.com/cargo-bins/cargo-binstall#installation) to install `cargo-binstall` and enable the `cargo binstall <crate-name>` subcommand.

```bash
cargo binstall bendsql
```

**Building from Source**

When building from source, some dependencies may involve compiling C/C++ code. Ensure that you have the GCC/G++ or Clang toolchain installed on your computer.

```bash
cargo install bendsql
```

## Customizing BendSQL

BendSQL provides a range of settings that allow you to define how query results are presented. For specific setting and customization methods, please refer to the documentation at: https://github.com/datafuselabs/bendsql/blob/main/README.md

You have the following methods to configure a setting for BendSQL:

- Add and configure a setting in the configuration file `~/.config/bendsql/config.toml`. To do so, open the file and add your setting under the `[settings]` section. The following example sets the `max_display_rows` to 10 and `max_width` to 100:

```toml title='Example:'
...
[settings]
max_display_rows = 10
max_width = 100
...
```

- Configure a setting at runtime by launching BendSQL and then specifying the setting in the format `.<setting> <value>`. Please note that settings configured in this way only take effect in the current session.

```shell title='Example:'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> .max_width 100
```

### Managing Row Visibility

The `max_display_rows` setting sets the maximum number of rows to display in the output format when presenting query results. By default, it limits the display to 40 rows. The following example demonstrates setting the maximum number of rows to display as 10, showcasing only a subset of 10 rows out of a total of 96:

```sql title='Example:'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> select * from system.settings;

SELECT
  *
FROM
  system.settings

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     name                    │  value  │ default │   range  │  level  │                                                                     description                                                                    │  type  │
│                    String                   │  String │  String │  String  │  String │                                                                       String                                                                       │ String │
├─────────────────────────────────────────────┼─────────┼─────────┼──────────┼─────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────┤
│ acquire_lock_timeout                        │ 15      │ 15      │ None     │ DEFAULT │ Sets the maximum timeout in seconds for acquire a lock.                                                                                            │ UInt64 │
│ aggregate_spilling_bytes_threshold_per_proc │ 0       │ 0       │ None     │ DEFAULT │ Sets the maximum amount of memory in bytes that an aggregator can use before spilling data to storage during query execution.                      │ UInt64 │
│ aggregate_spilling_memory_ratio             │ 0       │ 0       │ [0, 100] │ DEFAULT │ Sets the maximum memory ratio in bytes that an aggregator can use before spilling data to storage during query execution.                          │ UInt64 │
│ auto_compaction_imperfect_blocks_threshold  │ 50      │ 50      │ None     │ DEFAULT │ Threshold for triggering auto compaction. This occurs when the number of imperfect blocks in a snapshot exceeds this value after write operations. │ UInt64 │
│ collation                                   │ utf8    │ utf8    │ ["utf8"] │ DEFAULT │ Sets the character collation. Available values include "utf8".                                                                                     │ String │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                                  │ ·      │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                                  │ ·      │
│ ·                                           │ ·       │ ·       │ ·        │ ·       │ ·                                                                                                                                                  │ ·      │
│ storage_read_buffer_size                    │ 1048576 │ 1048576 │ None     │ DEFAULT │ Sets the byte size of the buffer used for reading data into memory.                                                                                │ UInt64 │
│ table_lock_expire_secs                      │ 10      │ 10      │ None     │ DEFAULT │ Sets the seconds that the table lock will expire in.                                                                                               │ UInt64 │
│ timezone                                    │ UTC     │ UTC     │ None     │ DEFAULT │ Sets the timezone.                                                                                                                                 │ String │
│ unquoted_ident_case_sensitive               │ 0       │ 0       │ None     │ DEFAULT │ Determines whether Databend treats unquoted identifiers as case-sensitive.                                                                         │ UInt64 │
│ use_parquet2                                │ 0       │ 0       │ [0, 1]   │ DEFAULT │ This setting is deprecated                                                                                                                         │ UInt64 │
│ 96 rows                                     │         │         │          │         │                                                                                                                                                    │        │
│ (10 shown)                                  │         │         │          │         │                                                                                                                                                    │        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
96 rows read in 0.022 sec. Processed 96 rows, 16.52 KiB (4.45 thousand rows/s, 766.10 KiB/s)
```

### Adjusting Column and Table Widths

The parameters `max_col_width` and `max_width` specify the maximum permitted width in characters for individual columns and the entire display output, respectively.

| Setting       | Description                                                                                                                   | Default Value |
|---------------|-------------------------------------------------------------------------------------------------------------------------------|---------------|
| max_width     | Sets the maximum width in characters of the entire display output. A value of 0 defaults to the width of the terminal window. | 1048576       |
| max_col_width | Sets the maximum width in characters of each column's display rendering. A value smaller than 3 disables the limit.           | 1048576       |

The following example sets column display width to 10 characters and the entire display width to 100 characters:

```sql title='Example:'
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

## Utility Commands

BendSQL provides users with a variety of commands to streamline their workflow and customize their experience. Here's an overview of the commands available in BendSQL:

| Command                   | Description                       |
|---------------------------|-----------------------------------|
| `!exit`                   | Exits BendSQL.                    |
| `!quit`                   | Exits BendSQL.                    |
| `!configs`                | Displays current BendSQL settings.|
| `!set <setting> <value>`  | Modifies a BendSQL setting.       |
| `!source <sql_file>`      | Executes a SQL file.              |

For examples of each command, please refer to the reference information below：

#### `!exit`

Disconnects from Databend and exits BendSQL.

```shell title='Example:'
➜  ~ bendsql
Welcome to BendSQL 0.17.0-homebrew.
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !exit
Bye~
```

#### `!quit`

Disconnects from Databend and exits BendSQL.

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

Displays the current BendSQL settings.

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

Modifies a BendSQL setting. 

```shell title='Example:'
root@localhost:8000/default> !set display_pretty_sql false
```

#### `!source <sql_file>`

Executes a SQL file.

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