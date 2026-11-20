---
title: GROUP BY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

Databend supports GROUP BY with a variety of extensions.

## Upgrade Compatibility

Databend now reuses intermediate aggregate results by default for eligible `GROUPING SETS`, `ROLLUP`, and `CUBE` queries. This can change the order of floating-point additions in `SUM`. Allow for floating-point rounding differences when you compare totals across this upgrade.