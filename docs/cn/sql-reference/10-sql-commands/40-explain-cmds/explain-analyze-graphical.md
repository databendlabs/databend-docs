---
title: EXPLAIN ANALYZE GRAPHICAL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.647"/>

通过浏览器中的交互式可视化界面分析查询性能。仅在 BendSQL v0.22.2 及以上版本可用。

## 语法

```sql
EXPLAIN ANALYZE GRAPHICAL <statement>
```

## 配置

在 BendSQL 配置文件 `~/.config/bendsql/config.toml` 中添加：

```toml
[server]
bind_address = "127.0.0.1"        
auto_open_browser = true      
```

## 示例

```sql
EXPLAIN ANALYZE GRAPHICAL SELECT l_returnflag, COUNT(*) 
FROM lineitem 
WHERE l_shipdate <= '1998-09-01' 
GROUP BY l_returnflag;
```

输出：
```bash
View graphical online: http://127.0.0.1:8080?perf_id=1
```

将打开交互式视图，展示执行计划、算子运行时长及数据流。

![图形化分析](@site/static/img/documents/sql/explain-graphical.png)