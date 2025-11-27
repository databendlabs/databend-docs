---
title: MARKOV_GENERATE
---

Using the model trained by [MARKOV_TRAIN](../07-aggregate-functions/aggregate-markov-train.md) to anonymize the dataset.

## Syntax

```sql
FEISTEL_OBFUSCATE( <model>, <params>, <seed>, <determinator> )
```

## Arguments

| Arguments | Description |
| ----------- | ----------- |
| `model` | The return model of markov_train |
| `params`| Json string: `{"order": 5, "sliding_window_size": 8}` <br/> order：order of markov model to generate strings，<br/> size of a sliding window in a source string - its hash is used as a seed for RNG in markov model |
| `seed` | seed |
| `determinator`| Source string |

## Return Type

String.

## Examples

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
