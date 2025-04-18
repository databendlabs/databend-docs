---
title: ALTER CLUSTER KEY
sidebar_position: 3
---

修改表的 cluster key。

参见：
[DROP CLUSTER KEY](./dml-drop-cluster-key.md)

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <name> CLUSTER BY ( <expr1> [ , <expr2> ... ] )
```

## 示例

```sql
-- 创建表
CREATE TABLE IF NOT EXISTS playground(a int, b int);

-- 通过列添加 cluster key
ALTER TABLE playground CLUSTER BY(b,a);

INSERT INTO playground VALUES(0,3),(1,1);
INSERT INTO playground VALUES(1,3),(2,1);
INSERT INTO playground VALUES(4,4);

SELECT * FROM playground ORDER BY b,a;
SELECT * FROM clustering_information('db1','playground');

-- 删除 cluster key
ALTER TABLE playground DROP CLUSTER KEY;

-- 通过表达式添加 cluster key
ALTER TABLE playground CLUSTER BY(rand()+a); 
```