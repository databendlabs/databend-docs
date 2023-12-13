Databend提供了一个用Rust编写的驱动程序（[crates.io - databend-driver](https://crates.io/crates/databend-driver)），它简化了使用Rust编程语言开发应用程序并与Databend建立连接的过程。请注意，该驱动程序目前不支持处理数组。

有关安装说明、示例和源代码，请参见[GitHub - databend-driver](https://github.com/datafuselabs/BendSQL/tree/main/driver)。

## 教程1：使用Rust集成Databend

在开始之前，请确保已成功安装了本地Databend。有关详细说明，请参见[本地和Docker部署](/doc/deploy/deploying-local)。

### 步骤1：准备SQL用户账户

要将程序连接到Databend并执行SQL操作，您必须在代码中提供一个具有适当权限的SQL用户账户。如果需要，请在Databend中创建一个账户，并确保SQL用户只具有必要的权限以确保安全。

本教程以名为'user1'、密码为'abc123'的SQL用户为例。由于程序将向Databend写入数据，因此用户需要拥有ALL权限。有关如何管理SQL用户及其权限的详细信息，请参见[用户和角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤2：编写Rust程序

在此步骤中，您将创建一个与Databend通信的简单Rust程序。该程序将涉及创建表、插入数据和执行数据查询等任务。

<StepsWrap>

<StepContent number="1" title="创建一个新项目">

```shell
cargo new databend-demo --bin
```

```toml title='Cargo.toml'
[package]
name = "databend-demo"
version = "0.1.0"
edition = "2021"

# 更多键和定义请参见 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
databend-driver = "0.7"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1.12"
```


</StepContent>

<StepContent number="2" title="将以下代码复制并粘贴到main.rs文件中">


:::note
下面代码中的`hostname`值必须与Databend查询服务的HTTP处理程序设置对齐。
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

<StepContent number="3" title="运行程序。 ">

```shell
cargo run
```

```text title='输出'
mybook author 2022
```

</StepContent>

</StepsWrap>


## 教程2：使用Rust集成Databend Cloud

在开始之前，请确保已成功创建了一个仓库并获取了连接信息。有关如何操作，请参见[连接到仓库](/doc/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤1：创建Rust Crate

```shell
$ cargo new databend-sample --bin
```

### 步骤2：添加依赖项

使用以下代码编辑名为`Cargo.toml`的文件：

```toml
[package]
name = "databend-sample"
version = "0.1.0"
edition = "2021"

# 更多键和定义请参见 https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
chrono = "0.4"
databend-driver = "0.6"
tokio = { version = "1", features = ["full"] }
tokio-stream = "0.1"
```

### 步骤3：连接databend-driver

使用以下代码编辑名为`main.rs`的文件：

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

```

```rust
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
将代码中的{USER}、{PASSWORD}、{WAREHOUSE_HOST}和{DATABASE}替换为您的连接信息。有关如何获取连接信息的详细信息，请参见[连接到仓库](/doc/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 第4步：使用Cargo运行示例

```shell
$ cargo run
```