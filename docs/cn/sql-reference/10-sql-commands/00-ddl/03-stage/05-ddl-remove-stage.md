---
title: 移除STAGE文件
sidebar_position: 5
---

从STAGE中移除文件。

另请参阅:

- [LIST STAGE FILES](04-ddl-list-stage.md): 列出STAGE中的文件。
- [PRESIGN](presign.md): Databend建议使用预签名URL方法将文件上传到STAGE。

## 语法

```sql
REMOVE { userStage | internalStage | externalStage } [ PATTERN = '<regex_pattern>' ]
```
其中:

### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<file>]
```

### externalStage

```sql
externalStage ::= @<external_stage_name>[/<file>]
```

### PATTERN = 'regex_pattern'

一个正则表达式模式字符串，用单引号括起来，根据文件名过滤要移除的文件。

## 示例

此命令从名为*playground*的STAGE中移除所有名称匹配模式*'ontime.*'*的文件:

```sql
REMOVE @playground PATTERN = 'ontime.*'
```