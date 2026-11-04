---
title: DROP NETWORK RULE
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

删除 Network Rule。需要全局 `SUPER` 权限。

## 语法

```sql
DROP NETWORK RULE [ IF EXISTS ] <rule_name>
```

`IF EXISTS` 忽略规则不存在的错误。元数据服务错误仍会导致语句失败。

## 行为

规则仍被 integration 按名称引用时，也可以删除。缺失规则不匹配任何目标；integration 中其他现存规则仍可授权请求。如果没有规则匹配，请求会被拒绝。

此命令不会删除引用该规则的 integration 或 UDF。使用同一名称重建规则后，其目标会再次对这些 integration 生效。要修改 integration 中的引用，请使用 [ALTER EXTERNAL ACCESS INTEGRATION](../11-external-access-integration/ddl-alter-external-access-integration.md)。

策略变更异步传播。删除规则不会取消已经发出的 Flight 请求。

## 示例

```sql
DROP NETWORK RULE IF EXISTS udf_service_rule;
```
