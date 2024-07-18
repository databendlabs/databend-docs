---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.553"/>

Returns the estimated number of distinct values of each column in a table.

## Syntax

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

## Examples

You're most likely to use this function together with [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) to check the statistical information of a table. See the [Examples](/sql/sql-commands/ddl/table/analyze-table#examples) section on the [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) page.