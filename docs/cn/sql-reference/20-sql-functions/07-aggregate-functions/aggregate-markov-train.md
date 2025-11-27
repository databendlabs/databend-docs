---
title: MARKOV_TRAIN
---

MARKOV_TRAIN 函数用于训练马尔可夫模型，以便生成匿名化数据。

## 语法

```sql
MARKOV_TRAIN(<string>)

MARKOV_TRAIN(<order>)(<string>)

MARKOV_TRAIN(<order>, <frequency_cutoff>, <num_buckets_cutoff>, <frequency_add>, <frequency_desaturate>) (<string>)
```

| 参数             | 描述               |
|------------------| ------------------ |
| `string` | 输入数据。 |
| `order` | 模型上下文长度。 |
| `frequency-cutoff` | 频率截断：移除所有计数小于阈值的桶。 |
| `num-buckets-cutoff` | 桶数量截断：如果同一上下文的后继桶数量少于指定值，则移除该直方图。 |
| `frequency-add` | 频率平滑：对每个计数增加一个常数，以降低概率分布的偏斜。 |
| `frequency-desaturate` | 频率去饱和：取值范围 0 到 1，将每个频率移向平均值，以降低概率分布的偏斜。 |

## 返回类型

取决于实现，仅用于作为 [MARKOV_GENERATE](../19-data-anonymization-functions/markov_generate.md) 的参数。

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
