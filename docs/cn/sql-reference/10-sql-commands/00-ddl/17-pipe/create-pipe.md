---
title: CREATE PIPE
sidebar_position: 1
---

创建一个基于 `COPY INTO <table>` 语句的 pipe。

## 语法

```sql
CREATE PIPE [ IF NOT EXISTS ] <name>
    [ AUTO_INGEST = TRUE ]
    [ COMMENT = '<comment>' | COMMENTS = '<comment>' ]
AS
COPY INTO <table> ...
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `IF NOT EXISTS` | 可选。如果 pipe 已存在，则成功返回但不做修改。 |
| `AUTO_INGEST = TRUE` | 可选。启用自动导入。 |
| `COMMENT` / `COMMENTS` | 可选的 pipe 备注。 |
| `AS COPY INTO ...` | pipe 执行的 `COPY INTO <table>` 语句。 |

## 示例

```sql
CREATE PIPE IF NOT EXISTS my_pipe
AUTO_INGEST = TRUE
COMMENTS = 'load staged files into target table'
AS
COPY INTO my_table
FROM @my_stage;
```
