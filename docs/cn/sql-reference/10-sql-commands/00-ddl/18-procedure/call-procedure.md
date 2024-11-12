---
title: 调用存储过程
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.637"/>

通过调用其名称执行存储过程，如果过程需要，可以选择传递参数。

## 语法

```sql
CALL PROCEDURE <procedure_name>([<argument1>, <argument2>, ...])
```

## 示例

此示例演示如何创建并调用一个将重量从千克（kg）转换为磅（lb）的存储过程：

```sql
CREATE PROCEDURE convert_kg_to_lb(kg DECIMAL(4, 2)) 
RETURNS DECIMAL(10, 2) 
LANGUAGE SQL 
COMMENT = '将千克转换为磅'
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