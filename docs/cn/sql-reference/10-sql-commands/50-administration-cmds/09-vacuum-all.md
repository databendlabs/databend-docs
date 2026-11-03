---
title: VACUUM ALL
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

<EEFeature featureName='VACUUM ALL'/>

按顺序执行以下清理操作：

1. [VACUUM TABLES](09-vacuum-tables.md)：清理当前 Catalog 中所有非系统数据库内可写 FUSE 表的符合条件的历史数据。
2. [VACUUM DROPPED OBJECTS](09-vacuum-dropped-objects.md)：清理当前 Catalog 各数据库中符合条件的已删除对象，包括已删除的数据库。
3. [VACUUM TEMPORARY FILES](09-vacuum-temp-files.md)：使用默认保留策略清理租户的临时溢出文件和非活动临时表会话，不设置显式清理上限。

各步骤遵循各自的保留期和保护规则。活动表的当前数据会保留；已清理的历史数据和已删除对象无法恢复。临时溢出文件的保留期独立于 `data_retention_time_in_days`。

## 语法

```sql
VACUUM ALL
```

需要全局 `SUPER` 权限。不支持数据库筛选或命令选项。命令不返回结果集。

若某一步骤向上传递错误，执行会停止，不再运行后续步骤。批量清理内部处理的单表错误遵循 [VACUUM TABLES](09-vacuum-tables.md) 中的行为。已完成的清理不会回滚。

已删除对象清理步骤遵循[元数据兼容性](../00-ddl/01-table/91-vacuum-dropped-objects.md#metadata-compatibility)规则。命令成功后仍可能保留部分元数据。有关跳过无法解码的表、保留数据库以及仅清理已知退役引擎元数据的说明，请参阅该参考页面。

## 示例

```sql
VACUUM ALL;
```
