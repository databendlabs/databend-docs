---
title: 删除表
sidebar_position: 19
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.155"/>

删除一个表。

**另见：**

- [创建表](./10-ddl-create-table.md)
- [撤销删除表](./21-ddl-undrop-table.md)
- [清空表](40-ddl-truncate-table.md)

## 语法

```sql
DROP TABLE [ IF EXISTS ] [ <database_name>. ]<table_name> [ ALL ]
```

可选的 "ALL" 参数决定是否删除表的底层数据。

- 如果省略 "ALL"，则只从元数据服务中删除表架构，数据保持不变。在这种情况下，您可以使用 [撤销删除表](./21-ddl-undrop-table.md) 命令恢复表。

- 包含 "ALL" 将导致删除架构和底层数据。虽然 [撤销删除表](./21-ddl-undrop-table.md) 命令可以恢复架构，但它无法恢复表的数据。

## 示例

### 示例 1：删除一个表

此示例突出显示了使用 DROP TABLE 命令删除 "test" 表的用法。删除表后，任何尝试从中选择数据的操作都会导致 "未知表" 错误。它还演示了如何使用 UNDROP TABLE 命令恢复被删除的 "test" 表，使您能够再次从中选择数据。

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
>> SQL 错误 [1105] [HY000]: 未知表。代码：1025，文本 = 错误： 
  --> SQL:1:80
  |
1 | /* 应用名称=DBeaver 23.2.0 - SQLEditor <Script-12.sql> */ SELECT * FROM test
  |                                                                                ^^^^ 未知表 `default`.`test` 在目录 'default'

-- 恢复表
UNDROP TABLE test;
SELECT * FROM test;

a|b      |
-+-------+
1|example|
```

### 示例 2：带 "ALL" 删除一个表

此示例强调了使用带 "ALL" 参数的 DROP TABLE 命令删除 "test" 表的用法，包括其架构和底层数据。使用带 "ALL" 的 DROP TABLE 后，表被完全移除。它还演示了如何使用 UNDROP TABLE 命令恢复之前删除的 "test" 表。然而，由于表的数据被删除，随后的 SELECT 语句显示一个空结果。

```sql
CREATE TABLE test(a INT, b VARCHAR);
INSERT INTO test (a, b) VALUES (1, 'example');
SELECT * FROM test;

a|b      |
-+-------+
1|example|

-- 带 ALL 参数删除表
DROP TABLE test ALL;

-- 恢复表
UNDROP TABLE test;
SELECT * FROM test;

a|b|
-+-+

DESC test;

Field|Type   |Null|Default|Extra|
-----+-------+----+-------+-----+
a    |INT    |YES |NULL   |     |
b    |VARCHAR|YES |NULL   |     |
```