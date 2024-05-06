---
title: Full-Text Index
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

## What is Full-Text Indexing?

Full-text indexing, also known as inverted index, is a data structure used to efficiently map between terms and the documents or records that contain those terms. In a typical inverted index, each term from a document's text is associated with the document ID where it appears. This allows for fast full-text searches and retrieval of relevant documents based on search terms.

Databend utilizes [Tantivy](https://github.com/quickwit-oss/tantivy), a full-text search engine library, to implement inverted indexes. Suppose we have a collection of documents representing product reviews. Each document consists of a unique ID and some text content describing the review. Here are a few sample documents:

| Document ID | Content                                                             |
|-------------|---------------------------------------------------------------------|
| 101         | "This product is amazing! It exceeded all my expectations."         |
| 102         | "I'm disappointed with this product. It didn't work as advertised." |
| 103         | "Highly recommended! Best purchase I've made in a long time."       |

An inverted index for these documents would look like the table below. The inverted index allows us to quickly find which documents contain a particular term. For example, if we search for the term `recommended`, we can easily retrieve Document ID 103 from the inverted index.

| Term           | Document IDs |
|----------------|--------------|
| "product"      | 101, 102     |
| "amazing"      | 101          |
| "disappointed" | 102          |
| "recommended"  | 103          |

## Full-Text Indexing vs. LIKE Pattern Matching

Full-text indexing and LIKE pattern matching are both methods used for searching text data in a database. However, full-text indexing offers significantly faster query performance compared to LIKE pattern matching, especially in large databases with extensive text content.

The LIKE operator allows for pattern matching within text fields. It searches for a specified pattern within a string and returns rows where the pattern is found. For a query like the example below, Databend would perform a full table scan to check each row for the presence of the specified pattern `%Starbucks%`. This approach can be resource-intensive and result in slower query execution, especially with large tables.

```sql title='Example:'
SELECT * FROM table WHERE content LIKE '%Starbucks%';
```

In contrast, full-text indexing involves creating inverted indexes, which map terms to the documents or records containing those terms. These indexes enable efficient searching of text data based on specific keywords or phrases. Utilizing the inverted index, Databend can directly access the documents containing the specified term `Starbucks`, eliminating the need for scanning the entire table and significantly reducing query execution time, particularly in scenarios with large volumes of text content.

```sql title='Example:'
CREATE INVERTED INDEX table_content_idx ON table(content);
SELECT * FROM table WHERE match(content, 'Starbucks');
```

## Searching with Inverted Indexes

Before searching with inverted indexes, you must create them:

- You can create more than one inverted index for a table using the [CREATE INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/create-inverted-index) command, but each column must be unique across the inverted indexes. In other words, a column can only be indexed by one inverted index. 
- If your data is inserted into the table before the inverted index is created, you must refresh the inverted index using the [REFRESH INVERTED INDEX](/sql/sql-commands/ddl/inverted-index/refresh-inverted-index) command before searching so that the data can be properly indexed.

```sql title='Example:'
-- Create an inverted index for the 'comment_title' and 'comment_body' columns in the table 'user_comments'
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

-- If data existed in the table before creating the index, refresh the index to ensure indexing of existing data.
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```

### Full-Text Search Functions

Databend offers a range of full-text search functions empowering you to efficiently search through documents. For more information about their syntax and examples, see [Full-Text Search Functions](/sql/sql-functions/search-functions/).

| Full-Text Search Function          | Description                                                     |
|------------------------------------|-----------------------------------------------------------------|
| `MATCH('<columns>', '<keywords>')` | Searches for documents containing specified keywords.           |
| `QUERY('<query_expr>')`            | Searches for documents satisfying a specified query expression. |
| `SCORE()`                          | Returns the relevance of the query string.                      |

## Managing Inverted Indexes

Databend provides a variety of commands to manage inverted indexes. For details, see [Inverted Index](/sql/sql-commands/ddl/inverted-index/).

## Usage Examples

In the following example, we're first creating a full-text search index on a table that contains Kubernetes log data, and then we're searching the log data using the [Full-Text Search Functions](#full-text-search-functions).

1. Create a table named "k8s_logs" for Kubernetes log data, with a computed column named "event_message" derived from "event_data". Then, create an inverted index named "event_message_fulltext" on the column "event_message".
 
```sql
-- Create a table with a compute column
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- Create an inverted index on the "event_message" column
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);
```

2. Insert data into the table.
 
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

3. Search the log with the full-text search functions.

The following query searches for events containing "PersistentVolume" within the event messages stored in the "k8s_logs" table:

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

To check if the full-text index will be utilized for the search, use the [EXPLAIN](/sql/sql-commands/explain-cmds/explain) command:

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
indicates that the full-text index will be utilized, resulting in the pruning of 5 data blocks down to 1.

The following query searches for events where the event message contains "PersistentVolume claim created" and ensures a relevance score threshold of 0.5 or higher:

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