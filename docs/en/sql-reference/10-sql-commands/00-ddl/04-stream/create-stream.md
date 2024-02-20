---
title: CREATE STREAM
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='STREAM'/>

Creates a stream.

## Syntax

```sql
CREATE [ OR REPLACE ] STREAM [ IF NOT EXISTS ] [ <database_name>. ]<stream_name> 
  ON TABLE [ <database_name>. ]<table_name> 
    [ AT (STREAM => <stream_name>) ] 
    [ APPEND_ONLY = true | false ]
    [ COMMENT = '<comment>' ]
```

- The CREATE STREAM command allows for different database names between the stream and the associated table. In Databend, a stream is treated as an object belonging to a specific database, similar to a table or a view. If a database is not explicitly specified, the current database is assumed as the default context for the stream.

- The `AT (STREAM => <stream_name>)` clause establishes a dependency between the newly created stream and an existing stream. This linkage indicates that the new stream is designed to capture and reflect changes from the existing stream.

- `APPEND_ONLY`: When set to `true`, the stream operates in `Append-Only` mode; when set to `false`, it operates in `Standard` mode. Defaults to `false`. For additional details on stream operation modes, see [How Stream Works](/guides/load-data/continuous-data-pipelines/stream#how-stream-works).

## Examples

This example creates a steam named `books_stream_2023` for the `books_total` table:

```sql
CREATE STREAM books_stream_2023 
    ON TABLE books_total;
```