---
title: CREATE ROLE
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="新增或更新：v1.2.703"/>

创建一个新的 role。

创建 role 后，您可以将对象权限授予该 role，从而为系统中的对象启用访问控制安全性。

另请参见：[GRANT](10-grant.md)

## 语法

```sql
CREATE ROLE [ IF NOT EXISTS ] <name> [ COMMENT = '<string_literal>' ]
```

- `<name>` 不能包含以下非法字符：
    - 单引号 (')
    - 双引号 (")
    - 退格 (\b)
    - 换页 (\f)

## 示例

```sql
CREATE ROLE role1;
```