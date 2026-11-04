---
title: CREATE TABLE ... CLONE
sidebar_label: CREATE TABLE ... CLONE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

创建一个独立的表。初始时，新表与源表共享不可变数据文件。新表具有独立的身份、元数据、所有权和授权。此后对任一表的写入都不会改变另一个表。

:::caution[实验性功能：请先升级所有相关节点]
默认禁止创建克隆表。只有所有相关 query、Meta 和维护节点都支持克隆感知协议后，才应启用 `enable_experimental_clone_table`。混合版本部署无法保证数据完整性和安全性。之后禁用创建功能，不会移除现有克隆，也不会关闭它们的克隆感知垃圾回收机制。
:::

## 语法

```sql
SET enable_experimental_clone_table = 1;

CREATE [ OR REPLACE ] TABLE [ IF NOT EXISTS ] [ <database>. ]<target>
CLONE [ <database>. ]<source>
[ AT (
    SNAPSHOT => <snapshot_id_expr>
  | TIMESTAMP => <timestamp_expr>
  | OFFSET => <offset_seconds_expr>
  | TAG => <tag_name>
) ];
```

`OR REPLACE` 和 `IF NOT EXISTS` 不能同时使用。不指定 `AT` 时，克隆使用源表的当前状态。`OFFSET` 是相对于绑定阶段确定的时间的非正秒数。`TAG` 接受标识符，而不是字符串字面量。不支持 `STREAM` 和 `BEFORE` 导航。

## 要求与限制

- 源表和目标表必须位于同一租户和 Catalog 中。默认 Catalog 内支持跨数据库克隆。
- 源表必须是托管 Fuse 表。不支持外部表、挂载表、只读表和临时表作为源表。
- 克隆语句不能添加列定义、`ENGINE`、`LOCATION`、`PARTITION BY`、`CLUSTER BY`、表选项、`PROPERTIES`、`TTL`、`AS SELECT`、`TRANSIENT` 或 `TEMPORARY`。克隆会继承源表属性。支持托管瞬态表作为源表，并继承其瞬态行为。
- 克隆使用源表的托管存储，而不是目标数据库的默认存储连接或路径。新文件使用目标表自己的存储前缀。
- 支持空表克隆和克隆表的再次克隆。删除源表不会使现有克隆失效。

## 访问控制与策略

调用者需要目标数据库的 `CREATE` 权限，以及对源表的 `SELECT` 访问权限。克隆是新的可授权对象。源表的授权不会被复制，请单独管理目标表授权。

克隆不同于 `CREATE TABLE AS SELECT`。它共享已存储的数据，而不是只复制查询可见的结果。当前的脱敏和行访问策略绑定会被继承并验证。查询克隆表时，仍然应用这些策略。移除源表上的策略绑定，不会移除克隆表的绑定。

## 示例

```sql
SET enable_experimental_clone_table = 1;

CREATE TABLE clone_source (id INT, payload STRING);
INSERT INTO clone_source VALUES (1, 'original');

CREATE TABLE clone_target CLONE clone_source;

INSERT INTO clone_source VALUES (2, 'source only');
INSERT INTO clone_target VALUES (3, 'clone only');

SELECT id FROM clone_source ORDER BY id;
-- 1
-- 2

SELECT id FROM clone_target ORDER BY id;
-- 1
-- 3
```

共享文件不等于完整复制数据。后续写入和保留的历史数据仍可能占用额外存储空间。

## 克隆历史快照

```sql
SET VARIABLE selected_snapshot = (
    SELECT snapshot_id
    FROM fuse_snapshot('default', 'clone_source')
    ORDER BY timestamp DESC
    LIMIT 1
);

CREATE TABLE clone_history CLONE clone_source
AT (SNAPSHOT => $selected_snapshot);

UNSET VARIABLE selected_snapshot;
```

历史克隆使用所选快照的表结构、聚簇信息和数据。未随快照进行版本化的当前语义元数据，例如约束和安全策略，必须与该结构兼容。元数据不兼容时，创建会失败，而不是静默移除保护。CLONE 会拒绝旧式的、基于名称的安全策略。

请求的历史时间点必须仍然可用。历史时间点不存在或已过期时，命令会失败，不会生成空克隆。Tag 不能绕过源表的最低可见时间（LVT）边界。LVT 是垃圾回收推进时用于保护可见性的下界。

## 保留策略与垃圾回收

克隆感知的 `VACUUM`、清除操作和已删除表清理会保护仍被克隆引用的数据，并遵循它们的保留策略。不要直接在对象存储中删除共享对象。

请注意以下限制：

- 历史 CLONE 不能发布低于源表 LVT 的快照。对克隆组成员执行 FLASHBACK 时，也会检查该成员的 LVT 边界，源表同样适用。即使带 Tag 的数据仍可读取，Tag 也不能绕过此边界。
- 加入克隆组后，源表写入也会受到 LVT 边界保护。并发执行零保留期 VACUUM，可能导致长时间写入因 `TableSnapshotExpired` 而失败。重试前，请检查保留策略和并发维护操作。
- 只要后代克隆绑定仍存在，已删除表清理就会保守地保留已删除祖先表的整个目录。即使后代已不再引用其文件，也可能无法回收这部分空间。

有关相关维护命令，请参阅 [VACUUM TABLE](91-vacuum-table.md) 和 [FLASHBACK TABLE](70-flashback-table.md)。
