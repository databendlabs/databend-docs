---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

创建一个具有指定大小的计算集群。

## 语法

```sql
CREATE WAREHOUSE '<warehouse_name>'
    WITH WAREHOUSE_SIZE = '<warehouse_size>'
```

说明：

- `<warehouse_name>` 只能包含英文字母、数字和 `-`。建议统一使用单引号包裹。
- `<warehouse_size>` 不区分大小写，可选值为：`XSMALL`、`SMALL`、`MEDIUM`、`LARGE`、`XLARGE`、`XXLARGE`、`XXXLARGE`。建议统一使用单引号包裹。

## 示例

此示例创建一个 `XSMALL` 规格的计算集群：

```sql
CREATE WAREHOUSE 'testwarehouse' WITH WAREHOUSE_SIZE = 'XSMALL';
```
