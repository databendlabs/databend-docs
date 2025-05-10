---
title: User-Defined Function
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Python UDF'/>

User-Defined Functions (UDFs) offer enhanced flexibility by supporting both anonymous lambda expressions and predefined handlers (Python, JavaScript & WebAssembly) for defining UDFs. These features allow users to create custom operations tailored to their specific data processing needs. Databend UDFs are categorized into the following types:

- [Lambda UDFs](#lambda-udfs)
- [Embedded UDFs](#embedded-udfs)

## Lambda UDFs

A lambda UDF allows users to define custom operations using anonymous functions (lambda expressions) directly within their queries. These lambda expressions are often concise and can be used to perform specific data transformations or computations that may not be achievable using built-in functions alone.

### Usage Examples

This example creates UDFs to extract specific values from JSON data within a table using SQL queries.

```sql
CREATE OR REPLACE TABLE sale_items (
    item_id INT,
    details VARIANT
);

INSERT INTO sale_items VALUES
    (1, PARSE_JSON('{"name": "T-Shirt", "price": 20.00, "discount_pct": 10}')),  -- 10% discount
    (2, PARSE_JSON('{"name": "Jeans", "price": 50.00, "discount_pct": 25}')),   -- 25% discount
    (3, PARSE_JSON('{"name": "Jacket", "price": 100.00, "discount_pct": 0}')),    -- No discount
    (4, PARSE_JSON('{"name": "Socks", "price": 5.00, "discount_pct": 50}'));    -- 50% discount

-- Define a Lambda UDF to calculate the final price after discount
-- WITH EXPLICIT CASTING
CREATE OR REPLACE FUNCTION calculate_final_price AS (item_info) -> 
    (item_info['price']::FLOAT) * (1 - (item_info['discount_pct']::FLOAT) / 100.0);

SHOW USER FUNCTIONS;
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+
--| name                  | is_aggregate   | description | arguments                       | language | created_on                 |
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+
--| calculate_final_price |    0           |             | {"parameters":["item_info"]}    | SQL      | YYYY-MM-DD HH:MM:SS.ffffff |
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+

-- Use the Lambda UDF to get item names and their final prices
SELECT
    item_id,
    details['name']::STRING AS item_name,
    details['price']::FLOAT AS original_price,
    calculate_final_price(details) AS final_price
FROM sale_items
ORDER BY item_id;

-- Expected output for the SELECT query (final_price should now have values):
--+---------+-----------+----------------+-------------+
--| item_id | item_name | original_price | final_price |
--+---------+-----------+----------------+-------------+
--|       1 | T-Shirt   |          20.00 |       18.00 |
--|       2 | Jeans     |          50.00 |       37.50 |
--|       3 | Jacket    |         100.00 |      100.00 |
--|       4 | Socks     |           5.00 |        2.50 |
--+---------+-----------+----------------+-------------+
```

## Embedded UDFs

Embedded UDFs allow you to embed code written in the following programming languages within SQL:

- [Python](#python)
- [JavaScript](#javascript)
- [WebAssembly](#webassembly)

With Embedded UDFs, you can create both scalar functions and aggregate functions. Scalar functions operate on a single row of input and return a single value, while aggregate functions process multiple rows of input and return a single aggregated result, such as a sum or average.

:::note
- Creating aggregate UDFs with WebAssembly is not yet supported.
- If your program content is large, you can compress it and then pass it to a stage. See the [Usage Examples](#usage-examples-2) for WebAssembly.
:::

### Python (requires Databend Enterprise)

A Python UDF allows you to invoke Python code from a SQL query via Databend's built-in handler, enabling seamless integration of Python logic within your SQL queries.

:::note
The Python UDF must use only Python's standard library; third-party imports are not allowed.
:::

#### Data Type Mappings

| Databend  | Python            |
| --------- | ----------------- |
| BOOLEAN   | bool              |
| TINYINT   | int               |
| SMALLINT  | int               |
| INT       | int               |
| BIGINT    | int               |
| FLOAT     | float             |
| DOUBLE    | float             |
| DECIMAL   | decimal.Decimal   |
| DATE      | datetime.date     |
| TIMESTAMP | datetime.datetime |
| VARCHAR   | str               |
| BINARY    | bytes             |
| ARRAY     | list              |
| TUPLE     | tuple             |
| MAP       | dict              |
| VARIANT   | str               |
| BITMAP    | str               |
| GEOMETRY  | str               |

#### Usage Examples

```sql
-- Create a table with user interaction logs
CREATE TABLE user_interaction_logs (
    log_id INT,
    log_data VARIANT  -- JSON interaction log
);

-- Insert sample interaction log data
INSERT INTO user_interaction_logs VALUES
    (1, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:00:00Z", "action": "view_product", "details": {"product_id": "p789", "category": "electronics", "price": 99.99}}')),
    (2, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:05:10Z", "action": "add_to_cart", "details": {"product_id": "p789", "quantity": 1, "category": "electronics"}}')),
    (3, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:02:30Z", "action": "search", "details": {"query": "wireless headphones", "results_count": 15}}')),
    (4, PARSE_JSON('{"user_id": "u789", "timestamp": "2023-01-15T10:08:00Z", "action": "purchase", "details": {"order_id": "o555", "total_amount": 125.50, "item_count": 2}}')),
    (5, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:10:00Z", "action": "view_page", "details": {"page_name": "homepage"}}')),
    (6, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:12:00Z", "action": "purchase", "details": {"order_id": "o556", "total_amount": 25.00, "item_count": 1}}'));

-- Create a Python UDF to extract features from interaction logs
CREATE OR REPLACE FUNCTION extract_interaction_features_py(VARIANT)
RETURNS VARCHAR
LANGUAGE python HANDLER = 'extract_features'
AS $$
import json

def extract_features(log):
    log_dict = log if isinstance(log, dict) else {}
    action = log_dict.get('action', '').lower()
    details = log_dict.get('details', {})
    if not isinstance(details, dict):
        details = {}

    is_search_action = False
    has_product_interaction = False
    product_category_if_any = None
    search_query_length = 0
    purchase_value_bucket = None

    if action == 'search':
        is_search_action = True
        search_query_length = len(details.get('query', ''))

    if action in ['view_product', 'add_to_cart', 'remove_from_cart']:
        has_product_interaction = True
        product_category_if_any = details.get('category')
    
    if action == 'purchase':
        has_product_interaction = True 

    if action == 'purchase':
        total_amount = details.get('total_amount', 0.0)
        if not isinstance(total_amount, (int, float)):
            total_amount = 0.0

        if total_amount < 50:
            purchase_value_bucket = 'Low'
        elif total_amount < 200:
            purchase_value_bucket = 'Medium'
        else:
            purchase_value_bucket = 'High'
            
    result_dict = {
        "is_search_action": is_search_action,
        "has_product_interaction": has_product_interaction,
        "product_category_if_any": product_category_if_any,
        "search_query_length": search_query_length,
        "purchase_value_bucket": purchase_value_bucket
    }
    return json.dumps(result_dict)
$$;

-- Use the Python UDF to extract features
SELECT
    log_id,
    log_data['user_id']::STRING AS user_id,
    log_data['action']::STRING AS action,
    extract_interaction_features_py(log_data) AS extracted_features
FROM
    user_interaction_logs
ORDER BY
    log_id;
```


### JavaScript

A JavaScript UDF allows you to invoke JavaScript code from a SQL query via Databend's built-in handler, enabling seamless integration of JavaScript logic within your SQL queries.

#### Data Type Mappings


| Databend Type     | JS Type    |
| ----------------- | ---------- |
| NULL              | null       |
| BOOLEAN           | Boolean    |
| TINYINT           | Number     |
| TINYINT UNSIGNED  | Number     |
| SMALLINT          | Number     |
| SMALLINT UNSIGNED | Number     |
| INT               | Number     |
| INT UNSIGNED      | Number     |
| BIGINT            | Number     |
| BIGINT UNSIGNED   | Number     |
| FLOAT             | Number     |
| DOUBLE            | Number     |
| VARCHAR           | String     |
| DATE / TIMESTAMP  | Date       |
| DECIMAL           | BigDecimal |
| BINARY            | Uint8Array |

#### Usage Examples

```sql
-- Create a table with user interaction logs
CREATE TABLE user_interaction_logs (
    log_id INT,
    log_data VARIANT  -- JSON interaction log
);

-- Insert sample interaction log data
INSERT INTO user_interaction_logs VALUES
    (1, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:00:00Z", "action": "view_product", "details": {"product_id": "p789", "category": "electronics", "price": 99.99}}')),
    (2, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:05:10Z", "action": "add_to_cart", "details": {"product_id": "p789", "quantity": 1, "category": "electronics"}}')),
    (3, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:02:30Z", "action": "search", "details": {"query": "wireless headphones", "results_count": 15}}')),
    (4, PARSE_JSON('{"user_id": "u789", "timestamp": "2023-01-15T10:08:00Z", "action": "purchase", "details": {"order_id": "o555", "total_amount": 125.50, "item_count": 2}}')),
    (5, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:10:00Z", "action": "view_page", "details": {"page_name": "homepage"}}')),
    (6, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:12:00Z", "action": "purchase", "details": {"order_id": "o556", "total_amount": 25.00, "item_count": 1}}'));


-- Create a JavaScript UDF to extract features from interaction logs
CREATE FUNCTION extract_interaction_features_js(VARIANT)
RETURNS VARIANT
LANGUAGE javascript HANDLER = 'extractFeatures'
AS $$
export function extractFeatures(log) {
    const action = (log.action || '').toLowerCase();
    const details = log.details || {};

    let isSearchAction = false;
    let hasProductInteraction = false;
    let productCategoryIfAny = null;
    let searchQueryLength = 0;
    let purchaseValueBucket = null;

    if (action === 'search') {
        isSearchAction = true;
        searchQueryLength = (details.query || '').length;
    }

    if (['view_product', 'add_to_cart', 'remove_from_cart'].includes(action)) {
        hasProductInteraction = true;
        productCategoryIfAny = details.category || null;
    }
    
    if (action === 'purchase' && !productCategoryIfAny) {
         hasProductInteraction = true;
    }

    if (action === 'purchase') {
        const totalAmount = details.total_amount || 0.0;
        if (totalAmount < 50) {
            purchaseValueBucket = 'Low';
        } else if (totalAmount < 200) {
            purchaseValueBucket = 'Medium';
        } else {
            purchaseValueBucket = 'High';
        }
    }
            
    return {
        is_search_action: isSearchAction,
        has_product_interaction: hasProductInteraction,
        product_category_if_any: productCategoryIfAny,
        search_query_length: searchQueryLength,
        purchase_value_bucket: purchaseValueBucket
    };
}
$$;
```

### WebAssembly

A WebAssembly UDF allows users to define custom logic or operations using languages that compile to WebAssembly. These UDFs can then be invoked directly within SQL queries to perform specific computations or data transformations.

#### Usage Examples

In this example, the "wasm_gcd" function is created to compute the greatest common divisor (GCD) of two integers. The function is defined using WebAssembly and its implementation resides in the 'test10_udf_wasm_gcd.wasm.zst' binary file.

Prior to its execution, the function implementation undergoes a series of steps. First, it is compiled into a binary file, followed by compression into 'test10_udf_wasm_gcd.wasm.zst'. Finally, the compressed file is uploaded to a stage in advance.

:::note
The function can be implemented in Rust, as demonstrated in the example available at https://github.com/arrow-udf/arrow-udf/blob/main/arrow-udf-example/src/lib.rs
:::

```sql
CREATE FUNCTION wasm_gcd (INT, INT) RETURNS INT LANGUAGE wasm HANDLER = 'wasm_gcd(int4,int4)->int4' AS $$@data/udf/test10_udf_wasm_gcd.wasm.zst$$;

SELECT
    number,
    wasm_gcd((number * 3), (number * 6))
FROM
    numbers(5)
WHERE
    (number > 0)
ORDER BY 1;
```

## Managing UDFs

Databend provides a variety of commands to manage UDFs. For details, see [User-Defined Function](/sql/sql-commands/ddl/udf/).
