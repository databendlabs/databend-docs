---
title: JSON_EACH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.152"/>

从 JSON 对象中提取键值对，将结构分解为结果集中的单独行。每行代表从输入 JSON 表达式中提取的一个独立的键值对。

## 语法

```sql
JSON_EACH(<json_string>)
```

## 返回类型

JSON_EACH 返回一组元组，每个元组由一个 STRING 类型的键和一个对应的 VARIANT 类型的值组成。

## 示例

```sql
-- 从表示个人信息的 JSON 对象中提取键值对
SELECT
  JSON_EACH(
    PARSE_JSON (
      '{"name": "John", "age": 25, "isStudent": false, "grades": [90, 85, 92]}'
    )
  );


┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ json_each(parse_json('{"name": "john", "age": 25, "isstudent": false, "grades": [90, 85, 92]}')) │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ('age','25')                                                                                     │
│ ('grades','[90,85,92]')                                                                          │
│ ('isStudent','false')                                                                            │
│ ('name','"John"')                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 显示提取值的数据类型
SELECT
  TYPEOF (
    JSON_EACH(
      PARSE_JSON (
        '{"name": "John", "age": 25, "isStudent": false, "grades": [90, 85, 92]}'
      )
    )
  );

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ typeof(json_each(parse_json('{"name": "john", "age": 25, "isstudent": false, "grades": [90, 85, 92]}'))) │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TUPLE(STRING, VARIANT) NULL                                                                              │
│ TUPLE(STRING, VARIANT) NULL                                                                              │
│ TUPLE(STRING, VARIANT) NULL                                                                              │
│ TUPLE(STRING, VARIANT) NULL                                                                              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```