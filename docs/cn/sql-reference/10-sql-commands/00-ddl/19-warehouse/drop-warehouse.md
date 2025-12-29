---
title: DROP WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

删除指定的计算集群并释放与其关联的资源。

## 语法

```sql
DROP WAREHOUSE <warehouse_name>
```

提示：如果 `<warehouse_name>` 包含 `-`，请用反引号或双引号包裹。

## 示例

此示例删除 `testwarehouse` 计算集群：

```sql
DROP WAREHOUSE testwarehouse;
```
