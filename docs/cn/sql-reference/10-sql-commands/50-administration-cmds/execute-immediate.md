---
title: EXECUTE IMMEDIATE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.452"/>

执行一条 SQL 脚本。如需了解如何为 Databend 编写 SQL 脚本，请参考 [SQL 脚本](/sql/sql-reference/sql-scripting)。

## 语法

```sql
EXECUTE IMMEDIATE $$
BEGIN
    <procedure_body>
    RETURN <return_value>;             -- 用于返回单个值
    -- 或
    RETURN TABLE(<select_query>);      -- 用于返回一张表
END;
$$;
```

## 示例

以下示例通过循环将变量从 -1 迭代到 2，累加求和，最终结果为 2：

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
│ Result │
│ String │
├────────┤
│ 2      │
└────────┘
```

下面的示例返回一张包含列 `1 + 1` 且值为 2 的表：

```sql
EXECUTE IMMEDIATE $$
BEGIN
    LET x := 1;
    RETURN TABLE(SELECT :x + 1);
END;
$$;

┌───────────┐
│   Result  │
│   String  │
├───────────┤
│ ┌───────┐ │
│ │ 1 + 1 │ │
│ │ UInt8 │ │
│ ├───────┤ │
│ │     2 │ │
│ └───────┘ │
└───────────┘
```