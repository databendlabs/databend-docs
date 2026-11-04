---
title: 外部访问集成
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

使用 Network Rule 和 External Access Integration，可以在 operator 的主机限制范围内，通过 SQL 管理远程 UDF 的访问目标。你可以修改允许的目标或禁用 integration，无需逐个修改 UDF，也无需重启 Query 节点。每个 Query 节点都需要使用支持此功能的版本。

此功能控制的是 **Databend Query 节点到远程 Apache Arrow Flight UDF 服务器的连接**。它不会向内联 Python、JavaScript 或 WASM 代码授予网络访问能力，也不控制远程 handler 向其他服务发起的请求。

## 工作原理

1. **Network Rule（网络规则）**定义允许访问的主机和端口。当前仅支持 `TYPE = HOST_PORT` 和 `MODE = EGRESS`。
2. **External Access Integration（外部访问集成）**组合多个规则，并提供 `ENABLED` 开关。
3. 远程 UDF 在 `ADDRESS` 后通过 `EXTERNAL_ACCESS_INTEGRATIONS` 引用一个或多个 integration。

目标至少需要匹配这些 integration 中的一个规则。**所有被引用的 integration 都必须存在且已启用**，即使其他 integration 中已有匹配规则。

Network Rule 与 [Network Policy](/sql/sql-commands/ddl/network-policy) 不同：Network Policy 限制客户端连接 Databend；Network Rule 限制远程 UDF 的访问目标。

## Operator 配置与信任边界

SQL 策略不能覆盖 Query 节点配置。需要在每个 Query 节点上启用远程 UDF。除非 operator 显式允许不安全的 HTTP，否则应使用 HTTPS：

```toml
[query]
enable_udf_server = true
udf_server_allow_insecure = false
udf_server_allow_list = ["https://udf.example.com"]
```

`enable_udf_server` 和 `udf_server_allow_insecure` 均默认为 `false`，allow list 默认为 `[]`。

| 配置中的 allow list | 未引用 integration 的 UDF | 显式引用 integration 的 UDF |
|---|---|---|
| 非空 | 主机必须通过配置 allow list。 | 主机必须通过配置 allow list，**且**目标必须匹配 SQL 规则。 |
| 为空 | 原有 allow-list 检查拒绝访问。 | 由 SQL 规则授权目标。 |

配置 allow list 保持原有的**仅比较主机**的行为。Network Rule 则比较**主机和端口**。非空配置列表是 operator 设置的上限，租户 `SUPER` 用户不能通过 SQL 绕过。

:::caution
如果 operator 启用了远程 UDF，同时将配置列表留空，就表示将 integration 绑定 UDF 的目标控制权交给租户 SQL 策略管理员。要保留 operator 层面的主机限制，请使用非空列表。要禁用远程 UDF，请设置 `enable_udf_server = false`。
:::

在 Databend Cloud 中，这些配置由服务 operator 管理。请使用支持 gRPC/HTTP2 的 HTTPS 端点。如果远程 UDF 未启用，或目标超出了 operator 限制，请联系 Support。Integration 不能绕过该限制。

参见[Query 配置](/guides/self-hosted/references/node-config/query-config#remote-udf-servers)。

## 配置 SQL 管理的访问

以下示例使用已有角色 `udf_developer`。`https://udf.example.com` 上的服务器需要提供 `gcd` handler，接收两个 `INT` 参数并返回 `INT NULL`。服务器示例见 [CREATE FUNCTION](/sql/sql-commands/ddl/external-function/ddl-create-function)。

### 1. 创建规则和 Integration

使用具有 `SUPER` 权限的身份执行：

```sql
CREATE NETWORK RULE udf_service_rule
    TYPE = HOST_PORT
    MODE = EGRESS
    VALUE_LIST = ('udf.example.com:443');

CREATE EXTERNAL ACCESS INTEGRATION udf_access
    ALLOWED_NETWORK_RULES = (udf_service_rule)
    ENABLED = TRUE;
```

规则值不包含 URL scheme。省略端口时使用 `443`。不支持通配符、CIDR 网段、端口范围、端口 `0`、URL 路径或认证信息。

### 2. 授权函数开发者

由管理员向角色授予所需权限：

```sql
GRANT SUPER ON *.* TO ROLE udf_developer;
GRANT USAGE ON INTEGRATION udf_access TO ROLE udf_developer;
```

`USAGE` 是 `SUPER` 之外的额外要求。它不允许仅拥有普通 `CREATE` 权限的角色创建 UDF。修改 UDF 时，角色需要原有的全局 `ALTER` 权限，以及新定义中所有 integration 的 `USAGE` 权限。

### 3. 创建并调用函数

使用拥有已授权角色的用户执行：

```sql
CREATE FUNCTION gcd (INT, INT)
    RETURNS INT NULL
    LANGUAGE python
    HANDLER = 'gcd'
    ADDRESS = 'https://udf.example.com'
    EXTERNAL_ACCESS_INTEGRATIONS = (udf_access);

SELECT gcd(48, 18);
-- 6
```

Databend 在远程 Flight schema 检查之前校验权限和策略。服务器 schema 仍需与声明的参数类型和返回类型匹配。Integration 不会将 Flight 协议改为 REST，也不会改变服务器 schema 的要求。

调用已有 UDF 时，使用原有的 UDF 调用权限。调用者不需要额外拥有 integration `USAGE`。例如，在执行 UDF 权限检查的场景中，向已有角色 `udf_reader` 授予 UDF 访问权限：

```sql
GRANT USAGE ON UDF gcd TO ROLE udf_reader;
```

## 修改或禁用访问

修改规则中的目标：

```sql
ALTER NETWORK RULE udf_service_rule
    SET VALUE_LIST = ('udf.example.com:443', 'udf.example.com:8443');
```

该操作替换整个列表，不会修改 UDF 的 `ADDRESS`。要修改函数地址，请使用 `ALTER FUNCTION`。

禁用或重新启用 integration：

```sql
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = FALSE;
ALTER EXTERNAL ACCESS INTEGRATION udf_access SET ENABLED = TRUE;
```

Databend 在每次 Flight 数据请求之前检查策略，包括已构建的查询 pipeline 发起的请求。Integration 被禁用或不存在时，请求会被拒绝。显式引用 integration 后，即使规则不匹配，也不会回退到配置 allow list 放行。

:::note
策略变更通过节点本地的元数据 watch 异步传播。不同节点可能在不同时间观察到变更。更新不会取消已经发出的请求。请勿依赖这些 SQL 语句实现跨节点即时撤销。
:::

被删除的规则不匹配任何目标，其他现存规则仍可授权请求。新建或替换 `ALLOWED_NETWORK_RULES` 列表时，其中所有规则都必须存在。读取或解码策略元数据出错时，不会据此放行访问。

## 权限与对象生命周期

| 操作 | 所需权限 |
|---|---|
| 创建、修改或删除 Network Rule 或 integration | 全局 `SUPER` |
| 创建引用 integration 的 UDF | 全局 `SUPER`，以及每个被引用 integration 的 `USAGE` |
| 修改引用 integration 的 UDF | 全局 `ALTER`，以及新定义中每个 integration 的 `USAGE` |
| 调用已有 UDF | 原有 UDF 调用权限，不额外要求 integration `USAGE` |

要阻止函数开发者在后续定义中引用 integration：

```sql
REVOKE USAGE ON INTEGRATION udf_access FROM ROLE udf_developer;
```

这不会禁用已有的引用函数。要阻止这些函数继续访问，请禁用 integration 或修改其规则。

Integration 授权按名称保存，执行 `DROP INTEGRATION` 后仍会保留。使用同一名称重建 integration 后，这些授权可能再次生效。请在删除 integration **之前**撤销不再需要的授权。

## 支持的 SQL

- [Network Rule 命令](/sql/sql-commands/ddl/network-rule)
- [External Access Integration 命令](/sql/sql-commands/ddl/external-access-integration)
- [CREATE FUNCTION](/sql/sql-commands/ddl/external-function/ddl-create-function)
- [ALTER FUNCTION](/sql/sql-commands/ddl/external-function/ddl-alter-function)
- [GRANT](/sql/sql-commands/ddl/user/grant) 和 [REVOKE](/sql/sql-commands/ddl/user/revoke)

当前规则和 integration 的实现不支持 Secret、OAuth 参数、`COMMENT` 或 `UNSET`。`EXTERNAL_ACCESS_INTEGRATIONS` 仅用于带 `ADDRESS` 的远程标量 UDF 定义。
