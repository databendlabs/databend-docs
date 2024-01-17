---
title: LIST_STAGE 
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.32"/>

列出阶段中的文件。这允许您根据文件扩展名过滤阶段中的文件，并获取每个文件的详细信息。该函数类似于DDL命令 [LIST STAGE FILES](../../10-sql-commands/00-ddl/03-stage/04-ddl-list-stage.md)，但提供了使用SELECT语句检索特定文件信息的灵活性，例如文件名、大小、MD5哈希、最后修改时间戳和创建者，而不是所有文件信息。

## 语法

```sql
LIST_STAGE(
  LOCATION => '{ internalStage | externalStage | userStage }'
  [ PATTERN => '<regex_pattern>']
)
```

其中：

### internalStage

```sql
internalStage ::= @<internal_stage_name>[/<path>]
```

### externalStage

```sql
externalStage ::= @<external_stage_name>[/<path>]
```

### userStage

```sql
userStage ::= @~[/<path>]
```

### PATTERN

参见 [COPY INTO table](/10-sql-commands/10-dml/dml-copy-into-table.md)。


## 示例

```sql
SELECT * FROM list_stage(location => '@my_stage/', pattern => '.*[.]log');
+----------------+------+------------------------------------+-------------------------------+---------+
|      name      | size |                md5                 |         last_modified         | creator |
+----------------+------+------------------------------------+-------------------------------+---------+
| 2023/meta.log  |  475 | "4208ff530b252236e14b3cd797abdfbd" | 2023-04-19 20:23:24.000 +0000 | NULL    |
| 2023/query.log | 1348 | "1c6654b207472c277fc8c6207c035e18" | 2023-04-19 20:23:24.000 +0000 | NULL    |
+----------------+------+------------------------------------+-------------------------------+---------+

-- 等同于以下语句：
LIST @my_stage PATTERN = '.log';
```