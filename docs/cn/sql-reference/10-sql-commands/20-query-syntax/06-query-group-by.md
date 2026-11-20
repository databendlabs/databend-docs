---
title: GROUP BY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

Databend 支持 GROUP BY 及其多种扩展。

## 升级兼容性

对于符合条件的 `GROUPING SETS`、`ROLLUP` 和 `CUBE` 查询，Databend 现在默认复用中间聚合结果。这可能改变 `SUM` 中浮点加法的执行顺序。在比较此次升级前后的汇总结果时，请考虑浮点舍入差异。