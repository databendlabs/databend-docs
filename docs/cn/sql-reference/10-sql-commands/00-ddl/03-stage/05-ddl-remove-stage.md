---
title: 删除阶段文件
sidebar_position: 5
---

从一个阶段中删除文件。

另请参阅：

- [列出阶段文件](04-ddl-list-stage.md)：列出阶段中的文件。
- [PRESIGN](presign.md)：Databend推荐使用预签名URL方法上传文件到阶段。

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

此命令从名为 *playground* 的阶段中删除所有文件名匹配模式 *'ontime.*'* 的文件：

```sql
REMOVE @playground PATTERN = 'ontime.*'
```