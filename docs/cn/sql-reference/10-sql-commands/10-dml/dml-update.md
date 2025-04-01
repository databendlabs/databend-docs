---
title: 更新数据
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.705"/>

更新表中行数据，可选择使用其他表的值进行更新。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除操作要么完全成功，要么彻底失败。
:::

## 语法

```sql
UPDATE <目标表>
       SET <列名> = <值> [ , <列名> = <值> , ... ] -- 设置新值  
        [ FROM <附加表> ] -- 使用其他表的值  
        [ WHERE <条件> ] -- 筛选行
```

## 配置 `error_on_nondeterministic_update` 设置

`error_on_nondeterministic_update` 设置控制当 UPDATE 语句尝试更新一个目标行（该行与多个源行关联且无确定性更新规则）时是否返回错误。

- 当 `error_on_nondeterministic_update` = `true`（默认）：若目标行匹配多个源行且无明确取值规则，Databend 将返回错误。
- 当 `error_on_nondeterministic_update` = `false`：即使目标行关联多个源行，UPDATE 语句仍会执行，但最终更新结果可能非确定性。

示例：

考虑以下表结构：

```sql
CREATE OR REPLACE TABLE target (
    id INT,
    price DECIMAL(10, 2)
);

INSERT INTO target VALUES
(1, 299.99),
(2, 399.99);

CREATE OR REPLACE TABLE source (
    id INT,
    price DECIMAL(10, 2)
);

INSERT INTO source VALUES
(1, 279.99),
(2, 399.99),
(2, 349.99);  -- 源表中存在重复id
```

执行以下 UPDATE 语句：

```sql
UPDATE target
SET target.price = source.price
FROM source
WHERE target.id = source.id;
```

- 当 `error_on_nondeterministic_update = true` 时，此查询会失败，因为 target 表中 id = 2 的行匹配 source 表中多行，导致更新不明确。

  ```sql
  SET error_on_nondeterministic_update = 1;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  error: APIError: QueryFailed: [4001]源表多行匹配目标表中同一行多次
  ```

- 当 `error_on_nondeterministic_update = false` 时，更新会成功，但 target 表中 id = 2 的 price 可能被更新为 399.99 或 349.99，具体取决于执行顺序。

  ```sql
  SET error_on_nondeterministic_update = 0;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  ┌────────────────────────┐
  │ 更新的行数            │
  ├────────────────────────┤
  │                      2 │
  └────────────────────────┘

  SELECT * FROM target;

  ┌────────────────────────────────────────────┐
  │        id       │           price          │
  ├─────────────────┼──────────────────────────┤
  │               1 │ 279.99                   │
  │               2 │ 399.99                   │
  └────────────────────────────────────────────┘
  ```