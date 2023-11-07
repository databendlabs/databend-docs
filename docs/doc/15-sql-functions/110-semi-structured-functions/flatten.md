---
title: FLATTEN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.190"/>

Transforms nested JSON data into a tabular format, where each element or field is represented as a separate row.

## Syntax

```sql
FLATTEN( INPUT => <expr> [ , PATH => <expr> ]
                         [ , OUTER => TRUE | FALSE ]
                         [ , RECURSIVE => TRUE | FALSE ]
                         [ , MODE => 'OBJECT' | 'ARRAY' | 'BOTH' ] )
```

| Parameter | Description                                                                                                                                                         | Default |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| INPUT     | Specifies the JSON or array data to flatten.                                                                                                                        | -       |
| PATH      | Specifies the path to the array or object within the input data to flatten.                                                                                         | -       |
| OUTER     | If set to TRUE, rows with zero results will still be included in the output, but the values in the KEY, INDEX, and VALUE columns of those rows will be set to NULL. | FALSE   |
| RECURSIVE | If set to TRUE, the function will continue to flatten nested elements.                                                                                              | FALSE   |
| MODE      | Controls whether to flatten only objects ('OBJECT'), only arrays ('ARRAY'), or both ('BOTH').                                                                       | 'BOTH'  |

## Output

The following table describes the output columns of the FLATTEN function:

| Column | Description                                                                              |
|--------|------------------------------------------------------------------------------------------|
| SEQ    | A unique sequence number associated with the input.                                      |
| KEY    | Key to the expanded value. If the flattened element does not contain a key, it's set to NULL.|
| PATH   | Path to the flattened element.                                                           |
| INDEX  | If the element is an array, this column contains its index; otherwise, it's set to NULL. |
| VALUE  | Value of the flattened element.                                                          |
| THIS   | This column identifies the element currently being flattened.                            |

## Examples

```sql
SELECT
  *
FROM
  FLATTEN (
    INPUT => PARSE_JSON (
      '{"name": "John", "languages": ["English", "Spanish", "French"], "address": {"city": "New York", "state": "NY"}}'
    )
  );

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   seq  │        key       │       path       │       index      │               value              │                                                  this                                                 │
├────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│      1 │ address          │ address          │             NULL │ {"city":"New York","state":"NY"} │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
│      1 │ languages        │ languages        │             NULL │ ["English","Spanish","French"]   │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
│      1 │ name             │ name             │             NULL │ "John"                           │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- PATH helps in selecting elements at a specific path from the original JSON data.
SELECT
  *
FROM
  FLATTEN (
    INPUT => PARSE_JSON (
      '{"name": "John", "languages": ["English", "Spanish", "French"], "address": {"city": "New York", "state": "NY"}}'
    ),
    PATH => 'languages'
  );

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   seq  │        key       │       path       │       index      │       value       │              this              │
├────────┼──────────────────┼──────────────────┼──────────────────┼───────────────────┼────────────────────────────────┤
│      1 │ NULL             │ languages[0]     │                0 │ "English"         │ ["English","Spanish","French"] │
│      1 │ NULL             │ languages[1]     │                1 │ "Spanish"         │ ["English","Spanish","French"] │
│      1 │ NULL             │ languages[2]     │                2 │ "French"          │ ["English","Spanish","French"] │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- RECURSIVE enables recursive flattening of nested structures.
SELECT
  *
FROM
  FLATTEN (
    INPUT => PARSE_JSON (
      '{"name": "John", "languages": ["English", "Spanish", "French"], "address": {"city": "New York", "state": "NY"}}'
    ),
    RECURSIVE => TRUE
  );

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   seq  │        key       │       path       │       index      │               value              │                                                  this                                                 │
├────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│      1 │ address          │ address          │             NULL │ {"city":"New York","state":"NY"} │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
│      1 │ city             │ address.city     │             NULL │ "New York"                       │ {"city":"New York","state":"NY"}                                                                      │
│      1 │ state            │ address.state    │             NULL │ "NY"                             │ {"city":"New York","state":"NY"}                                                                      │
│      1 │ languages        │ languages        │             NULL │ ["English","Spanish","French"]   │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
│      1 │ NULL             │ languages[0]     │                0 │ "English"                        │ ["English","Spanish","French"]                                                                        │
│      1 │ NULL             │ languages[1]     │                1 │ "Spanish"                        │ ["English","Spanish","French"]                                                                        │
│      1 │ NULL             │ languages[2]     │                2 │ "French"                         │ ["English","Spanish","French"]                                                                        │
│      1 │ name             │ name             │             NULL │ "John"                           │ {"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"} │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


-- MODE specifies whether only objects ('OBJECT'), only arrays ('ARRAY'), or both ('BOTH') should be flattened.
-- In this example, MODE => 'ARRAY' is used, which means that only arrays within the JSON data will be flattened.
SELECT
  *
FROM
  FLATTEN (
    INPUT => PARSE_JSON (
      '{"name": "John", "languages": ["English", "Spanish", "French"], "address": {"city": "New York", "state": "NY"}}'
    ),
    MODE => 'ARRAY'
  );

---


-- OUTER determines the inclusion of zero-row expansions in the output.
-- In this first example, OUTER => TRUE is used with an empty JSON array, which results in zero-row expansions. 
-- Rows are included in the output even when there are no values to flatten.
SELECT
  *
FROM
  FLATTEN (INPUT => PARSE_JSON ('[]'), OUTER => TRUE);

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   seq  │        key       │       path       │       index      │       value       │        this       │
├────────┼──────────────────┼──────────────────┼──────────────────┼───────────────────┼───────────────────┤
│      1 │ NULL             │ NULL             │             NULL │ NULL              │ NULL              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- In this second example, OUTER is omitted, and the output shows how rows with zero results are not included when OUTER is not specified.
SELECT
  *
FROM
  FLATTEN (INPUT => PARSE_JSON ('[]'));

```