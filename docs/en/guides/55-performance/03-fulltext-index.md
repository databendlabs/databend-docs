---
title: Full-Text Index
---
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Inverted INDEX'/>


## What is Full-Text Indexing?

Full-text indexing is a powerful technique that enables efficient searching within large text datasets. It provides significant performance improvements and enhanced functionality compared to traditional SQL pattern matching using `LIKE '%keyword%'`.

## How Does Full-Text Indexing Work?

Databend utilizes [Tantivy](https://github.com/quickwit-oss/tantivy), a full-text search engine library, to implement inverted indexes. When you create a full-text index on a column, Databend builds an inverted index that maps keywords to their locations within the text. This enables lightning-fast keyword searches.

## Full-Text vs. LIKE Pattern Matching

- **Full-Text Indexing**: Utilizes an inverted index to quickly locate keywords, resulting in fast search performance.
- **LIKE Pattern Matching**: Scans the entire data for matches, which becomes inefficient as the dataset grows larger.

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
-- Inserting log entries into the k8s_log table
INSERT INTO k8s_log (event_id, event_data, event_timestamp)
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

INSERT INTO k8s_log (event_id, event_data, event_timestamp)
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

INSERT INTO k8s_log (event_id, event_data, event_timestamp)
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

INSERT INTO k8s_log (event_id, event_data, event_timestamp)
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

INSERT INTO k8s_log (event_id, event_data, event_timestamp)
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
SELECT * FROM k8s_log WHERE MATCH(event_message, 'PersistentVolume');
```
