---
title: UNDROP TABLE
sidebar_position: 20
---

恢复已删除表的最近版本。这利用了Databend的时间回溯功能；已删除的对象只能在保留期内（默认为24小时）恢复。

**另请参阅：**
- [CREATE TABLE](./10-ddl-create-table.md)
- [DROP TABLE](./20-ddl-drop-table.md)
- [SHOW TABLES](show-tables.md)

## 语法

```sql
UNDROP TABLE [ <database_name>. ]<table_name>
```

如果已存在同名表，则会返回错误。

## 示例

```sql
CREATE TABLE test(a INT, b VARCHAR);

-- 删除表
DROP TABLE test;

-- 显示当前数据库中已删除的表
SHOW TABLES HISTORY;

┌────────────────────────────────────────────────────┐
│ Tables_in_orders_2024 │          drop_time         │
├───────────────────────┼────────────────────────────┤
│ test                  │ 2024-01-23 04:56:34.766820 │
└────────────────────────────────────────────────────┘

-- 恢复表
UNDROP TABLE test;
```