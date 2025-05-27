---
title: Virtual Column
---

# 虚拟列：JSON 数据的自动加速

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

虚拟列 (Virtual Column) 自动加速对存储在 [VARIANT](/sql/sql-reference/data-types/variant) 列中的半结构化数据的查询。此功能为 JSON 数据访问提供了**零配置的性能优化**。

## 解决了什么问题？

查询 JSON 数据时，传统数据库在每次访问嵌套字段时都必须解析整个 JSON 结构。这会造成性能瓶颈：

| 问题 | 影响 | 虚拟列解决方案 |
|---------|--------|------------------------|
| **查询延迟** | 复杂的 JSON 查询需要数秒 | 亚秒级响应时间 |
| **过度数据读取** | 即使只读取单个字段也必须读取整个 JSON 文档 | 只读取所需的特定字段 |
| **JSON 解析缓慢** | 每次查询都重新解析整个 JSON 文档 | 预物化字段以实现即时访问 |
| **CPU 使用率高** | JSON 遍历消耗处理能力 | 像常规数据一样直接读取列 |
| **内存开销** | 将完整的 JSON 结构加载到内存中 | 只加载所需字段 |

**示例场景**：一个电商分析表，其中包含 JSON 格式的产品数据。如果没有虚拟列，查询数百万行中的 `product_data['category']` 需要解析每个 JSON 文档。有了虚拟列，它就变成了直接的列查找。

## 自动工作原理

1. **数据摄取** → Databend 分析 VARIANT 列中的 JSON 结构
2. **智能检测** → 系统识别频繁访问的嵌套字段
3. **后台优化** → 自动创建虚拟列
4. **查询加速** → 查询自动使用优化路径

![Virtual Column Workflow](/img/sql/virtual-column.png)

## 配置

```sql
-- 启用该功能（实验性）
SET enable_experimental_virtual_column = 1;

-- 可选：控制自动刷新行为
SET enable_refresh_virtual_column_after_write = 1;  -- 默认：启用
```

## 完整示例

此示例演示了虚拟列的自动创建和性能优势：

```sql
SET enable_experimental_virtual_column=1;

-- 创建一个名为 'test' 的表，包含 'id'（整型）和 'val'（Variant 类型）列。
CREATE TABLE test(id int, val variant);

-- 向 'test' 表插入包含 Variant 数据的示例记录。
INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend","tags":["powerful","fast"],"pricings":[{"type":"Standard","price":"Pay as you go"},{"type":"Enterprise","price":"Custom"}]}'
  ),
  (
    2,
    '{"id":2,"name":"databricks","tags":["scalable","flexible"],"pricings":[{"type":"Free","price":"Trial"},{"type":"Premium","price":"Subscription"}]}'
  ),
  (
    3,
    '{"id":3,"name":"snowflake","tags":["cloud-native","secure"],"pricings":[{"type":"Basic","price":"Pay per second"},{"type":"Enterprise","price":"Annual"}]}'
  ),
  (
    4,
    '{"id":4,"name":"redshift","tags":["reliable","scalable"],"pricings":[{"type":"On-Demand","price":"Pay per usage"},{"type":"Reserved","price":"1 year contract"}]}'
  ),
  (
    5,
    '{"id":5,"name":"bigquery","tags":["innovative","cost-efficient"],"pricings":[{"type":"Flat Rate","price":"Monthly"},{"type":"Flex","price":"Per query"}]}'
  );

INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;
INSERT INTO test SELECT * FROM test;

-- 解释从表中选择特定字段的查询执行计划。
EXPLAIN
SELECT
  val ['name'],
  val ['tags'] [0],
  val ['pricings'] [0] ['type']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
Exchange
├── output columns: [test.val['name'] (#3), test.val['pricings'][0]['type'] (#5), test.val['tags'][0] (#8)]
├── exchange type: Merge
└── TableScan
    ├── table: default.default.test
    ├── output columns: [val['name'] (#3), val['pricings'][0]['type'] (#5), val['tags'][0] (#8)]
    ├── read rows: 160
    ├── read size: 1.69 KiB
    ├── partitions total: 6
    ├── partitions scanned: 6
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 6 to 6>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name'], val['pricings'][0]['type'], val['tags'][0]]
    └── estimated rows: 160.00

-- 解释从表中仅选择 'name' 字段的查询执行计划。
EXPLAIN
SELECT
  val ['name']
FROM
  test;

-[ EXPLAIN ]-----------------------------------
Exchange
├── output columns: [test.val['name'] (#2)]
├── exchange type: Merge
└── TableScan
    ├── table: default.book_db.test
    ├── output columns: [val['name'] (#2)]
    ├── read rows: 160
    ├── read size: < 1 KiB
    ├── partitions total: 16
    ├── partitions scanned: 16
    ├── pruning stats: [segments: <range pruning: 6 to 6>, blocks: <range pruning: 16 to 16>]
    ├── push downs: [filters: [], limit: NONE]
    ├── virtual columns: [val['name']]
    └── estimated rows: 160.00

-- 显示所有自动生成的虚拟列。
SHOW VIRTUAL COLUMNS WHERE table='test';

╭────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ database │  table │ source_column │ virtual_column_id │    virtual_column_name   │ virtual_column_type │
│  String  │ String │     String    │       UInt32      │          String          │        String       │
├──────────┼────────┼───────────────┼───────────────────┼──────────────────────────┼─────────────────────┤
│ default  │ test   │ val           │        3000000000 │ ['id']                   │ UInt64              │
│ default  │ test   │ val           │        3000000001 │ ['name']                 │ String              │
│ default  │ test   │ val           │        3000000002 │ ['pricings'][0]['price'] │ String              │
│ default  │ test   │ val           │        3000000003 │ ['pricings'][0]['type']  │ String              │
│ default  │ test   │ val           │        3000000004 │ ['pricings'][1]['price'] │ String              │
│ default  │ test   │ val           │        3000000005 │ ['pricings'][1]['type']  │ String              │
│ default  │ test   │ val           │        3000000006 │ ['tags'][0]              │ String              │
│ default  │ test   │ val           │        3000000007 │ ['tags'][1]              │ String              │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

## 监控命令

| 命令 | 用途 |
|---------|---------|
| [`SHOW VIRTUAL COLUMNS`](/sql/sql-commands/ddl/virtual-column/show-virtual-columns) | 查看自动创建的虚拟列 |
| [`REFRESH VIRTUAL COLUMN`](/sql/sql-commands/ddl/virtual-column/refresh-virtual-column) | 手动刷新虚拟列 |
| [`FUSE_VIRTUAL_COLUMN`](/sql/sql-functions/system-functions/fuse_virtual_column) | 查看虚拟列元数据 |

## 性能结果

虚拟列通常提供：
- JSON 字段访问速度**快 5-10 倍**
- **无需更改查询**即可实现自动优化
- 查询处理期间**资源消耗降低**
- 对现有应用程序的**透明加速**

---

*虚拟列在后台自动工作 - 只需启用该功能，让 Databend 优化您的 JSON 查询。*