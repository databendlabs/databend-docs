---
title: 用户自定义函数
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Python UDF'/>

用户自定义函数（UDF）通过支持匿名 lambda 表达式和预定义的处理程序（Python、JavaScript 和 WebAssembly）来定义 UDF，从而提供增强的灵活性。这些功能允许用户创建根据其特定数据处理需求量身定制的自定义操作。Databend UDF 分为以下类型：

- [Lambda UDFs](#lambda-udfs)
- [Embedded UDFs](#embedded-udfs)

## Lambda UDFs

lambda UDF 允许用户直接在其查询中使用匿名函数（lambda 表达式）定义自定义操作。这些 lambda 表达式通常简洁明了，可用于执行特定的数据转换或计算，而这些转换或计算可能无法仅使用内置函数来实现。

### 使用示例

此示例创建 UDF，以使用 SQL 查询从表中的 JSON 数据中提取特定值。

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

通过嵌入式 UDF，您可以将使用以下编程语言编写的代码嵌入到 SQL 中：

- [Python](#python)
- [JavaScript](#javascript)
- [WebAssembly](#webassembly)

使用嵌入式 UDF，您可以创建标量函数和聚合函数。标量函数对单行输入进行操作并返回单个值，而聚合函数处理多行输入并返回单个聚合结果，例如总和或平均值。

:::note
- 尚不支持使用 WebAssembly 创建聚合 UDF。
- 如果您的程序内容很大，您可以对其进行压缩，然后将其传递到 Stage。有关 WebAssembly，请参见[使用示例](#usage-examples-2)。
:::

### Python (需要 Databend Enterprise)

通过 Python UDF，您可以经由 Databend 的内置处理程序从 SQL 查询调用 Python 代码，从而可以在 SQL 查询中无缝集成 Python 逻辑。

:::note
Python UDF 必须仅使用 Python 的标准库；不允许第三方导入。
:::

#### 数据类型映射

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

#### 使用示例

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

通过 JavaScript UDF，您可以经由 Databend 的内置处理程序从 SQL 查询调用 JavaScript 代码，从而可以在 SQL 查询中无缝集成 JavaScript 逻辑。

#### 数据类型映射


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

#### 使用示例

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


```md
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
        has_product_interaction: has_product_interaction,
        product_category_if_any: productCategoryIfAny,
        search_query_length: searchQueryLength,
        purchase_value_bucket: purchaseValueBucket
    };
}
$$;
```

### WebAssembly

WebAssembly UDF 允许用户使用编译为 WebAssembly 的语言定义自定义逻辑或操作。然后，可以在 SQL 查询中直接调用这些 UDF，以执行特定的计算或数据转换。

#### Usage Examples

在此示例中，创建 "wasm_gcd" 函数来计算两个整数的最大公约数 (GCD)。该函数使用 WebAssembly 定义，其实现在 'test10_udf_wasm_gcd.wasm.zst' 二进制文件中。

在执行之前，函数实现会经过一系列步骤。首先，它被编译成一个二进制文件，然后被压缩成 'test10_udf_wasm_gcd.wasm.zst'。最后，压缩后的文件会提前上传到 Stage。

:::note
该函数可以使用 Rust 实现，如 https://github.com/arrow-udf/arrow-udf/blob/main/arrow-udf-example/src/lib.rs 上的示例所示。
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

Databend 提供了各种命令来管理 UDF。有关详细信息，请参见 [User-Defined Function](/sql/sql-commands/ddl/udf/)。{/*examples*/}
