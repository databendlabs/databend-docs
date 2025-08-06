---
title: 驱动
---

Databend 为多种编程语言提供官方驱动，使您能够从应用程序连接并交互 Databend。

## 快速入门

1. **选择语言** - 从 Python、Go、Node.js、Java 或 Rust 中选择  
2. **获取连接字符串** - 使用下方 DSN 格式  
3. **安装并连接** - 参考各驱动的专属文档  

## 连接字符串（DSN）

所有 Databend 驱动均使用统一的 DSN（Data Source Name）格式：

```
databend://user:pass@host[:port]/[database][?sslmode=disable][&arg1=value1]
```

### 连接示例

| 部署方式         | 连接字符串                                                  |
|------------------|-------------------------------------------------------------|
| **自托管**       | `databend://user:pass@host:8000/database?sslmode=disable`   |
| **Databend Cloud** | `databend://user:pass@host:443/database?warehouse=wh`       |

### 参数参考

| 参数        | 描述                       | 自托管               | Databend Cloud | 示例                     |
|-------------|----------------------------|----------------------|----------------|--------------------------|
| `sslmode`   | SSL 模式                   | `disable`（必需）    | 不使用         | `?sslmode=disable`       |
| `warehouse` | Warehouse 名称             | 不使用               | 必需           | `?warehouse=compute_wh`  |

> **Databend Cloud**：[获取连接信息 →](/guides/cloud/using-databend-cloud/warehouses#obtaining-connection-information)

## 可用驱动

| 语言                   | 包                                     | 主要特性                                                                                             |
|------------------------|----------------------------------------|------------------------------------------------------------------------------------------------------|
| **[Python](./python)** | `databend-driver`<br/>`databend-sqlalchemy` | • 同步/异步支持<br/>• SQLAlchemy 方言<br/>• 兼容 PEP 249                                              |
| **[Go](./golang)**     | `databend-go`                          | • database/sql 接口<br/>• 连接池<br/>• 批量操作                                                        |
| **[Node.js](./nodejs)**| `databend-driver`                      | • TypeScript 支持<br/>• 基于 Promise 的 API<br/>• 流式结果                                             |
| **[Java](./jdbc)**     | `databend-jdbc`                        | • 兼容 JDBC 4.0<br/>• 连接池<br/>• 预处理语句                                                          |
| **[Rust](./rust)**     | `databend-driver`                      | • Async/await 支持<br/>• 类型安全查询<br/>• 零拷贝反序列化                                             |