---
title: 网络策略
---

网络策略用于基于客户端 IP 地址控制 Databend 的登录权限。即使提供了正确的凭证，如果连接请求的来源 IP 不符合策略要求，该请求也会被拒绝。这为用户名和密码认证之外增加了一层额外的安全保障。

## 工作方式

- `ALLOWED_IP_LIST` 接受单个 IPv4 地址或 CIDR 网段（例如 `10.0.0.0/24`）。只有在列表中的地址才允许登录。
- `BLOCKED_IP_LIST`（可选）用于在允许的范围内明确排除某些 IP。Databend 会优先检查阻止列表，因此如果一个 IP 同时存在于两个列表中，它仍会被拒绝。
- 一个用户同一时间只能关联一个网络策略，但同一个策略可以被多个用户共享，便于统一管理。
- 如果服务器无法获取客户端 IP，或者 IP 不在允许列表里，Databend 会直接返回 `AuthenticateFailure` 并拒绝连接。

## 操作示例

本示例将涵盖网络策略的典型生命周期：创建策略、绑定到用户、验证状态、集中更新以及最终的解绑和删除。

### 1. 创建并查看策略

```sql
CREATE NETWORK POLICY corp_vpn_policy
    ALLOWED_IP_LIST=('10.1.0.0/16', '172.16.8.12/32')
    BLOCKED_IP_LIST=('10.1.10.25')
    COMMENT='Only VPN ranges';

SHOW NETWORK POLICIES;

Name            |Allowed Ip List           |Blocked Ip List|Comment          |
----------------+--------------------------+---------------+-----------------+
corp_vpn_policy |10.1.0.0/16,172.16.8.12/32|10.1.10.25     |Only VPN ranges  |
```

### 2. 绑定策略到用户

```sql
CREATE USER alice IDENTIFIED BY 'Str0ngPass!' WITH SET NETWORK POLICY='corp_vpn_policy';
CREATE USER bob IDENTIFIED BY 'An0therPass!';

-- 给已存在的用户补充策略
ALTER USER bob WITH SET NETWORK POLICY='corp_vpn_policy';
```

### 3. 验证策略执行情况

```sql
DESC USER alice;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  name  │ hostname │       auth_type      │ default_role │ roles │ disabled │   network_policy  │ password_policy │ must_change_password │
├────────┼──────────┼──────────────────────┼──────────────┼───────┼──────────┼───────────────────┼─────────────────┼──────────────────────┤
│ alice  │ %        │ double_sha1_password │              │       │ false    │ corp_vpn_policy   │                 │ NULL                 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

DESC NETWORK POLICY corp_vpn_policy;

Name            |Allowed Ip List           |Blocked Ip List|Comment         |
----------------+--------------------------+---------------+----------------+
corp_vpn_policy |10.1.0.0/16,172.16.8.12/32|10.1.10.25     |Only VPN ranges |
```

### 4. 更新并复用策略

借助 [ALTER NETWORK POLICY](/sql/sql-commands/ddl/network-policy/ddl-alter-policy) 可以直接修改允许或阻止的 IP 而无需逐个更新用户：

```sql
ALTER NETWORK POLICY corp_vpn_policy
    SET ALLOWED_IP_LIST=('10.1.0.0/16', '10.2.0.0/16')
        BLOCKED_IP_LIST=('10.1.10.25', '10.2.5.5')
        COMMENT='VPN + DR site';

DESC NETWORK POLICY corp_vpn_policy;

Name            |Allowed Ip List             |Blocked Ip List          |Comment          |
----------------+----------------------------+-------------------------+-----------------+
corp_vpn_policy |10.1.0.0/16,10.2.0.0/16     |10.1.10.25,10.2.5.5      |VPN + DR site    |
```

所有引用该策略的用户都会自动应用新的 IP 范围设置。

### 5. 解除绑定并清理

```sql
ALTER USER bob WITH UNSET NETWORK POLICY;
DROP NETWORK POLICY corp_vpn_policy;
```

在删除策略之前，请确认没有用户正在使用该策略；否则，相关用户的登录将会失败。

---

完整语法与更多命令请参阅 [网络策略 SQL 参考](/sql/sql-commands/ddl/network-policy/)，其中涵盖 `CREATE`、`ALTER`、`SHOW`、`DESC` 和 `DROP`。
