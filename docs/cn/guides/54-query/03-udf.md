---
title: 用户定义函数（User-Defined Function）
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Python UDF'/>

用户定义函数（User-Defined Functions，UDFs）通过支持匿名 lambda 表达式和预定义处理程序（Python、JavaScript 和 WebAssembly）来定义 UDF，提供更强的灵活性。这些功能让用户能够创建满足特定数据处理需求的自定义操作。Databend UDF 分为以下类型：

- [Lambda UDFs](#lambda-udfs)
- [嵌入式 UDFs（Embedded UDFs）](#embedded-udfs)

## Lambda UDFs

Lambda UDF 允许用户在查询中直接使用匿名函数（lambda 表达式）定义自定义操作。这些 lambda 表达式通常很简洁，可用于执行特定的数据转换或计算，这些操作可能无法仅通过内置函数实现。

### 使用示例

本示例创建 UDF，通过 SQL 查询从表中的 JSON 数据提取特定值。

```sql
CREATE OR REPLACE TABLE sale_items (
    item_id INT,
    details VARIANT
);

INSERT INTO sale_items VALUES
    (1, PARSE_JSON('{"name": "T-Shirt", "price": 20.00, "discount_pct": 10}')),  -- 10% 折扣
    (2, PARSE_JSON('{"name": "Jeans", "price": 50.00, "discount_pct": 25}')),   -- 25% 折扣
    (3, PARSE_JSON('{"name": "Jacket", "price": 100.00, "discount_pct": 0}')),    -- 无折扣
    (4, PARSE_JSON('{"name": "Socks", "price": 5.00, "discount_pct": 50}'));    -- 50% 折扣

-- 定义 Lambda UDF 计算折扣后最终价格
-- 使用显式类型转换
CREATE OR REPLACE FUNCTION calculate_final_price AS (item_info) -> 
    (item_info['price']::FLOAT) * (1 - (item_info['discount_pct']::FLOAT) / 100.0);

SHOW USER FUNCTIONS;
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+
--| name                  | is_aggregate   | description | arguments                       | language | created_on                 |
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+
--| calculate_final_price |    0           |             | {"parameters":["item_info"]}    | SQL      | YYYY-MM-DD HH:MM:SS.ffffff |
--+-----------------------+----------------+-------------+---------------------------------+----------+----------------------------+

-- 使用 Lambda UDF 获取商品名称和最终价格
SELECT
    item_id,
    details['name']::STRING AS item_name,
    details['price']::FLOAT AS original_price,
    calculate_final_price(details) AS final_price
FROM sale_items
ORDER BY item_id;

-- SELECT 查询预期输出（final_price 应有值）：
--+---------+-----------+----------------+-------------+
--| item_id | item_name | original_price | final_price |
--+---------+-----------+----------------+-------------+
--|       1 | T-Shirt   |          20.00 |       18.00 |
--|       2 | Jeans     |          50.00 |       37.50 |
--|       3 | Jacket    |         100.00 |      100.00 |
--|       4 | Socks     |           5.00 |        2.50 |
--+---------+-----------+----------------+-------------+
```

## 嵌入式 UDFs（Embedded UDFs）

嵌入式 UDF 允许在 SQL 中嵌入以下编程语言编写的代码：

- [Python](#python)
- [JavaScript](#javascript)
- [WebAssembly](#webassembly)

通过嵌入式 UDF，可创建标量函数和聚合函数。标量函数对单行输入进行操作并返回单个值，聚合函数处理多行输入数据并返回单个聚合结果（如求和或平均值）。

:::note
- 暂不支持使用 WebAssembly 创建聚合 UDF
- 若程序内容较大，可压缩后传递到 stage，详见 WebAssembly 的[使用示例](#usage-examples-2)
:::

### Python（需 Databend 企业版）

Python UDF 允许通过 Databend 内置处理器在 SQL 查询中调用 Python 代码，实现 Python 逻辑与 SQL 查询的无缝集成。

:::note
Python UDF 仅能使用 Python 标准库，禁止导入第三方库
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
-- 创建用户交互日志表
CREATE TABLE user_interaction_logs (
    log_id INT,
    log_data VARIANT  -- JSON 交互日志
);

-- 插入示例交互日志数据
INSERT INTO user_interaction_logs VALUES
    (1, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:00:00Z", "action": "view_product", "details": {"product_id": "p789", "category": "electronics", "price": 99.99}}')),
    (2, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:05:10Z", "action": "add_to_cart", "details": {"product_id": "p789", "quantity": 1, "category": "electronics"}}')),
    (3, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:02:30Z", "action": "search", "details": {"query": "wireless headphones", "results_count": 15}}')),
    (4, PARSE_JSON('{"user_id": "u789", "timestamp": "2023-01-15T10:08:00Z", "action": "purchase", "details": {"order_id": "o555", "total_amount": 125.50, "item_count": 2}}')),
    (5, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:10:00Z", "action": "view_page", "details": {"page_name": "homepage"}}')),
    (6, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:12:00Z", "action": "purchase", "details": {"order_id": "o556", "total_amount": 25.00, "item_count": 1}}'));

-- 创建 Python UDF 从交互日志提取特征
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

-- 使用 Python UDF 提取特征
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

JavaScript UDF 允许通过 Databend 内置处理器在 SQL 查询中调用 JavaScript 代码，实现 JavaScript 逻辑与 SQL 查询的无缝集成。

#### 数据类型映射

| Databend 类型     | JS 类型    |
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
-- 创建用户交互日志表
CREATE TABLE user_interaction_logs (
    log_id INT,
    log_data VARIANT  -- JSON 交互日志
);

-- 插入示例交互日志数据
INSERT INTO user_interaction_logs VALUES
    (1, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:00:00Z", "action": "view_product", "details": {"product_id": "p789", "category": "electronics", "price": 99.99}}')),
    (2, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:05:10Z", "action": "add_to_cart", "details": {"product_id": "p789", "quantity": 1, "category": "electronics"}}')),
    (3, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:02:30Z", "action": "search", "details": {"query": "wireless headphones", "results_count": 15}}')),
    (4, PARSE_JSON('{"user_id": "u789", "timestamp": "2023-01-15T10:08:00Z", "action": "purchase", "details": {"order_id": "o555", "total_amount": 125.50, "item_count": 2}}')),
    (5, PARSE_JSON('{"user_id": "u123", "timestamp": "2023-01-15T10:10:00Z", "action": "view_page", "details": {"page_name": "homepage"}}')),
    (6, PARSE_JSON('{"user_id": "u456", "timestamp": "2023-01-15T10:12:00Z", "action": "purchase", "details": {"order_id": "o556", "total_amount": 25.00, "item_count": 1}}'));


-- 创建 JavaScript UDF 从交互日志提取特征
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

WebAssembly UDF 允许使用可编译为 WebAssembly 的语言定义自定义逻辑或操作，这些 UDF 可直接在 SQL 查询中调用以执行特定计算或数据转换。

#### 使用示例

本示例创建 "wasm_gcd" 函数计算两个整数的最大公约数（GCD）。该函数使用 WebAssembly 定义，其实现位于 'test10_udf_wasm_gcd.wasm.zst' 二进制文件中。

执行前需经过以下步骤：
1. 将函数实现编译为二进制文件
2. 压缩为 'test10_udf_wasm_gcd.wasm.zst'
3. 提前将压缩文件上传至 stage

:::note
该函数可用 Rust 实现，示例见：https://github.com/arrow-udf/arrow-udf/blob/main/arrow-udf-example/src/lib.rs
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

## 管理 UDF

Databend 提供多种命令管理 UDF，详见[用户定义函数（User-Defined Function）](/sql/sql-commands/ddl/udf/)。