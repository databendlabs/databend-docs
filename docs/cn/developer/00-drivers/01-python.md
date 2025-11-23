---
title: Python
---

# Python 驱动

使用我们的官方驱动通过 Python 连接 Databend，支持同步与异步操作。

## 快速开始

选择适合你的方式：

| 包 | 适用场景 | 安装 |
|---|---|---|
| **databend-driver** | 直接数据库操作，支持 async/await | `pip install databend-driver` |
| **databend-sqlalchemy** | ORM 集成，已有 SQLAlchemy 应用 | `pip install databend-sqlalchemy` |

**连接字符串**：关于 DSN 格式与示例，请参见 [驱动概览](./index.md#connection-string-dsn)。

---

## databend-driver（推荐）

### 功能特性
- ✅ **原生性能**：直连 Databend
- ✅ **同步/异步支持**：任选编程风格  
- ✅ **PEP 249 兼容**：标准 Python DB API
- ✅ **类型安全**：完整 Python 类型映射

### 同步用法

```python
from databend_driver import BlockingDatabendClient

# 连接并执行
client = BlockingDatabendClient('<your-dsn>')
cursor = client.cursor()

# DDL：创建表
cursor.execute("CREATE TABLE users (id INT, name STRING)")

# 写入：插入数据
cursor.execute("INSERT INTO users VALUES (?, ?)", (1, 'Alice'))

# 查询：读取数据
cursor.execute("SELECT * FROM users")
for row in cursor.fetchall():
    print(row.values())

cursor.close()
```

### 异步用法

```python
import asyncio
from databend_driver import AsyncDatabendClient

async def main():
    client = AsyncDatabendClient('<your-dsn>')
    conn = await client.get_conn()
    
    # DDL：创建表
    await conn.exec("CREATE TABLE users (id INT, name STRING)")
    
    # 写入：插入数据
    await conn.exec("INSERT INTO users VALUES (?, ?)", (1, 'Alice'))
    
    # 查询：读取数据
    rows = await conn.query_iter("SELECT * FROM users")
    async for row in rows:
        print(row.values())
    
    await conn.close()

asyncio.run(main())
```

---

## databend-sqlalchemy

用于 SQLAlchemy ORM 集成：

```python
from sqlalchemy import create_engine, text

engine = create_engine('<your-dsn>')
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print(result.fetchall())
```

---

## 数据类型映射

| Databend | Python | 说明 |
|---|---|---|
| **数值类型** | | |
| `BOOLEAN` | `bool` | |
| `TINYINT` | `int` | |
| `SMALLINT` | `int` | |
| `INT` | `int` | |
| `BIGINT` | `int` | |
| `FLOAT` | `float` | |
| `DOUBLE` | `float` | |
| `DECIMAL` | `decimal.Decimal` | 保留精度 |
| **日期/时间** | | |
| `DATE` | `datetime.date` | |
| `TIMESTAMP` | `datetime.datetime` | |
| `INTERVAL` | `datetime.timedelta` | |
| **文本/二进制** | | |
| `VARCHAR` | `str` | UTF-8 编码 |
| `BINARY` | `bytes` | |
| **复杂类型** | | |
| `ARRAY` | `list` | 支持嵌套结构 |
| `TUPLE` | `tuple` | |
| `MAP` | `dict` | |
| `VARIANT` | `str` | JSON 编码 |
| `BITMAP` | `str` | Base64 编码 |
| `GEOMETRY` | `str` | WKT 格式 |

## 相关资源

- **PyPI**: [databend-driver](https://pypi.org/project/databend-driver/) • [databend-sqlalchemy](https://pypi.org/project/databend-sqlalchemy/)
- **GitHub**: [databend-driver](https://github.com/databendlabs/databend-py) • [databend-sqlalchemy](https://github.com/databendlabs/databend-sqlalchemy)