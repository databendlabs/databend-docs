---
title: ALTER EXTERNAL ACCESS INTEGRATION
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

修改 integration 的规则或启用状态。需要全局 `SUPER` 权限。

## 语法

```sql
ALTER EXTERNAL ACCESS INTEGRATION [ IF EXISTS ] <integration_name> SET
    [ ALLOWED_NETWORK_RULES = (<rule_name>, ...) ]
    [ ENABLED = { TRUE | FALSE } ]
```

至少指定一个属性。属性顺序不限，但不能重复。未指定的属性保持原值。

`ALLOWED_NETWORK_RULES` 替换整个列表。列表不能为空，且其中所有规则都必须存在。`ENABLED = FALSE` 拒绝所有引用该 integration 的 UDF 后续发出的请求，但不会删除 UDF 或其授权。

使用 `IF EXISTS` 时，不存在的 integration 不触发操作。元数据服务错误仍会导致语句失败。不支持 `UNSET`、Secret、OAuth 参数或 `COMMENT`。

## 示例

禁用并重新启用 integration：

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = FALSE;
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = TRUE;
```

在一条语句中替换规则并启用 integration。假定两个规则均已存在：

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET
    ALLOWED_NETWORK_RULES = (udf_service_rule, backup_service_rule)
    ENABLED = TRUE;
```

策略变更异步传播到 Query 节点。已有 pipeline 在后续 Flight 数据请求之前检查策略，但更新不会取消已经发出的请求。信任边界和时效限制见[外部访问集成](/guides/security/external-access-integration)。
