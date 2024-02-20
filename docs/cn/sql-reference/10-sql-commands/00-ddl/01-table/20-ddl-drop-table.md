---
title: 删除表
sidebar_position: 19
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.155"/>

删除一个表。

**另请参阅：**

- [创建表](./10-ddl-create-table.md)
- [撤销删除表](./21-ddl-undrop-table.md)
- [清空表](40-ddl-truncate-table.md)

## 语法

```sql
DROP TABLE [ IF EXISTS ] [ <database_name>. ]<table_name>
```

该命令仅在元数据服务中将表模式标记为已删除，确保实际数据保持完整。如果您需要恢复已删除的表模式，可以使用 [撤销删除表](./21-ddl-undrop-table.md) 命令。

要彻底删除表及其数据文件，请考虑使用 [彻底删除表](91-vacuum-drop-table.md) 命令。


## 示例

### 删除一个表

此示例突出显示了使用 DROP TABLE 命令删除 "test" 表的用法。删除表后，任何尝试从中选择数据的操作都会导致“未知表”错误。它还演示了如何使用 UNDROP TABLE 命令恢复已删除的 "test" 表，允许您再次从中选择数据。

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
  |                                                                                ^^^^ 未知表 `default`.`test` 在目录 'default' 中

-- 恢复表
UNDROP TABLE test;
SELECT * FROM test;

a|b      |
-+-------+
1|example|
```