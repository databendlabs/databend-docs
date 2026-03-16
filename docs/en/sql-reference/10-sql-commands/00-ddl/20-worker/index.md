---
title: Worker
sidebar_position: 0
---

Worker-related SQL commands for managing sandbox UDF execution environments in Databend Cloud.

## Introduction

Workers are execution environments for User-Defined Functions (UDFs) in Databend Cloud's sandbox environment. Each worker corresponds to a single UDF, and the cloud starts the corresponding worker based on the function name. The Worker management interface provides full lifecycle control over these execution environments.

## General Rules

- **Worker naming**: Follows standard identifier naming conventions
- **Strings and identifiers**: Bare identifiers may omit quotes when they contain no spaces; otherwise enclose with single quotes
- **Numeric parameters**: Accept integers or string representations
- **Boolean parameters**: Accept `'true'`/`'false'` string values
- **Options**: Specified using `WITH` keyword followed by key-value pairs

## Worker Management

Tags are key-value pairs that help categorize and organize workers, similar to warehouse tags. They are commonly used for:

- **Environment identification**: Mark workers as dev, staging, or production
- **Purpose tracking**: Identify the purpose of the worker (e.g., sandbox, testing)
- **Ownership**: Identify which team or user owns the worker
- **Custom metadata**: Add any arbitrary metadata for organizational purposes

Tag keys and values are arbitrary strings. Tags can be:

- Added at worker creation time using options
- Updated or added later using `ALTER WORKER ... SET TAG key = 'value'`
- Removed using `ALTER WORKER ... UNSET TAG key`

## Supported Statements

| Statement         | Purpose                      | Notes                                                      |
| ----------------- | ---------------------------- | ---------------------------------------------------------- |
| `CREATE WORKER`   | Create a worker              | Supports `IF NOT EXISTS` and option list                   |
| `ALTER WORKER`    | Modify worker settings       | Supports `SET`, `UNSET`, `SET TAG`, `UNSET TAG`, `SUSPEND`, `RESUME` |
| `SHOW WORKERS`    | List workers                 | Shows all available workers                                |
| `DROP WORKER`     | Delete a worker              | Optional `IF EXISTS`                                       |

## Worker Management

| Command                             | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| [CREATE WORKER](create-worker.md)   | Creates a new worker for UDF execution            |
| [SHOW WORKERS](show-workers.md)     | Lists all workers                                 |
| [ALTER WORKER](alter-worker.md)     | Modifies worker settings and state                |
| [DROP WORKER](drop-worker.md)       | Removes a worker                                  |
| [Examples](examples.md)             | Comprehensive usage examples and best practices   |

:::note
A worker represents an execution environment for a specific UDF in Databend Cloud's sandbox. Each UDF has a corresponding worker that manages its runtime environment and resources.
:::

:::tip
Environment variables for UDFs are managed by the cloud for security reasons. After creating a UDF, users need to configure environment variables in the cloud console.
:::