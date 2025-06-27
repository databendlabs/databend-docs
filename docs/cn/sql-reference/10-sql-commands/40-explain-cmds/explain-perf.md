---
title: EXPLAIN PERF
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<FunctionDescription description="引入或更新于：v1.2.765"/>

`EXPLAIN PERF` 通过捕获堆栈跟踪（Stack Trace）进行 CPU 性能分析。此命令返回包含火焰图（Flame Graph）的 HTML 文件，该文件基于当前集群所有节点收集的数据生成。您可直接在浏览器中打开此 HTML 文件。

这有助于分析查询性能并识别瓶颈。

## 语法

```sql
EXPLAIN PERF <statement>
```

## 示例

```shell
bendsql --quote-style never --query="EXPLAIN PERF SELECT avg(number) FROM numbers(10000000)" > demo.html
```

随后在浏览器中打开 `demo.html` 文件查看火焰图（Flame Graph）：

<img src="https://github.com/user-attachments/assets/07acfefa-a1c3-4c00-8c43-8ca1aafc3224"/>

若查询（Query）执行过快，可能因数据采集不足导致火焰图（Flame Graph）为空。