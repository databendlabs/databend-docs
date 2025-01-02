---
title: 调用存储过程
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.637"/>

通过调用存储过程的名称来执行它，如果存储过程需要参数，可以传递参数。

## 语法

```sql
CALL PROCEDURE <procedure_name>([<argument1>, <argument2>, ...])
```

## 示例

以下示例展示了如何创建并调用一个将重量从千克（kg）转换为磅（lb）的存储过程：

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
│   结果     │
├────────────┤
│ 22.0462000 │
└────────────┘
```