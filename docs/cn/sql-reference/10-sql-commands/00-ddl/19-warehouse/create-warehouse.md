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

提示：如果 `<warehouse_name>` 包含 `-`，请用引号包裹，例如：`'name-with-hyphen'`、`` `name-with-hyphen` `` 或 `"name-with-hyphen"`。

## 示例

此示例创建一个 `XSMALL` 规格的计算集群：

```sql
CREATE WAREHOUSE 'testwarehouse' WITH WAREHOUSE_SIZE = 'XSMALL';
```
