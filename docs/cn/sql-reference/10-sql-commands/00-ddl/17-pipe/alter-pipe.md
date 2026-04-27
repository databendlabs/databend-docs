---
title: ALTER PIPE
sidebar_position: 1
---

修改一个 pipe。

## 语法

```sql
ALTER PIPE [ IF EXISTS ] <name> SET PIPE_EXECUTION_PAUSED = <bool>
ALTER PIPE [ IF EXISTS ] <name> SET COMMENTS = '<comment>'
ALTER PIPE [ IF EXISTS ] <name> REFRESH [ PREFIX = '<prefix>' ] [ MODIFIED_AFTER = '<timestamp>' ]
```

## 示例

```sql
ALTER PIPE my_pipe SET PIPE_EXECUTION_PAUSED = true;
ALTER PIPE my_pipe REFRESH PREFIX = '2025/';
```
