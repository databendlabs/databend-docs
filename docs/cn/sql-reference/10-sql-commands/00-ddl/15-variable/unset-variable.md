---
title: UNSET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.609"/>

从当前会话中移除一个或多个变量。

## 语法

```sql
-- 移除一个变量
UNSET VARIABLE <变量名>

-- 移除多个变量
UNSET VARIABLE (<变量1>, <变量2>, ...)
```

## 示例

以下示例移除了单个变量：

```sql
-- 从会话中移除变量 a
UNSET VARIABLE a;  
```

以下示例移除了多个变量：

```sql
-- 从会话中移除变量 x 和 y
UNSET VARIABLE (x, y); 
```