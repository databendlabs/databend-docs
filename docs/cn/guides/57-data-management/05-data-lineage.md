---
title: 数据血缘
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.935"/>

:::note
数据血缘是[企业版功能](/guides/self-hosted/editions/enterprise/features)。私有化部署需要企业版或试用版许可证；Databend Cloud 已包含此功能。
:::

数据血缘用于展示数据如何从源对象流向目标对象。你可以使用数据血缘了解对象依赖关系、评估变更影响、排查数据管道问题，以及将派生列追溯到其源列。

Databend 会记录对象级和列级关系：

- **上游血缘（Upstream Lineage）**：标识为当前对象提供数据的表、视图或 Stage。
- **下游血缘（Downstream Lineage）**：标识使用当前对象数据的其他对象。
- **列级血缘（Column Lineage）**：展示源列到派生目标列的映射关系。

![Databend Cloud 中的表级和列级血缘](/img/guides/data-lineage.png)

## 启用数据血缘

对于提供 **Lineage** 页签的 Databend Cloud Warehouse，血缘配置由服务管理。私有化部署需要在每个 Query 节点的 `databend-query.toml` 中添加以下配置，然后重启节点：

```toml title="databend-query.toml"
[lineage]
on = true
```

默认情况下，血缘历史会永久保留。如需设置固定的保留时长，可通过 `retention` 指定小时数，例如：

```toml title="databend-query.toml"
[lineage]
on = true
retention = 720
```

完整配置说明请参见 [Query 节点配置](/guides/self-hosted/references/node-config/query-config#lineage-部分)。

## 生成血缘关系

启用数据血缘后，Databend 会自动记录由 `CREATE TABLE ... AS SELECT`、`CREATE VIEW`、`INSERT ... SELECT`、多表 `INSERT`、`REPLACE`、`MERGE` 和 `COPY` 等操作产生的关系。通过 Stream 读取数据时，血缘会解析到其底层表。

以下示例创建了一条包含两跳关系的血缘链路：

```sql
CREATE OR REPLACE DATABASE lineage_demo;

CREATE OR REPLACE TABLE lineage_demo.fact_orders (
    order_id BIGINT,
    customer_id BIGINT,
    amount DECIMAL(12, 2),
    order_time TIMESTAMP
);

CREATE OR REPLACE TABLE lineage_demo.agg_customer_sales AS
SELECT
    customer_id,
    sum(amount) AS total_amount,
    count(*) AS order_count,
    max(order_time) AS last_order_time
FROM lineage_demo.fact_orders
GROUP BY customer_id;

CREATE OR REPLACE TABLE lineage_demo.customer_segments AS
SELECT
    customer_id,
    total_amount,
    order_count,
    if(total_amount >= 1000, 'high_value', 'standard') AS segment,
    now() AS updated_at
FROM lineage_demo.agg_customer_sales;
```

## 查看血缘关系

在 Databend Cloud 中，通过 Database Explorer 打开一个表或视图，然后选择 **Lineage** 页签。血缘图会显示上下游对象；如果存在列级血缘，还会显示列之间的连接关系。

如需通过 SQL 查询血缘，请使用 [`GET_LINEAGE`](/sql/sql-functions/table-functions/get-lineage) 表函数：

```sql
SELECT
    distance,
    source_object_database,
    source_object_name,
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

查询列级血缘时，请使用带限定符的列名，并将对象域指定为 `COLUMN`：

```sql
SELECT
    distance,
    source_object_name,
    source_column_name,
    target_object_name,
    target_column_name
FROM GET_LINEAGE(
    'lineage_demo.customer_segments.segment',
    'COLUMN',
    'UPSTREAM',
    2
)
ORDER BY distance;
```

## 刷新现有视图的血缘

启用数据血缘后创建的视图会被自动追踪。如果部署中已存在视图，请先预览缺失或过期的关系，然后再进行刷新：

```sql
REFRESH LINEAGE FOR ALL VIEWS DRY RUN;
REFRESH LINEAGE FOR ALL VIEWS;
```

该命令会校准 `default` Catalog 中所有视图的血缘关系。结果只显示需要变更或无法处理的视图，不显示未发生变化的视图。执行命令需要全局 `SUPER` 权限。有关输出列的详细说明，请参见 [`REFRESH LINEAGE`](/sql/sql-commands/ddl/view/refresh-lineage)。

## 使用限制

- `GET_LINEAGE` 最多可遍历五跳关系。
- `system` 和 `information_schema` 中的对象不会作为血缘源记录。
- Stage 支持对象级血缘，但 Stage 文件字段无法提供稳定的列级映射。
- 外部 Catalog 对象可作为血缘端点显示，但不会继续跨越外部 Catalog 边界遍历。
- 查询结果仅包含当前角色可见的对象。
