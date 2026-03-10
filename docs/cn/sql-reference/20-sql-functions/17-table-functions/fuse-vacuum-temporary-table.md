---
title: FUSE_VACUUM_TEMPORARY_TABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.666"/>

## 概述

临时表通常在会话结束时自动清理（详见 [CREATE TEMP TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-temp-table.md)）。但是，由于查询节点崩溃或会话异常终止等事件，此过程可能会失败，从而留下孤立的临时文件。

`FUSE_VACUUM_TEMPORARY_TABLE()` 手动删除这些剩余文件以回收存储空间。

**何时使用此函数：**
- 在已知的系统故障或会话异常终止之后。
- 如果您怀疑孤立的临时数据正在消耗存储空间。
- 作为容易出现此类问题的环境中的定期维护任务。

## 操作安全

`FUSE_VACUUM_TEMPORARY_TABLE()` 函数被设计为安全可靠的操作。
- **仅针对临时数据：** 它专门识别并删除仅属于临时表的孤立数据和元数据文件。
- **对常规表无影响：** 该函数不会影响任何常规的持久表或其数据。其范围严格限于清理未引用的临时表残余。

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