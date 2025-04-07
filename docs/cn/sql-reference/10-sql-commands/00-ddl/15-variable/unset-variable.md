---
title: UNSET VARIABLE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.609"/>

从当前会话中删除一个或多个变量。

## 语法

```sql
-- 删除一个变量
UNSET VARIABLE <variable_name>

-- 删除多个变量
UNSET VARIABLE (<variable1>, <variable2>, ...)
```

## 示例

以下示例取消设置单个变量：

```sql
-- 从会话中删除变量 a
UNSET VARIABLE a;  
```

以下示例取消设置多个变量：

```sql
-- 从会话中删除变量 x 和 y
UNSET VARIABLE (x, y); 
```