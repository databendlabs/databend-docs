---
title: DICT_GET
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

使用提供的键表达式从字典中检索指定属性的值。

## 句法

```sql
DICT_GET([db_name.]<dict_name>, '<attr_name>', <key_expr>)
```

| 参数        | 描述                                                                                                                                                       |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| dict_name   | 字典的名称。                                                                                                                                                   |
| attr_name   | 您想要检索其值的字典中的属性名称。                                                                                                                               |
| key_expr    | 用于在字典中定位特定条目的键表达式。它表示字典主键的值，用于检索相应的数据。                                                                                               |

## 示例

请参阅 [使用示例](/guides/query/dictionary#usage-example)。