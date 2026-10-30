---
title: CREATE EXTERNAL ACCESS INTEGRATION
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

为远程 UDF 服务器创建租户级 External Access Integration。需要全局 `SUPER` 权限。

## 语法

```sql
CREATE [ OR REPLACE ] EXTERNAL ACCESS INTEGRATION [ IF NOT EXISTS ] <integration_name>
    ALLOWED_NETWORK_RULES = (<rule_name>, ...)
    ENABLED = { TRUE | FALSE }
```

| 参数 | 说明 |
|---|---|
| `<integration_name>` | 租户级标识符。 |
| `ALLOWED_NETWORK_RULES` | 非空的现存 Network Rule 标识符列表，不是字符串字面量。 |
| `ENABLED` | 必填。设为 `FALSE` 后，拒绝引用该 integration 的 UDF 请求。 |

两个属性的顺序不限，同一属性不能重复。`OR REPLACE` 和 `IF NOT EXISTS` 不能同时使用。不支持 Secret、OAuth 参数或 `COMMENT`。

启用后的 integration 允许匹配其任一规则的目标。UDF 引用多个 integration 时，每个对象都必须存在且已启用；目标至少需要匹配这些对象中的一个规则。非空的 operator `udf_server_allow_list` 还必须允许该主机。

## 示例

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT MODE = EGRESS
    VALUE_LIST = ('udf.example.com:443');

CREATE EXTERNAL ACCESS INTEGRATION udf_access
    ALLOWED_NETWORK_RULES = (udf_service_rule)
    ENABLED = TRUE;

GRANT USAGE ON INTEGRATION udf_access TO ROLE udf_developer;
```

假定 `udf_developer` 已存在。Integration `USAGE` 允许在 UDF 定义中引用该对象。创建 UDF 仍需 `SUPER`，修改 UDF 仍需全局 `ALTER`。

`CREATE OR REPLACE` 的策略变更会异步传播到已有 UDF 引用，无需重建这些 UDF。

函数语法与完整配置见[外部访问集成](/guides/security/external-access-integration)。
