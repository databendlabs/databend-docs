---
title: USE WAREHOUSE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

切换当前会话使用的计算集群，后续查询将在该集群上执行。

## 语法

```sql
USE WAREHOUSE <warehouse_name>
```

| 参数 | 说明 |
|------|------|
| warehouse_name | 计算集群名称。命令会验证该集群是否存在且可访问。 |

## 示例

将当前会话切换到 `my_warehouse`：

```sql
USE WAREHOUSE my_warehouse;
```
