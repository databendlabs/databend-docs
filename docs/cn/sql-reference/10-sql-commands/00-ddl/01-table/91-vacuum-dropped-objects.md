---
title: VACUUM DROPPED OBJECTS
sidebar_position: 18
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

<EEFeature featureName='VACUUM DROPPED OBJECTS'/>

永久清理符合条件的已删除对象，回收其存储空间和元数据。这包括已删除的表，以及扫描所有数据库时发现的已删除数据库。已删除视图的元数据也会被清理。清理后的对象无法通过 UNDROP 恢复。

使用 [SHOW DROP TABLES](show-drop-tables.md) 列出数据库中已删除的表。要清理活动表的历史数据，请使用 [VACUUM TABLE](91-vacuum-table.md)。

## 语法

```sql
VACUUM DROPPED OBJECTS [FROM <database>]
```

| 参数 | 说明 |
|------|------|
| `FROM <database>` | 将清理范围限制为当前 Catalog 中的指定数据库。省略时扫描当前 Catalog 中的所有数据库，包括已删除的数据库。 |

指定 `FROM` 时，需要对该数据库具有 `SUPER` 访问权限。省略 `FROM` 时，需要全局 `SUPER` 权限。

命令不返回结果集。

## 保留期

已删除对象在超过 `data_retention_time_in_days` 配置的保留期后才符合清理条件（默认为 1 天）。存储和元数据一旦清理便无法恢复。

```sql
SET data_retention_time_in_days = 2;
SHOW SETTINGS LIKE 'data_retention_time_in_days';
```

<a id="metadata-compatibility"></a>

## 元数据兼容性

清理可以跳过元数据无法解码或引擎无法初始化的表，并保留其元数据及所在的已删除数据库。其他符合条件的对象仍可被清理，但命令完成并不表示所有对象都已回收。

对于已知退役的只读 `DELTA` 引擎，清理可以移除已删除表的元数据，但不会删除外部数据文件。此例外不适用于任意未知引擎。保留期及其他保护规则仍然适用。

如果仍有对象保留，请检查 Meta 和 Query Server 日志。跳过元数据不会修复它。不要手动删除被跳过的元数据或数据。

[VACUUM ALL](../../50-administration-cmds/09-vacuum-all.md) 的已删除对象清理步骤遵循这些规则。

## 示例

清理指定数据库中符合条件的已删除对象：

```sql
VACUUM DROPPED OBJECTS FROM default;
```

清理当前 Catalog 所有数据库中符合条件的已删除对象：

```sql
VACUUM DROPPED OBJECTS;
```
