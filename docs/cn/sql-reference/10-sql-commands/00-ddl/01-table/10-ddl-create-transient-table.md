---
title: 创建瞬态表
sidebar_position: 1
---

创建一个不存储历史数据以支持时间回溯的表。

瞬态表用于保存不需要数据保护或恢复机制的临时数据。Databend不为瞬态表保留历史数据，因此您将无法使用时间回溯功能查询瞬态表的先前版本，例如，SELECT语句中的[AT](./../../20-query-syntax/03-query-at.md)子句对瞬态表不起作用。请注意，您仍然可以[删除](./20-ddl-drop-table.md)和[恢复](./21-ddl-undrop-table.md)瞬态表。

:::caution
对瞬态表的并发修改（包括写操作）可能会导致数据损坏，使数据无法读取。此缺陷正在解决中。在修复之前，请避免对瞬态表进行并发修改。
:::

## 语法

```sql
CREATE [ OR REPLACE ] TRANSIENT TABLE 
       [ IF NOT EXISTS ] 
       [ <database_name>. ]<table_name>
       ...
```

省略的部分遵循[CREATE TABLE](10-ddl-create-table.md)的语法。

## 示例

此示例创建一个名为`visits`的瞬态表：

```sql
CREATE TRANSIENT TABLE visits (
  visitor_id BIGINT
);
```