---
title: Ngram Index
---

# Ngram 索引: 用于 LIKE 查询的快速模式匹配

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Ngram 索引通过使用带有通配符 (`%`) 的 `LIKE` 运算符来加速模式匹配查询，从而实现快速子字符串搜索而无需进行全表扫描。

## 解决了什么问题？

使用 `LIKE` 查询进行模式匹配在大型数据集上会面临显著的性能挑战：

| 问题 | 影响 | Ngram 索引解决方案 |
|---------|--------|---------------------|
| **慢速通配符搜索** | `WHERE content LIKE '%keyword%'` 会扫描整个表 | 使用 n-gram 段预过滤数据块 |
| **全表扫描** | 每次模式搜索都会读取所有行 | 只读取包含模式的相关数据块 |
| **搜索性能差** | 用户等待子字符串搜索结果时间长 | 子秒级模式匹配响应时间 |
| **传统索引无效** | B-树索引无法优化中间通配符 | 字符级索引处理任何通配符位置 |

**示例**: 在 1000 万条日志条目中搜索 `'%error log%'`。如果没有 ngram 索引，它会扫描所有 1000 万行。有了 ngram 索引，它会立即预过滤到大约 1000 个相关块。

## Ngram 与全文索引：何时使用？

| 特性 | Ngram 索引 | 全文索引 |
|---------|-------------|-----------------|
| **主要用例** | 使用 `LIKE '%pattern%'` 进行模式匹配 | 使用 `MATCH()` 进行语义文本搜索 |
| **搜索类型** | 精确子字符串匹配 | 基于词语的搜索，带有相关性 |
| **查询语法** | `WHERE column LIKE '%text%'` | `WHERE MATCH(column, 'text')` |
| **高级特性** | 不区分大小写的匹配 | 模糊搜索、相关性评分、布尔运算符 |
| **性能重点** | 加速现有 LIKE 查询 | 用高级搜索功能替换 LIKE |
| **最适合** | 日志分析、代码搜索、精确模式匹配 | 文档搜索、内容发现、搜索引擎 |

**在以下情况下选择 Ngram 索引：**
- 您有需要优化的现有 `LIKE '%pattern%'` 查询
- 需要精确的子字符串匹配 (不区分大小写)
- 处理日志、代码或 ID 等结构化数据
- 希望在不改变查询语法的情况下提高性能

**在以下情况下选择全文索引：**
- 为文档或内容构建搜索功能
- 需要模糊搜索、相关性评分或复杂查询
- 处理自然语言文本
- 需要超越简单模式匹配的高级搜索功能

## Ngram 索引的工作原理

Ngram 索引将文本分解为重叠的字符子字符串 (n-gram)，以便进行快速模式查找：

**`gram_size = 3` 的示例：**
```text
Input: "The quick brown"
N-grams: "The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

**查询处理：**
```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```
1. 模式 `'quick br'` 被分词为 n-gram："qui", "uic", "ick", "ck ", "k b", " br"
2. 索引过滤包含这些 n-gram 的数据块
3. 完整的 `LIKE` 过滤器仅应用于预过滤的块

:::note **重要限制**
- 模式必须至少有 `gram_size` 个字符长 (像 `'%yo%'` 这样短的模式，如果 `gram_size=3` 则不会使用索引)
- 匹配不区分大小写 ("FOO" 匹配 "foo", "Foo", "fOo")
- 仅适用于 `LIKE` 运算符，不适用于其他模式匹配函数
:::

## 快速设置

```sql
-- 创建包含文本内容的表
CREATE TABLE logs(id INT, message STRING);

-- 创建 ngram 索引，使用 3 字符段
CREATE NGRAM INDEX logs_message_idx ON logs(message) gram_size = 3;

-- 插入数据 (自动索引)
INSERT INTO logs VALUES (1, 'Application error occurred');

-- 使用 LIKE 搜索 - 自动优化
SELECT * FROM logs WHERE message LIKE '%error%';
```

## 完整示例

此示例演示了为日志分析创建 ngram 索引并验证其性能优势：

```sql
-- 为应用程序日志创建表
CREATE TABLE t_articles (
    id INT,
    content STRING
);

-- 创建 ngram 索引，使用 3 字符段
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

**关键性能指标：** `bloom pruning: 2 to 1` 表明 ngram 索引在扫描前成功过滤掉了 50% 的数据块。

## 最佳实践

| 实践 | 益处 |
|----------|---------|
| **选择合适的 gram_size** | `gram_size=3` 在大多数情况下效果良好；对于更长的模式，使用更大的值 |
| **索引频繁搜索的列** | 专注于在 `LIKE '%pattern%'` 查询中使用的列 |
| **监控索引使用情况** | 使用 `EXPLAIN` 验证 `bloom pruning` 统计信息 |
| **考虑模式长度** | 确保搜索模式至少有 `gram_size` 个字符长 |

## 基本命令

有关完整的命令参考，请参阅 [Ngram 索引](/sql/sql-commands/ddl/ngram-index/)。

| 命令 | 用途 |
|---------|---------|
| `CREATE NGRAM INDEX name ON table(column) gram_size = N` | 创建 N 字符段的 ngram 索引 |
| `SHOW INDEXES` | 列出所有索引，包括 ngram 索引 |
| `DROP NGRAM INDEX name ON table` | 删除 ngram 索引 |

:::tip **何时使用 Ngram 索引**
**理想用途：**
- 日志分析和监控系统
- 代码搜索和模式匹配
- 产品目录搜索
- 任何频繁使用 `LIKE '%pattern%'` 查询的应用程序

**不推荐用于：**
- 短模式搜索 (少于 `gram_size` 个字符)
- 精确字符串匹配 (请改用相等比较)
- 复杂的文本搜索需求 (请改用全文索引)
:::

---

*Ngram 索引对于需要在大型文本数据集上使用 `LIKE` 查询进行快速模式匹配的应用程序至关重要。*