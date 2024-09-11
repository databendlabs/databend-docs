---
title: 全文索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

## 什么是全文索引？

全文索引，也称为倒排索引，是一种用于高效映射术语与包含这些术语的文档或记录的数据结构。在典型的倒排索引中，文档文本中的每个术语都与出现该术语的文档ID相关联。这使得能够进行快速的全文搜索并根据搜索词检索相关文档。

Databend 使用 [Tantivy](https://github.com/quickwit-oss/tantivy)，一个全文搜索引擎库，来实现倒排索引。假设我们有一组代表产品评论的文档。每个文档由一个唯一的ID和一些描述评论的文本内容组成。以下是几个示例文档：

| 文档ID | 内容                                                             |
|-------------|---------------------------------------------------------------------|
| 101         | "This product is amazing! It exceeded all my expectations."         |
| 102         | "I'm disappointed with this product. It didn't work as advertised." |
| 103         | "Highly recommended! Best purchase I've made in a long time."       |

这些文档的倒排索引将如下表所示。倒排索引使我们能够快速找到包含特定术语的文档。例如，如果我们搜索术语 `recommended`，我们可以轻松地从倒排索引中检索到文档ID 103。

| 术语           | 文档IDs |
|----------------|--------------|
| "product"      | 101, 102     |
| "amazing"      | 101          |
| "disappointed" | 102          |
| "recommended"  | 103          |

## 全文索引与LIKE模式匹配

全文索引和LIKE模式匹配都是用于在数据库中搜索文本数据的方法。然而，全文索引相比LIKE模式匹配提供了显著更快的查询性能，尤其是在具有大量文本内容的大型数据库中。

LIKE操作符允许在文本字段中进行模式匹配。它在字符串中搜索指定的模式，并返回找到该模式的行。对于如下示例的查询，Databend将执行全表扫描以检查每一行是否存在指定的模式 `%Starbucks%`。这种方法可能会消耗大量资源，并导致查询执行速度变慢，尤其是在大型表中。

```sql title='示例:'
SELECT * FROM table WHERE content LIKE '%Starbucks%';
```

相比之下，全文索引涉及创建倒排索引，这些索引将术语映射到包含这些术语的文档或记录。这些索引使得能够基于特定关键词或短语高效地搜索文本数据。利用倒排索引，Databend可以直接访问包含指定术语 `Starbucks` 的文档，无需扫描整个表，从而显著减少查询执行时间，特别是在具有大量文本内容的场景中。

```sql title='示例:'
CREATE INVERTED INDEX table_content_idx ON table(content);
SELECT * FROM table WHERE match(content, 'Starbucks');
```

## 使用倒排索引进行搜索

在使用倒排索引进行搜索之前，您必须创建它们：

- 您可以使用 [CREATE INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/create-inverted-index) 命令为一个表创建多个倒排索引，但每个列在倒排索引中必须是唯一的。换句话说，一个列只能由一个倒排索引索引。
- 如果您的数据在倒排索引创建之前已插入表中，您必须在使用 [REFRESH INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/refresh-inverted-index) 命令进行搜索之前刷新倒排索引，以便数据可以被正确索引。

```sql title='示例:'
-- 为表 'user_comments' 中的 'comment_title' 和 'comment_body' 列创建倒排索引
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

-- 如果表中在创建索引之前已存在数据，刷新索引以确保现有数据的索引。
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```

### 全文搜索函数

Databend 提供了一系列全文搜索函数，使您能够高效地搜索文档。有关其语法和示例的更多信息，请参阅 [全文搜索函数](/sql/sql-functions/search-functions/)。

## 管理倒排索引

Databend 提供了多种命令来管理倒排索引。有关详细信息，请参阅 [倒排索引](/sql/sql-commands/ddl/inverted-index/)。

## 使用示例

在以下示例中，我们首先在一个包含Kubernetes日志数据的表上创建全文搜索索引，然后使用 [全文搜索函数](#全文搜索函数) 搜索日志数据。

1. 创建一个名为 "k8s_logs" 的表用于Kubernetes日志数据，其中包含一个从 "event_data" 派生的计算列 "event_message"。然后，在 "event_message" 列上创建一个名为 "event_message_fulltext" 的倒排索引。
 
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

以下查询在 "k8s_logs" 表中存储的事件消息中搜索包含 "PersistentVolume" 的事件：

```sql
SELECT
  event_id,
  event_message
FROM
  k8s_logs
WHERE
  MATCH(event_message, 'PersistentVolume');

-[ RECORD 1 ]-----------------------------------
     event_id: 5
event_message: PersistentVolume claim created
```

要检查全文索引是否将用于搜索，请使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令：

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
    ├── pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]
    ├── push downs: [filters: [k8s_logs._search_matched (#4)], limit: NONE]
    └── estimated rows: 5.00
```

`pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]`
表示将使用全文索引，从而将5个数据块修剪为1个。

以下查询搜索事件消息包含 "PersistentVolume claim created" 的事件，并确保相关性评分阈值为0.5或更高：

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

-[ RECORD 1 ]-----------------------------------
       event_id: 5
  event_message: PersistentVolume claim created
event_timestamp: 2024-04-08 12:00:00
        score(): 0.86304635
```

以下查询使用 `fuzziness` 选项进行模糊搜索：

```sql
-- 'PersistentVolume claim create' 故意拼写错误
SELECT
    event_id, event_message, event_timestamp
FROM
    k8s_logs
WHERE
    match('event_message', 'PersistentVolume claim create', 'fuzziness=1');

-[ RECORD 1 ]-----------------------------------
       event_id: 5
  event_message: PersistentVolume claim created
event_timestamp: 2024-04-08 12:00:00
```