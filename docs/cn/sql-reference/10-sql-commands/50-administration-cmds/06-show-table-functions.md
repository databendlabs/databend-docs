---
title: SHOW TABLE FUNCTIONS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.190"/>

显示当前支持的表函数列表。

## 语法

```sql
SHOW TABLE_FUNCTIONS [LIKE '<pattern>' | WHERE <expr>] | [LIMIT <limit>]
```

## 示例

```sql
SHOW TABLE_FUNCTIONS;
+------------------------+
| name                   |
+------------------------+
| numbers                |
| numbers_mt             |
| numbers_local          |
| fuse_snapshot          |
| fuse_segment           |
| fuse_block             |
| fuse_statistic         |
| clustering_information |
| sync_crash_me          |
| async_crash_me         |
| infer_schema           |
+------------------------+
```

显示以 `"number"` 开头的表函数:
```sql
SHOW TABLE_FUNCTIONS LIKE 'number%';
+---------------+
| name          |
+---------------+
| numbers       |
| numbers_mt    |
| numbers_local |
+---------------+
```

使用 `WHERE` 显示以 `"number"` 开头的表函数:
```sql
SHOW TABLE_FUNCTIONS WHERE name LIKE 'number%';
+---------------+
| name          |
+---------------+
| numbers       |
| numbers_mt    |
| numbers_local |
+---------------+
```