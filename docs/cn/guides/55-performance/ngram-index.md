---
title: Ngram 索引
---

# Ngram 索引：LIKE 查询的高速模式匹配

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Ngram 索引通过带通配符 (`%`) 的 `LIKE` 操作符加速模式匹配查询，无需全表扫描即可实现快速子字符串搜索。

## 解决什么问题？

`LIKE` 模式匹配在大数据集上存在显著性能挑战：

| 问题 | 影响 | Ngram 索引解决方案 |
|---------|--------|---------------------|
| **通配符搜索慢** | `WHERE content LIKE '%keyword%'` 需扫描全表 | 使用 n-gram 片段预过滤数据块 |
| **全表扫描** | 每次模式搜索都需读取所有行 | 仅读取包含模式的相关数据块 |
| **搜索性能差** | 子字符串搜索结果等待时间长 | 亚秒级模式匹配响应时间 |
| **传统索引失效** | B-tree 索引无法优化中间通配符 | 字符级索引处理任意通配符位置 |

**示例**：在 1000 万条日志中搜索 `'%error log%'`。无 ngram 索引时需扫描全部 1000 万行；使用 ngram 索引可立即预过滤至约 1000 个相关数据块。

## Ngram 索引 vs 全文索引：如何选择？

| 特性 | Ngram 索引 | 全文索引 |
|---------|-------------|-----------------|
| **主要用途** | `LIKE '%pattern%'` 模式匹配 | `MATCH()` 语义文本搜索 |
| **搜索类型** | 精确子字符串匹配 | 基于词汇的搜索（含相关性） |
| **查询语法** | `WHERE column LIKE '%text%'` | `WHERE MATCH(column, 'text')` |
| **高级功能** | 不区分大小写匹配 | 模糊搜索、相关性评分、布尔运算符 |
| **性能重点** | 加速现有 LIKE 查询 | 用高级搜索替代 LIKE |
| **适用场景** | 日志分析、代码搜索、精确匹配 | 文档搜索、内容发现、搜索引擎 |

**选择 Ngram 索引当：**
- 需优化现有 `LIKE '%pattern%'` 查询
- 要求精确子字符串匹配（不区分大小写）
- 处理日志、代码或 ID 等结构化数据
- 需提升性能但不改变查询语法

**选择全文索引当：**
- 为文档或内容构建搜索功能
- 需要模糊搜索、相关性评分或复杂查询
- 处理自然语言文本
- 需要超越简单模式匹配的高级搜索能力

## 工作原理

Ngram 索引将文本拆分为重叠字符子串（n-gram）实现快速模式查找：

**`gram_size = 3` 示例：**
```text
输入: "The quick brown"
N-grams: "The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

**查询处理流程：**
```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```
1. 模式 `'quick br'` 拆解为 n-gram: "qui", "uic", "ick", "ck ", "k b", " br"
2. 索引过滤包含这些 n-gram 的数据块
3. 完整 `LIKE` 过滤仅作用于预筛选数据块

:::note **关键限制**
- 模式长度至少需 `gram_size` 字符（如 `gram_size=3` 时 `'%yo%'` 无法使用索引）
- 匹配不区分大小写（"FOO" 可匹配 "foo", "Foo", "fOo"）
- 仅支持 `LIKE` 操作符，不适用其他模式匹配函数
:::

## 快速设置

```sql
-- Create table with text content
CREATE TABLE logs(id INT, message STRING);

-- Create ngram index with 3-character segments
CREATE NGRAM INDEX logs_message_idx ON logs(message) gram_size = 3;

-- Insert data (automatically indexed)
INSERT INTO logs VALUES (1, 'Application error occurred');

-- Search using LIKE - automatically optimized
SELECT * FROM logs WHERE message LIKE '%error%';
```

## 完整示例

创建 ngram 索引进行日志分析并验证性能优势：

```sql
-- Create table for application logs
CREATE TABLE t_articles (
    id INT,
    content STRING
);

-- Create ngram index with 3-character segments
CREATE NGRAM INDEX ngram_idx_content
ON t_articles(content)
gram_size = 3;

-- Verify index creation
SHOW INDEXES;
```

```sql
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        name       │  type  │ original │            definition            │         created_on         │      updated_on     │
├───────────────────┼────────┼──────────┼──────────────────────────────────┼────────────────────────────┼─────────────────────┤
│ ngram_idx_content │ NGRAM  │          │ t_articles(content)gram_size='3' │ 2025-05-13 01:02:58.598409 │ NULL                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

```sql
-- Insert test data: 995 irrelevant rows + 5 target rows
INSERT INTO t_articles
SELECT number, CONCAT('Random text number ', number)
FROM numbers(995);

INSERT INTO t_articles VALUES
    (1001, 'The silence was deep and complete'),
    (1002, 'They walked in silence through the woods'),
    (1003, 'Silence fell over the room'),
    (1004, 'A moment of silence was observed'),
    (1005, 'In silence, they understood each other');

-- Search with pattern matching
SELECT id, content FROM t_articles WHERE content LIKE '%silence%';

-- Verify index usage
EXPLAIN SELECT id, content FROM t_articles WHERE content LIKE '%silence%';
```

**性能结果：**
```sql
-[ EXPLAIN ]-----------------------------------
TableScan
├── table: default.default.t_articles
├── output columns: [id (#0), content (#1)]
├── read rows: 5
├── read size: < 1 KiB
├── partitions total: 2
├── partitions scanned: 1
├── pruning stats: [segments: <range pruning: 2 to 2>, blocks: <range pruning: 2 to 2, bloom pruning: 2 to 1>]
├── push downs: [filters: [is_true(like(t_articles.content (#1), '%silence%'))], limit: NONE]
└── estimated rows: 15.62
```

**关键指标：** `bloom pruning: 2 to 1` 表明 ngram 索引在扫描前成功过滤了 50% 数据块。

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **选择合适的 gram_size** | `gram_size=3` 适用多数场景；更长模式用更大值 |
| **索引高频搜索列** | 聚焦于 `LIKE '%pattern%'` 查询使用的列 |
| **监控索引使用** | 通过 `EXPLAIN` 验证 `bloom pruning` 统计 |
| **注意模式长度** | 确保搜索模式长度 ≥ `gram_size` |

## 核心命令

完整命令参考详见 [Ngram 索引](/sql/sql-commands/ddl/ngram-index/)。

| 命令                                                       | 用途                   |
|----------------------------------------------------------|----------------------|
| `CREATE NGRAM INDEX name ON table(column) gram_size = N` | 创建含 N 字符片段的 ngram 索引 |
| `SHOW INDEXES`                                           | 列出所有索引（含 ngram 索引）   |
| `REFRESH NGRAM INDEX name ON table`                      | 刷新 ngram 索引          |
| `DROP NGRAM INDEX name ON table`                         | 删除 ngram 索引          |

:::tip **使用场景**
**适用：**
- 日志分析与监控系统
- 代码搜索与模式匹配
- 产品目录搜索
- 高频使用 `LIKE '%pattern%'` 的应用

**不适用：**
- 短模式搜索（短于 `gram_size` 字符）
- 精确字符串匹配（应使用等值比较）
- 复杂文本搜索（应使用全文索引）
:::

---

*Ngram 索引是大型文本数据集上实现 `LIKE` 查询高速模式匹配的关键组件。*