---
title: REMOVE STAGE FILES
sidebar_position: 5
---

从 Stage 中删除文件。

另请参阅：

- [LIST STAGE FILES](04-ddl-list-stage.md)：列出 Stage 中的文件。
- [PRESIGN](presign.md)：Databend 建议使用 Presigned URL 方法将文件上传到 Stage。

## 语法

```sql
REMOVE { userStage | internalStage | externalStage } [ PATTERN = '<regex_pattern>' ]
```
其中：

### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<file>]
```

### externalStage

```sql
externalStage ::= @<external_stage_name>[/<file>]
```

### PATTERN = 'regex_pattern'

一个正则表达式模式字符串，用单引号括起来，用于按文件名过滤要删除的文件。

## 示例

此命令从名为 *playground* 的 Stage 中删除所有名称与模式 *'ontime.*'* 匹配的文件：

```sql
REMOVE @playground PATTERN = 'ontime.*'
```