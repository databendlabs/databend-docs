---
title: FUSE_STATISTIC
---

Returns the estimated number of distinct values of each column in a table.


## Syntax

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

## Examples

You're most likely to use this function together with `ANALYZE TABLE <table_name>` to generate and check the statistical information of a table. For more explanations and examples, see [OPTIMIZE TABLE](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md).