---
title: CREATE SNAPSHOT TAG
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.891"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

在 FUSE 表上创建命名快照标签。快照标签为表的特定时间点状态创建书签，允许您稍后通过 [AT](../../20-query-syntax/03-query-at.md) 子句查询该状态。

:::note
- 这是一个实验性功能，需要先启用：`SET enable_experimental_table_ref = 1;`
- 仅支持 FUSE 引擎表，不支持 Memory 引擎表和临时表。
:::

## 语法

```sql
ALTER TABLE [<database_name>.]<table_name> CREATE TAG <tag_name>
    [ AT (
        SNAPSHOT => '<snapshot_id>' |
        TIMESTAMP => <timestamp> |
        STREAM => <stream_name> |
        OFFSET => <time_interval> |
        TAG => <tag_name>
    ) ]
    [ RETAIN <n> { DAYS | SECONDS } ]
```

## 参数

| 参数 | 说明 |
|------|------|
| tag_name | 标签名称，在表内必须唯一。 |
| AT | 指定标签引用的快照。如果省略，标签引用当前（最新）快照。支持与 [AT](../../20-query-syntax/03-query-at.md) 子句相同的选项，另外支持 `TAG` 从已有标签复制。 |
| RETAIN | 设置自动过期时间。超过指定时间后，标签将在下次 [VACUUM](/sql/sql-commands/ddl/table/vacuum-table) 操作时被移除。不带 `RETAIN` 的标签会一直存在直到显式删除。 |

## 示例

### 标记当前快照

```sql
SET enable_experimental_table_ref = 1;

CREATE TABLE t1(a INT, b STRING);
INSERT INTO t1 VALUES (1, 'a'), (2, 'b'), (3, 'c');

-- 在当前快照创建标签
ALTER TABLE t1 CREATE TAG v1_0;

-- 插入更多数据
INSERT INTO t1 VALUES (4, 'd'), (5, 'e');

-- 查询标签对应的快照（返回 3 行，而非 5 行）
SELECT * FROM t1 AT (TAG => v1_0) ORDER BY a;
```

### 从已有引用创建标签

```sql
-- 从已有标签复制
ALTER TABLE t1 CREATE TAG v1_0_copy AT (TAG => v1_0);

-- 标记特定快照
ALTER TABLE t1 CREATE TAG before_migration
    AT (SNAPSHOT => 'aaa4857c5935401790db2c9f0f2818be');

-- 标记 1 小时前的状态
ALTER TABLE t1 CREATE TAG hourly_checkpoint AT (OFFSET => -3600);
```

### 创建带自动过期的标签

```sql
-- 标签 7 天后过期
ALTER TABLE t1 CREATE TAG temp_tag RETAIN 7 DAYS;

-- 标签 3600 秒后过期
ALTER TABLE t1 CREATE TAG debug_snapshot RETAIN 3600 SECONDS;
```
