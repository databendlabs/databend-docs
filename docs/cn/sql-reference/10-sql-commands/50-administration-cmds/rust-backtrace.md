---
title: SYSTEM ENABLE / DISABLE EXCEPTION_BACKTRACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.530"/>

控制 Databend 中 Rust backtraces 的生成。SYSTEM ENABLE EXCEPTION_BACKTRACE 在发生 panic 时启用 backtraces 以用于调试目的，而 SYSTEM DISABLE EXCEPTION_BACKTRACE 则禁用它们，以避免额外的开销或敏感信息的暴露。

## 语法

```sql
-- 启用 Rust backtraces
SYSTEM ENABLE EXCEPTION_BACKTRACE

-- 禁用 Rust backtraces
SYSTEM DISABLE EXCEPTION_BACKTRACE
```