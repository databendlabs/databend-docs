---
title: Golang
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

Databend offers a driver (databend-go) written in Golang, which facilitates the development of applications using the Golang programming language and establishes connectivity with Databend.

For installation instructions, examples, and the source code, see the GitHub [databend-go](https://github.com/databendlabs/databend-go) repo.

## Data Type Mappings

This table illustrates the correspondence between Databend data types and their corresponding Go equivalents:

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

## Databend Go Driver Behavior Summary

The Databend Go Driver is compatible with the ["database/sql"](https://pkg.go.dev/database/sql) interface specification. Below are some common basic behaviors, along with the key functions involved and the principles behind them.

| Basic Behavior              | Key Functions Involved                             | Principle                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creating a connection       | `DB.Open`                                          | Establish a connection to Databend using the DSN string and the `DB.Open` method.<br /><br />The DSN string format is `https://user:password@host/database?<query_option>=<value>`.                                                                                                                                                                                                                                          |
| Executing statements        | `DB.Exec`                                          | The `DB.Exec` method executes SQL statements using the `v1/query` interface for creating, deleting tables and inserting data.                                                                                                                                                                                                                                                                                                |
| Bulk insertion              | `DB.Begin`, `Tx.Prepare`, `Stmt.Exec`, `Tx.Commit` | Bulk insert/replace data (`INSERT INTO` and `REPLACE INTO`) are processed through transactions.<br /><br />Use `Stmt.Exec` to add as much data as possible to a prepared statement object; data will be appended to a file.<br /><br />Executing `Tx.Commit()` will finally upload the data to the built-in Stage and perform the insert/replace operation, using [Stage Attachment](/developer/apis/http#stage-attachment). |
| Querying single row         | `DB.QueryRow`, `Row.Scan`                          | Use the `DB.QueryRow` method to query a single row of data and return a `*sql.Row`, then call `Row.Scan` to map the column data to variables.                                                                                                                                                                                                                                                                                |
| Iterating over rows         | `DB.Query`, `Rows.Next`, `Rows.Scan`               | Use the `DB.Query` method to query multiple rows of data and return a `*sql.Rows` structure, iterate over rows using the `Rows.Next` method, and map the data to variables using `Rows.Scan`.                                                                                                                                                                                                                                |
| Uploading to internal Stage | `APIClient.UploadToStage`                          | Upload data to Stage. By default, use `PRESIGN UPLOAD` to get a URL, or if PRESIGN is disabled, use the `v1/upload_to_stage` API.                                                                                                                                                                                                                                                                                            |

## Tutorial-1: Integrating with Databend using Golang

Before you start, make sure you have successfully installed a local Databend. For detailed instructions, see [Local and Docker Deployments](/guides/deploy/deploy/non-production/deploying-local).

### Step 1. Prepare a SQL User Account

To connect your program to Databend and execute SQL operations, you must provide a SQL user account with appropriate privileges in your code. Create one in Databend if needed, and ensure that the SQL user has only the necessary privileges for security.

This tutorial uses a SQL user named 'user1' with password 'abc123' as an example. As the program will write data into Databend, the user needs ALL privileges. For how to manage SQL users and their privileges, see [User & Role](/sql/sql-commands/ddl/user/).

```sql
CREATE USER user1 IDENTIFIED BY 'abc123';
GRANT ALL on *.* TO user1;
```

### Step 2. Write a Golang Program

In this step, you'll create a simple Golang program that communicates with Databend. The program will involve tasks such as creating a table, inserting data, and executing data queries.

<StepsWrap>

<StepContent number="1">

### Copy and paste the following code to the file main.go

:::note

- The code below connects to a local Databend with a SQL user named 'user1' and password 'abc123' as an example. Feel free to use your own values while maintaining the same format.
- The value of `hostname` in the code below must align with your HTTP handler settings for Databend query service.
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
	return fmt.Sprintf("databend://%s:%s@%s?sslmode=disable", username, password, hostname)
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

<StepContent number="2">

### Install dependencies.

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

### Run the program.

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

## Tutorial-2: Integrating with Databend Cloud using Golang

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).

### Step 1. Create a Go Module

```shell
$ mkdir sample
$ cd sample
$ go mod init cloud.databend.com/sample
```

### Step 2. Install Dependencies

```go
$ go get github.com/databendcloud/databend-go
```

### Step 3. Connect with databend-go

Create a file named `main.go` with the following code:

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
Replace `{USER}, {PASSWORD}, {HOST}, {WAREHOUSE_NAME} and {DATABASE}` in the code with your connection information. For how to
obtain the connection information,
see [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses#connecting).
:::

### Step 4. Run main.go

```shell
$ go run main.go
```
