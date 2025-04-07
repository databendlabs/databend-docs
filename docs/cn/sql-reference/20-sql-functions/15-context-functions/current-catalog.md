---
title: CURRENT_CATALOG
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

返回会话当前使用的 catalog 的名称。

## 语法

```sql
CURRENT_CATALOG()
```

## 示例

```sql
SELECT CURRENT_CATALOG();

┌───────────────────┐
│ current_catalog() │
├───────────────────┤
│ default           │
└───────────────────┘
```