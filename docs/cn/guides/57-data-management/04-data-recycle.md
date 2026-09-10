---
title: 数据清理与回收
sidebar_label: 数据回收
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.940"/>

## 概述

删除行或删除表不一定会立即释放存储空间。Databend 会保留历史数据和已删除对象，以便恢复。VACUUM 在数据符合清理条件后回收存储空间。

以下 VACUUM 命令需要[企业版许可证](/guides/self-hosted/editions/enterprise/features)。清理后的历史数据和已删除对象无法恢复。

## 选择清理范围

| 命令 | 清理范围 | 效果 |
|------|----------|------|
| [VACUUM TABLE](/sql/sql-commands/ddl/table/vacuum-table) | 单个可写 FUSE 表 | 清理符合条件的历史数据，保留表及其当前数据。 |
| [VACUUM TABLES](/sql/sql-commands/administration-cmds/vacuum-tables) | 指定数据库或当前 Catalog 所有非系统数据库中的可写 FUSE 表 | 批量执行相同的历史数据清理。 |
| [VACUUM DROPPED OBJECTS](/sql/sql-commands/ddl/table/vacuum-dropped-objects) | 指定数据库或当前 Catalog 所有数据库中的已删除对象，包括已删除的数据库 | 清理符合条件的已删除对象及其存储和元数据。 |
| [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files) | 租户的临时溢出文件和非活动临时表会话 | 清理临时存储。 |
| [VACUUM ALL](/sql/sql-commands/administration-cmds/vacuum-all) | 依次清理表历史数据、已删除对象和临时文件 | 按各步骤的保留规则依次执行三项清理。 |

单表清理需要对该表具有 `SUPER` 访问权限。指定数据库的批量清理或已删除对象清理需要对该数据库具有 `SUPER` 访问权限。未指定 FROM 的批量表清理和已删除对象清理、VACUUM ALL 以及临时文件清理需要全局 `SUPER` 权限。

批量表清理跳过非 FUSE 表和只读表。普通的单表失败会记录到日志中，并继续处理其他表；取消操作以及列出数据库或表时发生的错误可能中止执行。这些命令均不返回结果集。

## 清理表历史数据

```sql
VACUUM TABLE default.my_table;
```

数据合并会合并较小的 Block 和 Segment。先合并数据，再回收符合条件的历史数据占用的存储空间：

```sql
OPTIMIZE TABLE default.my_table COMPACT;
VACUUM TABLE default.my_table;
```

批量清理：

```sql
-- One database
VACUUM TABLES FROM default;

-- All non-system databases in the current catalog
VACUUM TABLES;
```

## 清理已删除对象

```sql
-- One database
VACUUM DROPPED OBJECTS FROM default;

-- All databases in the current catalog, including dropped databases
VACUUM DROPPED OBJECTS;
```

命令会清理符合条件的已删除对象及其元数据和存储。清理后无法再通过 UNDROP 恢复。

## 清理临时文件或执行全部步骤

```sql
VACUUM TEMPORARY FILES;
```

依次执行表历史数据、已删除对象和临时文件清理：

```sql
VACUUM ALL;
```

若某一步骤向上传递错误，后续步骤将不再执行。已完成的清理不会回滚。

## 保留期与保护规则

表历史数据和已删除对象使用 `data_retention_time_in_days` 设置（默认为 1 天）。例如，为当前会话设置 2 天的保留期：

```sql
SET data_retention_time_in_days = 2;
SHOW SETTINGS LIKE 'data_retention_time_in_days';
```

活动表清理会保留未过期快照标签引用的快照及数据，包括未设置过期时间的标签。过期标签不再保护历史数据；VACUUM 会尝试删除过期标签，标签删除失败不会中止清理。

临时溢出文件采用独立的保留期，默认为 3 天。可使用 RETAIN 覆盖该值；此选项不设置临时表会话的存活时间：

```sql
VACUUM TEMPORARY FILES RETAIN 2 DAYS;
```
