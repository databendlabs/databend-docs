---
title: FUSE_TAG
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.894"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='TABLE VERSIONING'/>

返回表的快照标签信息。有关快照标签的更多信息，请参阅[快照标签](../../10-sql-commands/00-ddl/21-table-versioning/index.md#snapshot-tags)。

## 语法

```sql
FUSE_TAG('<数据库名称>', '<表名称>')
```

## 输出列

| 列名                | 类型               | 描述                                                                       |
|---------------------|--------------------|----------------------------------------------------------------------------|
| name                | STRING             | 标签名称                                                                    |
| snapshot_location   | STRING             | 标签指向的快照文件                                                           |
| expire_at           | TIMESTAMP (可为空)  | 过期时间戳；在 CREATE SNAPSHOT TAG 中使用 `RETAIN` 时设置                      |

## 示例

```sql
CREATE TABLE mytable(a INT, b INT);

INSERT INTO mytable VALUES(1, 1),(2, 2);

-- 创建快照标签
CREATE SNAPSHOT TAG FOR mytable TAG v1;

INSERT INTO mytable VALUES(3, 3);

-- 创建带过期时间的标签
CREATE SNAPSHOT TAG FOR mytable TAG temp RETAIN 2 DAYS;

SELECT * FROM FUSE_TAG('default', 'mytable');

---
| name | snapshot_location                                          | expire_at                  |
|------|------------------------------------------------------------|----------------------------|
| v1   | 1/319/_ss/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4_v4.mpk        | NULL                       |
| temp | 1/319/_ss/f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3_v4.mpk        | 2025-06-15 10:30:00.000000 |
```
