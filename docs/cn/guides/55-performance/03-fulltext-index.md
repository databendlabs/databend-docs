---
title: 全文索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

## 什么是全文索引？

全文索引，又称倒排索引，是一种用于高效映射术语与包含这些术语的文档或记录的数据结构。在典型的倒排索引中，文档文本中的每个术语都与出现该术语的文档ID相关联。这使得基于搜索术语快速进行全文搜索和检索相关文档成为可能。

Databend 利用 [Tantivy](https://github.com/quickwit-oss/tantivy)，一个全文搜索引擎库，来实现倒排索引。假设我们有一系列代表产品评论的文档集合。每个文档包含一个唯一ID和描述评论的一些文本内容。以下是几个样本文档：

| 文档ID | 内容                                                             |
|--------|---------------------------------------------------------------------|
| 101    | "这个产品太棒了！它超出了我的所有预期。"                           |
| 102    | "我对这个产品感到失望。它并没有像广告中说的那样工作。"             |
| 103    | "强烈推荐！这是我长时间以来做出的最佳购买。"                       |

这些文档的倒排索引将如下表所示。倒排索引使我们能快速找出哪些文档包含特定术语。例如，如果我们搜索术语 `recommended`，我们可以轻松地从倒排索引中检索到文档ID 103。

| 术语           | 文档IDs         |
|----------------|-----------------|
| "product"      | 101, 102        |
| "amazing"      | 101             |
| "disappointed" | 102             |
| "recommended"  | 103             |

## 全文索引与LIKE模式匹配的比较

全文索引和LIKE模式匹配都是用于在数据库中搜索文本数据的方法。然而，与LIKE模式匹配相比，全文索引提供了显著更快的查询性能，特别是在具有大量文本内容的大型数据库中。

LIKE操作符允许在文本字段内进行模式匹配。它在字符串中搜索指定的模式，并返回找到该模式的行。对于如下示例查询，Databend将执行全表扫描，以检查每一行是否包含指定的模式`%Starbucks%`。这种方法可能会消耗大量资源，并导致查询执行速度变慢，尤其是在大型表中。

```sql title='示例：'
SELECT * FROM table WHERE content LIKE '%Starbucks%';
```

相比之下，全文索引涉及创建倒排索引，这些索引将术语映射到包含这些术语的文档或记录。这些索引使得基于特定关键词或短语高效搜索文本数据成为可能。利用倒排索引，Databend可以直接访问包含指定术语`Starbucks`的文档，无需扫描整个表，从而显著减少查询执行时间，特别是在具有大量文本内容的场景中。

```sql title='示例：'
CREATE INVERTED INDEX table_content_idx ON table(content);
SELECT * FROM table WHERE match(content, 'Starbucks');
```

## 使用倒排索引进行搜索

在使用倒排索引进行搜索之前，必须先创建它们：

- 您可以使用[CREATE INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/create-inverted-index)命令为表创建多个倒排索引，但每个列在倒排索引中必须是唯一的。换句话说，一个列只能由一个倒排索引索引。
- 如果您的数据在创建倒排索引之前已插入表中，您必须使用[REFRESH INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/refresh-inverted-index)命令刷新倒排索引，以便数据能被正确索引。

```sql title='示例：'
-- 为表'user_comments'中的'comment_title'和'comment_body'列创建倒排索引
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

-- 如果表中在创建索引前已有数据，刷新索引以确保现有数据的索引。
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```

### 全文搜索函数

Databend 提供了一系列全文搜索函数，使您能够高效地搜索文档。更多关于它们的语法和示例，请参见[全文搜索函数](/sql/sql-functions/search-functions/)。

| 全文搜索函数                     | 描述                                                         |
|--------------------------------|-------------------------------------------------------------|
| `MATCH('<columns>', '<keywords>')` | 搜索包含指定关键词的文档。                                   |
| `QUERY('<query_expr>')`          | 搜索满足指定查询表达式的文档。                               |
| `SCORE()`                        | 返回查询字符串的相关性得分。                                 |

## 管理倒排索引

Databend 提供了多种命令来管理倒排索引。详细信息，请参见[倒排索引](/sql/sql-commands/ddl/inverted-index/)。

## 使用示例

以下示例中，我们首先为包含Kubernetes日志数据的表创建全文搜索索引，然后使用[全文搜索函数](#全文搜索函数)搜索日志数据。

1. 创建一个名为 "k8s_logs" 的表，用于存储Kubernetes日志数据，并从 "event_data" 派生出一个名为 "event_message" 的计算列。然后，在 "event_message" 列上创建一个名为 "event_message_fulltext" 的倒排索引。

```sql
-- 创建带有计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 在 "event_message" 列上创建倒排索引
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);
```

2. 向表中插入数据。

```sql
INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (1,
    PARSE_JSON('{
        "message": "Pod scheduled",
        "object_type": "Pod",
        "name": "frontend-1",
        "namespace": "production",
        "node": "node-01",
        "status": "Scheduled"
    }'),
    '2024-04-08T08:00:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (2,
    PARSE_JSON('{
        "message": "Deployment scaled",
        "object_type": "Deployment",
        "name": "backend",
        "namespace": "development",
        "replicas": 3
    }'),
    '2024-04-08T09:15:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (3,
    PARSE_JSON('{
        "message": "Node condition changed",
        "object_type": "Node",
        "name": "node-02",
        "condition": "Ready",
        "status": "True"
    }'),
    '2024-04-08T10:30:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (4,
    PARSE_JSON('{
        "message": "ConfigMap updated",
        "object_type": "ConfigMap",
        "name": "app-config",
        "namespace": "default",
        "change": "data update"
    }'),
    '2024-04-08T11:45:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (5,
    PARSE_JSON('{
        "message": "PersistentVolume claim created",
        "object_type": "PVC",
        "name": "storage-claim",
        "namespace": "storage",
        "status": "Bound",
        "volume": "pv-logs"
    }'),
    '2024-04-08T12:00:00Z');
```

3. 使用全文搜索函数搜索日志。

以下查询在 "k8s_logs" 表中搜索包含 "PersistentVolume" 的事件消息：

```sql
SELECT
  event_id,
  event_message
FROM
  k8s_logs
WHERE
  MATCH(event_message, 'PersistentVolume');

┌──────────────────────────────────────────────────┐
│     event_id    │          event_message         │
├─────────────────┼────────────────────────────────┤
│               5 │ PersistentVolume claim created │
└──────────────────────────────────────────────────┘
```

要检查全文索引是否用于搜索，请使用[EXPLAIN](/sql/sql-commands/explain-cmds/explain)命令：

```sql
EXPLAIN SELECT event_id, event_message FROM k8s_logs WHERE MATCH(event_message, 'PersistentVolume');

-[ EXPLAIN ]-----------------------------------
Filter
├── output columns: [k8s_logs.event_id (#0), k8s_logs.event_message (#3)]
├── filters: [k8s_logs._search_matched (#4)]
├── estimated rows: 5.00
└── TableScan
    ├── table: default.default.k8s_logs
    ├── output columns: [event_id (#0), event_message (#3), _search_matched (#4)]
    ├── read rows: 1
    ├── read size: < 1 KiB
    ├── partitions total: 5
    ├── partitions scanned: 1
// highlight-next-line
    ├── pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]
    ├── push downs: [filters: [k8s_logs._search_matched (#4)], limit: NONE]
    └── estimated rows: 5.00
```

`pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]`
表明全文索引将被利用，导致从5个数据块修剪到1个。

以下查询搜索事件消息包含 "PersistentVolume claim created" 的事件，并确保相关性得分阈值为0.5或更高：

```sql
SELECT
  event_id,
  event_message,
  event_timestamp,
  SCORE()
FROM
  k8s_logs
WHERE
  SCORE() > 0.5
  AND QUERY('event_message:"PersistentVolume claim created"');

┌─────────────────────────────────────────────────────────────────────────────────────┐
│     event_id    │          event_message         │   event_timestamp   │   score()  │
├─────────────────┼────────────────────────────────┼─────────────────────┼────────────┤
│               5 │ PersistentVolume claim created │ 2024-04-08 12:00:00 │ 0.86304635 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```