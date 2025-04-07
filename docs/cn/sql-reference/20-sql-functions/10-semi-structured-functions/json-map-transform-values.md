---
title: JSON_MAP_TRANSFORM_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

使用 [lambda 表达式](../../00-sql-reference/42-lambda-expressions.md) 将转换应用于 JSON 对象中的每个值。

## 语法

```sql
JSON_MAP_TRANSFORM_VALUES(<json_object>, (<key>, <value>) -> <value_transformation>)
```

## 返回类型

返回一个 JSON 对象，该对象具有与输入 JSON 对象相同的键，但值已根据指定的 lambda 转换进行修改。

## 示例

此示例将 " - Special Offer" 附加到每个产品描述：

```sql
SELECT JSON_MAP_TRANSFORM_VALUES('{"product1":"laptop", "product2":"phone"}'::VARIANT, (k, v) -> CONCAT(v, ' - Special Offer')) AS promo_descriptions;

┌──────────────────────────────────────────────────────────────────────────┐
│                            promo_descriptions                            │
├──────────────────────────────────────────────────────────────────────────┤
│ {"product1":"laptop - Special Offer","product2":"phone - Special Offer"} │
└──────────────────────────────────────────────────────────────────────────┘
```