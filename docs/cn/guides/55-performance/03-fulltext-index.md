---
title: 全文索引
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

## 什么是全文索引？

全文索引，也称为倒排索引，是一种用于有效映射术语和包含这些术语的文档或记录之间关系的数据结构。在一个典型的倒排索引中，文档文本中的每个术语都与它出现的文档 ID 相关联。这允许快速全文搜索和基于搜索词检索相关文档。

Databend 使用 [Tantivy](https://github.com/quickwit-oss/tantivy)，一个全文搜索引擎库，来实现倒排索引。假设我们有一个代表产品评论的文档集合。每个文档由一个唯一的 ID 和一些描述评论的文本内容组成。以下是一些示例文档：

| 文档 ID | 内容                                                              |
|-------------|---------------------------------------------------------------------|
| 101         | "This product is amazing! It exceeded all my expectations."         |
| 102         | "I'm disappointed with this product. It didn't work as advertised." |
| 103         | "Highly recommended! Best purchase I've made in a long time."       |

这些文档的倒排索引如下表所示。倒排索引允许我们快速找到哪些文档包含特定术语。例如，如果我们搜索术语 `recommended`，我们可以很容易地从倒排索引中检索到文档 ID 103。

| 术语           | 文档 IDs |
|----------------|--------------|
| "product"      | 101, 102     |
| "amazing"      | 101          |
| "disappointed" | 102          |
| "recommended"  | 103          |

## 全文索引 vs. LIKE 模式匹配

全文索引和 LIKE 模式匹配都是用于在数据库中搜索文本数据的方法。然而，与 LIKE 模式匹配相比，全文索引提供了明显更快的查询性能，尤其是在具有大量文本内容的大型数据库中。

LIKE 运算符允许在文本字段中进行模式匹配。它在字符串中搜索指定的模式，并返回找到该模式的行。对于像下面示例这样的查询，Databend 将执行全表扫描，以检查每一行是否存在指定的模式 `%Starbucks%`。这种方法可能会消耗大量资源，并导致查询执行速度变慢，尤其是在大型表中。

```sql title='Example:'
SELECT * FROM table WHERE content LIKE '%Starbucks%';
```

相比之下，全文索引涉及创建倒排索引，该索引将术语映射到包含这些术语的文档或记录。这些索引能够基于特定关键字或短语有效地搜索文本数据。利用倒排索引，Databend 可以直接访问包含指定术语 `Starbucks` 的文档，而无需扫描整个表，从而显著减少查询执行时间，尤其是在具有大量文本内容的情况下。

```sql title='Example:'
CREATE INVERTED INDEX table_content_idx ON table(content);
SELECT * FROM table WHERE match(content, 'Starbucks');
```

## 使用倒排索引进行搜索

在使用倒排索引进行搜索之前，您必须创建它们：

- 您可以使用 [CREATE INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/create-inverted-index) 命令为一个表创建多个倒排索引，但每个列在倒排索引中必须是唯一的。换句话说，一个列只能被一个倒排索引索引。
- 如果您的数据在创建倒排索引之前插入到表中，您必须在使用 [REFRESH INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/refresh-inverted-index) 命令搜索之前刷新倒排索引，以便可以正确地索引数据。

```sql title='Example:'
-- 为表 'user_comments' 中的 'comment_title' 和 'comment_body' 列创建一个倒排索引
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

-- 如果在创建索引之前表中已存在数据，请刷新索引以确保对现有数据进行索引。
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```

### 全文搜索函数

Databend 提供了一系列全文搜索函数，使您能够高效地搜索文档。有关其语法和示例的更多信息，请参见 [全文搜索函数](/sql/sql-functions/search-functions/)。

## 管理倒排索引

Databend 提供了各种命令来管理倒排索引。有关详细信息，请参见 [倒排索引](/sql/sql-commands/ddl/inverted-index/)。

## 使用示例

在以下示例中，我们首先在包含 Kubernetes 日志数据的表上创建一个全文搜索索引，然后我们使用 [全文搜索函数](#full-text-search-functions) 搜索日志数据。

1. 创建一个名为 "k8s_logs" 的表，用于存储 Kubernetes 日志数据，其中包含一个名为 "event_message" 的计算列，该列从 "event_data" 派生而来。然后，在 "event_message" 列上创建一个名为 "event_message_fulltext" 的倒排索引。
 
```sql
-- 创建一个带有计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 在 "event_message" 列上创建一个倒排索引
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);
```

2. 将数据插入到表中。
 
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

以下查询搜索 "k8s_logs" 表中 event_message 包含 "PersistentVolume" 的事件：

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

要检查是否将使用全文索引进行搜索，请使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令：

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
表示将使用全文索引，从而将 5 个数据块修剪为 1 个。

以下查询搜索事件消息包含 "PersistentVolume claim created" 的事件，并确保相关性得分阈值大于等于 0.5：

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

以下查询使用 `fuzziness` 选项执行模糊搜索：

```sql
-- 'PersistentVolume claim create' 是故意拼写错误的
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