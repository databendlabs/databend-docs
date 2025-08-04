---
title: Rust
---

# Databend Rust 驱动

官方 Rust 驱动，为 Rust 应用程序提供原生连接、async/await 支持和全面的类型安全。

## 安装

将驱动添加到你的 `Cargo.toml`：

```toml
[dependencies]
databend-driver = "0.7"
tokio = { version = "1", features = ["full"] }
```

**连接字符串**：关于 DSN 格式和连接示例，请参阅[驱动概述](./index.md#connection-string-dsn)。

---

## 主要特性

- ✅ **Async/Await 支持**：专为现代 Rust 异步编程构建
- ✅ **类型安全**：与 Rust 的类型系统进行强类型映射
- ✅ **连接池**：高效的连接管理
- ✅ **Stage 操作**：向 Databend Stage 上传或下载数据
- ✅ **流式结果**：高效处理大型结果集

## 数据类型映射

### 基础类型
| Databend | Rust | 备注 |
| --- | --- | --- |
| BOOLEAN | bool | |
| TINYINT | i8, u8 | |
| SMALLINT | i16, u16 | |
| INT | i32, u32 | |
| BIGINT | i64, u64 | |
| FLOAT | f32 | |
| DOUBLE | f64 | |
| DECIMAL | String | 保留精度 |
| VARCHAR | String | UTF-8 编码 |
| BINARY | `Vec<u8>` | |

### 日期/时间类型
| Databend | Rust | 备注 |
| --- | --- | --- |
| DATE | chrono::NaiveDate | 需要 chrono crate |
| TIMESTAMP | chrono::NaiveDateTime | 需要 chrono crate |

### 复杂类型
| Databend | Rust | 备注 |
| --- | --- | --- |
| ARRAY[T] | `Vec<T>` | 支持嵌套数组 |
| TUPLE[T, U] | (T, U) | 多元素元组 |
| MAP[K, V] | `HashMap<K, V>` | 键值映射 |
| VARIANT | String | JSON 编码 |
| BITMAP | String | Base64 编码 |
| GEOMETRY | String | WKT 格式 |

---

## 基本用法

以下示例演示 DDL、写入和查询操作：

```rust
use databend_driver::Client;
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 连接到 Databend
    let client = Client::new("<your-dsn>".to_string());
    let conn = client.get_conn().await?;

    // DDL：创建表
    conn.exec("CREATE TABLE IF NOT EXISTS users (id INT, name VARCHAR, created_at TIMESTAMP)")
        .await?;

    // 写入：插入数据
    conn.exec("INSERT INTO users VALUES (1, 'Alice', '2023-12-01 10:00:00')")
        .await?;
    conn.exec("INSERT INTO users VALUES (2, 'Bob', '2023-12-01 11:00:00')")
        .await?;

    // 查询：查询数据
    let mut rows = conn.query_iter("SELECT id, name, created_at FROM users ORDER BY id")
        .await?;
    
    while let Some(row) = rows.next().await {
        let (id, name, created_at): (i32, String, chrono::NaiveDateTime) = 
            row?.try_into()?;
        println!("User {}: {} (created: {})", id, name, created_at);
    }

    Ok(())
}
```

## 相关资源

- **Crates.io**：[databend-driver](https://crates.io/crates/databend-driver)
- **GitHub 仓库**：[BendSQL/driver](https://github.com/databendlabs/BendSQL/tree/main/driver)
- **Rust 文档**：[docs.rs/databend-driver](https://docs.rs/databend-driver)