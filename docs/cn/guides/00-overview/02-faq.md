---
title: 常见问题解答
---

### Q1: Databend的主要对象、层次结构及关联权限是什么？

下图展示了Databend对象在两个层次上的层次结构。每种类型的对象都设计了细粒度的权限和所有权，提供了灵活性。更多信息请参见[访问控制](../56-security/access-control/index.md)。

![Alt text](/img/guides/faq1.png)

### Q2: 如何在Databend中创建表？

使用[CREATE TABLE](/sql/sql-commands/ddl/table/ddl-create-table)命令在Databend中创建表：

```sql title='示例:'
CREATE TABLE example (
-- 除了DECIMAL外，无需指定字段长度。
  c1 INT,
  c2 VARCHAR,
  c3 DATETIME,
  c4 DECIMAL(20, 2),
  c5 BITMAP,
  c6 TUPLE (FLOAT, FLOAT)
);
```

### Q3: Databend、MySQL和Oracle之间的数据类型映射关系是什么？

下表概述了Databend、MySQL和Oracle之间数据类型的映射关系。

| Databend      | MySQL      | Oracle       |
| ------------- | ---------- | ------------ |
| TINYINT       | TINYINT    | NUMBER(3,0)  |
| SMALLINT      | SMALLINT   | NUMBER(5,0)  |
| INT           | INT        | NUMBER(10,0) |
| BIGINT        | BIGINT     | NUMBER(19,0) |
| FLOAT         | FLOAT      | FLOAT        |
| DOUBLE        | DOUBLE     | FLOAT(24)    |
| DECIMAL       | DECIMAL    | NUMBER       |
| DATE          | DATE       | DATE         |
| TIMESTAMP     | TIMESTAMP  | NUMBER       |
| DATETIME      | DATETIME   | DATE         |
| YEAR          | INT        | NUMBER       |
| VARCHAR       | VARCHAR    | VARCHAR2     |
| VARCHAR       | CHAR       | CHAR         |
| BINARY        | VARBINARY  | RAW, BLOB    |
| VARCHAR       | TEXT       | VARCHAR2     |
| VARCHAR       | LONGTEXT   | RAW, CBLOB   |
| VARCHAR       | MEDIUMTEXT | RAW, CBLOB   |
| VARCHAR       | ENUM       | VARCHAR2     |
| VARCHAR       | SET        | VARCHAR2     |
| VARCHAR       | bit        | CHAR         |
| ARRAY         | N/A        | N/A          |
| BOOLEAN       | N/A        | N/A          |
| TUPLE         | N/A        | N/A          |
| MAP           | N/A        | N/A          |
| JSON, VARIANT | JSON       | JSON         |
| BITMAP        | N/A        | N/A          |