---
title: Node.js
---

# Node.js 驱动

官方 Node.js 驱动，为现代 JavaScript 应用程序提供 TypeScript 支持和基于 Promise 的 API。

## 安装

```bash
npm install databend-driver
```

**连接字符串**：关于 DSN 格式和连接示例，请参阅[驱动程序概述](./index.md#connection-string-dsn)。

---

## 主要特性

- ✅ **TypeScript 支持**：包含完整的 TypeScript 定义
- ✅ **基于 Promise 的 API**：支持现代的 async/await
- ✅ **流式结果**：高效处理大型结果集
- ✅ **连接池**：内置连接管理

## 数据类型映射

| Databend | Node.js | 说明 |
|----------|---------|-------------------|
| **基本类型** | | |
| `BOOLEAN` | `boolean` | |
| `TINYINT` | `number` | |
| `SMALLINT` | `number` | |
| `INT` | `number` | |
| `BIGINT` | `number` | |
| `FLOAT` | `number` | |
| `DOUBLE` | `number` | |
| `DECIMAL` | `string` | 保留精度 |
| `STRING` | `string` | |
| **日期/时间** | | |
| `DATE` | `Date` | |
| `TIMESTAMP` | `Date` | |
| **复杂类型** | | |
| `ARRAY(T)` | `Array` | |
| `TUPLE(...)` | `Array` | |
| `MAP(K,V)` | `Object` | |
| `VARIANT` | `string` | JSON 编码 |
| `BINARY` | `Buffer` | |
| `BITMAP` | `string` | Base64 编码 |

---

## 基本用法

```javascript
const { Client } = require('databend-driver');

// 连接到 Databend
const client = new Client('<your-dsn>');
const conn = await client.getConn();

// DDL：创建表
await conn.exec(`CREATE TABLE users (
    id INT,
    name STRING,
    email STRING
)`);

// 写入：插入数据
await conn.exec("INSERT INTO users VALUES (?, ?, ?)", [1, "Alice", "alice@example.com"]);

// 查询：选择数据
const rows = await conn.queryIter("SELECT id, name, email FROM users WHERE id = ?", [1]);
for await (const row of rows) {
    console.log(row.values());
}

conn.close();
```

## 相关资源

- **NPM 包**：[databend-driver](https://www.npmjs.com/package/databend-driver)
- **GitHub 仓库**：[databend-js](https://github.com/databendlabs/databend-js)
- **TypeScript 定义**：包含在包中