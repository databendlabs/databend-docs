---
title: DROP PROCEDURE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.637"/>

删除已存在的存储过程。

## 语法

```sql
DROP PROCEDURE <procedure_name>([<parameter_type1>, <parameter_type2>, ...])
```

- 如果存储过程没有参数，使用空括号：`DROP PROCEDURE <procedure_name>()`;
- 对于带有参数的存储过程，请指定准确的类型以避免错误。

## 示例

此示例创建然后删除一个存储过程：

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

DROP PROCEDURE convert_kg_to_lb(Decimal(4, 2));
```