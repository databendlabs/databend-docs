---
title: 更新数据
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.705"/>

更新表中的行数据，可选择使用其他表中的值。

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

`error_on_nondeterministic_update` 设置控制当 UPDATE 语句尝试更新一个目标行，而该行与多个源行关联且没有确定性更新规则时，是否返回错误。

- 当 `error_on_nondeterministic_update` = `true`（默认）：如果目标行匹配多个源行且没有明确的选择规则，Databend 将返回错误。
- 当 `error_on_nondeterministic_update` = `false`：即使目标行关联多个源行，UPDATE 语句也会继续执行，但最终的更新结果可能是不确定的。

示例：

考虑以下表：

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
(2, 349.99);  -- 源表中的重复 id
```

执行以下 UPDATE 语句：

```sql
UPDATE target
SET target.price = source.price
FROM source
WHERE target.id = source.id;
```

- 当 `error_on_nondeterministic_update = true` 时，此查询会失败，因为 target 中的 id = 2 匹配了 source 中的多行，导致更新不明确。

  ```sql
  SET error_on_nondeterministic_update = 1;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  error: APIError: QueryFailed: [4001]multi rows from source match one and the same row in the target_table multi times
  ```

- 当 `error_on_nondeterministic_update = false` 时，更新会成功，但 target.price 中 id = 2 的值可能会被更新为 399.99 或 349.99，具体取决于执行顺序。

  ```sql
  SET error_on_nondeterministic_update = 0;

  root@localhost:8000/default> UPDATE target
  SET target.price = source.price
  FROM source
  WHERE target.id = source.id;

  ┌────────────────────────┐
  │ number of rows updated │
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