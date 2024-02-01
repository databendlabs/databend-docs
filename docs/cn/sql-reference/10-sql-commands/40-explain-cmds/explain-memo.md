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
 ├── best cost: [#1] 10              
 ├── LogicalGet []                   
 └── PhysicalScan []                 
                                     
 Group #1                            
 ├── best cost: [#1] 100             
 ├── LogicalGet []                   
 └── PhysicalScan []                 
                                     
 Group #2                            
 ├── best cost: [#3] 310             
 ├── LogicalJoin [#0, #1]       
 ├── LogicalJoin [#1, #0]       
 ├── PhysicalHashJoin [#0, #1]       
 └── PhysicalHashJoin [#1, #0]
```