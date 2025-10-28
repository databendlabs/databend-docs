---
title: "Databend JSON (Variant) 工作原理"
sidebar_label: "Databend JSON 工作原理"
---

另请参阅：

- [Variant 数据类型](/sql/sql-reference/data-types/variant)
- [半结构化函数](/sql/sql-functions/semi-structured-functions/)

Databend 通过“原生 JSONB 存储 + 自动 JSON 索引”这套组合，把半结构化数据当成一等公民来处理。

## 为什么值得关注 Variant

使用 Databend 时，你可以直接载入原始 JSON，再用熟悉的 SQL 查询；性能优化全部交给系统完成。其背后有两大基石：

- 轻量的 **JSONB 二进制格式**，让执行引擎始终掌握字段的真实类型。
- 自动生成的 **虚拟列**（JSON 索引），把常用路径提前抽取出来，无需人工干预。

本文将沿着“orders.data”这样的示例字段，讲清这些能力如何把一份原始 JSON 转成可高效扫描的关系型列。

## JSON 存储布局

Databend 采用 JSONB 对 Variant 值进行存储，这套格式有几个直接好处：

- **类型原样保留**：数字、布尔、时间戳、十进制等都以原生形式保存，比较时无需转换。
- **结构稳定**：字段带有长度信息并按固定顺序排列，避免了重复解析。
- **零拷贝访问**：执行算子可以直接读取 JSONB 缓冲区，不需要把 JSON 文本重新拼出来。

每一列 Variant 数据都会保留完整的 JSONB 原文；当系统发现 `data['user']['id']` 等路径被频繁访问时，会额外生成带类型的“侧边列”，方便后续下推。

## 自动生成 JSON 索引

新的数据块写入时，Databend 会立刻启动一条轻量级流水线，判断哪些 JSON 路径值得生成虚拟列——这就是 Databend 内置的 JSON 索引。

### 写入流程

Databend 会在数据流入的同时分析常见模式，并把它们转换成带类型的列：

```
┌───────────────────────────────────────────────┐
│ Variant Ingestion Flow                        │
├──────────────┬────────────────────────────────┤
│ Sample Rows  │ Peek at the first rows in block │
│ Detect Paths │ Keep stable leaf key paths      │
│ Infer Types  │ Pick native column types        │
│ Materialize  │ Write values to virtual Parquet │
│ Register     │ Attach metadata to base column  │
└──────────────┴────────────────────────────────┘
```

### 轻量策略

为了保证速度，系统做了几层约束：

- 只抽样每个数据块最前面的 10 行，快速了解文档结构。
- 路径如果大部分是 NULL，或者指向对象、数组等非叶子节点，就不再继续。
- 只有样本里保持稳定的叶子节点才会晋升为虚拟列，每个数据块最多生成 1,000 个。
- 内部使用哈希缓存，避免同一条路径被反复分析。
- 如果没有路径符合条件，Databend 仍然保留完整的 JSONB 原文，查询结果不会受到影响。

最终效果是：你只管写入 JSON，Databend 会自动把常见访问模式变成带类型的列，不用写一行 DDL，也不用调任何参数。

### 虚拟列 = JSON 索引

在这种语境下，“虚拟列”就等同于 Databend 的 JSON 索引。系统会判断 `data['items'][0]['price']` 这样的路径是否稳定，再推断合适的类型，把对应的值写入列式文件并附带元信息。嵌套 JSON 会继续以 JSONB 形式保存，基础类型则直接落成数字、字符串或布尔列。

```
Raw JSON block ──(auto sampling)──▶ Candidate paths ──(stable?)──▶ JSON index
```

实质上，Databend 把频繁访问的 JSON 片段拍成列式快照，而不是维护额外的 B-tree。

### 元数据结构

这些虚拟列会连同主数据块一起被写入表快照，每条记录都会记住 JSON 路径、推断出的类型、在文件中的偏移范围以及统计信息。这样一来，Databend 需要时可以直接跳到这些抽取出来的值；如果没有命中索引，也能随时退回原始 JSON。

## 查询阶段如何利用索引

索引准备好之后，读取流程就变成三步判断：

```
┌──────────────┐   rewrite paths   ┌────────────────────┐
│ SQL Planner  │------------------>│ Virtual Column Map │
└──────┬───────┘                   └─────────┬──────────┘
       │ pushdown request                   │ per-block check
       ▼                                    ▼
┌──────────────┐   has virtual?   ┌────────────────────┐
│ Fuse Storage │----------------->│ Virtual File Read  │
└──────┬───────┘        │        └─────────┬──────────┘
       │ no             └------------------┘ fallback
       ▼
┌──────────────┐
│ JSONB Reader │
└──────┬───────┘
       ▼
┌──────────────┐
│ Query Output │
└──────────────┘
```

- 在规划阶段，Databend 会把 `get_by_keypath` 之类的调用直接改写成读取虚拟列。
- 如果索引存在，存储层只读取那几列的 Parquet 片段；当所有目标路径都有索引时，还能跳过原始 JSON。
- 如果没有索引，系统会在 JSONB 原文上实时执行路径提取，语义不变。
- 无论哪种情况，后续的筛选、投影、统计都基于原生类型完成，再也不需要重建 JSON 字符串。

同时，系统会记录每个虚拟列对应的 JSON 路径和原始列，这样就能判断什么时候可以完全跳过原文，什么时候必须重新打开它。

## 与 Variant 交互

索引准备好之后，日常使用依旧是熟悉的语法和函数。

### 访问语法

Databend 同时支持 Snowflake 风格和 PostgreSQL 风格的选择器，所有语法都会走同一套路径解析器，自动复用 JSON 索引。例如读取 `orders` 表时，可以这样获取嵌套字段：

```sql title="Snowflake-style examples"
SELECT data['user']['profile']['name'],
       data:user:profile.settings.theme,
       data['items'][0]['price']
FROM orders;
```

```sql title="PostgreSQL-style examples"
SELECT data->'user'->'profile'->>'name',
       data#>>'{user,profile,settings,theme}',
       data @> '{"user":{"id":123}}'
FROM orders;
```

### 函数组合

除了路径选择器，Databend 还提供一整套 Variant 常用函数：

- **解析与类型转换**：`parse_json`、`try_parse_json`、`to_variant`、`to_jsonb_binary`
- **导航与投射**：`get_path`、`get_by_keypath`、`flatten`、箭头/路径/包含运算符
- **修改操作**：`object_insert`、`object_remove_keys`、拼接 (`||`)、`array_*` 系列
- **分析场景**：`json_extract_keys`、`json_length`、`jsonb_array_elements`、`json_array_agg`

这些函数都直接作用于 JSONB 缓冲区，并运行在 Databend 的向量化执行引擎中。

## 性能观察

- 与直接扫描文本 JSON 相比：
  - 单路径查询可做到 **约 3 倍提速**，同时 **数据扫描量减少至原本的 1/26**。
  - 多路径读取也能实现 **约 1.4 倍提速**，**扫描数据降低到原来的 1/5.5**。
  - 虚拟列条件下推还能与其他索引（布隆过滤、倒排索引等）叠加，进一步减少读取块。
- JSON 结构越稳定，索引覆盖度越高，收益就越明显。

## Variant 的综合价值

- **与 Snowflake 语法兼容**：现有 SQL、UDF 无需改写。
- **原生 JSONB 执行**：避免字符串转换，让算子始终处理真实类型。
- **自动 JSON 索引**：写入时即时抽样、记录元数据、查询时自动下推。
- **运维成本低**：虚拟列与 Fuse 表的常规块共享生命周期策略，存储与算力一目了然。

借助这套机制，Databend 让灵活的 JSON 与高性能分析真正合二为一——半结构化数据在数仓里也能享受一等待遇。
