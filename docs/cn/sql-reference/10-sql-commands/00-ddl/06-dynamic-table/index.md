---
title: 动态表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

动态表将查询结果存储在 Fuse 中。定义查询可以关联多个源表并聚合数据。创建动态表时会写入初始结果。之后，只有显式执行全量刷新，源表的变更才会反映到动态表中。

:::note
动态表支持手动全量刷新。源数据变更后，执行 `REFRESH DYNAMIC TABLE` 即可更新存储结果。如需定期刷新，可以由应用程序或外部调度器执行此命令。两次刷新之间，查询返回上次存储的结果。
:::

## 命令

| 命令 | 描述 |
|---------|-------------|
| [CREATE DYNAMIC TABLE](ddl-create-dynamic-table.md) | 定义动态表并写入初始查询结果。 |
| [REFRESH DYNAMIC TABLE](ddl-refresh-dynamic-table.md) | 从源表重新计算完整结果。 |
| [SHOW CREATE TABLE](../01-table/show-create-table.md) | 显示可重新执行的 `CREATE DYNAMIC TABLE` 语句。 |
| [DESCRIBE](../01-table/50-describe-table.md) | 显示输出列。 |
| [DROP TABLE](../01-table/20-ddl-drop-table.md) | 删除动态表。 |

使用 `SELECT` 按名称查询动态表。使用 `SHOW TABLES` 列出表。在 `system.tables` 中，动态表的 `table_type` 为 `DYNAMIC TABLE`。

## 选择派生对象

| 对象 | 查询返回的数据 | 维护方式 |
|--------|--------------------------|-------------|
| [视图](../05-view/ddl-create-view.md) | 基于源数据执行存储的查询。 | 不存储查询结果，无需刷新。 |
| [物化视图](../05-view/materialized-view.md) | 读取时修正尚未刷新的源表变更，返回当前结果。 | 对单个源表的仅追加变更支持增量刷新。 |
| 动态表 | 返回创建或上次成功刷新时存储的结果，即使源表已发生变更。 | 需要显式全量刷新。支持关联多个源表。 |

优化器不会将针对源表的查询替换为读取动态表。请在查询中直接引用动态表。

完整示例请参阅[动态表](/guides/load-data/continuous-data-pipelines/dynamic-table)。
