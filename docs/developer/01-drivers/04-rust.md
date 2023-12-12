---
title: Rust
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend offers a driver ([crates.io - databend-driver](https://crates.io/crates/databend-driver)) written in Rust, which facilitates the development of applications using the Rust programming language and establishes connectivity with Databend. Please note that the driver currently does not support handling arrays.

For installation instructions, examples, and the source code, see [GitHub - databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver).

## Tutorial-1: Integrating with Databend using Rust

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](/doc/deploy/deploying-local).

### Step 1. Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### Step 2. Write a Rust Program

In this step, you'll create a simple Rust program that communicates with Databend. The program will involve tasks such as creating a table, inserting data, and executing data queries.

<StepsWrap>

<StepContent number="1" title="Create a new project">

```shell
cargo new databend-demo --bin
```

```toml title='Cargo.toml'
[package]
name = "databend-demo"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
databend-driver = "0.7"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1.12"
```


</StepContent>

<StepContent number="2" title="Copy and paste the following code to the file main.rs">


:::note
The value of `hostname` in the code below must align with your HTTP handler settings for Databend query service.
:::

```rust title='main.rs'
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() {
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

<StepContent number="3" title="Run the program. ">

```shell
cargo run
```

```text title='Outputs'
mybook author 2022
```

</StepContent>

</StepsWrap>


## Tutorial-2: Integrating with Databend Cloud using Rust

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](/cloud/using-databend-cloud/warehouses#connecting).

### Step 1. Create a Rust Crate

```shell
$ cargo new databend-sample --bin
```

### Step 2. Add Dependencies

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

### Step 3. Connect with databend-driver

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
see [Connecting to a Warehouse](/cloud/using-databend-cloud/warehouses#connecting).
:::

### Step 4. Run sample with Cargo

```shell
$ cargo run
```