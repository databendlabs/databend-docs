---
title: "TPC-H SF1000（1TB）：Databend Cloud Warehouse 规格 Benchmark"
sidebar_label: "TPC-H SF1000 Benchmark"
slug: tpch-sf1000
---

本文对比 Databend Cloud Small、Medium、Large 三档 Warehouse 在同一 TPC-H SF1000 workload 下的表现。SF1000 通常用于表示约 1TB 规模的 TPC-H 数据。

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
| Small | 1173.32 s | 1.00x | — |
| Medium | 537.93 s | 2.18x | 2.18x |
| Large | 285.96 s | 4.10x | 1.88x |

![TPC-H SF1000 Warehouse Size Benchmark](@site/static/img/documents/tpch-sf1000-warehouse-size.svg)

Medium 约为 Small 的 2.18x。Large 约为 Small 的 4.10x，可在 5 分钟内完成 22 条 Query。

## Query 明细

单位：秒。数值越低越好。

| Query | Small | Medium | Large | Small → Medium | Medium → Large |
|---:|---:|---:|---:|---:|---:|
| Q1 | 31.61 | 19.93 | 10.33 | 1.59x | 1.93x |
| Q2 | 10.00 | 7.15 | 5.52 | 1.40x | 1.30x |
| Q3 | 73.07 | 24.50 | 17.75 | 2.98x | 1.38x |
| Q4 | 177.60 | 17.22 | 16.39 | 10.31x | 1.05x |
| Q5 | 300.78 | 17.69 | 11.22 | 17.00x | 1.58x |
| Q6 | 13.93 | 4.46 | 2.19 | 3.12x | 2.04x |
| Q7 | 33.08 | 18.08 | 9.78 | 1.83x | 1.85x |
| Q8 | 31.37 | 17.81 | 10.90 | 1.76x | 1.63x |
| Q9 | 102.01 | 45.41 | 29.52 | 2.25x | 1.54x |
| Q10 | 40.84 | 31.18 | 23.05 | 1.31x | 1.35x |
| Q11 | 5.91 | 3.59 | 2.20 | 1.65x | 1.63x |
| Q12 | 23.74 | 11.81 | 8.70 | 2.01x | 1.36x |
| Q13 | 57.78 | 34.52 | 23.78 | 1.67x | 1.45x |
| Q14 | 38.45 | 9.84 | 5.18 | 3.91x | 1.90x |
| Q15 | 13.22 | 8.18 | 4.82 | 1.62x | 1.70x |
| Q16 | 4.77 | 3.25 | 2.27 | 1.47x | 1.43x |
| Q17 | 20.77 | 11.29 | 5.87 | 1.84x | 1.92x |
| Q18 | 90.78 | 158.89 | 17.24 | 0.57x | 9.22x |
| Q19 | 20.36 | 10.86 | 8.22 | 1.87x | 1.32x |
| Q20 | 25.34 | 10.07 | 4.94 | 2.52x | 2.04x |
| Q21 | 52.85 | 64.57 | 61.19 | 0.82x | 1.06x |
| Q22 | 5.06 | 7.64 | 4.90 | 0.66x | 1.56x |
| 合计 | 1173.32 | 537.93 | 285.96 | 2.18x | 1.88x |

## 说明

整体 workload 随 Warehouse 规格提升有清晰收益。个别 Query 不完全线性，通常与 Query 形态、执行计划、调度和缓存行为有关。
