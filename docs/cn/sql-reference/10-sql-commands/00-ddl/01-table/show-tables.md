---
title: SHOW TABLES
sidebar_position: 15
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.415"/>

列出当前或指定数据库中的表。

:::note
从 1.2.415 版本开始，SHOW TABLES 命令不再在其结果中包含视图。要显示视图，请改用 [SHOW VIEWS](../05-view/show-views.md)。
:::

另请参阅：[system.tables](../../../00-sql-reference/31-system-tables/system-tables.md)

## 语法

```sql
SHOW [ FULL ] TABLES 
     [ {FROM | IN} <database_name> ] 
     [ HISTORY ] 
     [ LIKE '<pattern>' | WHERE <expr> ]
```

| 参数      | 描述                                                                                                                      |
|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| FULL      | 列出包含附加信息的结果。 有关更多详细信息，请参见 [示例](#examples)。                                                              |
| FROM / IN | 指定数据库。 如果省略，则该命令将返回当前数据库的结果。                                                                           |
| HISTORY   | 显示保留期内（默认为 24 小时）表删除的时间戳。 如果尚未删除表，则 `drop_time` 的值为 NULL。                                               |
| LIKE      | 使用区分大小写的模式匹配按名称过滤结果。                                                                                              |
| WHERE     | 使用 WHERE 子句中的表达式过滤结果。                                                                                             |

## 示例

以下示例列出了当前数据库（默认）中所有表的名称：

```sql
SHOW TABLES;

┌───────────────────┐
│ Tables_in_default │
├───────────────────┤
│ books             │
│ mytable           │
│ ontime            │
│ products          │
└───────────────────┘
```

以下示例列出了包含附加信息的所有表：

```sql
SHOW FULL TABLES;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  tables  │ table_type │ database │ catalog │       owner      │ engine │ cluster_by │         create_time        │     num_rows     │     data_size    │ data_compressed_size │    index_size    │
├──────────┼────────────┼──────────┼─────────┼──────────────────┼────────┼────────────┼────────────────────────────┼──────────────────┼──────────────────┼──────────────────────┼──────────────────┤
│ books    │ BASE TABLE │ default  │ default │ account_admin    │ FUSE   │            │ 2024-01-16 03:53:15.354132 │                0 │                0 │                    0 │                0 │
│ mytable  │ BASE TABLE │ default  │ default │ account_admin    │ FUSE   │            │ 2024-01-16 03:53:27.968505 │                0 │                0 │                    0 │                0 │
│ ontime   │ BASE TABLE │ default  │ default │ account_admin    │ FUSE   │            │ 2024-01-16 03:53:42.052399 │                0 │                0 │                    0 │                0 │
│ products │ BASE TABLE │ default  │ default │ account_admin    │ FUSE   │            │ 2024-01-16 03:54:00.883985 │                0 │                0 │                    0 │                0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

以下示例演示了当存在可选参数 HISTORY 时，结果将包括已删除的表：

```sql
DROP TABLE products;

SHOW TABLES;

┌───────────────────┐
│ Tables_in_default │
├───────────────────┤
│ books             │
│ mytable           │
│ ontime            │
└───────────────────┘

SHOW TABLES HISTORY;

┌────────────────────────────────────────────────┐
│ Tables_in_default │          drop_time         │
├───────────────────┼────────────────────────────┤
│ books             │ NULL                       │
│ mytable           │ NULL                       │
│ ontime            │ NULL                       │
│ products          │ 2024-01-16 03:55:47.900362 │
└────────────────────────────────────────────────┘
```

以下示例列出了名称末尾包含字符串“time”的表：

```sql
SHOW TABLES LIKE '%time';

┌───────────────────┐
│ Tables_in_default │
├───────────────────┤
│ ontime            │
└───────────────────┘

-- CASE-SENSITIVE pattern matching. 
-- No results will be returned if you code the previous statement like this: 
SHOW TABLES LIKE '%TIME';
```

以下示例列出了数据大小大于 1,000 字节的表：

```sql
SHOW TABLES WHERE data_size > 1000 ;

┌───────────────────┐
│ Tables_in_default │
├───────────────────┤
│ ontime            │
└───────────────────┘
```