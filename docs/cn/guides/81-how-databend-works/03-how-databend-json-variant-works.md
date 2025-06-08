title: "Databend JSON (Variant) 工作原理"
sidebar_label: "Databend JSON 工作原理"
---

另请参阅：

- [Variant 数据类型](/sql/sql-reference/data-types/variant)
- [半结构化函数](/sql/sql-functions/semi-structured-functions/)

## 核心概念

Databend 的 Variant 类型是一种灵活的数据类型，专为处理 JSON 等半结构化数据而设计。它提供与 Snowflake 兼容的语法和函数，同时通过高效的存储格式和优化的访问机制实现高性能。Databend 中大多数与 Variant 相关的函数都与其 Snowflake 对应函数直接兼容，为熟悉 Snowflake JSON 处理能力的用户提供了无缝的迁移体验。

```
┌─────────────────────────────────────────────────────────────────┐
│ Variant 类型核心组件                                            │
├─────────────────┬───────────────────────────────────────────────┤
│ 存储格式        │ 基于 JSONB 的二进制存储                       │
│ 虚拟列          │ 自动提取 JSON 路径                            │
│ 访问方法        │ 多种路径导航语法选项                          │
│ 函数            │ 丰富的 JSON 操作函数集                        │
└─────────────────┴───────────────────────────────────────────────┘
```

## 写入 Variant 数据

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant 写入过程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JSON 输入：                                                    │
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
│  JSONB 编码：                                                   │
│  [包含类型信息和优化结构的二进制格式]                           │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  虚拟列提取：                                                   │
│  - ['customer_id'] → Int64 列                                   │
│  - ['order_id'] → Int64 列                                      │
│  - ['items'][0]['name'] → String 列                             │
│  - ['items'][0]['price'] → Float64 列                           │
│  - ['items'][1]['name'] → String 列                             │
│  - ['items'][1]['price'] → Float64 列                           │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  存储：                                                         │
│  - 主 JSONB 列（完整文档）                                      │
│  - 虚拟列（提取的路径）                                         │
│  - 元数据更新                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### JSONB 存储格式

Databend 使用 [JSONB 二进制格式](https://github.com/databendlabs/jsonb) 来高效存储 JSON 数据。这种自定义格式具有以下特点：

- **类型保留**：维护数据类型（数字、字符串、布尔值）。
- **结构优化**：通过高效索引保留嵌套结构。
- **空间效率**：比文本 JSON 更紧凑。
- **直接二进制操作**：无需完整解析即可执行操作。

[databendlabs/jsonb](https://github.com/databendlabs/jsonb) 库实现了这种二进制格式，以最小的开销提供高性能的 JSON 操作。

### 虚拟列生成

在数据摄取 (data ingestion) 过程中，Databend 会自动分析 JSON 结构并创建虚拟列 (virtual columns)：

```
┌─────────────────────────────────────────────────────────────────┐
│                 虚拟列处理过程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  嵌套 JSON：                                                    │
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
│  路径提取：                                                     │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON 路径               │ 推断类型        │                  │
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
│  已创建虚拟列                                                   │
│  [每个路径都成为一个具有原生类型的独立列]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 读取 Variant 数据

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variant 读取过程                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SQL 查询：                                                     │
│  SELECT data['user']['profile']['name'],                        │
│         data['user']['orders'][0]['total']                      │
│  FROM customer_data                                             │
│  WHERE data['user']['id'] = 123                                 │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  路径分析：                                                     │
│  ┌─────────────────────────┬─────────────────┐                  │
│  │ JSON 路径               │ 是否为虚拟列？  │                  │
│  ├─────────────────────────┼─────────────────┤                  │
│  │ ['user']['id']          │ 是 (Int64)      │                  │
│  │ ['user']['profile']['name'] │ 是 (String) │                 │
│  │ ['user']['orders'][0]['total'] │ 是 (Float64) │             │
│  └─────────────────────────┴─────────────────┘                  │
│                                                                 │
│         ▼                                                       │
│                                                                 │
│  优化执行：                                                     │
│  1. 在 ['user']['id'] 虚拟列上应用筛选器                        │
│  2. 仅读取所需的虚拟列：                                        │
│     - ['user']['profile']['name']                               │
│     - ['user']['orders'][0]['total']                            │
│  3. 跳过读取主 JSONB 列                                         │
│  4. 直接从虚拟列返回结果                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 多种访问模式

Databend 支持多种语法选项来访问和操作 JSON 数据，包括与 Snowflake 和 PostgreSQL 兼容的模式：

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON 访问语法选项                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  原始 JSON：                                                    │
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
│  Snowflake 兼容的访问方式：                                     │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 方括号表示法：                                    │       │
│  │    data['user']['profile']['settings']['theme']      │       │
│  │                                                      │       │
│  │ 2. 冒号表示法：                                      │       │
│  │    data:user:profile:settings:theme                  │       │
│  │                                                      │       │
│  │ 3. 点号混合表示法：                                  │       │
│  │    data['user']['profile'].settings.theme            │       │
│  │    data:user:profile.settings.theme                  │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
│  PostgreSQL 兼容的操作符：                                      │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ 1. 箭头操作符：                                      │       │
│  │    data->'user'->'profile'->'settings'->'theme'      │       │
│  │    data->>'user'  (返回文本而非 JSON)                │       │
│  │                                                      │       │
│  │ 2. 路径操作符：                                      │       │
│  │    data#>'{user,profile,settings,theme}'             │       │
│  │    data#>>'{user,profile,settings,theme}'            │       │
│  │                                                      │       │
│  │ 3. 包含操作符：                                      │       │
│  │    data @> '{"user":{"profile":{"name":"Alice"}}}'   │       │
│  │    data ? 'user'  (检查键是否存在)                   │       │
│  │                                                      │       │
│  │ 4. 修改操作符：                                      │       │
│  │    data - 'user'  (移除键)                           │       │
│  │    data || '{"new_field":123}'  (拼接)               │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

有关访问语法的更多详细信息，请参阅 [Variant 文档](/sql/sql-reference/data-types/variant#accessing-elements-in-json)和 [JSON 操作符文档](/sql/sql-commands/query-operators/json)。

### 丰富的函数支持

Databend 提供了一套全面的函数，用于处理 JSON 数据，并按其用途进行组织：

```
┌─────────────────────────────────────────────────────────────────┐
│                 JSON 函数分类                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 基本操作：                                                  │
│     • 解析与验证：                                              │
│       - PARSE_JSON, CHECK_JSON                                  │
│     • 对象访问与提取：                                          │
│       - GET, GET_PATH, GET_IGNORE_CASE, OBJECT_KEYS             │
│     • 类型检查与转换：                                          │
│       - JSON_TYPEOF, AS_TYPE, IS_ARRAY, IS_OBJECT, IS_STRING    │
│                                                                 │
│  2. 构造与修改：                                                │
│     • JSON 对象操作：                                           │
│       - JSON_OBJECT, JSON_OBJECT_INSERT, JSON_OBJECT_DELETE     │
│       - JSON_OBJECT_PICK, JSON_STRIP_NULLS                      │
│     • JSON 数组操作：                                           │
│       - JSON_ARRAY, JSON_ARRAY_INSERT, JSON_ARRAY_DISTINCT      │
│       - FLATTEN                                                 │
│                                                                 │
│  3. 高级查询与转换：                                            │
│     • 路径查询：                                                │
│       - JSON_PATH_EXISTS, JSON_PATH_QUERY, JSON_PATH_QUERY_ARRAY│
│       - JSON_EXTRACT_PATH_TEXT, JQ                              │
│     • 数组转换：                                                │
│       - JSON_ARRAY_MAP, JSON_ARRAY_FILTER, JSON_ARRAY_TRANSFORM │
│       - JSON_ARRAY_APPLY, JSON_ARRAY_REDUCE                     │
│     • 集合操作：                                                │
│       - JSON_ARRAY_INTERSECTION, JSON_ARRAY_EXCEPT              │
│       - JSON_ARRAY_OVERLAP                                      │
│     • 对象转换：                                                │
│       - JSON_MAP_FILTER, JSON_MAP_TRANSFORM_KEYS/VALUES         │
│     • 展开与格式化：                                            │
│       - JSON_ARRAY_ELEMENTS, JSON_EACH, JSON_PRETTY             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

完整的 JSON 函数列表可在[半结构化函数文档](/sql/sql-functions/semi-structured-functions/)中找到。


## 性能比较

Databend 的虚拟列技术提供了显著的性能优势：

```
┌─────────────────────────────────────────────────────────────────┐
│                 性能比较                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  查询：SELECT data['account_balance'],                          │
│         data['address']['city'], data['phone']                  │
│         FROM user_activity_logs                                 │
│                                                                 │
│  不使用虚拟列：                                                 │
│  - 3.763 秒                                                     │
│  - 处理 11.90 GiB 数据                                          │
│                                                                 │
│  使用虚拟列：                                                   │
│  - 1.316 秒（快 3 倍）                                          │
│  - 处理 461.34 MiB 数据（数据量减少 26 倍）                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

对于复杂的嵌套结构，其优势仍然十分可观：

```
┌─────────────────────────────────────────────────────────────────┐
│  查询：SELECT data['purchase_history'],                         │
│         data['wishlist'], data['last_purchase']['item']         │
│         FROM user_activity_logs                                 │
│                                                                 │
│  不使用虚拟列：                                                 │
│  - 5.509 秒                                                     │
│  - 处理 11.90 GiB 数据                                          │
│                                                                 │
│  使用虚拟列：                                                   │
│  - 3.924 秒（快 1.4 倍）                                        │
│  - 处理 2.15 GiB 数据（数据量减少 5.5 倍）                      │
└─────────────────────────────────────────────────────────────────┘
```

## Databend 在 Variant 数据处理上的优势

Databend 的 Variant 类型具有四大核心优势：

1. **Snowflake 兼容性**
   - 兼容的语法和函数
   - 熟悉的访问模式：`data['field']`、`data:field`、`data.field`
   - 无缝的迁移路径

2. **卓越的性能**
   - 查询执行速度提升 3 倍
   - 数据扫描量减少 26 倍
   - 为常用路径自动创建虚拟列

3. **强大的 JSON 处理能力**
   - 丰富的函数集，支持复杂操作
   - 兼容 PostgreSQL 的路径查询
   - 强大的数组和对象转换功能

4. **成本效益**
   - 优化的 JSONB 二进制存储
   - 无需定义模式
   - 降低存储和计算成本

Databend 融合了 Snowflake 的易用性与更强的性能及成本效益，是现代数据分析工作负载的理想选择。