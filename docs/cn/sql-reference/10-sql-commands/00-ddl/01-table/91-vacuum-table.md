---
title: VACUUM TABLE
sidebar_position: 17
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.940"/>

<EEFeature featureName='VACUUM TABLE'/>

永久删除 FUSE 表中符合清理条件的历史快照及其不再需要的 Segment、Block 和相关文件，回收存储空间。表及其当前数据仍然可用。

另请参阅：[VACUUM TABLES](../../50-administration-cmds/09-vacuum-tables.md)、[VACUUM DROPPED OBJECTS](91-vacuum-dropped-objects.md)、[VACUUM ALL](../../50-administration-cmds/09-vacuum-all.md)。

## 语法

```sql
VACUUM TABLE [<database>.]<table>
```

省略数据库名时使用当前数据库。命令在当前 Catalog 中执行，需要对目标表具有 `SUPER` 访问权限。仅支持可写的 FUSE 表。

命令不返回结果集。

## 保留期与快照标签

清理遵循 `data_retention_time_in_days` 设置（默认为 1 天）。已清理的历史数据无法再通过时间旅行查询或通过 Flashback 恢复。

未过期的[快照标签](../21-table-versioning/01-create-snapshot-tag.md)（包括未设置过期时间的标签）引用的快照及其关联数据受到保护，不会被清理。过期标签不再保护其快照。VACUUM 会尝试删除过期标签；删除过期标签失败不会中止清理。

通过会话设置调整后续清理操作的保留期：

```sql
SET data_retention_time_in_days = 2;
SHOW SETTINGS LIKE 'data_retention_time_in_days';
```

## 示例

创建表并修改数据，然后清理符合条件的历史数据：

```sql
CREATE OR REPLACE TABLE vacuum_example (id INT);
INSERT INTO vacuum_example VALUES (1), (2);
DELETE FROM vacuum_example WHERE id = 1;
VACUUM TABLE vacuum_example;
SELECT * FROM vacuum_example;
```

当前行仍然可用。新产生的历史数据会保留到符合清理条件时。

数据合并与存储回收是独立的操作。先合并表数据，再清理符合条件的历史文件：

```sql
OPTIMIZE TABLE vacuum_example COMPACT;
VACUUM TABLE vacuum_example;
```
