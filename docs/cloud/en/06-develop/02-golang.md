---
title: Golang
---

This topic shows how to connect to Databend Cloud from a Golang application
using [databend-go](https://github.com/databendcloud/databend-go).

## Prerequisites

Before you start, make sure you have successfully created a warehouse and obtained the connection information. For how
to do that, see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).

## Step 1. Create a Go Module

```shell
$ mkdir sample
$ cd sample
$ go mod init cloud.databend.com/sample
```

## Step 2. Install Dependencies

```go
$ go get github.com/databendcloud/databend-go
```

## Step 3. Connect with databend-go

Create a file named `main.go` with the following code:

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
Replace {USER}, {PASSWORD}, {WAREHOUSE_HOST}, and {DATABASE} in the code with your connection information. For how to
obtain the connection information,
see [Connecting to a Warehouse](../02-using-databend-cloud/00-warehouses.md#connecting-to-a-warehouse-connecting).
:::

## Step 4. Run main.go

```shell
$ go run main.go
```
