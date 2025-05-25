---
title: Connect to Databend
---

Databend supports multiple connection methods to suit different use cases. Choose the method that best fits your needs:

## SQL Clients & Tools

| Client | Type | Best For | Key Features |
|--------|------|----------|--------------|
| **[BendSQL](/guides/sql-clients/bendsql)** | Command Line | Developers, Scripts | Native CLI, Rich formatting, Multiple install options |
| **[DBeaver](/guides/sql-clients/jdbc)** | GUI Application | Data Analysis, Visual Queries | Built-in driver, Cross-platform, Query builder |

## Developer Drivers

| Language | Driver | Use Case | Documentation |
|----------|--------|----------|---------------|
| **Go** | Native Driver | Backend Applications | [Golang Guide](/guides/sql-clients/developers/golang) |
| **Python** | Python Connector | Data Science, Analytics | [Python Guide](/guides/sql-clients/developers/python) |
| **Node.js** | JavaScript Driver | Web Applications | [Node.js Guide](/guides/sql-clients/developers/nodejs) |
| **Java** | JDBC Driver | Enterprise Applications | [JDBC Guide](/guides/sql-clients/developers/jdbc) |
| **Rust** | Native Driver | System Programming | [Rust Guide](/guides/sql-clients/developers/rust) |

## Connection Methods

| Method | Security Level | Use Case | Setup Complexity |
|--------|----------------|----------|------------------|
| **Direct Connection** | Standard | Development, Testing | ⭐ Simple |
| **[AWS PrivateLink](/guides/sql-clients/privatelink)** | High | Production, Enterprise | ⭐⭐⭐ Advanced |
