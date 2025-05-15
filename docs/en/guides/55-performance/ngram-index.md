---
title: Ngram Index
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='NGRAM INDEX'/>

The Ngram Index is a specialized indexing technique that improves the performance of pattern matching queries using the `LIKE` operator with the `%` wildcard. These queries are common in applications that require substring or fuzzy matching, such as searching for keywords within product descriptions, user comments, or log data.

Unlike traditional indexes, which are typically ineffective when the search pattern does not have a fixed prefix (e.g., `LIKE '%keyword%'`), the Ngram Index breaks down text into overlapping substrings (n-grams) and indexes them for fast lookup. This allows Databend to narrow down matching rows efficiently, avoiding costly full table scans.

## How Ngram Index Works

Ngram Index in Databend is built using character-level n-grams. When a column is indexed, its text content is treated as a continuous sequence of characters, including letters, spaces, and punctuation. The text is then split into all possible overlapping substrings of a fixed length, defined by the gram_size parameter.

For example, with `gram_size = 3`, the string:

```text
The quick brown
```

will be split into the following 3-character substrings:

```text
"The", "he ", "e q", " qu", "qui", "uic", "ick", "ck ", "k b", " br", "bro", "row", "own"
```

These substrings are stored in the index and used to accelerate pattern matching in queries using the `LIKE` operator.
When a query such as:

```sql
SELECT * FROM t WHERE content LIKE '%quick br%'
```

is issued, the condition `%quick br%` is also tokenized into trigrams, such as "qui", "uic", "ick", "ck ", "k b", " br", etc. Databend uses these to filter data blocks via the n-gram index before applying the full `LIKE` filter, significantly reducing the amount of data scanned.

:::note
- The index only works when the pattern to be matched is at least as long as `gram_size`. Short patterns (e.g., '%yo%' with gram_size = 3) won't benefit from the index.

- When using the Ngram index, matches are case-insensitive. For example, searching for "FOO" will match "foo", "Foo", or "fOo".
:::

## Managing Ngram Indexes

Databend provides a variety of commands to manage Ngram indexes. For details, see [Ngram Index](/sql/sql-commands/ddl/ngram-index/).

## Usage Examples

To accelerate fuzzy string searches using the `LIKE` operator, you can create an Ngram Index on one or more STRING columns of a table. This example shows how to create a table, define an Ngram Index, insert sample data, and verify that the index is being used in query planning.

First, create a simple table to store text data:

```sql
CREATE TABLE t_articles (
    id INT,
    content STRING
);
```

Next, create an Ngram Index on the `content` column. The `gram_size` parameter defines the number of characters used in each n-gram segment:

```sql
CREATE NGRAM INDEX ngram_idx_content
ON t_articles(content)
gram_size = 3;
```

To show the created index:

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

Now insert a large number of rows. Most entries contain unrelated text, but a few contain the keyword we want to match later:

```sql
-- Insert 995 irrelevant rows
INSERT INTO t_articles
SELECT number, CONCAT('Random text number ', number)
FROM numbers(995);

-- Insert 5 rows with target keyword
INSERT INTO t_articles VALUES
    (1001, 'The silence was deep and complete'),
    (1002, 'They walked in silence through the woods'),
    (1003, 'Silence fell over the room'),
    (1004, 'A moment of silence was observed'),
    (1005, 'In silence, they understood each other');
```

Now run a query using a `LIKE '%silence%'` pattern. This is where the Ngram Index becomes useful:

```sql
EXPLAIN SELECT id, content FROM t_articles WHERE content LIKE '%silence%';
```

In the `EXPLAIN` output, look for the `bloom pruning` detail in the `pruning stats` line:

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

Here, `bloom pruning: 2 to 1` shows that the Ngram Index successfully filtered out one of the two data blocks before scan. 