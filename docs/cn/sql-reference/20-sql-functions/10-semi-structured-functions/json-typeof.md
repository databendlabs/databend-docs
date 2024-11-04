---
title: JSON_TYPEOF
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.91"/>

返回JSON结构的主层级的类型。

## 语法

```sql
JSON_TYPEOF(<json_string>)
```

## 返回类型

json_typeof函数（或类似函数）的返回类型是一个字符串，指示解析的JSON值的数据类型。可能的返回值有：'null'、'boolean'、'string'、'number'、'array'和'object'。

## 示例

```sql
-- 解析一个NULL的JSON值
SELECT JSON_TYPEOF(PARSE_JSON(NULL));

--
json_typeof(parse_json(null))|
-----------------------------+
                             |

-- 解析一个字符串'null'的JSON值
SELECT JSON_TYPEOF(PARSE_JSON('null'));

--
json_typeof(parse_json('null'))|
-------------------------------+
null                           |

SELECT JSON_TYPEOF(PARSE_JSON('true'));

--
json_typeof(parse_json('true'))|
-------------------------------+
boolean                        |

SELECT JSON_TYPEOF(PARSE_JSON('"Databend"'));

--
json_typeof(parse_json('"databend"'))|
-------------------------------------+
string                               |


SELECT JSON_TYPEOF(PARSE_JSON('-1.23'));

--
json_typeof(parse_json('-1.23'))|
--------------------------------+
number                          |

SELECT JSON_TYPEOF(PARSE_JSON('[1,2,3]'));

--
json_typeof(parse_json('[1,2,3]'))|
----------------------------------+
array                             |

SELECT JSON_TYPEOF(PARSE_JSON('{"name": "Alice", "age": 30}'));

--
json_typeof(parse_json('{"name": "alice", "age": 30}'))|
-------------------------------------------------------+
object                                                 |
```