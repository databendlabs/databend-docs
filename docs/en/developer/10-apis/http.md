---
title: HTTP Handler
sidebar_label: REST API
---

The Databend HTTP handler is a REST API that used to send query statement for execution on the server and to receive results back to the client.

The HTTP handler is hosted by databend-query, it can be specified by using `--http_handler_host` and `--http_handler_port`(This defaults to 8000).

## HTTP Methods

### Overview

This handler return results in `pages` with long-polling.

1. Start with A `POST` to `/v1/query` with JSON of type `QueryRequest` which contains the SQL to execute, returns a JSON
   of type `QueryResponse`.
2. Use fields of `QueryResponse` for further processing:
   1. A `GET` to the `next_uri` returns the next `page` of query results. It returns `QueryResponse` too, processing it
      the same way until `next_uri` is null.
   2. (optional) A `GET` to the `kill_uri` to kill the query. Return empty body.


Please note that you should keep using the latest `next_uri` to get the next page of results before the query is finished, otherwise you may miss some results or leak session resources until session timeout. The `next_uri` will be null when you have received all the results of the query.

### Quick Example

```shell
curl -u root: \
  --request POST \
  '127.0.0.1:8001/v1/query/' \
  --header 'Content-Type: application/json' \
  --data-raw '{"sql": "SELECT avg(number) FROM numbers(100000000)"}'
```

the SQL will be run with default session and pagination settings, mainly:

1. use a new one-off session with the `default` database.
2. each request wait for at most 1 second for results before return.

for more advanced configs, see the Reference below:

you are expected to get JSON like this (formatted):

```json
{
  "id": "b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "session_id": "5643627c-a900-43ac-978f-8c76026d9944",
  "session": {},
  "schema": [
    {
      "name": "avg(number)",
      "type": "Nullable(Float64)"
    }
  ],
  "data": [["49999999.5"]],
  "state": "Succeeded",
  "error": null,
  "stats": {
    "scan_progress": {
      "rows": 100000000,
      "bytes": 800000000
    },
    "write_progress": {
      "rows": 0,
      "bytes": 0
    },
    "result_progress": {
      "rows": 1,
      "bytes": 9
    },
    "total_scan": {
      "rows": 100000000,
      "bytes": 800000000
    },
    "running_time_ms": 446.748083
  },
  "affect": null,
  "stats_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5",
  "final_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "next_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/final",
  "kill_uri": "/v1/query/b22c5bba-5e78-4e50-87b0-ec3855c757f5/kill"
}
```

## Query Request

QueryRequest

| field      | type         | Required | Default | description                              |
| ---------- | ------------ | -------- | ------- | ---------------------------------------- |
| sql        | string       | Yes      |         | the sql to execute                       |
| session_id | string       | No       |         | used only when reuse server-side session |
| session    | SessionState | No       |         |                                          |
| pagination | Pagination   | No       |         | a uniq query_id for this POST request    |

SessionState

| field                    | type                | Required | Default   | description                                                   |
| ------------------------ | ------------------- | -------- | --------- | ------------------------------------------------------------- |
| database                 | string              | No       | "default" | set current_database                                          |
| keep_server_session_secs | int                 | No       | 0         | secs the Session will be retain after the last query finished |
| settings                 | map(string, string) | No       | 0         |                                                               |

OldSession

| field | type   | Required | Default | description                              |
| ----- | ------ | -------- | ------- | ---------------------------------------- |
| id    | string | Yes      |         | session_id from QueryResponse.session_id |

Pagination: critical conditions for each HTTP request to return (before all remaining result is ready to return)

| field          | type | Required | Default | description       |
| -------------- | ---- | -------- | ------- | ----------------- |
| wait_time_secs | u32  | No       | 1       | long polling time |

## Query Response

QueryResponse:

| field      | type         | description                              |
| ---------- | ------------ | ---------------------------------------- |
| state      | string       | choices: "Running","Failed", "Succeeded" |
| error      | QueryError   | error of the sql parsing or execution    |
| id         | string       | a uniq query_id for this POST request    |
| data       | array        | each item is a row of results            |
| schema     | array        | An ordered sequence of Field             |
| affect     | Affect       | the affect of some queries               |
| session_id | String       |                                          |
| session    | SessionState |                                          |

Field:

| field | type   |
| ----- | ------ |
| name  | string |
| type  | string |

Stats:

| field           | type          | description                                                                                                      |
| --------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| running_time_ms | float         | million secs elapsed since query begin to execute internally, stop timing when query Finished (state != Running) |
| scan_progress   | QueryProgress | query scan progress                                                                                              |

Progress:

| field      | type |
| ---------- | ---- |
| read_rows  | int  |
| read_bytes | int  |

Error:

| field     | type   | description                     |
| --------- | ------ | ------------------------------- |
| stats     | int    | error code used inside databend |
| message   | string | error message                   |
| backtrace | string |                                 |

Affect:

| field | type   | description         |
| ----- | ------ | ------------------- |
| type  | string | ChangeSetting/UseDB |
| ...   |        | according to type   |

### Response Status Code

The usage of status code for different kinds of errors:

| code | error                                                                       |
| ---- | --------------------------------------------------------------------------- |
| 200  | if sql is invalid or failed, the detail is in the `error` field of the JSON |
| 404  | "query_id" or "page" not found                                              |
| 400  | invalid request format                                                      |

Check the response body for error reason as a string when status code is not 200.

### data format

all field value in `.data` is represented in string,
client need to interpreter the values with the help of information in the `schema` field.

### client-side session

Dur to the stateless nature of HTTP, it is hard to maintain session in server side.
client need to config the session in the `session` field when starting a new Request.

```json
{
  "sql": "select 1",
  "session": {
    "database": "db2",
    "settings": {
      "max_threads": "1"
    }
  }
}
```

all the values of settings should be string.

If the SQL is `set` or `use`, the `session` will be change, can carry back to client in side response,
client need to record it and put it in the following Request.

### QueryAffect (Experimental)

For each SQL, client get an optional table-formed `result`.
Client also get info about `progress` about rows/bytes read/write.
Due to the limit of them, client may not get all interesting information about the Query.
So we add `QueryAffect` to carry some extra information about the Query.

Note that `QueryAffect` is for advanced user and is not stable.
It is not recommended to QueryAffect to maintain session.

### Example for Session and QueryAffect:

set statement:

```json
{
  "sql": "set max_threads=1;",
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "6"
    }
  }
}
```

response:

```json
{
  "affect": {
    "type": "ChangeSetting",
    "key": "max_threads",
    "value": "1",
    "is_global": false
  },
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "1"
    }
  }
}
```

use statement:

```json
{
  "sql": "use db2",
  "session": {
    "database": "db1",
    "settings": {
      "max_threads": "6"
    }
  }
}
```

response:

```json
{
  "affect": {
    "type": "UseDB",
    "name": "db2"
  },
  "session": {
    "database": "db2",
    "settings": {
      "max_threads": "1"
    }
  }
}
```

## Stage Attachment

Databend allows you to insert or update data from a staged file into a table by utilizing the `INSERT INTO` or `REPLACE INTO` statement with its HTTP Handler.

### Example: Inserting Data from Staged File

```sql
create table t_insert_stage(a int null, b int default 2, c float, d varchar default 'd');
```

Upload `values.csv` to a stage:

```plain title='values.csv'
1,1.0
2,2.0
3,3.0
4,4.0
```

```shell title='Request /v1/upload_to_stage' API
curl -H "stage_name:my_int_stage" -F "upload=@./values.csv" -XPUT http://root:@localhost:8000/v1/upload_to_stage
```

Insert with the uploaded file:

```shell
curl -d '{"sql": "insert into t_insert_stage (a, c) values", "stage_attachment": {"location": "@my_int_stage/values.csv", "file_format_options": {}, "copy_options": {}}}' -H 'Content-type: application/json' http://root:@localhost:8000/v1/query
```

:::tip
You can specify the file format and various copy-related settings with the FILE_FORMAT and COPY_OPTIONS available in the [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) command. When `purge` is set to `true`, the original file will only be deleted if the data update is successful.
:::

Verify the inserted data:

```sql
select * from t_insert_stage;
+------+------+------+------+
| a    | b    | c    | d    |
+------+------+------+------+
|    1 |    2 |  1.0 | d    |
|    2 |    2 |  2.0 | d    |
|    3 |    2 |  3.0 | d    |
|    4 |    2 |  4.0 | d    |
+------+------+------+------+
```

### Example: Replacing Data with Staged File

First, create a table called "sample":

```sql
CREATE TABLE sample
(
    Id      INT,
    City    VARCHAR,
    Score   INT,
    Country VARCHAR DEFAULT 'China'
);
```

Then, create an internal stage and upload a sample CSV file called [sample_3_replace.csv](https://github.com/ZhiHanZ/databend/blob/0f333a13fc38548595ea58242a37c5f4a73e9c88/tests/data/sample_3_replace.csv) to the stage:

```sql
CREATE STAGE s1 FILE_FORMAT = (TYPE = CSV);
```

```shell
curl -u root: -H "stage_name:s1" -F "upload=@sample_3_replace.csv" -XPUT "http://localhost:8000/v1/upload_to_stage"
{"id":"b8305187-c816-4bb5-8350-c441b85baaf9","stage_name":"s1","state":"SUCCESS","files":["sample_3_replace.csv"]}
```

```sql
LIST @s1;
name                |size|md5|last_modified                |creator|
--------------------+----+---+-----------------------------+-------+
sample_3_replace.csv|  83|   |2023-06-12 03:01:56.522 +0000|       |
```

Use REPLACE INTO to insert data from the staged CSV file through the HTTP handler:

:::tip
You can specify the file format and various copy-related settings with the FILE_FORMAT and COPY_OPTIONS available in the [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) command. When `purge` is set to `true`, the original file will only be deleted if the data update is successful.
:::

```shell
curl -s -u root: -XPOST "http://localhost:8000/v1/query" --header 'Content-Type: application/json' -d '{"sql": "REPLACE INTO sample (Id, City, Score) ON(Id) VALUES", "stage_attachment": {"location": "@s1/sample_3_replace.csv", "copy_options": {"purge": "true"}}}'
{"id":"92182fc6-11b9-461b-8fbd-f82ecaa637ef","session_id":"f5caf18a-5dc8-422d-80b7-719a6da76039","session":{},"schema":[],"data":[],"state":"Succeeded","error":null,"stats":{"scan_progress":{"rows":5,"bytes":83},"write_progress":{"rows":5,"bytes":277},"result_progress":{"rows":0,"bytes":0},"total_scan":{"rows":0,"bytes":0},"running_time_ms":143.632441},"affect":null,"stats_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef","final_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/final","next_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/final","kill_uri":"/v1/query/92182fc6-11b9-461b-8fbd-f82ecaa637ef/kill"}
```

Verify the inserted data:

```sql
SELECT * FROM sample;
id|city       |score|country|
--+-----------+-----+-------+
 1|'Chengdu'  |   80|China  |
 3|'Chongqing'|   90|China  |
 6|'HangZhou' |   92|China  |
 9|'Changsha' |   91|China  |
10|'Hong Kong'|   88|China  |
```

## client implementations

The official client [bendsql](https://github.com/databendlabs/bendsql) is mainly base on HTTP handler.

The most simple example of http handler client implementation is in [sqllogictest](https://github.com/databendlabs/databend/blob/main/tests/sqllogictests/src/client/http_client.rs) for databend.
