---
title: CURRENT_CATALOG
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.668"/>

返回当前会话正在使用的 catalog 名称。

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