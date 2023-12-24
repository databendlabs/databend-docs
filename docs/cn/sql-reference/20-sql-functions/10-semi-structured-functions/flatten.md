---
title: FLATTEN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.213"/>

Transforms nested JSON data into a tabular format, where each element or field is represented as a separate row.

## Syntax

```sql
[LATERAL] FLATTEN ( INPUT => <expr> [ , PATH => <expr> ]
                                    [ , OUTER => TRUE | FALSE ]
                                    [ , RECURSIVE => TRUE | FALSE ]
                                    [ , MODE => 'OBJECT' | 'ARRAY' | 'BOTH' ] )
```

| Parameter / Keyword | Description                                                                                                                                                                                                             | Default |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| INPUT               | Specifies the JSON or array data to flatten.                                                                                                                                                                            | -       |
| PATH                | Specifies the path to the array or object within the input data to flatten.                                                                                                                                             | -       |
| OUTER               | If set to TRUE, rows with zero results will still be included in the output, but the values in the KEY, INDEX, and VALUE columns of those rows will be set to NULL.                                                     | FALSE   |
| RECURSIVE           | If set to TRUE, the function will continue to flatten nested elements.                                                                                                                                                  | FALSE   |
| MODE                | Controls whether to flatten only objects ('OBJECT'), only arrays ('ARRAY'), or both ('BOTH').                                                                                                                           | 'BOTH'  |
| LATERAL             | LATERAL is an optional keyword used to reference columns defined to the left of the LATERAL keyword within the FROM clause. LATERAL enables cross-referencing between the preceding table expressions and the function. | -       |

## Output

The following table describes the output columns of the FLATTEN function:

:::note
When using the LATERAL keyword with FLATTEN, these output columns may not be explicitly provided, as LATERAL introduces dynamic cross-referencing, altering the output structure.
:::

| Column | Description                                                                              |
|--------|------------------------------------------------------------------------------------------|
| SEQ    | A unique sequence number associated with the input.                                      |
| KEY    | Key to the expanded value. If the flattened element does not contain a key, it's set to NULL.|
| PATH   | Path to the flattened element.                                                           |
| INDEX  | If the element is an array, this column contains its index; otherwise, it's set to NULL. |
| VALUE  | Value of the flattened element.                                                          |
| THIS   | This column identifies the element currently being flattened.                            |

## Examples

### Example 1: Demonstrating PATH, OUTER, RECURSIVE, and MODE Parameters

This example demonstrates the behavior of the FLATTEN function with respect to the PATH, OUTER, RECURSIVE, and MODE parameters.

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

### Example 2: Demonstrating LATERAL FLATTEN

This example demonstrates the behavior of the FLATTEN function when used in conjunction with the LATERAL keyword.

```sql
-- Create a table for Tim Hortons transactions with multiple items
CREATE TABLE tim_hortons_transactions (
    transaction_id INT,
    customer_id INT,
    items VARIANT
);

-- Insert data for Tim Hortons transactions with multiple items
INSERT INTO tim_hortons_transactions (transaction_id, customer_id, items)
VALUES
    (101, 1, parse_json('[{"item":"coffee", "price":2.50}, {"item":"donut", "price":1.20}]')),
    (102, 2, parse_json('[{"item":"bagel", "price":1.80}, {"item":"muffin", "price":2.00}]')),
    (103, 3, parse_json('[{"item":"timbit_assortment", "price":5.00}]'));

-- Show Tim Hortons transactions with multiple items using LATERAL FLATTEN
SELECT
    t.transaction_id,
    t.customer_id,
    f.value:item::STRING AS purchased_item,
    f.value:price::FLOAT AS price
FROM
    tim_hortons_transactions t,
    LATERAL FLATTEN(input => t.items) f;

┌───────────────────────────────────────────────────────────────────────────┐
│  transaction_id │   customer_id   │   purchased_item  │       price       │
├─────────────────┼─────────────────┼───────────────────┼───────────────────┤
│             101 │               1 │ coffee            │               2.5 │
│             101 │               1 │ donut             │               1.2 │
│             102 │               2 │ bagel             │               1.8 │
│             102 │               2 │ muffin            │                 2 │
│             103 │               3 │ timbit_assortment │                 5 │
└───────────────────────────────────────────────────────────────────────────┘

-- Find maximum, minimum, and average prices of the purchased items
SELECT
    MAX(f.value:price::FLOAT) AS max_price,
    MIN(f.value:price::FLOAT) AS min_price,
    AVG(f.value:price::FLOAT) AS avg_price
FROM
    tim_hortons_transactions t,
    LATERAL FLATTEN(input => t.items) f;

┌───────────────────────────────────────────────────────────┐
│     max_price     │     min_price     │     avg_price     │
├───────────────────┼───────────────────┼───────────────────┤
│                 5 │               1.2 │               2.5 │
└───────────────────────────────────────────────────────────┘
```