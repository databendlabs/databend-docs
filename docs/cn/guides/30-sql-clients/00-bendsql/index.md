```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set max_display_rows 5
root@localhost:8000/default> select * from system.numbers limit 10;
┌─number─┐
│      0 │
│      1 │
│      2 │
│      3 │
│      4 │
└────────┘
5 rows shown (10 total)
```

#### `max_col_width`

The `max_col_width` setting determines the maximum width in characters of each column's display rendering. In the example below, the maximum column width is set to `20`. If a column's content exceeds this width, it will be truncated.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set max_col_width 20
root@localhost:8000/default> select repeat('a', 30) as long_string;
┌─long_string─┐
│ aaaaaaaaaaaa│
└─────────────┘
```

#### `max_width`

The `max_width` setting sets the maximum width in characters of the entire display output. In the example below, the maximum width is set to `30`. If the terminal window is narrower than this, the output will be adjusted accordingly.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set max_width 30
root@localhost:8000/default> select * from system.numbers limit 5;
┌─number─┐
│      0 │
│      1 │
│      2 │
│      3 │
└────────┘
```

#### `output_format`

The `output_format` setting specifies the format used to display query results. In the example below, the output format is set to `csv`.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set output_format csv
root@localhost:8000/default> select * from system.numbers limit 5;
0,1,2,3,4
```

#### `expand`

The `expand` setting controls whether the output of a query is displayed as individual records or in a tabular format. In the example below, `expand` is set to `on`, which means the output will be displayed as individual records.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set expand on
root@localhost:8000/default> select * from system.numbers limit 5;
{
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4
}
```

#### `multi_line`

The `multi_line` setting determines whether multi-line input for SQL queries is allowed. In the example below, `multi_line` is set to `true`, allowing queries to span multiple lines for better readability.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set multi_line true
root@localhost:8000/default> select
...> *
...> from
...> system.numbers
...> limit 5;
┌─number─┐
│      0 │
│      1 │
│      2 │
│      3 │
│      4 │
└────────┘
```

#### `replace_newline`

The `replace_newline` setting specifies whether newline characters in the output of query results should be replaced with spaces. In the example below, `replace_newline` is set to `true`, which means newline characters will be replaced with spaces to prevent unintended line breaks in the display.

```shell title='Example:'
// highlight-next-line
root@localhost:8000/default> !set replace_newline true
root@localhost:8000/default> select 'line1\nline2' as text;
┌─text─────┐
│ line1 line2│
└──────────┘
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

设置`max_col_width`和`max_width`分别指定单个列和整个显示输出的最大允许宽度（以字符为单位）。以下示例将列显示宽度设置为10个字符，将整个显示宽度设置为100个字符：

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

通过将`output_format`设置为`table`、`csv`、`tsv`或`null`，可以控制查询结果的格式。`table`格式以带有列标题的表格格式呈现结果，而`csv`和`tsv`格式分别提供逗号分隔值和制表符分隔值，`null`格式则完全抑制输出格式。

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

`expand`设置控制查询输出是作为单独的记录显示还是以表格格式显示。当`expand`设置为`auto`时，系统根据查询返回的行数自动确定如何显示输出。如果查询只返回一行，则输出显示为单个记录。

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

当`multi_line`设置为`true`时，允许输入跨越多行。因此，SQL查询的每个子句都在单独的行上输入，以提高可读性和组织性。

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

`replace_newline`设置确定是否在输出中将换行符（\n）替换为字面字符串（\\n）。在下面的示例中，`replace_newline`设置为`true`。因此，当选择字符串'Hello\nWorld'时，换行符（\n）被替换为字面字符串（\\n）。因此，输出不是显示换行符，而是将'Hello\nWorld'显示为'Hello\\nWorld'：

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

### 配置BendSQL设置

您可以通过以下方式配置BendSQL设置：

- 使用`!set <setting> <value>`命令。更多信息，请参阅[实用命令](#实用命令)。

- 在配置文件`~/.config/bendsql/config.toml`中添加并配置设置。为此，打开文件并在`[settings]`部分下添加您的设置。以下示例将`max_display_rows`设置为10，`max_width`设置为100：

```toml title='示例：'
...
[settings]
max_display_rows = 10
max_width = 100
...
```

- 在运行时通过启动BendSQL并按格式`.<setting> <value>`指定设置来配置设置。请注意，以这种方式配置的设置仅在当前会话中生效。

```shell title='示例：'
root@localhost:8000/default> .max_display_rows 10
root@localhost:8000/default> .max_width 100
```

## 实用命令

BendSQL为用户提供了一系列命令，以优化工作流程并定制体验。以下是BendSQL中可用命令的概览：

| 命令          | 描述                   |
|---------------|------------------------|
| `!exit`       | 退出BendSQL。          |
| `!quit`       | 退出BendSQL。          |
| `!configs`    | 显示当前BendSQL设置。  |
| `!set <setting> <value>` | 修改BendSQL设置。       |
| `!source <sql_file>`   | 执行SQL文件。          |

关于每个命令的示例，请参考以下参考信息：

#### `!exit`

断开与Databend的连接并退出BendSQL。

```shell title='示例：'
➜  ~ bendsql
欢迎使用BendSQL 0.17.0-homebrew。
连接到localhost:8000作为用户root。
已连接到Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !exit
再见~
```

#### `!quit`

断开与Databend的连接并退出BendSQL。

```shell title='示例：'
➜  ~ bendsql
欢迎使用BendSQL 0.17.0-homebrew。
连接到localhost:8000作为用户root。
已连接到Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

// highlight-next-line
root@localhost:8000/default> !quit
再见~
➜  ~
```

#### `!configs`

显示当前的BendSQL设置。

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

修改BendSQL设置。

```shell title='示例：'
root@localhost:8000/default> !set display_pretty_sql false
```

#### `!source <sql_file>`

执行SQL文件。

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
欢迎使用BendSQL 0.17.0-homebrew。
连接到localhost:8000作为用户root。
已连接到Databend Query v1.2.427-nightly-b1b622d406(rust-1.77.0-nightly-2024-04-20T22:12:35.318382488Z)

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