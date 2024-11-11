---
title: FLATTEN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.213"/>

将嵌套的 JSON 数据转换为表格格式，其中每个元素或字段都表示为单独的一行。

## 语法

```sql
[LATERAL] FLATTEN ( INPUT => <expr> [ , PATH => <expr> ]
                                    [ , OUTER => TRUE | FALSE ]
                                    [ , RECURSIVE => TRUE | FALSE ]
                                    [ , MODE => 'OBJECT' | 'ARRAY' | 'BOTH' ] )
```

| 参数/关键字 | 描述                                                                                                                              | 默认值 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| INPUT       | 指定要展平的 JSON 或数组数据。                                                                                                    | -      |
| PATH        | 指定输入数据中要展平的数组或对象的路径。                                                                                          | -      |
| OUTER       | 如果设置为 TRUE，即使结果为零的行仍将包含在输出中，但这些行的 KEY、INDEX 和 VALUE 列的值将设置为 NULL。                           | FALSE  |
| RECURSIVE   | 如果设置为 TRUE，函数将继续展平嵌套元素。                                                                                         | FALSE  |
| MODE        | 控制是仅展平对象 ('OBJECT')、仅展平数组 ('ARRAY')，还是两者都展平 ('BOTH')。                                                      | 'BOTH' |
| LATERAL     | LATERAL 是一个可选关键字，用于在 FROM 子句中引用 LATERAL 关键字左侧定义的列。LATERAL 允许在前面的表表达式和函数之间进行交叉引用。 | -      |

## 输出

下表描述了 FLATTEN 函数的输出列：

:::note
当与 FLATTEN 一起使用 LATERAL 关键字时，这些输出列可能不会显式提供，因为 LATERAL 引入了动态交叉引用，改变了输出结构。
:::

| 列    | 描述                                                |
| ----- | --------------------------------------------------- |
| SEQ   | 与输入关联的唯一序列号。                            |
| KEY   | 扩展值的键。如果展平的元素不包含键，则设置为 NULL。 |
| PATH  | 展平元素的路径。                                    |
| INDEX | 如果元素是数组，此列包含其索引；否则，设置为 NULL。 |
| VALUE | 展平元素的值。                                      |
| THIS  | 此列标识当前正在展平的元素。                        |

## 示例

### 示例 1: 演示 PATH、OUTER、RECURSIVE 和 MODE 参数

此示例演示了 FLATTEN 函数在 PATH、OUTER、RECURSIVE 和 MODE 参数方面的行为。

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

-- PATH 帮助从原始 JSON 数据中选择特定路径的元素。
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

-- RECURSIVE 启用嵌套结构的递归展平。
SELECT
  *
FROM
  FLATTEN (
    INPUT => PARSE_JSON (
      '{"name": "John", "languages": ["English", "Spanish", "French"], "address": {"city": "New York", "state": "NY"}}'
    ),
    RECURSIVE => TRUE
  );
```

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ seq │ key │ path │ index │ value │ this │
├────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1 │ address │ address │ NULL │ `{"city":"New York","state":"NY"}` │ `{"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"}` │
│ 1 │ city │ address.city │ NULL │ "New York" │ `{"city":"New York","state":"NY"}` │
│ 1 │ state │ address.state │ NULL │ "NY" │ `{"city":"New York","state":"NY"}` │
│ 1 │ languages │ languages │ NULL │ ["English","Spanish","French"] │ `{"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"}` │
│ 1 │ NULL │ languages[0] │ 0 │ "English" │ ["English","Spanish","French"] │
│ 1 │ NULL │ languages[1] │ 1 │ "Spanish" │ ["English","Spanish","French"] │
│ 1 │ NULL │ languages[2] │ 2 │ "French" │ ["English","Spanish","French"] │
│ 1 │ name │ name │ NULL │ "John" │ `{"address":{"city":"New York","state":"NY"},"languages":["English","Spanish","French"],"name":"John"}` │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

```sql
-- MODE 指定是否仅展平对象 ('OBJECT')、仅展平数组 ('ARRAY') 或两者都展平 ('BOTH')。
-- 在此示例中，使用 MODE => 'ARRAY'，这意味着仅展平 JSON 数据中的数组。
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


-- OUTER 确定是否在输出中包含零行扩展。
-- 在第一个示例中，使用 OUTER => TRUE 和一个空的 JSON 数组，这会导致零行扩展。
-- 即使没有值可以展平，行也会包含在输出中。
SELECT
  *
FROM
  FLATTEN (INPUT => PARSE_JSON ('[]'), OUTER => TRUE);

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   seq  │        key       │       path       │       index      │       value       │        this       │
├────────┼──────────────────┼──────────────────┼──────────────────┼───────────────────┼───────────────────┤
│      1 │ NULL             │ NULL             │             NULL │ NULL              │ NULL              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- 在第二个示例中，省略了 OUTER，输出显示了当未指定 OUTER 时，零结果行如何不被包含。
SELECT
  *
FROM
  FLATTEN (INPUT => PARSE_JSON ('[]'));

```

### 示例 2：演示 LATERAL FLATTEN

此示例演示了在使用 LATERAL 关键字时 FLATTEN 函数的行为。

```sql
-- 创建一个包含多个项目的 Tim Hortons 交易表
CREATE TABLE tim_hortons_transactions (
    transaction_id INT,
    customer_id INT,
    items VARIANT
);

-- 插入包含多个项目的 Tim Hortons 交易数据
INSERT INTO tim_hortons_transactions (transaction_id, customer_id, items)
VALUES
    (101, 1, parse_json('[{"item":"coffee", "price":2.50}, {"item":"donut", "price":1.20}]')),
    (102, 2, parse_json('[{"item":"bagel", "price":1.80}, {"item":"muffin", "price":2.00}]')),
    (103, 3, parse_json('[{"item":"timbit_assortment", "price":5.00}]'));

-- 使用 LATERAL FLATTEN 显示包含多个项目的 Tim Hortons 交易
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

-- 查找已购买项目的最大、最小和平均价格
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
