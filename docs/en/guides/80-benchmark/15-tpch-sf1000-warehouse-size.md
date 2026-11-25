---
title: "TPC-H SF1000 (1TB): Databend Cloud Warehouse Size Benchmark"
sidebar_label: "TPC-H SF1000 Benchmark"
slug: tpch-sf1000
benchmark_card:
  title: TPC-H SF1000 · 1 TB
  views:
    - tab: Total time
      headline: 3.34×
      summary: faster on Large vs. Small
      context: 22 queries · about 6B rows
      unit: s
      groups:
        - rows:
            - { label: Small, value: 539.73 }
            - { label: Medium, value: 311.88 }
            - { label: Large, value: 161.78, highlight: true }
      note: Lower is better
    - tab: Speedup
      headline: 3.34×
      summary: faster on Large vs. Small
      context: Speedup vs. Small warehouse
      decimals: 2
      unit: ×
      groups:
        - rows:
            - { label: Small, value: 1 }
            - { label: Medium, value: 1.73 }
            - { label: Large, value: 3.34, highlight: true }
      note: Higher is better
---

import SignupCard from '@site/src/components/SignupCard';

This page compares Small, Medium, and Large Databend Cloud Warehouses on the same TPC-H SF1000 workload. SF1000 is commonly used to represent about 1TB of TPC-H data.

## Dataset Scale

TPC-H Scale Factor 1000 (SF1000) represents approximately 1TB of generated data. The dataset contains about 6 billion rows across the 8 standard TPC-H tables.

| Table | Rows |
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
TPC Benchmark™ and TPC-H™ are trademarks of the Transaction Processing Performance Council ([TPC](http://www.tpc.org)). This test is inspired by TPC-H, but it is not an official TPC-H result.
:::

## Summary

| Warehouse Size | Total Time | Speedup vs. Small | Speedup vs. Previous Size |
|---|---:|---:|---:|
| Small | 539.73 s | 1.00x | — |
| Medium | 311.88 s | 1.73x | 1.73x |
| Large | 161.78 s | 3.34x | 1.93x |

![TPC-H SF1000 Warehouse Size Benchmark](@site/static/img/documents/tpch-sf1000-warehouse-size.svg)

Medium is about 1.73x faster than Small. Large is about 3.34x faster than Small and completes the full 22-query workload in under 3 minutes.

## Query Details

Unit: seconds. Lower is better.

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
| Total | 539.73 | 311.88 | 161.78 | 1.73x | 1.93x |

## Notes

The overall workload scales clearly as the Warehouse size increases. Some individual queries may not scale linearly due to query shape, execution plan, scheduling, and cache behavior.

<SignupCard title="Find the right warehouse size on Databend Cloud" />
