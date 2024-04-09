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
- You can create more than one inverted index for a table, but each column must be unique across the inverted indexes. In other words, a column can only be indexed by one inverted index. 
- If your data is inserted into the table before the inverted index is created, you must refresh the inverted index before searching so that the data can be properly indexed.

```sql title='Example:'
-- Create an inverted index for the 'comment_title' and 'comment_body' columns in the table 'user_comments'
CREATE INVERTED INDEX customer_feedback_idx ON customer_feedback(comment_title, comment_body);

-- If data existed in the table before creating the index, refresh the index to ensure indexing of existing data.
REFRESH INVERTED INDEX customer_feedback_idx ON customer_feedback;
```

To conduct searches leveraging inverted indexes, you can utilize the following functions:

| Function                       | Description                                                                                                                                                                            |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `match( <column>, '<keyword>' )` | Searches for a specific keyword within the indexed documents. It returns the documents containing the keyword.                                                                         |
| `score()`                        | Assigns a relevance score to each document based on its match to the search query. This score reflects how well the document matches the query terms and helps prioritize the results. |

This example retrieves content from the 'content' column in table 't' where the value contains the keyword `Starbucks`, ordered by relevance score:

```sql title='Example:'
SELECT score(), content 
FROM table 
WHERE match(content, 'Starbucks') 
ORDER BY score();
```

The result might look something like this:

| Score    | Content                                 |
|----------|-----------------------------------------|
| 2.354890 | Starbucks opens new store in downtown   |
| 2.354890 | Starbucks announces seasonal drink menu |
| 1.124567 | Enjoying a latte at Starbucks           |

## Managing Inverted Indexes

Databend provides a variety of commands to manage inverted indexes. For details, see [Inverted Index](/sql/sql-commands/ddl/inverted-index/).

## Usage Examples

1. Creating a Table with Full-Text Indexing
 
```sql
-- Table creation with a compute column
CREATE OR REPLACE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- Creating an inverted index on the event_message column
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);
```

:::info

Here we use [computed column](https://docs.databend.com/sql/sql-commands/ddl/table/ddl-create-table#computed-columns) `event_message` to extract the `message` field from the `event_data` column. We then create an inverted index on the `event_message` column to enable full-text search.

:::

2. Inserting Data into the Table
 
```sql
-- Inserting log entries into the k8s_logs table
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

3. Querying with Full-Text Search

```sql
-- Query to search for events with 'PersistentVolume' in the event_message
SELECT * FROM k8s_logs WHERE MATCH(event_message, 'PersistentVolume');
```

To check if the full-text index is being used, you can use the `EXPLAIN` like this:
```
EXPLAIN SELECT * FROM k8s_logs WHERE MATCH(event_message, 'PersistentVolume');
```

Result:
```
Filter
├── output columns: [k8s_logs.event_id (#0), k8s_logs.event_data (#1), k8s_logs.event_timestamp (#2), k8s_logs.event_message (#3)]
├── filters: [k8s_logs._search_matched (#4)]
├── estimated rows: 5.00
└── TableScan
    ├── table: default.fulltext.k8s_logs
    ├── output columns: [event_id (#0), event_data (#1), event_timestamp (#2), event_message (#3), _search_matched (#4)]
    ├── read rows: 1
    ├── read bytes: 305
    ├── partitions total: 5
    ├── partitions scanned: 1
    ├── pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]
    ├── push downs: [filters: [k8s_logs._search_matched (#4)], limit: NONE]
    └── estimated rows: 5.00
```

`pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]`
indicates that the full-text index is being utilized, and it has pruned 5 data blocks down to 1.
