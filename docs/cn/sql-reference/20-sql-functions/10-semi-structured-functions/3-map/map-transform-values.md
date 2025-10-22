---
title: MAP_TRANSFORM_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.762"/>

使用 [lambda 表达式（Lambda Expression）](/sql/stored-procedure-scripting/#lambda-expressions) 对 JSON 对象中的每个值应用转换。

## 语法

```sql
MAP_TRANSFORM_VALUES(<json_object>, (<key>, <value>) -> <value_transformation>)
```

## 返回类型

返回一个 JSON 对象，其键与输入的 JSON 对象相同，但值已根据指定的 lambda 转换进行了修改。

## 示例

此示例将每个数值乘以 10，将原始对象转换为 `{"a":10,"b":20}`：

```sql
SELECT MAP_TRANSFORM_VALUES('{"a":1,"b":2}'::VARIANT, (k, v) -> v * 10) AS transformed_values;

┌────────────────────┐
│ transformed_values │
├────────────────────┤
│ {"a":10,"b":20}    │
└────────────────────┘
```