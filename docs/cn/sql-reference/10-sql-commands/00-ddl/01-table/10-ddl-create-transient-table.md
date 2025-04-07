---
title: CREATE TRANSIENT TABLE
sidebar_position: 1
---

创建一个不存储时间回溯历史数据的表。

TRANSIENT TABLE 用于保存不需要数据保护或恢复机制的临时数据。Databend 不会为 TRANSIENT TABLE 保存历史数据，因此您将无法使用时间回溯功能从 TRANSIENT TABLE 的先前版本进行查询。例如，SELECT 语句中的 [AT](./../../20-query-syntax/03-query-at.md) 子句不适用于 TRANSIENT TABLE。请注意，您仍然可以 [drop](./20-ddl-drop-table.md) 和 [undrop](./21-ddl-undrop-table.md) TRANSIENT TABLE。

:::caution
对 TRANSIENT TABLE 的并发修改（包括写入操作）可能会导致数据损坏，从而导致数据无法读取。此缺陷正在解决中。在修复之前，请避免对 TRANSIENT TABLE 进行并发修改。
:::

## 语法

```sql
CREATE [ OR REPLACE ] TRANSIENT TABLE 
       [ IF NOT EXISTS ] 
       [ <database_name>. ]<table_name>
       ...
```

省略的部分遵循 [CREATE TABLE](10-ddl-create-table.md) 的语法。

## 示例

此示例创建一个名为 `visits` 的 TRANSIENT TABLE：

```sql
CREATE TRANSIENT TABLE visits (
  visitor_id BIGINT
);
```