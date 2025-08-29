---
title: Administration Commands
---

This page provides reference information for the system administration commands in Databend.

## System Monitoring

| Command | Description |
|---------|-------------|
| **[SHOW PROCESSLIST](07-show-processlist)** | Display active queries and connections |
| **[SHOW METRICS](08-show-metrics)** | View system performance metrics |
| **[KILL](01-kill)** | Terminate running queries or connections |
| **[RUST BACKTRACE](rust-backtrace)** | Debug Rust stack traces |

## Configuration Management

| Command | Description |
|---------|-------------|
| **[SET](02-set-global)** | Set global configuration parameters |
| **[UNSET](02-unset)** | Remove configuration settings |
| **[SET VARIABLE](03-set-var)** | Manage user-defined variables |
| **[SHOW SETTINGS](03-show-settings)** | Display current system settings |

## Function Management

| Command | Description |
|---------|-------------|
| **[SHOW FUNCTIONS](04-show-functions)** | List built-in functions |
| **[SHOW USER FUNCTIONS](05-show-user-functions)** | List user-defined functions |
| **[SHOW TABLE FUNCTIONS](06-show-table-functions)** | List table-valued functions |

## Storage Maintenance

| Command | Description |
|---------|-------------|
| **[VACUUM TABLE](09-vacuum-table)** | Reclaim storage space from tables |
| **[VACUUM DROP TABLE](09-vacuum-drop-table)** | Clean up dropped table data |
| **[VACUUM TEMP FILES](09-vacuum-temp-files)** | Remove temporary files |
| **[SHOW INDEXES](show-indexes)** | Display table indexes |

## Dynamic Execution

| Command | Description |
|---------|-------------|
| **[EXECUTE IMMEDIATE](execute-immediate)** | Execute dynamically constructed SQL statements |