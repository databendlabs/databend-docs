---
title: DROP SNAPSHOT TAG
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.891"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

从 FUSE 表上删除命名快照标签。删除后，被引用的快照如果没有其他标签或保留策略保护，将可以被垃圾回收。

:::note
- 这是一个实验性功能，需要先启用：`SET enable_experimental_table_ref = 1;`
- 仅支持 FUSE 引擎表。
:::

## 语法

```sql
ALTER TABLE [<database_name>.]<table_name> DROP TAG <tag_name>
```

## 参数

| 参数 | 说明 |
|------|------|
| tag_name | 要删除的快照标签名称。如果标签不存在，将返回错误。 |

## 示例

```sql
SET enable_experimental_table_ref = 1;

CREATE TABLE t1(a INT, b STRING);
INSERT INTO t1 VALUES (1, 'a'), (2, 'b');

-- 创建然后删除标签
ALTER TABLE t1 CREATE TAG v1_0;
ALTER TABLE t1 DROP TAG v1_0;

-- 查询已删除的标签会返回错误
SELECT * FROM t1 AT (TAG => v1_0);
-- Error: tag 'v1_0' not found
```
