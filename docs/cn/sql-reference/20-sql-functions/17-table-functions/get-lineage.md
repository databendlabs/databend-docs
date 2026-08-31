---
title: GET_LINEAGE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.935"/>

返回表、视图、Stage 或列的上游或下游血缘。结果中的每一行表示血缘路径中的一条源对象到目标对象的关系。

在私有化部署中使用该函数之前，需要先在 `databend-query.toml` 中启用数据血缘。请参见[数据血缘](/guides/data-management/data-lineage#启用数据血缘)。

## 语法

```sql
GET_LINEAGE(
    '<object_name>',
    '<object_domain>',
    '<direction>'
    [, <distance> ]
)
```

## 参数

| 参数 | 描述 |
|------|------|
| `object_name` | 查询起点。表或视图使用 `[catalog.]database.object`，Stage 使用 `stage_name`，列使用 `[catalog.]database.object.column`。省略 Catalog 或数据库时，将使用当前会话中的值。 |
| `object_domain` | 对象类型：`TABLE`、`VIEW`、`STAGE` 或 `COLUMN`。 |
| `direction` | `UPSTREAM` 表示向数据源方向追溯；`DOWNSTREAM` 表示向数据使用方方向追溯。 |
| `distance` | 可选的最大遍历跳数，取值范围为 `1` 到 `5`，默认为 `5`。 |

所有参数均为位置参数。

## 输出列

| 列 | 类型 | 描述 |
|----|------|------|
| `source_object_catalog` | Nullable(String) | 源对象所属的 Catalog；Stage 为 `NULL`。 |
| `source_object_database` | Nullable(String) | 源对象所属的数据库；Stage 为 `NULL`。 |
| `source_object_name` | Nullable(String) | 源对象名称。 |
| `source_object_domain` | Nullable(String) | 源对象域：`TABLE`、`VIEW` 或 `STAGE`。 |
| `source_column_name` | Nullable(String) | 列级血缘中的源列；非列级血缘为 `NULL`。 |
| `source_status` | String | `ACTIVE`；如果源列应用了 Masking Policy，则为 `MASKED`。 |
| `target_object_catalog` | Nullable(String) | 目标对象所属的 Catalog；Stage 为 `NULL`。 |
| `target_object_database` | Nullable(String) | 目标对象所属的数据库；Stage 为 `NULL`。 |
| `target_object_name` | Nullable(String) | 目标对象名称。 |
| `target_object_domain` | Nullable(String) | 目标对象域：`TABLE`、`VIEW` 或 `STAGE`。 |
| `target_column_name` | Nullable(String) | 列级血缘中的目标列；非列级血缘为 `NULL`。 |
| `target_status` | String | `ACTIVE`；如果目标列应用了 Masking Policy，则为 `MASKED`。 |
| `distance` | Int32 | 相对于查询起点的跳数。直接关系的距离为 `1`。 |
| `process` | Nullable(String) | 创建该关系的操作元数据，采用 JSON 字符串格式，例如 Query ID、查询文本、用户、时间和血缘类型。 |

## 示例

### 查询上游表

以下查询返回 `agg_customer_sales` 两跳以内的上游关系：

```sql
SELECT
    distance,
    source_object_catalog,
    source_object_database,
    source_object_name,
    source_object_domain,
    target_object_database,
    target_object_name
FROM GET_LINEAGE(
    'lineage_demo.agg_customer_sales',
    'TABLE',
    'UPSTREAM',
    2
)
ORDER BY distance;
```

### 查询下游列

以下查询追踪 `fact_orders.amount` 被哪些列使用：

```sql
SELECT
    distance,
    source_object_name,
    source_column_name,
    target_object_name,
    target_column_name
FROM GET_LINEAGE(
    'lineage_demo.fact_orders.amount',
    'COLUMN',
    'DOWNSTREAM',
    5
)
ORDER BY distance, target_object_name, target_column_name;
```

## 使用说明

- 如果对象存在但没有已记录的血缘，函数将返回空结果。
- 查询结果会根据当前角色的对象可见性进行过滤。
- Stage 仅支持对象级关系；Stage 文件字段不会作为稳定列返回。
- `system` 和 `information_schema` 中的对象不会被记录为血缘源。
- 外部 Catalog 对象会作为终止端点返回，不会继续向外部 Catalog 内部遍历。
- 对于启用数据血缘之前已存在的视图，请使用 [`REFRESH LINEAGE`](/sql/sql-commands/ddl/view/refresh-lineage) 回填血缘关系。
