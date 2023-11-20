---
title: Rust
---

本主题介绍如何使用 [databend-driver](https://crates.io/crates/databend-driver) 建立从 Rust 应用程序到 Databend Cloud 的连接。

:::tip
[databend-driver](https://crates.io/crates/databend-driver) 现在还不支持处理数组类型。
:::

## 准备工作

在开始之前，请确保您已经成功创建计算集群并获得连接信息。欲了解如何做到这一点，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。

## 第一步：创建 Rust Crate

```shell
$ cargo new databend-sample --bin
```

## 第二步：添加依赖

编辑名为 `Cargo.toml` 的文件，并写入像下面这样的代码：

```toml
[package]
name = "databend-sample"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
chrono = "0.4"
databend-driver = "0.6"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1"
```

## 第三步：用 databend-driver 建立连接

编辑名为 `main.rs` 的文件，并写入像下面这样的代码：

```rust
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() {
    let dsn = "databend://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}";
    let client = Client::new(dsn.to_string());
    let conn = client.get_conn().await.unwrap();

    let sql_table_dorp = "DROP TABLE IF EXISTS data;";
    conn.exec(sql_table_dorp).await.unwrap();

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
请使用您的连接信息替换代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 。了解如何获取连接信息，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。
:::

## 第三步：通过 Cargo 运行 sample

```shell
$ cargo run
```
