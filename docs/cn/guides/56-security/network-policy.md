---
title: 网络策略
---

网络策略会根据客户端 IP 决定 Databend 是否接受登录。即使口令正确，只要 IP 不符合策略，连接请求都会立即被拒绝，因此它是账号密码之外的又一道防线。

## 工作方式

- `ALLOWED_IP_LIST` 接受单个 IPv4 地址或 CIDR（例如 `10.0.0.0/24`），列表之外的地址一律不得登录。
- `BLOCKED_IP_LIST`（可选）用来在允许范围里再细分黑名单。系统会先检查阻止列表，再检查允许列表，所以同一 IP 同时出现在两个列表时仍会被拒绝。
- 每个用户一次只能绑定一个网络策略；同一个策略可以复用到多个用户，方便集中维护。
- 如果服务器拿不到客户端 IP，或者 IP 不在允许列表里，Databend 会直接返回 `AuthenticateFailure` 并拒绝连接。

## 操作示例

下面的示例覆盖网络策略的完整生命周期：创建 → 绑定 → 校验 → 集中更新 → 回收。

### 1. 创建策略并查看当前配置

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

### 2. 将策略绑定到用户

```sql
CREATE USER alice IDENTIFIED BY 'Str0ngPass!' WITH SET NETWORK POLICY='corp_vpn_policy';
CREATE USER bob IDENTIFIED BY 'An0therPass!';

-- 给已存在的用户补充策略
ALTER USER bob WITH SET NETWORK POLICY='corp_vpn_policy';
```

### 3. 检查策略是否生效

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

### 4. 统一更新并复用策略

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

策略与用户完全解耦，更新策略后所有引用它的用户都会立即得到新的 IP 规则。

### 5. 解除绑定并清理

```sql
ALTER USER bob WITH UNSET NETWORK POLICY;
DROP NETWORK POLICY corp_vpn_policy;
```

在删除策略前，请确认没有用户仍然依赖它，否则这些用户后续会登录失败。

---

完整语法与更多命令请参阅 [网络策略 SQL 参考](/sql/sql-commands/ddl/network-policy/)，其中涵盖 `CREATE`、`ALTER`、`SHOW`、`DESC` 和 `DROP`。
