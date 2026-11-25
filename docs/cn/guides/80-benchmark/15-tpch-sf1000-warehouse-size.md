---
title: "TPC-H SF1000 性能对比：Small / Medium / Large Warehouse"
sidebar_label: "TPC-H SF1000 基准测试"
slug: tpch-sf1000
benchmark_card:
  title: TPC-H SF1000 · 1 TB
  views:
    - tab: 总耗时
      headline: 3.34×
      summary: 查询速度
      context: Large 较 Small · 22 条查询
      unit: 秒
      groups:
        - rows:
            - { label: Small, value: 539.73 }
            - { label: Medium, value: 311.88 }
            - { label: Large, value: 161.78, highlight: true }
      note: 耗时越短越好
    - tab: 加速比
      headline: 3.34×
      summary: 查询速度
      context: 以 Small 规格为基准
      decimals: 2
      unit: ×
      groups:
        - rows:
            - { label: Small, value: 1 }
            - { label: Medium, value: 1.73 }
            - { label: Large, value: 3.34, highlight: true }
      note: 加速比越高越好
---

import SignupCard from '@site/src/components/SignupCard';

本文使用 TPC-H SF1000（约 1TB）数据集，对比 Databend Cloud 三种规格 Warehouse（Small、Medium、Large）的查询性能表现。

## 数据规模

TPC-H Scale Factor 1000（SF1000）表示约 1TB 的生成数据。该数据集包含 8 张 TPC-H 标准表，总行数约 60 亿行。

| 表 | 行数 |
|---|---:|
| customer | 150,000,000 |
| lineitem | 6,000,000,000 |
| nation | 25 |
| orders | 1,500,000,000 |
| part | 200,000,000 |
| partsupp | 800,000,000 |
| region | 5 |
| supplier | 10,000,000 |

:::info[Disclaimer]
TPC Benchmark™ 和 TPC-H™ 是事务处理性能委员会 ([TPC](http://www.tpc.org)) 的商标。本文测试受 TPC-H 启发，但不属于官方 TPC-H 结果。
:::

## 总览

| Warehouse 规格 | 总耗时 | 相对 Small 加速比 | 相对上一档加速比 |
|---|---:|---:|---:|
| Small | 539.73 s | 1.00x | — |
| Medium | 311.88 s | 1.73x | 1.73x |
| Large | 161.78 s | 3.34x | 1.93x |

![TPC-H SF1000 Warehouse Size Benchmark](@site/static/img/documents/tpch-sf1000-warehouse-size.svg)

Medium 约为 Small 的 1.73x。Large 约为 Small 的 3.34x，可在 3 分钟内完成 22 条 Query。

## Query 明细

单位：秒。数值越低越好。

| Query | Small | Medium | Large | Small → Medium | Medium → Large |
|---:|---:|---:|---:|---:|---:|
| Q1 | 30.19 | 22.64 | 9.33 | 1.33x | 2.43x |
| Q2 | 7.76 | 6.74 | 4.20 | 1.15x | 1.60x |
| Q3 | 20.32 | 14.75 | 8.13 | 1.38x | 1.81x |
| Q4 | 14.51 | 12.08 | 5.92 | 1.20x | 2.04x |
| Q5 | 20.02 | 14.61 | 6.50 | 1.37x | 2.25x |
| Q6 | 6.97 | 3.75 | 2.04 | 1.86x | 1.84x |
| Q7 | 21.45 | 13.40 | 7.83 | 1.60x | 1.71x |
| Q8 | 21.67 | 14.97 | 7.13 | 1.45x | 2.10x |
| Q9 | 44.80 | 35.02 | 18.99 | 1.28x | 1.84x |
| Q10 | 41.07 | 28.16 | 15.87 | 1.46x | 1.77x |
| Q11 | 4.63 | 3.13 | 1.65 | 1.48x | 1.90x |
| Q12 | 29.97 | 12.32 | 6.12 | 2.43x | 2.01x |
| Q13 | 32.55 | 17.80 | 8.77 | 1.83x | 2.03x |
| Q14 | 23.50 | 5.35 | 3.46 | 4.39x | 1.55x |
| Q15 | 10.10 | 4.90 | 2.64 | 2.06x | 1.86x |
| Q16 | 4.60 | 3.21 | 1.98 | 1.43x | 1.62x |
| Q17 | 19.94 | 8.97 | 4.93 | 2.22x | 1.82x |
| Q18 | 68.04 | 20.74 | 11.67 | 3.28x | 1.78x |
| Q19 | 42.45 | 7.35 | 4.12 | 5.78x | 1.78x |
| Q20 | 31.25 | 8.20 | 4.33 | 3.81x | 1.89x |
| Q21 | 39.66 | 47.10 | 22.06 | 0.84x | 2.14x |
| Q22 | 4.29 | 6.69 | 4.12 | 0.64x | 1.62x |
| 合计 | 539.73 | 311.88 | 161.78 | 1.73x | 1.93x |

## 说明

整体查询性能随 Warehouse 规格提升有清晰收益。个别 Query 不完全线性，通常与查询形态、执行计划、调度和缓存行为有关。

<SignupCard title="在 Databend Cloud 上选择适合您的 Warehouse 规格" />
