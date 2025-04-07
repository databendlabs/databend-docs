---
title: SYSTEM ENABLE / DISABLE EXCEPTION_BACKTRACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.530"/>

控制 Databend 中 Rust backtrace 的生成。SYSTEM ENABLE EXCEPTION_BACKTRACE 启用 backtrace，以便在发生 panic 时进行调试，而 SYSTEM DISABLE EXCEPTION_BACKTRACE 禁用它们，以避免额外的开销或暴露敏感信息。

## 语法

```sql
-- 启用 Rust backtrace
SYSTEM ENABLE EXCEPTION_BACKTRACE

-- 禁用 Rust backtrace
SYSTEM DISABLE EXCEPTION_BACKTRACE
```