---
title: CREATE PIPE
sidebar_position: 1
---

Creates a pipe backed by a `COPY INTO <table>` statement.

## Syntax

```sql
CREATE PIPE [ IF NOT EXISTS ] <name>
    [ AUTO_INGEST = TRUE ]
    [ COMMENT = '<comment>' | COMMENTS = '<comment>' ]
AS
COPY INTO <table> ...
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `IF NOT EXISTS` | Optional. Succeeds without changes if the pipe already exists. |
| `AUTO_INGEST = TRUE` | Optional. Enables automatic ingestion. |
| `COMMENT` / `COMMENTS` | Optional pipe comment. |
| `AS COPY INTO ...` | The `COPY INTO <table>` statement executed by the pipe. |

## Example

```sql
CREATE PIPE IF NOT EXISTS my_pipe
AUTO_INGEST = TRUE
COMMENTS = 'load staged files into target table'
AS
COPY INTO my_table
FROM @my_stage;
```
