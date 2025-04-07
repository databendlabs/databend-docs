---
title: 用户自定义函数
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='Python UDF'/>

用户自定义函数 (UDFs) 通过支持匿名 lambda 表达式和预定义的处理程序（Python、JavaScript 和 WebAssembly）来定义 UDF，从而提供增强的灵活性。这些功能允许用户创建根据其特定数据处理需求量身定制的自定义操作。Databend UDF 分为以下类型：

- [Lambda UDFs](#lambda-udfs)
- [嵌入式 UDFs](#embedded-udfs)

## Lambda UDFs

lambda UDF 允许用户直接在其查询中使用匿名函数（lambda 表达式）来定义自定义操作。这些 lambda 表达式通常简洁明了，可用于执行仅使用内置函数可能无法实现的特定数据转换或计算。

### 使用示例

此示例创建 UDF，以使用 SQL 查询从表中的 JSON 数据中提取特定值。

```sql
-- 定义 UDF
CREATE FUNCTION get_v1 AS (input_json) -> input_json['v1'];
CREATE FUNCTION get_v2 AS (input_json) -> input_json['v2'];

SHOW USER FUNCTIONS;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │    is_aggregate   │ description │           arguments           │ language │         created_on         │
├────────┼───────────────────┼─────────────┼───────────────────────────────┼──────────┼────────────────────────────┤
│ get_v1 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:20:28.432842 │
│ get_v2 │ NULL              │             │ {"parameters":["input_json"]} │ SQL      │ 2024-11-18 23:21:46.838744 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 创建表
CREATE TABLE json_table(time TIMESTAMP, data JSON);

-- 插入时间事件
INSERT INTO json_table VALUES('2022-06-01 00:00:00.00000', PARSE_JSON('{"v1":1.5, "v2":20.5}'));

-- 从事件中获取 v1 和 v2 值
SELECT get_v1(data), get_v2(data) FROM json_table;
+------------+------------+
| data['v1'] | data['v2'] |
+------------+------------+
| 1.5        | 20.5       |
+------------+------------+
```

## 嵌入式 UDFs

嵌入式 UDF 允许您在 SQL 中嵌入使用以下编程语言编写的代码：

- [Python](#python)
- [JavaScript](#javascript)
- [WebAssembly](#webassembly)

使用嵌入式 UDF，您可以创建标量函数和聚合函数。标量函数对单行输入进行操作并返回单个值，而聚合函数处理多行输入并返回单个聚合结果，例如总和或平均值。

:::note
- 尚不支持使用 WebAssembly 创建聚合 UDF。
- 如果您的程序内容很大，您可以压缩它，然后将其传递到 Stage。有关 WebAssembly，请参见[使用示例](#usage-examples-2)。
:::

### Python (需要 Databend Enterprise)

Python UDF 允许您通过 Databend 的内置处理程序从 SQL 查询中调用 Python 代码，从而可以在 SQL 查询中无缝集成 Python 逻辑。

:::note
Python UDF 必须仅使用 Python 的标准库；不允许第三方导入。
:::

#### 数据类型映射

请参见开发者指南中的 [数据类型映射](/developer/drivers/python#data-type-mappings)。

#### 使用示例

此示例定义了一个用于情感分析的 Python UDF，创建了一个表，插入了示例数据，并对文本数据执行情感分析。

1. 定义一个名为 `sentiment_analysis` 的 Python UDF。

```sql
-- 创建情感分析函数
CREATE OR REPLACE FUNCTION sentiment_analysis(STRING) RETURNS STRING
LANGUAGE python HANDLER = 'sentiment_analysis_handler'
AS $$
def remove_stop_words(text, stop_words):
    """
    从文本中删除常见的停用词。

    Args:
    text (str): 输入文本。
    stop_words (set): 要删除的停用词集。

    Returns:
    str: 删除停用词后的文本。
    """
    return ' '.join([word for word in text.split() if word.lower() not in stop_words])

def calculate_sentiment(text, positive_words, negative_words):
    """
    计算文本的情感得分。

    Args:
    text (str): 输入文本。
    positive_words (set): 一组积极词。
    negative_words (set): 一组消极词。

    Returns:
    int: 情感得分。
    """
    words = text.split()
    score = sum(1 for word in words if word in positive_words) - sum(1 for word in words if word in negative_words)
    return score

def get_sentiment_label(score):
    """
    根据情感得分确定情感标签。

    Args:
    score (int): 情感得分。

    Returns:
    str: 情感标签（“积极”、“消极”、“中性”）。
    """
    if score > 0:
        return 'Positive'
    elif score < 0:
        return 'Negative'
    else:
        return 'Neutral'

def sentiment_analysis_handler(text):
    """
    分析输入文本的情感。

    Args:
    text (str): 输入文本。

    Returns:
    str: 情感分析结果，包括得分和标签。
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

2. 使用 `sentiment_analysis` 函数对文本数据执行情感分析。

```sql
CREATE OR REPLACE TABLE texts (
    original_text STRING
);

-- 插入示例数据
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

JavaScript UDF 允许您通过 Databend 的内置处理程序从 SQL 查询中调用 JavaScript 代码，从而可以在 SQL 查询中无缝集成 JavaScript 逻辑。

#### 数据类型映射

下表显示了 Databend 和 JavaScript 之间的类型映射：

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
| STRING            | String     |
| DATE / TIMESTAMP  | Date       |
| DECIMAL           | BigDecimal |
| BINARY            | Uint8Array |

#### 使用示例

此示例定义了一个名为 "gcd_js" 的 JavaScript UDF，用于计算两个整数的最大公约数 (GCD)，并在 SQL 查询中应用它：

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

此示例定义了一个聚合 UDF，该 UDF 通过根据一组值的相应权重对其进行聚合来计算该组值的加权平均值：

```sql
CREATE FUNCTION weighted_avg (INT, INT) STATE {sum INT, weight INT} RETURNS FLOAT
LANGUAGE javascript AS $$
export function create_state() {
    return {sum: 0, weight: 0};
}
export function accumulate(state, value, weight) {
    state.sum += value * weight;
    state.weight += weight;
    return state;
}
export function retract(state, value, weight) {
    state.sum -= value * weight;
    state.weight -= weight;
    return state;
}
export function merge(state1, state2) {
    state1.sum += state2.sum;
    state1.weight += state2.weight;
    return state1;
}
export function finish(state) {
    return state.sum / state.weight;
}
$$;
```

### WebAssembly

WebAssembly UDF 允许用户使用编译为 WebAssembly 的语言定义自定义逻辑或操作。然后可以直接在 SQL 查询中调用这些 UDF，以执行特定的计算或数据转换。

#### 使用示例

在此示例中，创建了 "wasm_gcd" 函数来计算两个整数的最大公约数 (GCD)。该函数使用 WebAssembly 定义，其实现在 'test10_udf_wasm_gcd.wasm.zst' 二进制文件中。

在执行之前，函数实现会经过一系列步骤。首先，它被编译成一个二进制文件，然后被压缩成 'test10_udf_wasm_gcd.wasm.zst'。最后，压缩后的文件会提前上传到 Stage。

:::note
该函数可以使用 Rust 实现，如 https://github.com/risingwavelabs/arrow-udf/blob/main/arrow-udf-wasm/examples/wasm.rs 提供的示例所示
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

Databend 提供了各种命令来管理 UDF。有关详细信息，请参见 [用户自定义函数](/sql/sql-commands/ddl/udf/)。