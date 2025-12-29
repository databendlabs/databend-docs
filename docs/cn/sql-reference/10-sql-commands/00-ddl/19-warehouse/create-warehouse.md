---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

创建一个具有指定大小的计算集群。

## 语法

```sql
CREATE WAREHOUSE <warehouse_name>
    WITH WAREHOUSE_SIZE = { XSMALL | SMALL | MEDIUM | LARGE | XLARGE | XXLARGE | XXXLARGE }
```

## 示例

此示例创建一个 `XSMALL` 规格的计算集群：

```sql
CREATE WAREHOUSE test_warehouse WITH WAREHOUSE_SIZE = XSMALL;
```
