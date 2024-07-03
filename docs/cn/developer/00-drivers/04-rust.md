---
title: Rust
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend提供了一个用Rust编写的驱动程序（[crates.io - databend-driver](https://crates.io/crates/databend-driver)），便于使用Rust编程语言开发应用程序，并建立与Databend的连接。请注意，该驱动目前不支持处理数组。

关于安装指南、示例和源代码，请参阅[GitHub - databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)。

## 数据类型映射

下表展示了Databend通用数据类型与其对应的Rust类型的对应关系：

| Databend  | Rust                  |
|-----------|-----------------------|
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

下表展示了Databend半结构化数据类型与其对应的Rust类型的对应关系：

| Databend    | Rust           |
|-------------|----------------|
| ARRAY[T]    | `Vec<T> `      |
| TUPLE[T, U] | (T, U)         |
| MAP[K, V]   | `HashMap<K, V>`|
| VARIANT     | String         |
| BITMAP      | String         |
| GEOMETRY    | String         |

## Databend Rust驱动行为概述

下表概述了Rust驱动的主要行为和功能及其目的：

| 函数名称       | 描述                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- |
| `info`         | 返回客户端的连接信息。                                                                   |
| `version`      | 返回执行`SELECT VERSION()`语句的结果。                                                    |
| `exec`         | 执行SQL语句并返回受影响的行数。                                                          |
| `query_iter`   | 执行SQL查询并返回用于逐行处理结果的迭代器。                                              |
| `query_iter_ext`| 执行SQL查询并返回包含有关结果的统计信息的迭代器。                                       |
| `query_row`    | 执行SQL查询并返回单行结果。                                                              |
| `get_presigned_url` | 根据操作和Stage参数生成`PRESIGN`语句，返回HTTP方法、头部和URL。                        |
| `upload_to_stage` | 将数据上传到Stage。默认使用`PRESIGN UPLOAD`获取URL，如果PRESIGN被禁用，则使用`v1/upload_to_stage`API。 |
| `load_data`    | 将数据上传到内置Stage（`upload_to_stage`）并执行插入/替换操作，附带[Stage附件](/developer/apis/http#stage-attachment)。 |
| `load_file`    | 重用`load_data`逻辑上传文件并插入数据。                                                   |
| `stream_load`  | 将数据读取为Vec，转换为CSV，然后调用`load_data`方法。                                      |

## 教程1：使用Rust与Databend集成

开始之前，请确保您已成功安装本地Databend。详细指南请参阅[本地和Docker部署](/guides/deploy/deploy/non-production/deploying-local)。

### 步骤1. 准备SQL用户账户

要使您的程序连接到Databend并执行SQL操作，您必须在代码中提供具有适当权限的SQL用户账户。如有需要，在Databend中创建一个，并确保SQL用户仅具有必要的安全权限。

本教程使用名为'user1'、密码为'abc123'的SQL用户作为示例。由于程序将向Databend写入数据，该用户需要ALL权限。关于如何管理SQL用户及其权限，请参阅[用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤2. 编写Rust程序

在本步骤中，您将创建一个简单的Rust程序，该程序与Databend通信。该程序将涉及创建表、插入数据和执行数据查询等任务。

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

# 更多键及其定义请参见 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
databend-driver = "0.7"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1.12"
```

</StepContent>

<StepContent number="2">

### 将以下代码复制粘贴到main.rs文件中

:::note
代码中`hostname`的值必须与您的Databend查询服务的HTTP处理程序设置相匹配。
:::

```rust title='main.rs'
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() {
    // 以名为'user1'的SQL用户和密码'abc123'连接到本地Databend作为示例。
    // 使用您自己的值时请保持相同格式。
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

## 教程2：使用Rust与Databend Cloud集成

开始之前，请确保您已成功创建仓库并获取连接信息。关于如何操作，请参阅[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤1. 创建Rust Crate

```shell
$ cargo new databend-sample --bin
```

### 步骤2. 添加依赖项

编辑名为`Cargo.toml`的文件，添加以下代码：

```toml
[package]
name = "databend-sample"
version = "0.1.0"
edition = "2021"

# 更多键及其定义请参见 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
chrono = "0.4"
databend-driver = "0.6"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1"
```

### 步骤3. 连接到databend-driver

编辑名为`main.rs`的文件，添加以下代码：

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
在代码中替换{USER}, {PASSWORD}, {WAREHOUSE_HOST}, 和 {DATABASE}为您的连接信息。关于如何获取连接信息，请参阅[连接到仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 第4步：使用Cargo运行示例

```shell
$ cargo run
```