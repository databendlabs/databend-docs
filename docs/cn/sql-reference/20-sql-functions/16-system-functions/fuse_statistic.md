---
title: FUSE_STATISTIC
---

返回表中每一列的估计不同值数量。

## 语法

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

## 示例

您最有可能将此函数与 `ANALYZE TABLE <table_name>` 一起使用，以生成并检查表的统计信息。更多解释和示例，请参见 [OPTIMIZE TABLE](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md)。