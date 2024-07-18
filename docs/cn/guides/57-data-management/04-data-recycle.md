---
title: 数据清理与回收
sidebar_label: 数据回收
---

在 Databend 中，当你执行 `DROP`、`TRUNCATE` 或 `DELETE` 命令时，数据并未真正删除，允许时间旅行回到之前的状态。

数据分为两种类型：

- **历史数据**：用于时间旅行，存储历史数据或已删除表的数据。
- **临时数据**：系统用于存储溢出数据。

如果数据量较大，你可以运行几个命令（[企业版功能](/guides/overview/editions/dee/enterprise-features)）来删除这些数据，释放存储空间。

## 清理已删除表的数据

删除所有已删除表的数据文件，释放存储空间。

```sql
VACUUM DROP TABLE;
```

了解更多 [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table)。

## 清理表的历史数据

移除指定表的历史数据，清除旧版本并释放存储空间。

```sql
VACUUM TABLE <table_name>;
```

了解更多 [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table)。

## 清理临时数据

清除用于连接、聚合和排序的临时溢出文件，释放存储空间。

```sql
VACUUM TEMPORARY FILES;
```

了解更多 [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files)。