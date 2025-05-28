---
title: Connect to Databend
---

Databend supports multiple connection methods to suit different use cases. All SQL clients and drivers below work with both Databend Cloud and self-hosted Databend deployments - <span class="text-blue">the only difference is how you obtain your connection string</span>.

## Obtaining Connection Strings

| Deployment | How to Get Connection String | Connection Format |
|------------|------------------------------|-------------------|
| **Databend Cloud** | 1. Log in to [Databend Cloud](https://app.databend.com)<br/>2. Click **Connect** on the Overview page<br/>3. Select your database and warehouse<br/>4. Copy the generated connection details | `databend://<username>:<password>@<tenant>.gw.<region>.default.databend.com:443/<database>?warehouse=<warehouse_name>` |
| **Self-Hosted** | Use your deployment information:<br/>• Default user: `root` (or custom SQL user)<br/>• Host: your server address (e.g., `localhost`) | `databend://<username>:<password>@<hostname>:<port>/<database>` |

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
