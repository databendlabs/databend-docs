---
title: SYSTEM$FUSE_AMEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.609"/>

从 S3 兼容的对象存储中恢复表数据。

## 语法

```sql
CALL SYSTEM$FUSE_AMEND('<database_name>', '<table_name>');
```

## 示例

此函数设计用于故障安全场景。详情请参阅[故障安全指南](/guides/security/fail-safe)。