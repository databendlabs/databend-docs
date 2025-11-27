---
title: MARKOV_GENERATE
---

MARKOV_GENERATE 函数利用由 [MARKOV_TRAIN](../07-aggregate-functions/aggregate-markov-train.md) 训练生成的模型来生成匿名化数据。

## 语法

```sql
MARKOV_GENERATE( <model>, <params>, <seed>, <determinator> )
```

## 参数

| 参数        | 描述        |
| ----------- | ----------- |
| `model` | 由 markov_train 生成的模型。 |
| `params`| 生成参数，为 JSON 字符串格式，例如 `{"order": 5, "sliding_window_size": 8}`。<br/> `order`：模型上下文长度。<br/> `sliding_window_size`：源字符串中滑动窗口的大小，其哈希值将用作模型中随机数生成器 (RNG) 的种子。 |
| `seed` | 生成种子。|
| `determinator`| 输入数据（决定因子）。 |

## 返回类型

字符串

## 示例

```sql
create table model as
select markov_train(concat('bar', number::string)) as bar from numbers(100);

select markov_generate(bar,'{"order":5,"sliding_window_size":8}', 151, (number+100000)::string) as generate
from numbers(5), model;
+-----------+
| generate  |
+-----------+
│ bar95     │
│ bar64     │
│ bar85     │
│ bar56     │
│ bar95     │
+-----------+
```
