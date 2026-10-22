---
title: REFRESH DYNAMIC TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.945"/>

重新执行动态表的定义查询，并替换其完整存储结果。此命令不会仅处理上次刷新后的变更。

## 语法

```sql
REFRESH DYNAMIC TABLE
  [ <catalog_name>. ][ <database_name>. ]<table_name>
```

`table_name` 必须是现有动态表。此命令不能刷新普通表或物化视图。

## 刷新行为

- 刷新提交前，查询仍返回上次存储的结果。读取者只能看到旧结果或新结果，不会看到部分替换的结果。
- 刷新失败时，之前存储的结果仍然可用。
- 如果定义查询不返回任何行，刷新成功后动态表将变为空表。
- 刷新会重新计算完整查询，因此可以反映源表的插入、更新和删除。
- 同一目标表的刷新由目标表锁串行执行。该锁不会阻止源表上的 DDL 操作。
- 刷新遵循普通查询的读取语义，不提供固定的跨表事务快照。

刷新需要动态表的 `SELECT` 权限，以及定义查询读取的所有源表的 `SELECT` 权限。

## 源表身份

Databend 在创建时记录源表 ID。刷新时会检查存储的查询是否仍然解析为相同的源表 ID。

删除源表后，动态表中已有的数据仍可读取。如果源表不存在，刷新会失败。删除源表后创建同名新表并不能修复依赖关系。要使用新源表，请重新创建动态表。

## 示例

本示例使用 [CREATE DYNAMIC TABLE](ddl-create-dynamic-table.md#示例) 中的表。请先执行该示例至第一个 `SELECT`，不要执行清理命令。

```sql
INSERT INTO orders VALUES (3, 10, 300);

-- The stored result still contains the previous totals.
SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          100 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

```sql
REFRESH DYNAMIC TABLE customer_totals;

SELECT customer_name, total_amount
FROM customer_totals
ORDER BY customer_name;
```

```text
┌───────────────┬──────────────┐
│ customer_name │ total_amount │
├───────────────┼──────────────┤
│ alice         │          400 │
│ bob           │          200 │
└───────────────┴──────────────┘
```

没有内置的自动刷新机制。应用程序或外部调度器必须在需要时执行 `REFRESH DYNAMIC TABLE`。源表较大时，全量刷新可能产生较高开销。
