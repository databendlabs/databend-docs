---
title: "Databend JSON (Variant) 工作原理"
sidebar_label: "Databend JSON 工作原理"
---

另请参阅：

- [Variant 数据类型](/sql/sql-reference/data-types/variant)
- [半结构化函数](/sql/sql-functions/semi-structured-functions/)

## 核心概念

Databend 的 Variant 类型是一种灵活的数据类型，旨在处理像 JSON 这样的半结构化数据。它提供了与 Snowflake 兼容的语法和函数，同时通过高效的存储格式和优化的访问机制提供高性能。Databend 中大多数与 Variant 相关的函数都与其 Snowflake 对应函数直接兼容，这使得熟悉 Snowflake JSON 处理能力的用户可以无缝迁移。

```
┌─────────────────────────────────────────────────────────────────┐
│ Variant 类型核心组件                                            │
├─────────────────┬───────────────────────────────────────────────┤
│ 存储格式          │ 基于 JSONB 的二进制存储                         │
│ 虚拟列           │ 自动提取 JSON 路径                            │
│ 访问方法          │ 用于路径导航的多种语法选项                      │
│ 函数            │ 丰富的 JSON 操作函数集                        │
└─────────────────┴───────────────────────────────────────────────┘
```

## 写入 Variant 数据

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant 写入过程                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JSON 输入：                                                    │
│  {                                                              │
│    "customer_id": 123,                                          │
│    "order_id": 1001,                                          │
│    "items": [                                                   │
│      {"name": "Shoes", "price": 59.99},                         │
│      {"name": "T-shirt", "price": 19.99}                        │
│    ]                                                            │
│  }                                                              │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  JSONB 编码：                                                   │
│  [具有类型信息和优化结构的二进制格式]                            │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  虚拟列提取：                                                  │
│  - ['customer_id'] → Int64 列                                  │
│  - ['order_id'] → Int64 列                                   │
│  - ['items'][0]['name'] → String 列                         │
│  - ['items'][0]['price'] → Float64 列                       │
│  - ['items'][1]['name'] → String 列                         │
│  - ['items'][1]['price'] → Float64 列                       │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  存储：                                                       │
│  - 主 JSONB 列（完整文档）                                     │
│  - 虚拟列（提取的路径）                                         │
│  - 元数据更新                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### JSONB 存储格式

Databend 使用 [JSONB 二进制格式](https://github.com/databendlabs/jsonb) 来高效存储 JSON 数据。这种自定义格式提供：

- **类型保留**: 维护数据类型（数字、字符串、布尔值）
- **结构优化**: 通过高效的索引保留嵌套结构
- **空间效率**: 比文本 JSON 更紧凑
- **直接二进制操作**: 无需完全解析即可进行操作

[databendlabs/jsonb](https://github.com/databendlabs/jsonb) 库实现了这种二进制格式，以最小的开销提供高性能的 JSON 操作。

### 虚拟列生成

在数据摄取期间，Databend 会自动分析 JSON 结构并创建虚拟列：


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

## Reading Variant Data

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

### Multiple Access Patterns

Databend 支持多种语法选项来访问和操作 JSON 数据，包括 Snowflake 兼容和 PostgreSQL 兼容的模式：
```

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON 访问语法选项                                  │
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
│      }                                                        │
│    }                                                            │
│  }                                                              │
│                                                                 │
│  Snowflake 兼容的访问方式:                                       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 方括号表示法:                                       │       │
│  │    data['user']['profile']['settings']['theme']      │       │
│  │                                                      │       │
│  │ 2. 冒号表示法:                                        │       │
│  │    data:user:profile:settings:theme                  │       │
│  │                                                      │       │
│  │ 3. 混合点表示法:                                       │       │
│  │    data['user']['profile'].settings.theme            │       │
│  │    data:user:profile.settings.theme                  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  PostgreSQL 兼容的操作符:                                        │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 箭头操作符:                                        │       │
│  │    data->'user'->'profile'->'settings'->'theme'      │       │
│  │    data->>'user'  (返回文本而不是 JSON)                │       │
│  │                                                      │       │
│  │ 2. 路径操作符:                                        │       │
│  │    data#>'{user,profile,settings,theme}'             │       │
│  │    data#>>'{user,profile,settings,theme}'            │       │
│  │                                                      │       │
│  │ 3. 包含操作符:                                        │       │
│  │    data @> '{"user":{"profile":{"name":"Alice"}}}'   │       │
│  │    data ? 'user'  (检查键是否存在)                    │       │
│  │                                                      │       │
│  │ 4. 修改操作符:                                        │       │
│  │    data - 'user'  (删除键)                           │       │
│  │    data || '{"new_field":123}'  (连接)                │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

更多关于访问语法的详细信息，请参考 [Variant 文档](/sql/sql-reference/data-types/variant#accessing-elements-in-json) 和 [JSON 操作符文档](/sql/sql-commands/query-operators/json)。

### 丰富的功能支持

Databend 提供了一套全面的 JSON 数据处理函数，按其用途组织：
```

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON 函数分类                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 基础操作:                                                  │
│     • 解析和验证:                                               │
│       - PARSE_JSON, CHECK_JSON                                  │
│     • 对象访问和提取:                                           │
│       - GET, GET_PATH, GET_IGNORE_CASE, OBJECT_KEYS             │
│     • 类型检查和转换:                                           │
│       - JSON_TYPEOF, AS_TYPE, IS_ARRAY, IS_OBJECT, IS_STRING    │
│                                                                 │
│  2. 构造和修改:                                                │
│     • JSON 对象操作:                                            │
│       - JSON_OBJECT, JSON_OBJECT_INSERT, JSON_OBJECT_DELETE     │
│       - JSON_OBJECT_PICK, JSON_STRIP_NULLS                      │
│     • JSON 数组操作:                                            │
│       - JSON_ARRAY, JSON_ARRAY_INSERT, JSON_ARRAY_DISTINCT      │
│       - FLATTEN                                                 │
│                                                                 │
│  3. 高级查询和转换:                                              │
│     • 路径查询:                                                 │
│       - JSON_PATH_EXISTS, JSON_PATH_QUERY, JSON_PATH_QUERY_ARRAY│
│       - JSON_EXTRACT_PATH_TEXT, JQ                              │
│     • 数组转换:                                                │
│       - JSON_ARRAY_MAP, JSON_ARRAY_FILTER, JSON_ARRAY_TRANSFORM │
│       - JSON_ARRAY_APPLY, JSON_ARRAY_REDUCE                     │
│     • 集合操作:                                                 │
│       - JSON_ARRAY_INTERSECTION, JSON_ARRAY_EXCEPT              │
│       - JSON_ARRAY_OVERLAP                                      │
│     • 对象转换:                                                 │
│       - JSON_MAP_FILTER, JSON_MAP_TRANSFORM_KEYS/VALUES         │
│     • 扩展和格式化:                                               │
│       - JSON_ARRAY_ELEMENTS, JSON_EACH, JSON_PRETTY             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

完整的 JSON 函数列表请参考 [半结构化函数文档](/sql/sql-functions/semi-structured-functions/)。

## 性能对比

Databend 的虚拟列技术提供了显著的性能优势：

```
┌─────────────────────────────────────────────────────────────────┐
│                 性能对比                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  查询: SELECT data['account_balance'],                         │
│         data['address']['city'], data['phone']                  │
│         FROM user_activity_logs                                 │
│                                                                 │
│  没有虚拟列:                                                   │
│  - 3.763 秒                                                     │
│  - 11.90 GiB 已处理                                            │
│                                                                 │
│  使用虚拟列:                                                   │
│  - 1.316 秒 (快 3 倍)                                           │
│  - 461.34 MiB 已处理 (数据减少 26 倍)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

对于复杂的嵌套结构，优势仍然非常明显：

```
┌─────────────────────────────────────────────────────────────────┐
│  查询: SELECT data['purchase_history'],                        │
│         data['wishlist'], data['last_purchase']['item']         │
│         FROM user_activity_logs                                 │
│                                                                 │
│  没有虚拟列:                                                   │
│  - 5.509 秒                                                     │
│  - 11.90 GiB 已处理                                            │
│                                                                 │
│  使用虚拟列:                                                   │
│  - 3.924 秒 (快 1.4 倍)                                          │
│  - 2.15 GiB 已处理 (数据减少 5.5 倍)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Databend Variant 数据的优势

Databend 的 Variant 类型提供了四个主要优势：

1. **Snowflake 兼容性**
   - 兼容的语法和函数
   - 熟悉的访问模式：`data['field']`，`data:field`，`data.field`
   - 无缝迁移路径

2. **卓越的性能**
   - 查询执行速度提高 3 倍
   - 数据扫描减少 26 倍
   - 常见路径的自动虚拟列

3. **高级 JSON 功能**
   - 丰富的函数集，用于复杂操作
   - 与 PostgreSQL 兼容的路径查询
   - 强大的数组和对象转换

4. **成本效益**
   - 优化的 JSONB 二进制存储
   - 无需模式定义
   - 降低存储和计算成本

Databend 结合了 Snowflake 的熟悉性以及增强的性能和成本效益，使其成为现代数据分析工作负载的理想选择。
