---
title: 物化视图（Materialized View）
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.934"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='物化视图'/>

物化视图会将查询结果物理存储。它只能基于 `default` catalog 中的一张持久化 FUSE 表创建。创建时，Databend 会自动为源表启用变更跟踪（change tracking）。

物化视图与逻辑视图不同：可使用显式刷新把源表变更持久化到物化视图中。即使物理存储尚未追上源表，读取结果也保持一致。首次刷新前，Databend 会直接根据源表执行定义查询；源表存在尚未刷新的变更时，Databend 会使用 **read fix**：在读取时将物化视图的已持久化存量数据与所需的源表增量数据 `UNION`，并将视图定义应用于该增量。因此查询会返回最新结果，而不是陈旧的物化数据。

## 限制

- 定义必须是基于一张基表的简单 `SELECT ... FROM ... [WHERE ...] [GROUP BY ...]` 查询。不支持 JOIN、子查询、集合运算和非确定性函数。
- 聚合仅支持 `sum`、`min`、`max`、`avg`、`count` 和 `approx_count_distinct`。不支持 `DISTINCT`、`FILTER`、窗口函数和带排序的聚合形式。
- 源表必须是 `default` catalog 中持久化的 FUSE 基表，不能以其他视图或其他表引擎作为源。
- 物化视图为只读对象。使用 `REFRESH MATERIALIZED VIEW` 维护数据；不支持 `INSERT`、`UPDATE`、`DELETE`、`TRUNCATE` 和普通的 `ALTER TABLE` 操作。

## 创建物化视图

```sql
CREATE [ OR REPLACE ] MATERIALIZED VIEW [ IF NOT EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<view_name>
  [ ( <column_name>, ... ) ]
  [ CLUSTER BY ( <expr>, ... ) ]
  [ COMMENT = '<comment>' ]
  [ <fuse_table_option> = <value> ... ]
AS <query>
```

使用 `CLUSTER BY` 时必须显式指定列名列表，并且聚簇键只能引用非聚合输出列或 `GROUP BY` 键。可选的 Fuse 表选项用于控制物理存储布局；支持的选项请参见 [CREATE TABLE](../01-table/10-ddl-create-table.md)。

创建仅记录定义，不会同步填充物理存储。请执行 `REFRESH MATERIALIZED VIEW` 来物化初始数据。

```sql
CREATE TABLE orders (
  order_id INT,
  customer_id INT,
  amount DECIMAL(10, 2),
  paid BOOLEAN
);

CREATE MATERIALIZED VIEW paid_orders_by_customer
  (customer_id, total_amount, order_count)
  CLUSTER BY (customer_id)
  COMMENT = '按客户汇总已支付订单'
AS
SELECT customer_id, sum(amount), count(*)
FROM orders
WHERE paid
GROUP BY customer_id;

REFRESH MATERIALIZED VIEW paid_orders_by_customer;
```

`CREATE OR REPLACE` 会替换已有物化视图；当同名对象已存在时，`IF NOT EXISTS` 不执行任何操作。

## 刷新物化视图

```sql
REFRESH MATERIALIZED VIEW [ <catalog_name>. ][ <database_name>. ]<view_name>
```

首次刷新会物化全部源表数据。后续刷新会增量处理仅追加（append-only）的变更。若源表发生 `UPDATE`、`DELETE` 或 `TRUNCATE`，Databend 会根据当前源表状态重建物化视图，确保结果正确。

## 修改物理布局

请使用专用的 `ALTER MATERIALIZED VIEW` 语法执行受支持的维护操作：

```sql
ALTER MATERIALIZED VIEW <view_name> CLUSTER BY ( <expr>, ... );
ALTER MATERIALIZED VIEW <view_name> DROP CLUSTER KEY;
ALTER MATERIALIZED VIEW <view_name> RECLUSTER [ FINAL ] [ LIMIT <n> ];
ALTER MATERIALIZED VIEW <view_name> SET OPTIONS ( <option> = <value>, ... );
ALTER MATERIALIZED VIEW <view_name> UNSET OPTIONS ( <option>, ... );
ALTER MATERIALIZED VIEW <view_name> COMMENT = '<comment>';
```

例如，在刷新前设置存储布局选项：

```sql
ALTER MATERIALIZED VIEW paid_orders_by_customer SET OPTIONS (row_per_block = 2);
REFRESH MATERIALIZED VIEW paid_orders_by_customer;
```

物化视图不支持 `RECLUSTER WHERE`。如需修改定义，请使用 `CREATE OR REPLACE MATERIALIZED VIEW`；`ALTER VIEW` 不适用。

<h3 id="optimize-mv-recluster">使用 OPTIMIZE TABLE 重聚簇</h3>

<FunctionDescription description="Introduced or updated: Unreleased"/>

使用 `OPTIMIZE TABLE` 对具有聚簇键的物化视图执行重聚簇。此操作仍需要 Enterprise 许可证。不支持 `WHERE`。

```sql
OPTIMIZE TABLE [catalog.][database.]view_name RECLUSTER [FINAL] [LIMIT <n>];
```

上文的 `ALTER MATERIALIZED VIEW ... RECLUSTER` 语法仍作为兼容别名保留。`ALTER TABLE ... RECLUSTER` 也能识别物化视图目标。这并不表示物化视图支持其他普通的 `ALTER TABLE` 操作。上文的其他布局修改仍需使用 `ALTER MATERIALIZED VIEW`。

重聚簇会重新组织物理存储。它不能替代 `REFRESH MATERIALIZED VIEW`。有关执行注意事项，请参阅 [RECLUSTER TABLE](../06-clusterkey/dml-recluster-table.md#optimize-recluster)。有关统一语法，请参阅 [OPTIMIZE TABLE](../01-table/60-optimize-table.md#recluster-syntax)。

## 查看和删除定义

```sql
SHOW MATERIALIZED VIEWS
  [ { FROM | IN } <database_name> ]
  [ LIKE '<pattern>' | WHERE <expr> ];

SHOW CREATE MATERIALIZED VIEW
  [ <catalog_name>. ][ <database_name>. ]<view_name>;

DROP MATERIALIZED VIEW [ IF EXISTS ]
  [ <catalog_name>. ][ <database_name>. ]<view_name>;
```

```sql
SHOW MATERIALIZED VIEWS LIKE 'paid_orders%';
SHOW CREATE MATERIALIZED VIEW paid_orders_by_customer;
DROP MATERIALIZED VIEW IF EXISTS paid_orders_by_customer;
```

## 访问控制要求

<FunctionDescription description="Introduced or updated: Unreleased"/>

直接读取需要对物化视图拥有有效的 `SELECT` 权限。数据库级 `SELECT` 授权（`db.*`）或全局 `SELECT` 授权（`*.*`）也允许此类读取。仅拥有源表的 `SELECT` 权限不再允许直接读取物化视图。

管理员可以向已有角色授予访问权限：

```sql
GRANT SELECT ON MATERIALIZED VIEW default.paid_orders_by_customer TO ROLE reader;
```

使用该有效角色的用户可以查询物化视图，无需源表访问权限。此规则适用于首次刷新前、刷新后，以及读取包含尚未刷新的源表变更时。同一查询中显式引用源表仍需源表访问权限。优化器对源表查询进行改写时，仍要求源表 `SELECT`，不要求物化视图 `SELECT`。

创建物化视图需要数据库 `CREATE` 和源表 `SELECT`。创建不会自动授予物化视图的所有权或 `SELECT`。此规则同样适用于创建者。升级前，请向此前仅依赖源表访问权限的读取者授予物化视图 `SELECT`。已有有效数据库级或全局 `SELECT` 授权的用户无需额外的单视图授权。

`system.materialized_views` 的可见性取决于有效的物化视图 `SELECT`。物化视图 `SELECT` 不授予维护权限。现有管理权限要求不变。例如，刷新和查看定义仍需源表 `SELECT` 或等效访问权限。删除物化视图仍需数据库 `DROP`。重命名源表不会改变基于源表对象身份的检查。

对象级授权和撤销必须使用 `ON MATERIALIZED VIEW`。对物化视图使用普通的 `ON db.view_name` 语法会被拒绝。`ON MATERIALIZED VIEW` 不支持 `GRANT ALL` 或通配符目标。使用以下语句撤销单视图授权：

```sql
REVOKE SELECT ON MATERIALIZED VIEW default.paid_orders_by_customer FROM ROLE reader;
```

`REVOKE ALL [PRIVILEGES] ON MATERIALIZED VIEW` 还会移除该对象上旧版本保留的权限。它不会撤销更大范围的数据库级或全局授权。参见 [GRANT](../02-user/10-grant.md#授予物化视图权限) 和 [REVOKE](../02-user/11-revoke.md#撤销物化视图权限)。
