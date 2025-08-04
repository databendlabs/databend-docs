---
title: Go
---

# Databend Go 驱动

官方 Go 驱动，提供标准的 `database/sql` 接口，可与现有 Go 应用程序无缝集成。

## 安装

```bash
go get github.com/databendlabs/databend-go
```

**连接字符串**：有关 DSN 格式和连接示例，请参阅[驱动概述](./index.md#connection-string-dsn)。

---

## 主要特性

- ✅ **标准接口**：完全兼容 `database/sql`
- ✅ **连接池**：内置连接管理
- ✅ **批量操作**：通过事务高效执行批量插入
- ✅ **类型安全**：全面的 Go 类型映射

## 数据类型映射

| Databend | Go | 说明 |
|----------|----|---------|
| **整数** | | |
| `TINYINT` | `int8` | |
| `SMALLINT` | `int16` | |
| `INT` | `int32` | |
| `BIGINT` | `int64` | |
| `TINYINT UNSIGNED` | `uint8` | |
| `SMALLINT UNSIGNED` | `uint16` | |
| `INT UNSIGNED` | `uint32` | |
| `BIGINT UNSIGNED` | `uint64` | |
| **浮点数** | | |
| `FLOAT` | `float32` | |
| `DOUBLE` | `float64` | |
| **其他类型** | | |
| `DECIMAL` | `decimal.Decimal` | 需要 decimal 包 |
| `STRING` | `string` | |
| `DATE` | `time.Time` | |
| `TIMESTAMP` | `time.Time` | |
| `ARRAY(T)` | `string` | JSON 编码 |
| `TUPLE(...)` | `string` | JSON 编码 |
| `VARIANT` | `string` | JSON 编码 |
| `BITMAP` | `string` | Base64 编码 |

---

## 基本用法

```go
import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/databendlabs/databend-go"
)

// 连接到 Databend
db, err := sql.Open("databend", "<your-dsn>")
if err != nil {
    log.Fatal(err)
}
defer db.Close()

// DDL：创建表
_, err = db.Exec("CREATE TABLE users (id INT, name STRING)")
if err != nil {
    log.Fatal(err)
}

// 写入：插入数据
_, err = db.Exec("INSERT INTO users VALUES (?, ?)", 1, "Alice")
if err != nil {
    log.Fatal(err)
}

// 查询：选择数据
var id int
var name string
err = db.QueryRow("SELECT id, name FROM users WHERE id = ?", 1).Scan(&id, &name)
if err != nil {
    log.Fatal(err)
}

fmt.Printf("User: %d, %s\n", id, name)
```

## 相关资源

- **GitHub 仓库**：[databend-go](https://github.com/databendlabs/databend-go)
- **Go 包**：[pkg.go.dev](https://pkg.go.dev/github.com/datafuselabs/databend-go)
- **示例**：[GitHub 示例](https://github.com/databendlabs/databend-go/tree/main/examples)