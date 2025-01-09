---
title: CREATE TRANSIENT TABLE
sidebar_position: 1
---

创建一个不存储其历史数据以供时间回溯的表。

临时表用于保存不需要数据保护或恢复机制的临时数据。Databend 不会保存临时表的历史数据，因此您将无法使用时间回溯功能查询临时表的先前版本，例如，SELECT 语句中的 [AT](./../../20-query-syntax/03-query-at.md) 子句将不适用于临时表。请注意，您仍然可以 [删除](./20-ddl-drop-table.md) 和 [恢复](./21-ddl-undrop-table.md) 临时表。

:::caution
对临时表的并发修改（包括写操作）可能会导致数据损坏，使数据无法读取。此缺陷正在解决中。在修复之前，请避免对临时表进行并发修改。
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

此示例创建一个名为 `visits` 的临时表：

```sql
CREATE TRANSIENT TABLE visits (
  visitor_id BIGINT
);
```