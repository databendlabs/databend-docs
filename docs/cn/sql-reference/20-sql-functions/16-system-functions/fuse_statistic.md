---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.553"/>

返回表中每一列的估计不同值数量。

## 语法

```sql
FUSE_STATISTIC('<数据库名>', '<表名>')
```

## 示例

您最有可能与 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 一起使用此函数来检查表的统计信息。请参阅 [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) 页面上的 [示例](/sql/sql-commands/ddl/table/analyze-table#examples) 部分。