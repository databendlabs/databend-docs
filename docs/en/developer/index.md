---
title: Developer Resources
sidebar_position: -2
---

# Developer Resources

Build applications with Databend using our official drivers, APIs, and development tools.

## Drivers

Connect to Databend using native drivers for popular programming languages. All drivers support both Databend self-hosted and Databend Cloud deployments.

| Language | Package | Key Features | Documentation |
|----------|---------|-------------|---------------|
| **Go** | [databend-go](https://github.com/databendlabs/databend-go) | Standard database/sql interface, connection pooling | [View Guide](00-drivers/00-golang.md) |
| **Python** | [databend-driver](https://pypi.org/project/databend-driver/) | Sync/async support, SQLAlchemy dialect available | [View Guide](00-drivers/01-python.md) |
| **Node.js** | [databend-driver](https://www.npmjs.com/package/databend-driver) | TypeScript support, Promise-based API | [View Guide](00-drivers/02-nodejs.md) |
| **Java** | [databend-jdbc](https://github.com/databendcloud/databend-jdbc) | JDBC 4.0 compatible, prepared statements | [View Guide](00-drivers/03-jdbc.md) |
| **Rust** | [databend-driver](https://github.com/databendlabs/BendSQL/tree/main/driver) | Async/await support, type-safe queries | [View Guide](00-drivers/04-rust.md) |

## APIs

Databend provides REST APIs for direct integration and custom applications.

| API | Description | Use Cases |
|-----|-------------|----------|
| [HTTP API](10-apis/http.md) | RESTful interface for SQL execution and data operations | Custom integrations, direct SQL execution |

## Development Tools

- **[BendSQL CLI](/tutorials/getting-started/connect-to-databendcloud-bendsql)** - Command-line interface for Databend
- **[Databend Cloud Console](/guides/cloud/resources/worksheet)** - Web-based management interface

## Additional Resources

- **[Community](https://github.com/databendlabs/databend)** - Get help and share knowledge
