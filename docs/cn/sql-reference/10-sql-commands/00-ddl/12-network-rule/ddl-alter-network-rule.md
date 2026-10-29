---
title: ALTER NETWORK RULE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

替换 Network Rule 的目标列表。需要全局 `SUPER` 权限。

## 语法

```sql
ALTER NETWORK RULE [ IF EXISTS ] <rule_name>
    SET VALUE_LIST = ('<host>[:<port>]', ...)
```

新列表不能为空，并且会替换整个列表，而非追加。值的格式与 [CREATE NETWORK RULE](ddl-create-network-rule.md) 相同。不支持修改 `TYPE` 和 `MODE`。

`IF EXISTS` 忽略规则不存在的错误，但不会忽略无效值或元数据服务错误。

## 示例

```sql
ALTER NETWORK RULE udf_service_rule
    SET VALUE_LIST = ('udf.example.com:443', 'udf.example.com:8443');
```

变更异步传播后，所有引用该规则的 integration 都会使用新列表。移除某个目标后，已有查询后续发出的 Flight 请求也可能被拒绝。此命令不会修改 UDF 的 `ADDRESS`。

传播时机与 operator 限制见[外部访问集成](/guides/security/external-access-integration)。
