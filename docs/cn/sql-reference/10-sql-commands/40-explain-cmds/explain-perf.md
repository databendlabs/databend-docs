---
title: EXPLAIN PERF
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="引入或更新于：v1.2.765"/>

`EXPLAIN PERF` 捕获堆栈跟踪（stack traces）以执行 CPU 性能分析（CPU profiling）。该命令返回一个 HTML 文件，其中包含根据当前集群所有节点收集的数据生成的火焰图（flame graphs）。你可以直接在浏览器中打开此 HTML 文件。

它有助于分析查询性能并识别瓶颈。

## 语法

```sql
EXPLAIN PERF <statement>
```

## 示例

```shell
bendsql --quote-style never --query="EXPLAIN PERF SELECT avg(number) FROM numbers(10000000)" > demo.html
```

然后，你可以在浏览器中打开 `demo.html` 文件查看火焰图（flame graphs）：

<img alt="graphs" src="https://github.com/user-attachments/assets/07acfefa-a1c3-4c00-8c43-8ca1aafc3224"/>

如果查询（Query）执行得非常快，可能无法收集到足够的数据，从而导致火焰图（flame graph）为空。