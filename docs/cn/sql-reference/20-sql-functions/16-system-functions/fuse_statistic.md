---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.553"/>

返回表中每一列的估计不同值数量。

## 语法

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

## 示例

在使用此函数检查表的统计信息时，最有可能与 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 一起使用。请参阅 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 页面上的 [示例](/sql/sql-commands/ddl/table/analyze-table#examples) 部分。