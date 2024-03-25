---
title: HISTOGRAM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.377"/>

Computes the distribution of the data. It uses an "equal height" bucketing strategy to generate the histogram. The result of the function returns an empty or Json string.

## Syntax

```sql
HISTOGRAM(<expr>)
HISTOGRAM(<expr> [, max_num_buckets])
```

`max_num_buckets` means the maximum number of buckets that can be used, by default it is 128.

For example:
```sql
select histogram(c_id) from histagg;
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                  histogram(c_id)                                                  │
│                                                  Nullable(String)                                                 │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [{"lower":"1","upper":"1","ndv":1,"count":6,"pre_sum":0},{"lower":"2","upper":"2","ndv":1,"count":6,"pre_sum":6}] │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
:::

## Arguments

| Arguments         | Description                                                                                |
|-------------------|--------------------------------------------------------------------------------------------|
| `<expr>`          | The data type of `<expr>` should be sortable.                                              |
| `max_num_buckets` | Optional constant positive integer, the maximum number of buckets that can be used.        |

## Return Type

the Nullable String type

## Example

**Create a Table and Insert Sample Data**

```sql
CREATE TABLE histagg (
  c_id INT,
  c_tinyint TINYINT,
  c_smallint SMALLINT,
  c_int INT
);

INSERT INTO histagg VALUES
  (1, 10, 20, 30),
  (1, 11, 21, 33),
  (1, 11, 12, 13),
  (2, 21, 22, 23),
  (2, 31, 32, 33),
  (2, 10, 20, 30);
```

**Query Demo 1**
```sql
SELECT HISTOGRAM(c_int) FROM histagg;
```

**Result**
```sql
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                              histogram(c_int)                                                                                                             │
│                                                                                                              Nullable(String)                                                                                                             │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [{"lower":"13","upper":"13","ndv":1,"count":1,"pre_sum":0},{"lower":"23","upper":"23","ndv":1,"count":1,"pre_sum":1},{"lower":"30","upper":"30","ndv":1,"count":2,"pre_sum":2},{"lower":"33","upper":"33","ndv":1,"count":2,"pre_sum":4}] │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Query result description：

```json
[
  {
    "lower": "13",
    "upper": "13",
    "ndv": 1,
    "count": 1,
    "pre_sum": 0
  },
  {
    "lower": "23",
    "upper": "23",
    "ndv": 1,
    "count": 1,
    "pre_sum": 1
  },
  {
    "lower": "30",
    "upper": "30",
    "ndv": 1,
    "count": 2,
    "pre_sum": 2
  },
  {
    "lower": "33",
    "upper": "33",
    "ndv": 1,
    "count": 2,
    "pre_sum": 4
  }
]
```

Fields description:

- buckets：All buckets
  - lower：Upper bound of the bucket
  - upper：Lower bound of the bucket
  - count：The number of elements contained in the bucket
  - pre_sum：The total number of elements in the front bucket
  - ndv：The number of distinct values in the bucket