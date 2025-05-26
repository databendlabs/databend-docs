---
title: "Databend JSON (Variant) 工作原理"
sidebar_label: "Databend JSON 工作原理"
---

另请参阅:

- [Variant 数据类型](/sql/sql-reference/data-types/variant)
- [半结构化函数](/sql/sql-functions/semi-structured-functions/)

## 核心概念

Databend 的 Variant 类型是一种灵活的数据类型，旨在处理 JSON 等半结构化数据。它提供了与 Snowflake 兼容的语法和函数，同时通过高效的存储格式和优化的访问机制提供高性能。Databend 中大多数与 Variant 相关的函数都直接兼容 Snowflake 的对应函数，这使得熟悉 Snowflake JSON 处理能力的用户可以无缝迁移。

```
┌─────────────────────────────────────────────────────────────────┐
│ Variant 类型核心组件                                            │
├─────────────────┬───────────────────────────────────────────────┤
│ 存储格式        │ 基于 JSONB 的二进制存储                       │
│ 虚拟列          │ 自动提取 JSON 路径                            │
│ 访问方法        │ 多种路径导航语法选项                          │
│ 函数            │ 丰富的 JSON 操作函数                          │
└─────────────────┴───────────────────────────────────────────────┘
```

## 写入 Variant 数据

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant 写入过程                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JSON 输入:                                                     │
│  {                                                              │
│    "customer_id": 123,                                          │
│    "order_id": 1001,                                            │
│    "items": [                                                   │
│      {"name": "Shoes", "price": 59.99},                         │
│      {"name": "T-shirt", "price": 19.99}                        │
│    ]                                                            │
│  }                                                              │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  JSONB 编码:                                                    │
│  [带有类型信息和优化结构的二进制格式]                           │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  虚拟列提取:                                                    │
│  - ['customer_id'] → Int64 列                                   │
│  - ['order_id'] → Int64 列                                      │
│  - ['items'][0]['name'] → String 列                            │
│  - ['items'][0]['price'] → Float64 列                           │
│  - ['items'][1]['name'] → String 列                            │
│  - ['items'][1]['price'] → Float64 列                           │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  存储:                                                          │
│  - 主 JSONB 列 (完整文档)                                       │
│  - 虚拟列 (提取的路径)                                          │
│  - 元数据更新                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### JSONB 存储格式

Databend 使用 [JSONB 二进制格式](https://github.com/databendlabs/jsonb)高效存储 JSON 数据。这种自定义格式提供:

- **类型保留**: 维护数据类型 (数字、字符串、布尔值)
- **结构优化**: 通过高效索引保留嵌套结构
- **空间效率**: 比文本 JSON 更紧凑
- **直接二进制操作**: 无需完全解析即可进行操作

[databendlabs/jsonb](https://github.com/databendlabs/jsonb) 库实现了这种二进制格式，以最小的开销提供高性能的 JSON 操作。

### 虚拟列生成

数据摄取期间，Databend 会自动分析 JSON 结构并创建虚拟列:


```
┌─────────────────────────────────────────────────────────────────┐
│                 Virtual Column Process                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Nested JSON:                                                   │
│  {                                                              │
│    "user": {                                                    │
│      "id": 123,                                                 │
│      "profile": {                                               │
│        "name": "Alice",                                         │
│        "email": "alice@example.com"                             │
│      },                                                         │
│      "orders": [                                                │
│        {"id": 1001, "total": 79.98},                            │
│        {"id": 1002, "total": 129.99}                            │
│      ]                                                          │
│    }                                                            │
│  }                                                              │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Path Extraction:                                               │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON Path               │ Inferred Type   │                  │
│  ├─────────────────────────┼─────────────────┤                  │
│  │ ['user']['id']          │ Int64           │                  │
│  │ ['user']['profile']['name'] │ String      │                  │
│  │ ['user']['profile']['email'] │ String     │                  │
│  │ ['user']['orders'][0]['id'] │ Int64       │                  │
│  │ ['user']['orders'][0]['total'] │ Float64  │                  │
│  │ ['user']['orders'][1]['id'] │ Int64       │                  │
│  │ ['user']['orders'][1]['total'] │ Float64  │                  │
│  └─────────────────────────┴─────────────────┘                  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Virtual Columns Created                                        │
│  [Each path becomes a separate column with native type]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 读取 Variant 数据

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant Read Process                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SQL Query:                                                     │
│  SELECT data['user']['profile']['name'],                        │
│         data['user']['orders'][0]['total']                      │
│  FROM customer_data                                             │
│  WHERE data['user']['id'] = 123                                 │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Path Analysis:                                                 │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON Path               │ Virtual Column? │                  │
│  ├─────────────────────────┼─────────────────┤                  │
│  │ ['user']['id']          │ Yes (Int64)     │                  │
│  │ ['user']['profile']['name'] │ Yes (String) │                 │
│  │ ['user']['orders'][0]['total'] │ Yes (Float64) │             │
│  └─────────────────────────┴─────────────────┘                  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  Optimized Execution:                                           │
│  1. Apply filter on ['user']['id'] virtual column               │
│  2. Read only required virtual columns:                         │
│     - ['user']['profile']['name']                               │
│     - ['user']['orders'][0]['total']                            │
│  3. Skip reading main JSONB column                              │
│  4. Return results directly from virtual columns                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 多种访问模式

Databend 支持多种语法选项来访问和操作 JSON 数据，包括 Snowflake 兼容和 PostgreSQL 兼容的模式：

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON 访问语法选项                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  原始 JSON:                                                     │
│  {                                                              │
│    "user": {                                                    │
│      "profile": {                                               │
│        "name": "Alice",                                         │
│        "settings": {                                            │
│          "theme": "dark"                                        │
│        }                                                        │
│      }                                                          │
│    }                                                            │
│  }                                                              │
│                                                                 │
│  Snowflake 兼容访问:                                            │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 方括号表示法:                                       │       │
│  │    data['user']['profile']['settings']['theme']      │       │
│  │                                                      │       │
│  │ 2. 冒号表示法:                                         │       │
│  │    data:user:profile:settings:theme                  │       │
│  │                                                      │       │
│  │ 3. 混合表示法 (带点):                                  │       │
│  │    data['user']['profile'].settings.theme            │       │
│  │    data:user:profile.settings.theme                  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  PostgreSQL 兼容运算符:                                         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 箭头运算符:                                         │       │
│  │    data->'user'->'profile'->'settings'->'theme'      │       │
│  │    data->>'user'  (返回文本而非 JSON)                  │       │
│  │                                                      │       │
│  │ 2. 路径运算符:                                         │       │
│  │    data#>'{user,profile,settings,theme}'             │       │
│  │    data#>>'{user,profile,settings,theme}'            │       │
│  │                                                      │       │
│  │ 3. 包含运算符:                                         │       │
│  │    data @> '{"user":{"profile":{"name":"Alice"}}}'   │       │
│  │    data ? 'user'  (检查键是否存在)                     │       │
│  │                                                      │       │
│  │ 4. 修改运算符:                                         │       │
│  │    data - 'user'  (移除键)                             │       │
│  │    data || '{"new_field":123}'  (连接)                 │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

有关访问语法的更多详细信息，请参阅 Variant 文档 ( /sql/sql-reference/data-types/variant#accessing-elements-in-json ) 和 JSON Operators 文档 ( /sql/sql-commands/query-operators/json )。

### 丰富的函数支持

Databend 提供了一套全面的函数来处理 JSON 数据，这些函数按其用途进行组织:

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON Function Categories                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Basic Operations:                                           │
│     • Parsing and Validation:                                   │
│       - PARSE_JSON, CHECK_JSON                                  │
│     • Object Access and Extraction:                             │
│       - GET, GET_PATH, GET_IGNORE_CASE, OBJECT_KEYS             │
│     • Type Inspection and Conversion:                           │
│       - JSON_TYPEOF, AS_TYPE, IS_ARRAY, IS_OBJECT, IS_STRING    │
│                                                                 │
│  2. Construction and Modification:                              │
│     • JSON Object Operations:                                   │
│       - JSON_OBJECT, JSON_OBJECT_INSERT, JSON_OBJECT_DELETE     │
│       - JSON_OBJECT_PICK, JSON_STRIP_NULLS                      │
│     • JSON Array Operations:                                    │
│       - JSON_ARRAY, JSON_ARRAY_INSERT, JSON_ARRAY_DISTINCT      │
│       - FLATTEN                                                 │
│                                                                 │
│  3. Advanced Query and Transformation:                          │
│     • Path Queries:                                             │
│       - JSON_PATH_EXISTS, JSON_PATH_QUERY, JSON_PATH_QUERY_ARRAY│
│       - JSON_EXTRACT_PATH_TEXT, JQ                              │
│     • Array Transformations:                                    │
│       - JSON_ARRAY_MAP, JSON_ARRAY_FILTER, JSON_ARRAY_TRANSFORM │
│       - JSON_ARRAY_APPLY, JSON_ARRAY_REDUCE                     │
│     • Set Operations:                                           │
│       - JSON_ARRAY_INTERSECTION, JSON_ARRAY_EXCEPT              │
│       - JSON_ARRAY_OVERLAP                                      │
│     • Object Transformations:                                   │
│       - JSON_MAP_FILTER, JSON_MAP_TRANSFORM_KEYS/VALUES         │
│     • Expansion and Formatting:                                 │
│       - JSON_ARRAY_ELEMENTS, JSON_EACH, JSON_PRETTY             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

JSON 函数的完整列表可在 [半结构化函数文档](/sql/sql-functions/semi-structured-functions/) 中找到。

## 性能对比

Databend 的虚拟列技术提供了显著的性能优势：

```
┌─────────────────────────────────────────────────────────────────┐
│                 Performance Comparison                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Query: SELECT data['account_balance'],                         │
│         data['address']['city'], data['phone']                  │
│         FROM user_activity_logs                                 │
│                                                                 │
│  Without Virtual Columns:                                       │
│  - 3.763 seconds                                                │
│  - 11.90 GiB processed                                          │
│                                                                 │
│  With Virtual Columns:                                          │
│  - 1.316 seconds (3x faster)                                    │
│  - 461.34 MiB processed (26x less data)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

对于复杂的嵌套结构，其优势依然显著：

```
┌─────────────────────────────────────────────────────────────────┐
│  Query: SELECT data['purchase_history'],                        │
│         data['wishlist'], data['last_purchase']['item']         │
│         FROM user_activity_logs                                 │
│                                                                 │
│  Without Virtual Columns:                                       │
│  - 5.509 seconds                                                │
│  - 11.90 GiB processed                                          │
│                                                                 │
│  With Virtual Columns:                                          │
│  - 3.924 seconds (1.4x faster)                                  │
│  - 2.15 GiB processed (5.5x less data)                         │
└─────────────────────────────────────────────────────────────────┘
```

## Databend 在 Variant 数据方面的优势

Databend 的 Variant 类型提供了四个关键优势：

1.  **Snowflake 兼容性**
    -   兼容的语法和函数
    -   熟悉的访问模式：`data['field']`、`data:field`、`data.field`
    -   无缝迁移路径

2.  **卓越的性能**
    -   查询执行速度快 3 倍
    -   数据扫描量减少 26 倍
    -   常见路径的自动虚拟列

3.  **高级 JSON 功能**
    -   丰富的函数集，用于复杂操作
    -   兼容 PostgreSQL 的路径查询
    -   强大的数组和对象转换

4.  **成本效益**
    -   优化的 JSONB 二进制存储
    -   无需定义 Schema
    -   降低存储和计算成本

Databend 将 Snowflake 的熟悉性与增强的性能和成本效益相结合，使其成为现代数据分析工作负载的理想选择。