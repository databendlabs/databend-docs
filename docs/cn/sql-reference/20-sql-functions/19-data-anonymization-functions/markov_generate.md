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
| `params`| 生成参数，为 JSON 字符串格式，例如 `{"order": 5, "sliding_window_size": 8}`。<br/> `order`：马尔可夫模型的阶数（上下文长度）。<br/> `sliding_window_size`：源字符串的滑动窗口大小，其哈希值将用于初始化随机数生成器 (RNG) 的种子。 |
| `seed` | 生成种子。|
| `determinator`| 输入数据（决定因子）。 |

## 返回类型

字符串

## 示例

以下是一个处理 PII（个人身份信息）的示例：分别针对姓名和邮箱训练模型，并一次性生成两列对应的匿名数据。

```sql
-- 1) 训练姓名与邮箱的 Markov 模型
CREATE TABLE markov_name_model AS
SELECT markov_train(name) AS model
FROM (
  VALUES ('Alice Johnson'),('Bob Smith'),('Carol Davis'),('David Miller'),('Emma Wilson'),
         ('Frank Brown'),('Grace Lee'),('Henry Clark'),('Irene Torres'),('Jack White'),
         ('Karen Young'),('Leo Turner'),('Mia Scott'),('Noah Harris'),('Olivia Baker'),
         ('Paul Adams'),('Quinn Foster'),('Rachel Price'),('Sam Carter'),('Tina Evans')
) AS t(name);

CREATE TABLE markov_email_model AS
SELECT markov_train(email) AS model
FROM (
  VALUES ('alice.johnson@gmail.com'),('bob.smith@yahoo.com'),('carol.davis@outlook.com'),
         ('david.miller@example.com'),('emma.wilson@example.com'),('frank.brown@gmail.com'),
         ('grace.lee@example.com'),('henry.clark@example.com'),('irene.torres@example.com'),
         ('jack.white@example.com'),('karen.young@example.com'),('leo.turner@example.com'),
         ('mia.scott@example.com'),('noah.harris@example.com'),('olivia.baker@example.com'),
         ('paul.adams@example.com'),('quinn.foster@example.com'),('rachel.price@example.com'),
         ('sam.carter@example.com'),('tina.evans@example.com')
) AS t(email);

-- 2) 同时生成姓名和邮箱，两列数据均保持与原始样本相似的分布特征；指定 seed 仅为了复现示例结果
SELECT
  markov_generate(n.model, '{"order":3,"sliding_window_size":12}', 3030, CONCAT('orig_', number))                  AS fake_name,
  markov_generate(e.model, '{"order":3,"sliding_window_size":12}', 3030, CONCAT('orig_', number, '@example.com')) AS fake_email
FROM numbers(6)
JOIN markov_name_model n
JOIN markov_email_model e
LIMIT 6;
-- 样例输出（MCP 实测）
+-------------+-------------------------+
| fake_name   | fake_email              |
+-------------+-------------------------+
| Frank Brown | henry.clark@example     |
| Grace Johnso| quinn.foster@example    |
| Rachel      | paul.adams@example      |
| Carol David | olivia.baker@example    |
| Jack White  | frank.brown@gmail.com   |
| Noah Harris | race.johnson@example    |
+-------------+-------------------------+
```
