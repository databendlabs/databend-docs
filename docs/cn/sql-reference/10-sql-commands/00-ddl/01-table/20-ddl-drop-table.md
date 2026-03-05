---
title: DROP TABLE
sidebar_position: 19
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.155"/>

删除表。

**参见：**

- [CREATE TABLE](./10-ddl-create-table.md)
- [UNDROP TABLE](./21-ddl-undrop-table.md)
- [TRUNCATE TABLE](40-ddl-truncate-table.md)

## 语法

```sql
DROP TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
```

此命令仅将表模式标记为在元数据服务中已删除，从而确保实际数据保持完整。如果需要恢复已删除的表模式，可以使用 [UNDROP TABLE](./21-ddl-undrop-table.md) 命令。

要完全删除表及其数据文件，请考虑使用 [VACUUM DROP TABLE](91-vacuum-drop-table.md) 命令。

## 示例

### 删除表

此示例重点介绍了使用 DROP TABLE 命令删除 "test" 表。删除表后，任何尝试从中进行 SELECT 操作都会导致 "Unknown table" 错误。它还演示了如何使用 UNDROP TABLE 命令恢复已删除的 "test" 表，从而允许您再次从中 SELECT 数据。

```sql
CREATE TABLE test(a INT, b VARCHAR);
INSERT INTO test (a, b) VALUES (1, 'example');
SELECT * FROM test;

a|b      |
-+-------+
1|example|

-- 删除表
DROP TABLE test;
SELECT * FROM test;
>> SQL Error [1105] [HY000]: UnknownTable. Code: 1025, Text = error: 
  --> SQL:1:80
  |
1 | /* ApplicationName=DBeaver 23.2.0 - SQLEditor <Script-12.sql> */ SELECT * FROM test
  |                                                                                ^^^^ Unknown table `default`.`test` in catalog 'default'

-- 恢复表
UNDROP TABLE test;
SELECT * FROM test;

a|b      |
-+-------+
1|example|
```