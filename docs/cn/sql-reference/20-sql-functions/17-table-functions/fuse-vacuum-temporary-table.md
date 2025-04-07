---
title: FUSE_VACUUM_TEMPORARY_TABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

清理未自动删除的临时表中的剩余文件，例如在查询节点崩溃之后。

## Syntax

```sql
FUSE_VACUUM_TEMPORARY_TABLE();
```

## Examples

```sql
SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE();

┌────────┐
│ result │
├────────┤
│ Ok     │
└────────┘
```