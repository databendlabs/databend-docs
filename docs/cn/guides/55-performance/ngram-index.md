---
title: Ngram 索引
---

# Ngram 索引：为 LIKE 查询实现快速模式匹配

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Ngram 索引通过利用 `LIKE` 操作符和通配符 (`%`) 加速模式匹配查询，无需全表扫描即可实现快速子字符串搜索。

## 解决什么问题？

在大数据集上使用 `LIKE` 查询进行模式匹配面临显著的性能挑战：

| 问题 | 影响 | Ngram 索引解决方案 |
|---------|--------|---------------------|
| **通配符搜索缓慢** | `WHERE content LIKE '%keyword%'` 需要扫描整个表 | 使用 n-gram 分段预过滤数据块 |
| **全表扫描** | 每次模式搜索都读取所有行 | 仅读取包含模式的关联数据块 |
| **搜索性能差** | 用户需要长时间等待子字符串搜索结果 | 实现亚秒级模式匹配响应 |
| **传统索引无效** | B-tree 索引无法优化中间通配符 | 字符级索引处理任意通配符位置 |

**示例**：在 1000 万条日志条目中搜索 `'%error log%'`。无 ngram 索引时需要扫描全部 1000 万行，使用 ngram 索引后可立即预过滤至约 1000 个相关数据块。

## Ngram 索引 vs 全文索引：如何选择？

| 特性 | Ngram 索引 | 全文索引 |
|---------|-------------|-----------------|
| **主要用途** | 使用 `LIKE '%pattern%'` 进行模式匹配 | 使用 `MATCH()` 进行语义文本搜索 |
| **搜索类型** | 精确子字符串匹配 | 基于词语的相关性搜索 |
| **查询语法** | `WHERE column LIKE '%text%'` | `WHERE MATCH(column, 'text')` |
| **高级功能** | 大小写不敏感匹配 | 模糊搜索、相关性评分、布尔运算符 |
| **性能重点** | 加速现有 LIKE 查询 | 用高级搜索函数替代 LIKE |
| **最佳场景** | 日志分析、代码搜索、精确模式匹配 | 文档搜索、内容发现、搜索引擎 |

**选择 Ngram 索引当：**
- 需要优化现有的 `LIKE '%pattern%'` 查询
- 需要精确子字符串匹配（大小写不敏感）
- 处理结构化数据如日志、代码或 ID
- 希望不改变查询语法即可提升性能

**选择全文索引当：**
- 为文档或内容构建搜索功能
- 需要模糊搜索、相关性评分或复杂查询
- 处理自然语言文本
- 需要超越简单模式匹配的高级搜索能力

## Ngram 索引工作原理

Ngram 索引将文本分解为重叠的字符子串（n-gram）以实现快速模式查找：

**`gram_size = 3` 示例：**
```text
输入："The quick brown"
N-grams: "The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

**查询处理流程：**
```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```
1. 模式 `'quick br'` 被分词为 n-grams: "qui", "uic", "ick", "ck ", "k b", " br"
2. 索引筛选包含这些 n-grams 的数据块
3. 仅在预过滤后的数据块上应用完整 `LIKE` 过滤

:::note **重要限制**
- 模式长度必须至少为 `gram_size` 字符（如 `gram_size=3` 时 `'%yo%'` 短模式不会使用索引）
- 匹配不区分大小写（"FOO" 匹配 "foo", "Foo", "fOo"）
- 仅适用于 `LIKE` 操作符，不适用于其他模式匹配函数
:::

## 快速设置

```sql
-- 创建包含文本内容的表
CREATE TABLE logs(id INT, message STRING);

-- 创建 3 字符分段的 ngram 索引
CREATE NGRAM INDEX logs_message_idx ON logs(message) gram_size = 3;

-- 插入数据（自动索引）
INSERT INTO logs VALUES (1, 'Application error occurred');

-- 使用 LIKE 搜索 - 自动优化
SELECT * FROM logs WHERE message LIKE '%error%';
```

## 完整示例

此示例展示如何为日志分析创建 ngram 索引并验证其性能优势：

```sql
-- 创建应用日志表
CREATE TABLE t_articles (
    id INT,
    content STRING
);

-- 创建 3 字符分段的 ngram 索引
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
-- 插入测试数据：995 条无关行 + 5 条目标行
INSERT INTO t_articles
SELECT number, CONCAT('Random text number ', number)
FROM numbers(995);

INSERT INTO t_articles VALUES
    (1001, 'The silence was deep and complete'),
    (1002, 'They walked in silence through the woods'),
    (1003, 'Silence fell over the room'),
    (1004, 'A moment of silence was observed'),
    (1005, 'In silence, they understood each other');

-- 使用模式匹配搜索
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

**关键性能指标：** `bloom pruning: 2 to 1` 显示 ngram 索引在扫描前成功过滤掉了 50% 的数据块。

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **选择合适的 gram_size** | `gram_size=3` 适用于多数场景；更长的模式使用更大的值 |
| **索引频繁搜索的列** | 聚焦于 `LIKE '%pattern%'` 查询使用的列 |
| **监控索引使用** | 使用 `EXPLAIN` 验证 `bloom pruning` 统计信息 |
| **考虑模式长度** | 确保搜索模式至少包含 `gram_size` 个字符 |

## 核心命令

完整命令参考请见 [Ngram 索引](/sql/sql-commands/ddl/ngram-index/)。

| 命令 | 用途 |
|---------|---------|
| `CREATE NGRAM INDEX name ON table(column) gram_size = N` | 创建 N 字符分段的 ngram 索引 |
| `SHOW INDEXES` | 列出所有索引（包括 ngram 索引） |
| `DROP NGRAM INDEX name ON table` | 删除 ngram 索引 |

:::tip **何时使用 Ngram 索引**
**适用于：**
- 日志分析和监控系统
- 代码搜索和模式匹配
- 产品目录搜索
- 任何频繁使用 `LIKE '%pattern%'` 查询的应用

**不推荐用于：**
- 短模式搜索（少于 `gram_size` 字符）
- 精确字符串匹配（应使用等值比较）
- 复杂文本搜索需求（应使用全文索引）
:::

---

*Ngram 索引对于需要在大规模文本数据集上使用 `LIKE` 查询实现快速模式匹配的应用至关重要。*