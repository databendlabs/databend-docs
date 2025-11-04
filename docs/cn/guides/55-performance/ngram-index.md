---
title: Ngram 索引
---

# Ngram 索引（Ngram Index）：为 LIKE 查询实现快速模式匹配

Ngram 索引（Ngram Index）能够加速使用 `LIKE` 操作符和通配符（`%`）的模式匹配查询，实现快速的子字符串搜索，而无需进行全表扫描。

## 它解决了什么问题？

在使用 `LIKE` 进行模式匹配查询时，大型数据集会面临严峻的性能挑战：

| 问题 | 影响 | Ngram 索引（Ngram Index）解决方案 |
|---------|--------|---------------------|
| **通配符搜索缓慢** | `WHERE content LIKE '%keyword%'` 会扫描整个表 | 使用 n-gram 片段预过滤数据块 |
| **全表扫描** | 每次模式搜索都会读取所有行 | 仅读取包含模式的相关数据块 |
| **搜索性能不佳** | 用户等待子字符串搜索结果的时间很长 | 亚秒级模式匹配响应时间 |
| **传统索引效率低下** | B-tree 索引无法优化中间的通配符 | 字符级索引可处理任何通配符位置 |

**示例**：在 1000 万条日志条目中搜索 `'%error log%'`。如果没有 Ngram 索引（Ngram Index），查询会扫描全部 1000 万行。而使用 Ngram 索引（Ngram Index），查询可以立即将范围预过滤到约 1000 个相关的数据块。

## Ngram 索引 vs 全文索引：如何选择？

| 特性 | Ngram 索引（Ngram Index） | 全文索引（Full-Text Index） |
|---------|-------------|-----------------|
| **主要使用场景** | 使用 `LIKE '%pattern%'` 进行模式匹配 | 使用 `MATCH()` 进行语义文本搜索 |
| **搜索类型** | 精确子字符串匹配 | 基于词语的相关性搜索 |
| **查询语法** | `WHERE column LIKE '%text%'` | `WHERE MATCH(column, 'text')` |
| **高级功能** | 不区分大小写的匹配 | 模糊搜索、相关性评分、布尔运算符 |
| **性能重点** | 加速现有的 LIKE 查询 | 用高级搜索功能替代 LIKE |
| **最适合** | 日志分析、代码搜索、精确模式匹配 | 文档搜索、内容发现、搜索引擎 |

**选择 Ngram 索引（Ngram Index）的情况：**
- 您需要优化现有的 `LIKE '%pattern%'` 查询
- 需要精确的子字符串匹配（不区分大小写）
- 处理结构化数据，如日志、代码或 ID
- 希望在不更改查询语法的情况下提高性能

**选择全文索引（Full-Text Index）的情况：**
- 为文档或内容构建搜索功能
- 需要模糊搜索、相关性评分或复杂查询
- 处理自然语言文本
- 希望获得超越简单模式匹配的高级搜索能力

## Ngram 索引（Ngram Index）工作原理

Ngram 索引（Ngram Index）将文本分解为重叠的字符子串（n-gram），以实现快速的模式查找：

**`gram_size = 3` 的示例：**
```text
输入："The quick brown"
N-grams："The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

**查询处理：**
```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```
1. 模式 `'quick br'` 被分词为 n-gram："qui", "uic", "ick", "ck ", "k b", " br"
2. 索引过滤出包含这些 n-gram 的数据块
3. 完整的 `LIKE` 过滤器仅应用于预过滤的数据块

:::note **重要限制**
- 模式长度必须至少为 `gram_size` 个字符（例如，当 `gram_size=3` 时，像 `'%yo%'` 这样的短模式将不会使用索引）
- 匹配不区分大小写（"FOO" 会匹配 "foo"、"Foo"、"fOo"）
- 仅适用于 `LIKE` 操作符，不适用于其他模式匹配函数
:::

## 快速设置

```sql
-- 创建包含文本内容的表
CREATE TABLE logs(id INT, message STRING);

-- 创建一个 n-gram 索引，分词长度为 3
CREATE NGRAM INDEX logs_message_idx ON logs(message) gram_size = 3;

-- 插入数据（将自动索引）
INSERT INTO logs VALUES (1, 'Application error occurred');

-- 使用 LIKE 进行搜索 - 将自动优化
SELECT * FROM logs WHERE message LIKE '%error%';
```

## 完整示例

此示例演示了如何为日志分析创建 Ngram 索引（Ngram Index）并验证其性能优势：

```sql
-- 为应用程序日志创建表
CREATE TABLE t_articles (
    id INT,
    content STRING
);

-- 创建一个 n-gram 索引，分词长度为 3
CREATE NGRAM INDEX ngram_idx_content
ON t_articles(content)
gram_size = 3;

-- 验证索引创建
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
-- 插入测试数据：995 行不相关数据 + 5 行目标数据
INSERT INTO t_articles
SELECT number, CONCAT('Random text number ', number)
FROM numbers(995);

INSERT INTO t_articles VALUES
    (1001, 'The silence was deep and complete'),
    (1002, 'They walked in silence through the woods'),
    (1003, 'Silence fell over the room'),
    (1004, 'A moment of silence was observed'),
    (1005, 'In silence, they understood each other');

-- 使用模式匹配进行搜索
SELECT id, content FROM t_articles WHERE content LIKE '%silence%';

-- 验证索引使用情况
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

**关键性能指标：** `bloom pruning: 2 to 1` 表明 Ngram 索引（Ngram Index）在扫描前成功过滤掉了 50% 的数据块。

## 最佳实践

| 实践 | 益处 |
|----------|---------|
| **选择合适的 gram_size** | `gram_size=3` 适用于大多数情况；对于更长的模式使用更大的值 |
| **为频繁搜索的列创建索引** | 专注于在 `LIKE '%pattern%'` 查询中使用的列 |
| **监控索引使用情况** | 使用 `EXPLAIN` 验证 `bloom pruning` 统计信息 |
| **考虑模式长度** | 确保搜索模式的长度至少为 `gram_size` 个字符 |

## 基本命令

有关完整的命令参考，请参见 [Ngram 索引（Ngram Index）](/sql/sql-commands/ddl/ngram-index/)。

| 命令 | 目的 |
|----------------------------------------------------------|----------------------------------------------|
| `CREATE NGRAM INDEX name ON table(column) gram_size = N` | 创建一个 n-gram 索引，分词长度为 N |
| `SHOW INDEXES` | 列出所有索引，包括 n-gram 索引 |
| `REFRESH NGRAM INDEX name ON table` | 刷新 n-gram 索引 |
| `DROP NGRAM INDEX name ON table` | 删除 n-gram 索引 |

:::tip **何时使用 Ngram 索引（Ngram Index）**
**理想场景：**
- 日志分析和监控系统
- 代码搜索和模式匹配
- 产品目录搜索
- 任何频繁使用 `LIKE '%pattern%'` 查询的应用

**不推荐的场景：**
- 短模式搜索（长度小于 `gram_size` 个字符）
- 精确字符串匹配（应使用等号比较）
- 复杂的文本搜索需求（应使用全文索引（Full-Text Index））
:::

---

*对于需要在大型文本数据集上使用 `LIKE` 查询进行快速模式匹配的应用，Ngram 索引（Ngram Index）至关重要。*
