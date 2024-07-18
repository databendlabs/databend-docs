---
title: Rust
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 提供了一个用 Rust 编写的驱动程序（[crates.io - databend-driver](https://crates.io/crates/databend-driver)），该驱动程序便于使用 Rust 编程语言开发应用程序并与 Databend 建立连接。请注意，该驱动程序目前不支持处理数组。

有关安装说明、示例和源代码，请参阅 [GitHub - databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)。

## 数据类型映射

下表展示了 Databend 通用数据类型与其对应的 Rust 类型的对应关系：

| Databend  | Rust                  |
| --------- | --------------------- |
| BOOLEAN   | bool                  |
| TINYINT   | i8,u8                 |
| SMALLINT  | i16,u16               |
| INT       | i32,u32               |
| BIGINT    | i64,u64               |
| FLOAT     | f32                   |
| DOUBLE    | f64                   |
| DECIMAL   | String                |
| DATE      | chrono::NaiveDate     |
| TIMESTAMP | chrono::NaiveDateTime |
| VARCHAR   | String                |
| BINARY    | `Vec<u8>`             |

下表展示了 Databend 半结构化数据类型与其对应的 Rust 类型的对应关系：

| Databend    | Rust            |
| ----------- | --------------- |
| ARRAY[T]    | `Vec<T> `       |
| TUPLE[T, U] | (T, U)          |
| MAP[K, V]   | `HashMap<K, V>` |
| VARIANT     | String          |
| BITMAP      | String          |
| GEOMETRY    | String          |

## Databend Rust 驱动程序行为总结

下表总结了 Rust 驱动程序的主要行为和功能及其用途：

| 函数名称           | 描述                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `info`             | 返回客户端的连接信息。                                                                     |
| `version`          | 返回执行 `SELECT VERSION()` 语句的结果。                                                   |
| `exec`             | 执行 SQL 语句并返回受影响的行数。                                                          |
| `query_iter`       | 执行 SQL 查询并返回一个用于逐行处理结果的迭代器。                                          |
| `query_iter_ext`   | 执行 SQL 查询并返回一个包含结果统计信息的迭代器。                                          |
| `query_row`        | 执行 SQL 查询并返回单行结果。                                                              |
| `get_presigned_url`| 根据操作和 Stage 参数生成 `PRESIGN` 语句，返回 HTTP 方法、头部和 URL。                     |
| `upload_to_stage`  | 上传数据到 Stage。默认使用 `PRESIGN UPLOAD` 的 URL，如果 PRESIGN 被禁用，则使用 `v1/upload_to_stage` API。|
| `load_data`        | 上传数据到内置 Stage（`upload_to_stage`）并执行带有 [stage attachment](/developer/apis/http#stage-attachment) 的插入/替换操作。|
| `load_file`        | 复用 `load_data` 逻辑上传文件并插入数据。                                                  |
| `stream_load`      | 将数据读取为 Vec，转换为 CSV，然后调用 `load_data` 方法。                                   |

## 教程-1：使用 Rust 与 Databend 集成

在开始之前，请确保您已成功安装本地 Databend。详细步骤请参阅 [本地和 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

### 步骤 1. 准备 SQL 用户账户

为了使您的程序能够连接到 Databend 并执行 SQL 操作，您必须在代码中提供一个具有适当权限的 SQL 用户账户。如有需要，请在 Databend 中创建一个，并确保该 SQL 用户仅具有必要的权限以保证安全。

本教程以名为 'user1' 且密码为 'abc123' 的 SQL 用户为例。由于程序将向 Databend 写入数据，该用户需要 ALL 权限。有关如何管理 SQL 用户及其权限，请参阅 [用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤 2. 编写 Rust 程序

在这一步中，您将创建一个简单的 Rust 程序，该程序与 Databend 进行通信。程序将涉及创建表、插入数据和执行数据查询等任务。

<StepsWrap>

<StepContent number="1">

### 创建新项目

```shell
cargo new databend-demo --bin
```

```toml title='Cargo.toml'
[package]
name = "databend-demo"
version = "0.1.0"
edition = "2021"

# 更多键及其定义请参阅 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
databend-driver = "0.7"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1.12"
```

</StepContent>

<StepContent number="2">

### 将以下代码复制粘贴到 main.rs 文件中

:::note
代码中 `hostname` 的值必须与您的 Databend 查询服务的 HTTP 处理程序设置一致。
:::

```rust title='main.rs'
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() {
    // 以名为 'user1' 且密码为 'abc123' 的 SQL 用户连接到本地 Databend 为例。
    // 请根据实际情况自由使用您自己的值，同时保持格式一致。
    let dsn = "databend://user1:abc123@localhost:8000/default?sslmode=disable";
    let client = Client::new(dsn.to_string());
    let conn = client.get_conn().await.unwrap();

    let sql_db_create = "CREATE DATABASE IF NOT EXISTS book_db;";
    conn.exec(sql_db_create).await.unwrap();

    let sql_table_create = "CREATE TABLE book_db.books (
    title VARCHAR,
    author VARCHAR,
    date VARCHAR
);";

    conn.exec(sql_table_create).await.unwrap();
    let sql_insert = "INSERT INTO book_db.books VALUES ('mybook', 'author', '2022');";
    conn.exec(sql_insert).await.unwrap();

    let mut rows = conn.query_iter("SELECT * FROM book_db.books;").await.unwrap();
    while let Some(row) = rows.next().await {
        let (title, author, date): (String, String, String) = row.unwrap().try_into().unwrap();
        println!("{} {} {}", title, author, date);
    }

    let sql_table_drop = "DROP TABLE book_db.books;";
    conn.exec(sql_table_drop).await.unwrap();

    let sql_db_drop = "DROP DATABASE book_db;";
    conn.exec(sql_db_drop).await.unwrap();
}
```

</StepContent>

<StepContent number="3">

### 运行程序

```shell
cargo run
```

```text title='输出'
mybook author 2022
```

</StepContent>

</StepsWrap>

## 教程-2：使用 Rust 与 Databend Cloud 集成

在开始之前，请确保您已成功创建仓库并获取连接信息。具体操作请参阅 [连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 创建 Rust Crate

```shell
$ cargo new databend-sample --bin
```

### 步骤 2. 添加依赖

编辑名为 `Cargo.toml` 的文件，添加以下代码：

```toml
[package]
name = "databend-sample"
version = "0.1.0"
edition = "2021"

# 更多键及其定义请参阅 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
chrono = "0.4"
databend-driver = "0.6"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1"
```

### 步骤 3. 连接 databend-driver

编辑名为 `main.rs` 的文件，添加以下代码：

```rust
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() {
    let dsn = "databend://{USER}:{PASSWORD}@${HOST}:443/{DATABASE}?&warehouse={WAREHOUSE_NAME}";
    let client = Client::new(dsn.to_string());
    let conn = client.get_conn().await.unwrap();

    let sql_table_dorp = "DROP TABLE IF EXISTS data;";
    conn.exec(sql_table_drop).await.unwrap();

    let sql_table_create = "CREATE TABLE IF NOT EXISTS data (
		i64 Int64,
		u64 UInt64,
		f64 Float64,
		s   String,
		s2  String,
		d   Date,
		t   DateTime)";

    conn.exec(sql_table_create).await.unwrap();
    let sql_insert = "INSERT INTO data VALUES ('1234', '2345', '3.1415', 'test', 'test2', '2021-01-01', '2021-01-01 00:00:00');";
    conn.exec(sql_insert).await.unwrap();

    let mut rows = conn.query_iter("SELECT * FROM data;").await.unwrap();
    while let Some(row) = rows.next().await {
        let (col1, col2, col3, col4, col5, col6, col7): (
            i64,
            u64,
            f64,
            String,
            String,
            chrono::NaiveDate,
            chrono::NaiveDateTime,
        ) = row.unwrap().try_into().unwrap();
        println!(
            "{} {} {} {} {} {} {}",
            col1, col2, col3, col4, col5, col6, col7
        );
    }
}
```

:::tip
在代码中替换 `{USER}, {PASSWORD}, {WAREHOUSE_HOST}, 和 {DATABASE}` 为你的连接信息。关于如何获取连接信息，请参见[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 第四步：使用 Cargo 运行示例

```shell
$ cargo run
```