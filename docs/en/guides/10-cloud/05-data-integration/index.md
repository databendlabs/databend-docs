---
title: Data Integration
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

The Data Integration feature in Databend Cloud enables you to load data from external sources into Databend through a visual, no-code interface. You can create data sources, configure integration tasks, and monitor synchronization — all from the Databend Cloud console.

## Supported Data Sources

| Data Source | Description                                                                                          |
|-------------|------------------------------------------------------------------------------------------------------|
| [MySQL](mysql)   | Sync data from MySQL databases with support for Snapshot, CDC, and Snapshot + CDC modes.        |
| [Amazon S3](s3)  | Import files from Amazon S3 buckets with support for CSV, Parquet, and NDJSON formats.          |

## Key Concepts

### Data Source

A data source represents a connection to an external system. It stores the credentials and connection details needed to access the source data. Once configured, a data source can be reused across multiple integration tasks.

Databend Cloud currently supports two types of data sources:
- **MySQL - Credentials**: Connection to a MySQL database (host, port, username, password, database).
- **AWS - Credentials**: Connection to Amazon S3 (Access Key and Secret Key).

### Integration Task

An integration task defines how data flows from a source to a target table in Databend. Each task specifies the source configuration, target warehouse and table, and operational parameters specific to the data source type.

## Managing Data Sources

![Data Sources Overview](/img/cloud/dataintegration/databendcloud-dataintegration-datasource-overview.png)

To manage data sources, navigate to **Data** > **Data Sources** from the left sidebar. From this page you can:

- View all configured data sources
- Create new data sources
- Edit or delete existing data sources
- Test connectivity to verify credentials

:::tip
It is recommended to always test the connection before saving a data source. This helps catch common issues such as incorrect credentials or network restrictions early.
:::

## Managing Tasks

### Starting and Stopping Tasks

After creation, a task is in a **Stopped** state. To begin data synchronization, click the **Start** button on the task.

![Task List](/img/cloud/dataintegration/dataintegration-task-list-with-action-button.png)

To stop a running task, click the **Stop** button. The task will gracefully shut down and save its progress.

### Task Status

The Data Integration page displays all tasks with their current status:

| Status      | Description                        |
|-------------|------------------------------------|
| Running     | Task is actively syncing data      |
| Stopped     | Task is not running                |
| Failed      | Task encountered an error          |

### Viewing Run History

Click on a task to view its execution history. The run history includes:

- Execution start and end times
- Number of rows synced
- Error details (if any)

![Run History](/img/cloud/dataintegration/dataintegration-run-history-page.png)

<IndexOverviewList />
