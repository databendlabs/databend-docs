---
title: Integration Tasks
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

An integration task in Databend Cloud defines how data flows from a source into a target table in Databend. Each task references an existing data source and specifies source settings, a target warehouse, a target database / table, and runtime parameters that are specific to the task type.

Unlike data sources, integration tasks are the executable units that actually perform data movement and synchronization. Data sources store access settings, while tasks handle scheduling, ingestion, synchronization, stopping, resuming, and monitoring.

## Supported Task Types

| Task Type | Description |
|-----------|-------------|
| [Amazon S3](./01-s3.md) | Imports CSV, Parquet, or NDJSON files from Amazon S3 with support for one-time or continuous ingestion. |
| [MySQL](./02-mysql.md) | Synchronizes table data from MySQL using `Snapshot`, `CDC Only`, or `Snapshot + CDC`. |

## Reading Guide

Recommended reading order:

1. Start with [Task Management](./00-management.md) to understand the task creation flow, start / stop behavior, status, and run history.
2. Then read the task-specific guide for the source type you want to configure.

## Task Type Differences

- S3 tasks are designed for file import scenarios and mainly focus on file path patterns, file formats, and ingestion behavior.
- MySQL tasks are designed for table synchronization scenarios and mainly focus on sync modes, primary keys, incremental capture, and archive scheduling.

<IndexOverviewList />
