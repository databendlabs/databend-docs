---
title: REFRESH LINEAGE
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.935"/>

:::note
数据血缘是[企业版功能](/guides/self-hosted/editions/enterprise/features)。私有化部署需要企业版或试用版许可证；Databend Cloud 已包含此功能。
:::

回填或校准 `default` Catalog 中现有视图的血缘关系。在已有视图的部署中启用数据血缘后，请使用此命令进行回填。启用数据血缘后创建的视图会被自动追踪。

执行此命令需要全局 `SUPER` 权限，并且必须已启用数据血缘。请参见[数据血缘](/guides/data-management/data-lineage#启用数据血缘)。

## 语法

```sql
REFRESH LINEAGE FOR ALL VIEWS [ DRY RUN ]
```

`DRY RUN` 只计算并报告变更，不会写入数据。建议先使用该选项检查刷新将执行的操作。

## 输出列

| 列 | 描述 |
|----|------|
| `object_domain` | 对象域，当前为 `VIEW`。 |
| `catalog` | 视图所属的 Catalog，当前为 `default`。 |
| `database` | 视图所属的数据库。 |
| `object_name` | 视图名称。 |
| `status` | `DRY_RUN`、`REFRESHED` 或 `ERROR`。 |
| `edge_count` | 当前视图定义中发现的血缘边数量。 |
| `upsert_count` | 需要新增或更新的缺失或已变更血缘边数量。 |
| `delete_count` | 需要删除的过期血缘边数量。 |
| `error` | `status` 为 `ERROR` 时的错误信息；其他情况为 `NULL`。 |

没有变更且处理成功的视图不会出现在结果中。

## 示例

预览现有视图需要执行的变更：

```sql
REFRESH LINEAGE FOR ALL VIEWS DRY RUN;
```

应用变更：

```sql
REFRESH LINEAGE FOR ALL VIEWS;
```

命令完成后，可通过 [`GET_LINEAGE`](/sql/sql-functions/table-functions/get-lineage) 查询视图的上游血缘：

```sql
SELECT
    distance,
    source_object_database,
    source_object_name,
    target_object_database,
    target_object_name
FROM GET_LINEAGE(
    'lineage_demo.sales_view',
    'VIEW',
    'UPSTREAM',
    1
);
```

:::note
如需修改逻辑视图定义，请使用 [`CREATE OR REPLACE VIEW`](ddl-create-view.md)。不支持 `ALTER VIEW ... AS ...`，因为不重新创建视图就修改定义可能导致已持久化的血缘关系不一致。
:::
