---
title: CALL PROCEDURE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.637"/>

通过调用存储过程的名称来执行它，如果过程需要参数，可以选择传递参数。

## 语法

```sql
CALL PROCEDURE <procedure_name>([<argument1>, <argument2>, ...])
```

## 示例

此示例演示如何创建和调用一个存储过程，该过程将重量从千克 (kg) 转换为磅 (lb)：

```sql
CREATE PROCEDURE convert_kg_to_lb(kg DECIMAL(4, 2)) 
RETURNS DECIMAL(10, 2) 
LANGUAGE SQL 
COMMENT = 'Converts kilograms to pounds'
AS $$
BEGIN
    RETURN kg * 2.20462;
END;
$$;

CALL PROCEDURE convert_kg_to_lb(10.00);

┌────────────┐
│   Result   │
├────────────┤
│ 22.0462000 │
└────────────┘
```