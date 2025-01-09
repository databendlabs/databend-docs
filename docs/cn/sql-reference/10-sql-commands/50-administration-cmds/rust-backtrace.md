---
title: SYSTEM ENABLE / DISABLE EXCEPTION_BACKTRACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.530"/>

控制 Databend 中 Rust 回溯的生成。SYSTEM ENABLE EXCEPTION_BACKTRACE 在发生 panic 时启用回溯以用于调试目的，而 SYSTEM DISABLE EXCEPTION_BACKTRACE 则禁用回溯以避免额外的开销或敏感信息的暴露。

## 语法

```sql
-- 启用 Rust 回溯
SYSTEM ENABLE EXCEPTION_BACKTRACE

-- 禁用 Rust 回溯
SYSTEM DISABLE EXCEPTION_BACKTRACE
```