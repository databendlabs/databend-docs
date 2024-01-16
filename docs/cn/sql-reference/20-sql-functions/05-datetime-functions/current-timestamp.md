---
title: CURRENT_TIMESTAMP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.225"/>

返回当前时间戳。

## 语法

```sql
CURRENT_TIMESTAMP
```

## 返回类型

TIMESTAMP。

## 示例

此示例使用 `SELECT CURRENT_TIMESTAMP` 语句返回当前时间戳：

```sql
SELECT CURRENT_TIMESTAMP();

┌────────────────────────────┐
│      current_timestamp     │
├────────────────────────────┤
│ 2023-11-27 15:59:52.438152 │
└────────────────────────────┘
```

此示例使用该函数为 TIMESTAMP 列生成默认值：

```sql
-- timestamp 列默认为当前时间戳
CREATE TABLE employees (
    id INT8,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 如果没有提供特定的时间戳，则会插入当前时间戳
INSERT INTO employees (id) VALUES (1);
INSERT INTO employees (id) VALUES (2);
INSERT INTO employees (id, created) 
    VALUES (3, '2024-01-01 09:00:00');

SELECT * FROM employees;

┌─────────────────────────────────────────────┐
│       id       │           created          │
├────────────────┼────────────────────────────┤
│              1 │ 2023-11-27 16:11:56.772168 │
│              2 │ 2023-11-27 16:12:01.857803 │
│              3 │ 2024-01-01 09:00:00        │
└─────────────────────────────────────────────┘
```