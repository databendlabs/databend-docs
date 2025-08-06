---
title: Drivers
---

Databend provides official drivers for multiple programming languages, enabling you to connect and interact with Databend from your applications.

## Quick Start

1. **Choose your language** - Select from Python, Go, Node.js, Java, or Rust
2. **Get your connection string** - Use the DSN format below
3. **Install and connect** - Follow the driver-specific documentation

## Connection String (DSN)

All Databend drivers use the same DSN (Data Source Name) format:

```
databend://user:pwd@host[:port]/[database][?sslmode=disable][&arg1=value1]
```

> The `user:pwd` refers to SQL users in Databend. See [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) to create users and grant privileges.

### Connection Examples

| Deployment | Connection String |
|------------|-------------------|
| **Self-hosted** | `databend://user:pwd@host:8000/database?sslmode=disable` |
| **Databend Cloud** | `databend://user:pwd@host:443/database?warehouse=wh` |

### Parameters Reference

| Parameter | Description | Self-hosted | Databend Cloud | Example |
|-----------|-------------|-------------|----------------|----------|
| `sslmode` | SSL mode | `disable` (required) | Not used | `?sslmode=disable` |
| `warehouse` | Warehouse name | Not used | Required | `?warehouse=compute_wh` |

> **Databend Cloud**: [Get connection info →](/guides/cloud/using-databend-cloud/warehouses#obtaining-connection-information)

## Available Drivers

| Language | Package | Key Features |
|----------|---------|-------------|
| **[Python](./python)** | `databend-driver`<br/>`databend-sqlalchemy` | • Sync/async support<br/>• SQLAlchemy dialect<br/>• PEP 249 compatible |
| **[Go](./golang)** | `databend-go` | • database/sql interface<br/>• Connection pooling<br/>• Bulk operations |
| **[Node.js](./nodejs)** | `databend-driver` | • TypeScript support<br/>• Promise-based API<br/>• Streaming results |
| **[Java](./jdbc)** | `databend-jdbc` | • JDBC 4.0 compatible<br/>• Connection pooling<br/>• Prepared statements |
| **[Rust](./rust)** | `databend-driver` | • Async/await support<br/>• Type-safe queries<br/>• Zero-copy deserialization |
