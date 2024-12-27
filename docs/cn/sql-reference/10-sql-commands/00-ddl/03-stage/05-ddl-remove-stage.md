---
title: 移除 Stage 文件
sidebar_position: 5
---

从 Stage 中移除文件。

另请参阅：

- [列出 Stage 文件](04-ddl-list-stage.md)：列出 Stage 中的文件。
- [PRESIGN](presign.md)：Databend 推荐使用 Presigned URL 方法将文件上传到 Stage。

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

一个正则表达式模式字符串，用单引号括起来，用于通过文件名过滤要移除的文件。

## 示例

以下命令从名为 *playground* 的 Stage 中移除所有文件名匹配模式 *'ontime.*'* 的文件：

```sql
REMOVE @playground PATTERN = 'ontime.*'
```