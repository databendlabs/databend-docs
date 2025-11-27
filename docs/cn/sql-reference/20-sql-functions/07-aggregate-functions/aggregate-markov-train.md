---
title: MARKOV_TRAIN
---

使用马尔可夫模型提取数据集中的模式

## 语法

```sql
MARKOV_TRAIN(<string>)

MARKOV_TRAIN(<order>)(<string>)

MARKOV_TRAIN(<order>, <frequency_cutoff>, <num_buckets_cutoff>, <frequency_add>, <frequency_desaturate>) (<string>)
```

| 参数             | 描述               |
|------------------| ------------------ |
| `string` | 输入 |
| `order` | 模型上下文长度 |
| `frequency-cutoff` | 频率截断: 移除所以计数小于阈值的桶 |
| `num-buckets-cutoff` | 同一上下文不同后继桶的截断：移除所有桶数量少于指定值的直方图 |
| `frequency-add` | 对每个计数加一个常数以降低概率分布的偏斜 |
| `frequency-desaturate` | 0..1 - 将每个频率移向平均值以降低概率分布的偏斜 |

## 返回类型

取决于实现，仅用于作为 [MARKOV_GENERATE](../20-other-functions/markov_generate.md) 的参数。

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
