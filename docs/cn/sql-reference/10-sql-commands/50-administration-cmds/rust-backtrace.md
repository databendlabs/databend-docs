---
title: SYSTEM ENABLE / DISABLE EXCEPTION_BACKTRACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.530"/>

控制Databend中Rust回溯的生成。`SYSTEM ENABLE EXCEPTION_BACKTRACE` 在发生panic时启用回溯以进行调试，而 `SYSTEM DISABLE EXCEPTION_BACKTRACE` 则禁用它们以避免额外的开销或敏感信息的暴露。

## 语法

```sql
-- 启用Rust回溯
SYSTEM ENABLE EXCEPTION_BACKTRACE

-- 禁用Rust回溯
SYSTEM DISABLE EXCEPTION_BACKTRACE
```