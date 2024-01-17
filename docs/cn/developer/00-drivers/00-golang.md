````
---
title: Golang
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend 提供了一个用 Golang 编写的驱动程序（databend-go），它便于使用 Golang 编程语言开发应用程序，并与 Databend 建立连接。

有关安装说明、示例和源代码，请参见 GitHub 上的 [databend-go](https://github.com/datafuselabs/databend-go) 仓库。

## Databend Go 驱动行为总结 {/*databend-go-driver-behavior-summary*/}

Databend Go 驱动与 ["database/sql"](https://pkg.go.dev/database/sql) 接口规范兼容。以下是一些常见的基本行为，以及涉及的关键函数和背后的原理。

| 基本行为             | 涉及的关键函数                                    | 原理                                                       |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| 创建连接             | `DB.Open`                                         | 使用 DSN 字符串和 `DB.Open` 方法建立与 Databend 的连接。<br /><br />DSN 字符串格式为 `https://user:password@host/database?<query_option>=<value>`。 |
| 执行语句             | `DB.Exec`                                         | `DB.Exec` 方法使用 `v1/query` 接口执行 SQL 语句，用于创建、删除表和插入数据。 |
| 批量插入             | `DB.Begin`, `Tx.Prepare`, `Stmt.Exec`, `Tx.Commit` | 通过事务处理批量插入/替换数据（`INSERT INTO` 和 `REPLACE INTO`）。<br /><br />使用 `Stmt.Exec` 尽可能多地向预处理语句对象添加数据；数据将被追加到文件中。<br /><br />执行 `Tx.Commit()` 最终会将数据上传到内置 Stage 并执行插入/替换操作，使用 [Stage 附件](/developer/apis/http#stage-attachment)。 |
| 查询单行数据         | `DB.QueryRow`, `Row.Scan`                         | 使用 `DB.QueryRow` 方法查询单行数据并返回一个 `*sql.Row`，然后调用 `Row.Scan` 将列数据映射到变量。 |
| 遍历多行数据         | `DB.Query`, `Rows.Next`, `Rows.Scan`              | 使用 `DB.Query` 方法查询多行数据并返回一个 `*sql.Rows` 结构，使用 `Rows.Next` 方法遍历行，并使用 `Rows.Scan` 将数据映射到变量。 |
| 上传到内部 Stage     | `APIClient.UploadToStage`                         | 上传数据到 Stage。默认情况下，使用 `PRESIGN UPLOAD` 获取 URL，或者如果 PRESIGN 被禁用，使用 `v1/upload_to_stage` API。 |

## 教程-1：使用 Golang 与 Databend 集成 {/*tutorial-1-integrating-with-databend-using-golang*/}

在开始之前，请确保您已成功安装了本地 Databend。有关详细说明，请参见 [本地和 Docker 部署](/guides/deploy/deploying-local)。

### 步骤 1. 准备 SQL 用户账户 {#step-1-prepare-a-sql-user-account}

要将您的程序连接到 Databend 并执行 SQL 操作，您必须在代码中提供具有适当权限的 SQL 用户账户。如果需要，请在 Databend 中创建一个，并确保 SQL 用户仅具有出于安全考虑所需的权限。

本教程使用名为 'user1'，密码为 'abc123' 的 SQL 用户作为示例。由于程序将向 Databend 写入数据，因此用户需要 ALL 权限。有关如何管理 SQL 用户及其权限，请参见 [用户与角色](/sql/sql-commands/ddl/user/)。

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### 步骤 2. 编写 Golang 程序 {#step-2-write-a-golang-program}

在此步骤中，您将创建一个简单的 Golang 程序，该程序与 Databend 进行通信。程序将涉及创建表、插入数据和执行数据查询等任务。

<StepsWrap> 

<StepContent number="1" title="将以下代码复制并粘贴到文件 main.go 中"> 

:::note
- 下面的代码连接到一个本地 Databend，使用名为 'user1' 和密码 'abc123' 的 SQL 用户作为示例。在保持相同格式的同时，可以自由使用您自己的值。
- 代码中的 `hostname` 值必须与您的 Databend 查询服务的 HTTP 处理程序设置保持一致。
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

<StepContent number="2" title="安装依赖项。"> 

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

<StepContent number="3" title="运行程序。">

```shell
go run main.go
```

```text title='输出'
2023/02/24 23:57:31 Connected
2023/02/24 23:57:31 Create database book_db success
2023/02/24 23:57:31 Create table: books
2023/02/24 23:57:31 Insert 1 row
2023/02/24 23:57:31 Select:{mybook author 2022}
```


</StepContent>

</StepsWrap>

## 教程-2：使用 Golang 与 Databend Cloud 集成 {/*tutorial-2-integrating-with-databend-cloud-using-golang*/}

在开始之前，请确保您已成功创建了一个数据仓库并获得了连接信息。有关如何做到这一点，请参见 [连接到数据仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。

### 步骤 1. 创建 Go 模块 {#step-1-create-a-go-module}

```shell
$ mkdir sample
$ cd sample
$ go mod init cloud.databend.com/sample
```

### 步骤 2. 安装依赖项 {#step-2-install-dependencies}

```go
$ go get github.com/databendcloud/databend-go
```

### 步骤 3. 使用 databend-go 连接 {#step-3-connect-with-databend-go}

创建一个名为 `main.go` 的文件，并填入以下代码：

```go
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/databendcloud/databend-go"
)

func main() {
	dsn := "https://{USER}:{PASSWORD}@{WAREHOUSE_HOST}:443/{DATABASE}"
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
将代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 替换为您的连接信息。有关如何获取连接信息，请参见 [连接到数据仓库](/guides/cloud/using-databend-cloud/warehouses#connecting)。
:::

### 步骤 4. 运行 main.go {#step-4-run-main-go}

```shell
$ go run main.go
```
````