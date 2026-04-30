---
title: ALTER PIPE
sidebar_position: 1
---

Modifies a pipe.

## Syntax

```sql
ALTER PIPE [ IF EXISTS ] <name> SET PIPE_EXECUTION_PAUSED = <bool>
ALTER PIPE [ IF EXISTS ] <name> SET COMMENTS = '<comment>'
ALTER PIPE [ IF EXISTS ] <name> REFRESH [ PREFIX = '<prefix>' ] [ MODIFIED_AFTER = '<timestamp>' ]
```

## Example

```sql
ALTER PIPE my_pipe SET PIPE_EXECUTION_PAUSED = true;
ALTER PIPE my_pipe REFRESH PREFIX = '2025/';
```
