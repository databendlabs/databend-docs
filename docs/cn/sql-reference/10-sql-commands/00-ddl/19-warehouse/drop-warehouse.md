---
title: DROP WAREHOUSE
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

删除计算集群并释放相关资源。

## 语法

```sql
DROP WAREHOUSE [ IF EXISTS ] <warehouse_name>
```

| 参数 | 说明 |
|------|------|
| `IF EXISTS` | 可选。若计算集群不存在则不报错。 |
| warehouse_name | 要删除的计算集群名称。 |

## 示例

删除计算集群：

```sql
DROP WAREHOUSE my_warehouse;
```

仅在存在时删除：

```sql
DROP WAREHOUSE IF EXISTS my_warehouse;
```
