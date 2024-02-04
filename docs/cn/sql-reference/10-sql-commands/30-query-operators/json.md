---
title: JSON 操作符
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.312"/>

| 操作符 | 描述 | 示例 | 结果 |
|----------|-------------|---------|--------|
| -> | 使用索引或键检索 JSON 数组或对象，返回一个 JSON 对象。 | - **使用键**：<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->'Databend'`<br/>- **使用索引**：<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->1` | Cloud Native Warehouse |
| ->> | 使用索引或键检索 JSON 数组或对象，返回一个字符串。 | - **使用键**：<br/>`PARSE_JSON('{"Databend": "Cloud Native Warehouse"}')->>'Databend'`<br/>- **使用索引**：<br/>`PARSE_JSON('["Databend", "Cloud Native Warehouse"]')->>1` | Cloud Native Warehouse |
| #> | 通过指定键路径检索 JSON 数组或对象，返回一个 JSON 对象。 | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>'{example, Databend}'` | Cloud Native Warehouse |
| #>> | 通过指定键路径检索 JSON 数组或对象，返回一个字符串。 | `PARSE_JSON('{"example": {"Databend": "Cloud Native Warehouse"}}')#>>'{example, Databend}'` | Cloud Native Warehouse |
| ? | 检查给定字符串是否作为键或数组存在于 JSON 对象中，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"a":1,"b":2,"c":3}') ? 'b'`| 1 |
| ?\| | 检查给定数组中的任何字符串是否作为键或数组元素存在，返回 1 表示真，0 表示假。 | PARSE_JSON('{"a":1,"b":2,"c":3}') ?\| ['b','e'] | 1 |
| ?& | 检查给定数组中的每个字符串是否都作为键或数组元素存在，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"a":1,"b":2,"c":3}') ?& ['b','e']` | 0 |
| @> | 检查左侧 JSON 表达式是否包含右侧 JSON 表达式的所有键值对，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"name":"Alice","age":30}') @> PARSE_JSON('{"name":"Alice"}')` | 1 |
| <@ | 检查左侧 JSON 表达式是否是右侧 JSON 表达式的子集，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"name":"Alice"}') <@ PARSE_JSON('{"name":"Bob"}')` | 0 |
| @@ | 检查指定的 JSON 路径表达式是否在 JSON 数据中匹配某些条件，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"a":1,"b":[1,2,3]}') @@ '$.a == 1'` | 1 |
| @? | 检查指定 JSON 值的 JSON 路径表达式是否返回任何项，返回 1 表示真，0 表示假。 | `PARSE_JSON('{"a":1,"b":[1,2,3]}') @? '$.b[3]'` | 0 |
| `- '<key>'` | 从 JSON 对象中删除一个键值对。 | `PARSE_JSON('{"a":1,"b":2}') - 'a'` |  {"b":2}  |
| `- <index>` | 从数组中删除指定索引处的元素（负整数从末尾开始计数）。 | `PARSE_JSON('[1,2,3]') - 2` |   [1,2]  |