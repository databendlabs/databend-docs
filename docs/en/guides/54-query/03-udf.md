---
title: User-Defined Function
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Python UDF'/>

User-Defined Functions (UDFs) offer enhanced flexibility by supporting both anonymous lambda expressions and predefined handlers (Python, JavaScript & WebAssembly) for defining UDFs. These features allow users to create custom operations tailored to their specific data processing needs. Databend UDFs are categorized into the following types:

- [Lambda UDFs](#lambda-udf)
- [Embedded UDFs](#embedded-udfs)

Databend provides a variety of commands to manage UDFs. For details, see [User-Defined Function](/sql/sql-commands/ddl/udf/).

## Lambda UDF

A lambda UDF allows users to define custom operations using anonymous functions (lambda expressions) directly within their queries. These lambda expressions are often concise and can be used to perform specific data transformations or computations that may not be achievable using built-in functions alone.

### Usage Examples

This example creates UDFs to extract specific values from JSON data within a table using SQL queries.

```sql
-- Define UDFs
CREATE FUNCTION get_v1 AS (json) -> json["v1"];
CREATE FUNCTION get_v2 AS (json) -> json["v2"];

-- Create a table
CREATE TABLE json_table(time TIMESTAMP, data JSON);

-- Insert a time event
INSERT INTO json_table VALUES('2022-06-01 00:00:00.00000', PARSE_JSON('{"v1":1.5, "v2":20.5}'));

-- Get v1 and v2 value from the event
SELECT get_v1(data), get_v2(data) FROM json_table;
+------------+------------+
| data['v1'] | data['v2'] |
+------------+------------+
| 1.5        | 20.5       |
+------------+------------+
```

## Embedded UDFs

Embedded UDFs allow you to embed code written in the following programming languages within SQL:

- [Python](#python)
- [JavaScript](#javascript)
- [WebAssembly](#webassembly)

:::note
If your program content is large, you can compress it and then pass it to a stage. See the [Usage Examples](#usage-examples-2) for WebAssembly.
:::

### Python (requires Databend Enterprise)

A Python UDF allows you to invoke Python code from a SQL query via Databend's built-in handler, enabling seamless integration of Python logic within your SQL queries.

:::note
The Python UDF must use only Python's standard library; third-party imports are not allowed.
:::

#### Data Type Mappings

See [Data Type Mappings](/developer/drivers/python#data-type-mappings) in the Developer Guide.

#### Usage Examples

This example defines a Python UDF for sentiment analysis, creates a table, inserts sample data, and performs sentiment analysis on the text data.

1. Define a Python UDF named `sentiment_analysis`.

```sql
-- Create the sentiment analysis function
CREATE OR REPLACE FUNCTION sentiment_analysis(STRING) RETURNS STRING
LANGUAGE python HANDLER = 'sentiment_analysis'
AS $$
def remove_stop_words(text, stop_words):
    """
    Removes common stop words from the text.
    
    Args:
    text (str): The input text.
    stop_words (set): A set of stop words to remove.
    
    Returns:
    str: Text with stop words removed.
    """
    return ' '.join([word for word in text.split() if word.lower() not in stop_words])

def calculate_sentiment(text, positive_words, negative_words):
    """
    Calculates the sentiment score of the text.
    
    Args:
    text (str): The input text.
    positive_words (set): A set of positive words.
    negative_words (set): A set of negative words.
    
    Returns:
    int: Sentiment score.
    """
    words = text.split()
    score = sum(1 for word in words if word in positive_words) - sum(1 for word in words if word in negative_words)
    return score

def get_sentiment_label(score):
    """
    Determines the sentiment label based on the sentiment score.
    
    Args:
    score (int): The sentiment score.
    
    Returns:
    str: Sentiment label ('Positive', 'Negative', 'Neutral').
    """
    if score > 0:
        return 'Positive'
    elif score < 0:
        return 'Negative'
    else:
        return 'Neutral'

def sentiment_analysis(text):
    """
    Analyzes the sentiment of the input text.
    
    Args:
    text (str): The input text.
    
    Returns:
    str: Sentiment analysis result including the score and label.
    """
    stop_words = set(["a", "an", "the", "and", "or", "but", "if", "then", "so"])
    positive_words = set(["good", "happy", "joy", "excellent", "positive", "love"])
    negative_words = set(["bad", "sad", "pain", "terrible", "negative", "hate"])

    clean_text = remove_stop_words(text, stop_words)
    sentiment_score = calculate_sentiment(clean_text, positive_words, negative_words)
    sentiment_label = get_sentiment_label(sentiment_score)
    
    return f'Sentiment Score: {sentiment_score}; Sentiment Label: {sentiment_label}'
$$;
```

2. Perform sentiment analysis on the text data using the `sentiment_analysis` function.

```sql
CREATE OR REPLACE TABLE texts (
    original_text STRING
);

-- Insert sample data
INSERT INTO texts (original_text)
VALUES 
('The quick brown fox feels happy and joyful'),
('A hard journey, but it was painful and sad'),
('Uncertain outcomes leave everyone unsure and hesitant'),
('The movie was excellent and everyone loved it'),
('A terrible experience that made me feel bad');


SELECT
    original_text,
    sentiment_analysis(original_text) AS processed_text
FROM
    texts;

|   original_text                                          |   processed_text                                  |
|----------------------------------------------------------|---------------------------------------------------|
|   The quick brown fox feels happy and joyful             |   Sentiment Score: 1; Sentiment Label: Positive   |
|   A hard journey, but it was painful and sad             |   Sentiment Score: -1; Sentiment Label: Negative  |
|   Uncertain outcomes leave everyone unsure and hesitant  |   Sentiment Score: 0; Sentiment Label: Neutral    |
|   The movie was excellent and everyone loved it          |   Sentiment Score: 1; Sentiment Label: Positive   |
|   A terrible experience that made me feel bad            |   Sentiment Score: -2; Sentiment Label: Negative  |
```

### JavaScript

A JavaScript UDF allows you to invoke JavaScript code from a SQL query via Databend's built-in handler, enabling seamless integration of JavaScript logic within your SQL queries.

#### Data Type Mappings

The following table shows the type mapping between Databend and JavaScript:

| Databend Type     | JS Type    |
|-------------------|------------|
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
| STRING            | String     |
| DATE / TIMESTAMP  | Date       |
| DECIMAL           | BigDecimal |
| BINARY            | Uint8Array |

#### Usage Examples

This example defines a JavaScript UDF named "gcd_js" to calculate the greatest common divisor (GCD) of two integers, and applies it within a SQL query:

```sql
CREATE FUNCTION gcd_js (INT, INT) RETURNS BIGINT LANGUAGE javascript HANDLER = 'gcd_js' AS $$
export function gcd_js(a, b) {
    while (b != 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}
$$

SELECT
    number,
    gcd_js((number * 3), (number * 6))
FROM
    numbers(5)
WHERE
    (number > 0)
ORDER BY 1;
```

### WebAssembly

A WebAssembly UDF allows users to define custom logic or operations using languages that compile to WebAssembly. These UDFs can then be invoked directly within SQL queries to perform specific computations or data transformations.

#### Usage Examples

In this example, the "wasm_gcd" function is created to compute the greatest common divisor (GCD) of two integers. The function is defined using WebAssembly and its implementation resides in the 'test10_udf_wasm_gcd.wasm.zst' binary file.

Prior to its execution, the function implementation undergoes a series of steps. First, it is compiled into a binary file, followed by compression into 'test10_udf_wasm_gcd.wasm.zst'. Finally, the compressed file is uploaded to a stage in advance.

:::note
The function can be implemented in Rust, as demonstrated in the example available at https://github.com/risingwavelabs/arrow-udf/blob/main/arrow-udf-wasm/examples/wasm.rs
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