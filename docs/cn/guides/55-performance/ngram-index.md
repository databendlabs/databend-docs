---
title: Ngram 索引
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

Ngram 索引是一种专门的索引技术，可以提高使用带有 `%` 通配符的 `LIKE` 运算符的模式匹配查询的性能。这些查询在需要子字符串或模糊匹配的应用程序中很常见，例如在产品描述、用户评论或日志数据中搜索关键字。

与传统索引不同，当搜索模式没有固定前缀时（例如，`LIKE '%keyword%'`），传统索引通常无效，Ngram 索引将文本分解为重叠的子字符串（n-gram）并对其进行索引以实现快速查找。这使得 Databend 能够有效地缩小匹配行的范围，避免代价昂贵的全表扫描。

## Ngram 索引的工作原理

Databend 中的 Ngram 索引是使用字符级 n-gram 构建的。当对列进行索引时，其文本内容被视为连续的字符序列，包括字母、空格和标点符号。然后，文本被分割成所有可能的固定长度的重叠子字符串，由 gram_size 参数定义。

例如，对于 `gram_size = 3`，字符串：

```text
The quick brown
```

将被分割成以下 3 个字符的子字符串：

```text
"The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

这些子字符串存储在索引中，并用于加速使用 `LIKE` 运算符的查询中的模式匹配。
当查询例如：

```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```

发出时，条件 `%quick br%` 也会被标记化为三元组，例如 "qui", "uic", "ick", "ck ", "k b", " br" 等。Databend 使用这些通过 n-gram 索引过滤数据块，然后再应用完整的 `LIKE` 过滤器，从而显著减少扫描的数据量。

:::note
- 仅当要匹配的模式至少与 `gram_size` 一样长时，索引才有效。短模式（例如，gram_size = 3 的 '%yo%'）不会从索引中受益。

- 使用 Ngram 索引时，匹配不区分大小写。例如，搜索 "FOO" 将匹配 "foo"、"Foo" 或 "fOo"。
:::

## 管理 Ngram 索引

Databend 提供了各种命令来管理 Ngram 索引。有关详细信息，请参见 [Ngram 索引](/sql/sql-commands/ddl/ngram-index/)。

## 使用示例

要加速使用 `LIKE` 运算符的模糊字符串搜索，可以在表的一个或多个 STRING 列上创建 Ngram 索引。此示例显示了如何创建表、定义 Ngram 索引、插入示例数据以及验证索引是否在查询计划中使用。

首先，创建一个简单的表来存储文本数据：

```sql
CREATE TABLE t_articles (
    id INT,
    content STRING
);
```

接下来，在 `content` 列上创建一个 Ngram 索引。`gram_size` 参数定义每个 n-gram 段中使用的字符数：

```sql
CREATE NGRAM INDEX ngram_idx_content
ON t_articles(content)
gram_size = 3;
```

要显示创建的索引：

```sql
SHOW INDEXES;
```

```sql
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│        name       │  type  │ original │            definition            │         created_on         │      updated_on     │
├───────────────────┼────────┼──────────┼──────────────────────────────────┼────────────────────────────┼─────────────────────┤
│ ngram_idx_content │ NGRAM  │          │ t_articles(content)gram_size='3' │ 2025-05-13 01:02:58.598409 │ NULL                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

现在插入大量行。大多数条目包含不相关的文本，但少数条目包含我们稍后要匹配的关键字：

```sql
-- 插入 995 个不相关的行
INSERT INTO t_articles
SELECT number, CONCAT('Random text number ', number)
FROM numbers(995);

-- 插入 5 行带有目标关键字的行
INSERT INTO t_articles VALUES
    (1001, 'The silence was deep and complete'),
    (1002, 'They walked in silence through the woods'),
    (1003, 'Silence fell over the room'),
    (1004, 'A moment of silence was observed'),
    (1005, 'In silence, they understood each other');
```

现在使用 `LIKE '%silence%'` 模式运行查询。这是 Ngram 索引变得有用的地方：

```sql
EXPLAIN SELECT id, content FROM t_articles WHERE content LIKE '%silence%';
```

在 `EXPLAIN` 输出中，在 `pruning stats` 行中查找 `bloom pruning` 详细信息：

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

这里，`bloom pruning: 2 to 1` 表明 Ngram 索引在扫描之前成功过滤掉了两个数据块中的一个。