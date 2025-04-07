---
title: SYSTEM$FUSE_AMEND
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.609"/>

从 S3 兼容的对象存储中恢复表数据。

## 语法

```sql
CALL SYSTEM$FUSE_AMEND('<database_name>', '<table_name>');
```

## 示例

此函数专为故障安全场景而设计。 有关详细信息，请参见 [Fail-Safe 指南](/guides/security/fail-safe)。