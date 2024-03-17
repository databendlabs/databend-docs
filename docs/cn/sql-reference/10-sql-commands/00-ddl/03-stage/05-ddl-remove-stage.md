---
title: 从 Stage 中删除文件
sidebar_position: 5
---

从一个 Stage 中删除文件。

另请参阅：

- [列出 Stage 中的文件](04-ddl-list-stage.md)。
- [PRESIGN](presign.md)：Databend 推荐使用预签名 URL 方法上传文件到 Stage。

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

一个正则表达式模式字符串，用单引号括起来，通过文件名过滤要删除的文件。

## 示例

此命令从名为 _playground_ 的 Stage 中删除所有文件名匹配模式 _'ontime._'\* 的文件：

```sql
REMOVE @playground PATTERN = 'ontime.*'
```
