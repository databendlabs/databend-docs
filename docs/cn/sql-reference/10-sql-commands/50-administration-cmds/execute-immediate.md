---
title: EXECUTE IMMEDIATE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.452"/>

执行一个 SQL 脚本。关于如何为 Databend 编写 SQL 脚本，请参阅 [SQL 脚本](/sql/sql-reference/sql-scripting)。

## 语法

```sql
EXECUTE IMMEDIATE $$
BEGIN
    <procedure_body>
    RETURN <return_value>;             -- 用于返回单个值
    -- 或者
    RETURN TABLE(<select_query>);      -- 用于返回一个表
END;
$$;
```

## 示例

此示例使用循环从 -1 迭代到 2 来递增 sum，结果为 sum (2):

```sql
EXECUTE IMMEDIATE $$
BEGIN
    LET x := -1;
    LET sum := 0;
    FOR x IN x TO x + 3 DO
        sum := sum + x;
    END FOR;
    RETURN sum;
END;
$$;

┌────────┐
│ 结果   │
│ 字符串 │
├────────┤
│ 2      │
└────────┘
```

以下示例返回一个包含列 `1 + 1` 和值 2 的表：

```sql
EXECUTE IMMEDIATE $$
BEGIN
    LET x := 1;
    RETURN TABLE(SELECT :x + 1);
END;
$$;

┌───────────┐
│   结果    │
│   字符串  │
├───────────┤
│ ┌───────┐ │
│ │ 1 + 1 │ │
│ │ UInt8 │ │
│ ├───────┤ │
│ │     2 │ │
│ └───────┘ │
└───────────┘
```