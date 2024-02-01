---
title: EXPLAIN MEMO
---

返回查询的内部结构`Memo`。

## 语法

```sql
EXPLAIN MEMO <query_statement>
```

## 示例

```sql
EXPLAIN MEMO SELECT * FROM numbers(10) t, numbers(100) t1;

 ----
 Group #0                            
 ├── 最佳成本: [#1] 10              
 ├── 逻辑获取 []                   
 └── 物理扫描 []                 
                                     
 Group #1                            
 ├── 最佳成本: [#1] 100             
 ├── 逻辑获取 []                   
 └── 物理扫描 []                 
                                     
 Group #2                            
 ├── 最佳成本: [#3] 310             
 ├── 逻辑连接 [#0, #1]       
 ├── 逻辑连接 [#1, #0]       
 ├── 物理哈希连接 [#0, #1]       
 └── 物理哈希连接 [#1, #0]
```