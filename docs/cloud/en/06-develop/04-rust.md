---
title: Rust
---

This topic shows how to connect to Databend Cloud from a Rust application
using [databend-driver](https://crates.io/crates/databend-driver).

:::tip
[databend-driver](https://crates.io/crates/databend-driver) currently does not support handling arrays.
:::

## Prerequisites

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

## Step 1. Create a Rust Crate

```shell
$ cargo new databend-sample --bin
```

## Step 2. Add Dependencies

Edit the file named `Cargo.toml` with the following code:

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

## Step 3. Connect with databend-driver

Edit the file named `main.rs` with the following code:

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
Replace {USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE} in the code with your connection information. For how to
obtain the connection information,
see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).
:::

## Step 4. Run sample with Cargo

```shell
$ cargo run
```
