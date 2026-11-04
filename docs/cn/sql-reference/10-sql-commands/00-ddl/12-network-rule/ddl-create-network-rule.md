---
title: CREATE NETWORK RULE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

创建租户级规则，定义远程 UDF 服务器的访问目标。需要全局 `SUPER` 权限。

## 语法

```sql
CREATE [ OR REPLACE ] NETWORK RULE [ IF NOT EXISTS ] <rule_name>
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('<host>[:<port>]', ...)
```

三个属性均为必填，可以使用任意顺序，但同一属性不能重复。`OR REPLACE` 和 `IF NOT EXISTS` 不能同时使用。

| 参数 | 说明 |
|---|---|
| `<rule_name>` | 租户级标识符。 |
| `TYPE` | 仅支持 `HOST_PORT`。 |
| `MODE` | 仅支持 `EGRESS`。 |
| `VALUE_LIST` | 非空的主机/端口列表，默认端口为 `443`。 |

值中不能包含 URL scheme、路径、认证信息、空白字符或通配符。不支持 CIDR 网段、端口范围或端口 `0`。服务器不监听 `443` 时，需要显式指定端口。

规则本身不会授权 UDF。需要将其加入[外部访问集成](../11-external-access-integration/ddl-create-external-access-integration.md)，并在函数定义中引用该 integration。非空的 operator `udf_server_allow_list` 仍是额外的主机限制。

## 示例

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('udf.example.com', 'udf.example.com:8443');
```

第一个值表示 `udf.example.com:443`。`CREATE OR REPLACE` 会影响所有按名称引用该规则的 integration。变更异步传播。

完整配置与信任边界见[外部访问集成](/guides/security/external-access-integration)。
