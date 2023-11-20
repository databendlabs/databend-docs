---
title: Golang
---

本主题介绍如何使用 [databend-go](https://github.com/databendcloud/databend-go) 建立从 Golang 应用程序到 Databend Cloud 的连接。

## 准备工作

在开始之前，请确保您已经成功创建计算集群并获得连接信息。欲了解如何做到这一点，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。

## 第一步：创建 Go 模块

```shell
$ mkdir sample
$ cd sample
$ go mod init cloud.databend.com/sample
```

## 第二步：安装依赖

```go
$ go get github.com/databendcloud/databend-go
```

## 第三步：用 databend-go 建立连接

创建名为 `main.go` 的文件，并写入像下面这样的代码：

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
		_, err = conn.Exec(`
		CREATE TABLE IF NOT EXISTS  data(
			Col1 TINYINT,
			Col2 VARCHAR 
		) 
		`)
		if err != nil {
			fmt.Println(err)
		}
		_, err = conn.Exec("INSERT INTO data VALUES (1, 'test-1')")
}
```

:::tip
请使用您的连接信息替换代码中的 {USER}、{PASSWORD}、{WAREHOUSE_HOST} 和 {DATABASE} 。了解如何获取连接信息，请参考[连接到计算集群](/02-using-databend-cloud/00-warehouses.md#connecting) 。
:::

## 第四步：运行 main.go

```shell
$ go run main.go
```