---
title: MARKOV_GENERATE
---

MARKOV_GENERATE 函数用于使用经 [MARKOV_TRAIN](../07-aggregate-functions/aggregate-markov-train.md) 训练的模型，生成匿名化数据

## 语法

```sql
FEISTEL_OBFUSCATE( <model>, <params>, <seed>, <determinator> )
```

## 参数

| 参数        | 描述        |
| ----------- | ----------- |
| `model` | markov_train 生成的模型 |
| `params`| 生成参数，json 字符串，`{"order": 5, "sliding_window_size": 8}` <br/> order：模型上下文长度，<br/> 源字符串中滑动窗口的大小-其哈希值用作模型中RNG的种子 |
| `seed` | 生成种子。|
| `determinator`| 输入 |

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
