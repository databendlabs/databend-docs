---
title: Golang
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 提供了一个用 Golang 编写的驱动程序 (databend-go)，它有助于使用 Golang 编程语言开发应用程序并建立与 Databend 的连接。

有关安装说明、示例和源代码，请参阅 GitHub [databend-go](https://github.com/databendlabs/databend-go) 仓库。

## 数据类型映射

下表说明了 Databend 数据类型与其对应的 Go 等效项之间的对应关系：

| Databend           | Go              |
| ------------------ | --------------- |
| TINYINT            | int8            |
| SMALLINT           | int16           |
| INT                | int32           |
| BIGINT             | int64           |
| TINYINT UNSIGNED   | uint8           |
| SMALLINT UNSIGNED  | uint16          |
| INT UNSIGNED       | uint32          |
| BIGINT UNSIGNED    | uint64          |
| Float32            | float32         |
| Float64            | float64         |
| Bitmap             | string          |
| Decimal            | decimal.Decimal |
| String             | string          |
| Date               | time.Time       |
| DateTime           | time.Time       |
| Array(T)           | string          |
| Tuple(T1, T2, ...) | string          |
| Variant            | string          |

## Databend Go 驱动程序行为摘要

Databend Go 驱动程序与 ["database/sql"](https://pkg.go.dev/database/sql) 接口规范兼容。以下是一些常见的行为，以及涉及的关键函数及其背后的原理。

| 基本行为         | 涉及的关键函数                                     | 原理                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 创建连接         | `DB.Open`                                          | 使用 DSN 字符串和 `DB.Open` 方法建立与 Databend 的连接。<br /><br />DSN 字符串格式为 `https://user:password@host/database?<query_option>=<value>`。                                                                                                                                                          |
| 执行语句         | `DB.Exec`                                          | `DB.Exec` 方法使用 `v1/query` 接口执行 SQL 语句，用于创建、删除表和插入数据。                                                                                                                                                                                                                                |
| 批量插入         | `DB.Begin`, `Tx.Prepare`, `Stmt.Exec`, `Tx.Commit` | 批量插入/替换数据（`INSERT INTO` 和 `REPLACE INTO`）通过事务处理。<br /><br />使用 `Stmt.Exec` 将尽可能多的数据添加到预处理语句对象；数据将附加到文件中。<br /><br />执行 `Tx.Commit()` 最终会将数据上传到内置的 Stage 并执行插入/替换操作，使用 [Stage Attachment](/developer/apis/http#stage-attachment)。 |
| 查询单行         | `DB.QueryRow`, `Row.Scan`                          | 使用 `DB.QueryRow` 方法查询单行数据并返回 `*sql.Row`，然后调用 `Row.Scan` 将列数据映射到变量。                                                                                                                                                                                                               |
| 迭代行           | `DB.Query`, `Rows.Next`, `Rows.Scan`               | 使用 `DB.Query` 方法查询多行数据并返回 `*sql.Rows` 结构，使用 `Rows.Next` 方法迭代行，并使用 `Rows.Scan` 将数据映射到变量。                                                                                                                                                                                  |
| 上传到内部 Stage | `APIClient.UploadToStage`                          | 将数据上传到 Stage。默认情况下，使用 `PRESIGN UPLOAD` 获取 URL，如果禁用 PRESIGN，则使用 `v1/upload_to_stage` API。                                                                                                                                                                                          |

## 教程 1：使用 Golang 与 Databend 集成

在开始之前，请确保已成功安装本地 Databend。有关详细说明，请参阅 [本地和 Docker 部署](/guides/deploy/deploy/non-production/deploying-local)。

### 步骤 1. 准备一个 SQL 用户帐户

要将程序连接到 Databend 并执行 SQL 操作，必须在代码中提供具有适当权限的 SQL 用户帐户。如果需要，在 Databend 中创建一个，并确保 SQL 用户仅具有必要的权限以确保安全。

本教程使用名为“user1”且密码为“abc123”的 SQL 用户作为示例。由于程序会将数据写入 Databend，因此用户需要所有权限。有关如何管理 SQL 用户及其权限的信息，请参阅 [用户 & 角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤 2. 编写 Golang 程序

在此步骤中，你将创建一个简单的 Golang 程序，该程序与 Databend 通信。该程序将涉及创建表、插入数据和执行数据查询等任务。

<StepsWrap>

<StepContent number="1">

### 将以下代码复制并粘贴到文件 main.go 中

:::note

- 以下代码连接到本地 Databend，其中 SQL 用户名为“user1”，密码为“abc123”作为示例。你可以随意使用自己的值，同时保持相同的格式。
- 以下代码中 `hostname` 的值必须与 Databend 查询服务的 HTTP 处理程序设置一致。
  :::

```go title='main.go'
package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/databendcloud/databend-go"
)

const (
	username = "user1"
	password = "abc123"
	hostname = "127.0.0.1:8000"
)

type Book struct {
	Title  string
	Author string
	Date   string
}

func dsn() string {
	return fmt.Sprintf("http://%s:%s@%s", username, password, hostname)
}

func main() {
	db, err := sql.Open("databend", dsn())

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connected")

	// Create db if do not exist
	dbSql := "CREATE DATABASE IF NOT EXISTS book_db"
	_, err = db.Exec(dbSql)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Create database book_db success")

	// Use book_db database
	_, err = db.Exec("USE book_db")
	if err != nil {
		log.Fatal(err)
	}

	// Create table.
	sql := "create table if not exists books(title VARCHAR, author VARCHAR, date VARCHAR)"
	_, err = db.Exec(sql)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Create table: books")

	// Insert 1 row.
	_, err = db.Exec("INSERT INTO books VALUES(?, ?, ?)", "mybook", "author", "2022")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Insert 1 row")
```

```go
	// Select.
	res, err := db.Query("SELECT * FROM books")
	if err != nil {
		log.Fatal(err)
	}

	for res.Next() {
		var book Book
		err := res.Scan(&book.Title, &book.Author, &book.Date)
		if err != nil {
			log.Fatal(err)
		}

		log.Printf("Select:%v", book)
	}
	db.Exec("drop table books")
	db.Exec("drop database book_db")
}
```

</StepContent>

<StepContent number="2">

### 安装依赖。

```shell
go mod init databend-golang
```

```text title='go.mod'
module databend-golang

go 1.20

require github.com/databendcloud/databend-go v0.3.10

require (
	github.com/BurntSushi/toml v1.2.1 // indirect
	github.com/avast/retry-go v3.0.0+incompatible // indirect
	github.com/google/uuid v1.3.0 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/sirupsen/logrus v1.9.0 // indirect
	golang.org/x/sys v0.5.0 // indirect
)
```

</StepContent>

<StepContent number="3">

### 运行程序。

```shell
go run main.go
```

```text title='Outputs'
2023/02/24 23:57:31 Connected
2023/02/24 23:57:31 Create database book_db success
2023/02/24 23:57:31 Create table: books
2023/02/24 23:57:31 Insert 1 row
2023/02/24 23:57:31 Select:{mybook author 2022}
```

</StepContent>

</StepsWrap>

## Tutorial-2: 使用 Golang 与 Databend Cloud 集成

在开始之前，请确保您已成功创建计算集群并获得连接信息。有关如何执行此操作，请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### Step 1. 创建一个 Go Module

```shell
$ mkdir sample
$ cd sample
$ go mod init cloud.databend.com/sample
```

### Step 2. 安装依赖

```go
$ go get github.com/databendcloud/databend-go
```

### Step 3. 使用 databend-go 连接

创建一个名为 `main.go` 的文件，其中包含以下代码：

```go
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/databendcloud/databend-go"
)

func main() {
	dsn := "databend://{USER}:{PASSWORD}@${HOST}:443/{DATABASE}?&warehouse={WAREHOUSE_NAME}";
	conn, err := sql.Open("databend", dsn)
	if err != nil {
		fmt.Println(err)
	}
	conn.Exec(`DROP TABLE IF EXISTS data`)
	createTable := `CREATE TABLE  IF NOT EXISTS data (
		i64 Int64,
		u64 UInt64,
		f64 Float64,
		s   String,
		s2  String,
		a16 Array(Int16),
		a8  Array(UInt8),
		d   Date,
		t   DateTime)`
	_, err = conn.Exec(createTable)
	if err != nil {
		fmt.Println(err)
	}
	scope, err := conn.Begin()
	batch, err := scope.Prepare(fmt.Sprintf("INSERT INTO %s VALUES", "data"))
	if err != nil {
		fmt.Println(err)
    }
	for i := 0; i < 10; i++ {
		_, err = batch.Exec(
			"1234",
			"2345",
			"3.1415",
			"test",
			"test2",
			"[4, 5, 6]",
			"[1, 2, 3]",
			"2021-01-01",
			"2021-01-01 00:00:00",
		)
	}
	err = scope.Commit()
	if err != nil {
		fmt.Println(err)
	}
}
```

:::tip
将代码中的 `{USER}, {PASSWORD}, {HOST}, {WAREHOUSE_NAME} and {DATABASE}` 替换为您的连接信息。有关如何
获取连接信息，
请参见 [连接到计算集群](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### Step 4. 运行 main.go

```shell
$ go run main.go
```
