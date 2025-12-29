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

提示：如果 `<warehouse_name>` 包含 `-`，请用引号包裹，例如：`'name-with-hyphen'`、`` `name-with-hyphen` `` 或 `"name-with-hyphen"`。

## 示例

此示例删除 `testwarehouse` 计算集群：

```sql
DROP WAREHOUSE 'testwarehouse';
```
