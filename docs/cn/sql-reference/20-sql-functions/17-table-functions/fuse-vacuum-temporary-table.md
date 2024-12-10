---
title: FUSE_VACUUM_TEMPORARY_TABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.666"/>

清理未自动删除的临时表的残留文件，例如在查询节点崩溃后。

## 语法

```sql
FUSE_VACUUM_TEMPORARY_TABLE();
```

## 示例

```sql
SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE();

┌────────┐
│ result │
├────────┤
│ Ok     │
└────────┘
```