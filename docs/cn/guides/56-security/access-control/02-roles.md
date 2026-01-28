---
title: 角色
---

角色在 Databend 的权限管理中起着关键作用。当多个用户需要相同的权限时，逐一授权会非常繁琐。通过角色，我们可以将一组权限打包，然后轻松地将其分配给多个用户。

![Alt text](/img/guides/access-control-3.png)

## 继承角色 & 建立层级结构

角色授予允许一个角色继承另一个角色的权限。这有助于构建灵活的层级结构（类似于组织架构）。Databend 主要包含两个[内置角色](#built-in-roles)：最高层级的 `account-admin` 和最低层级的 `public`。

假设我们创建了三个角色：_manager_、_engineer_ 和 _intern_。如果我们把 _intern_ 角色授予 _engineer_，那么 _engineer_ 不仅拥有自己的权限，还会继承 _intern_ 的权限。以此类推，如果把 _engineer_ 角色授予 _manager_，那么 _manager_ 将同时获得 _engineer_ 和 _intern_ 的所有权限。

![Alt text](/img/guides/access-control-4.png)

## 内置角色

Databend 附带以下内置角色：

| 内置角色      | 描述                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| account-admin | 拥有所有权限，是所有其他角色的父角色，可以无缝切换为租户内的任何角色。 |
| public        | 不继承任何权限，所有其他角色都是它的父角色。任何角色都可以切换为 public 角色。 |

在 Databend Cloud 中，您可以在邀请用户时直接分配 `account-admin` 角色，或者在用户加入后进行分配。如果您使用的是 Databend 社区版或企业版，请在部署时先配置好 `account-admin` 用户，然后再按需分配给其他用户。关于管理员用户的配置详情，请参阅[配置管理员用户](../../20-self-hosted/04-references/admin-users.md)。

## 设置默认角色

当用户拥有多个角色时，可以使用 [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) 或 [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) 命令设置默认角色。默认角色是用户登录会话时自动生效的角色：

```sql title='Example:'
-- 显示系统中现有的角色
SHOW ROLES;

┌───────────────────────────────────────────────────────────┐
│      name     │ inherited_roles │ is_current │ is_default │
├───────────────┼─────────────────┼────────────┼────────────┤
│ account_admin │               0 │ true       │ true       │
│ public        │               0 │ false      │ false      │
│ writer        │               0 │ false      │ false      │
└───────────────────────────────────────────────────────────┘

-- 创建一个密码为 'abc123' 的用户 'eric'，并将 'writer' 设置为默认角色
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将 'account_admin' 角色授予给用户 'eric'
GRANT ROLE account_admin TO eric;

-- 将 'account_admin' 设置为用户 'eric' 的默认角色
ALTER USER eric WITH DEFAULT_ROLE = 'account_admin';
```

- 用户可以在会话中使用 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令灵活切换角色。
- 用户可以使用 [SHOW ROLES](/sql/sql-commands/ddl/user/user-show-roles) 命令查看当前的活跃角色以及所有被授予的角色。
- 如果未显式设置默认角色，Databend 将默认使用内置角色 `public`。

## 激活角色 & 辅助角色

在 Databend 中，用户可以被授予多个角色。这些角色分为激活角色（Active Role）和辅助角色（Secondary Roles）：

- **激活角色**：用户当前会话中正在使用的主角色，可通过 [SET ROLE](/sql/sql-commands/ddl/user/user-set-role) 命令进行切换。

- **辅助角色**：提供额外权限的角色，默认处于激活状态。用户可以使用 [SET SECONDARY ROLES](/sql/sql-commands/ddl/user/user-set-2nd-roles) 命令来启用或禁用这些角色，从而临时调整权限范围。

## 账单角色

除了标准的内置角色，Databend Cloud 还支持创建名为 `billing` 的自定义角色，专为财务人员设计。`billing` 角色仅拥有账单信息的访问权限，确保财务人员在查看财务数据时，无法访问其他业务页面。

要设置和使用 `billing` 角色，可以使用以下命令创建：

```sql
CREATE ROLE billing;
```

角色名称不区分大小写，`billing` 和 `Billing` 视为相同。关于该角色的设置和分配步骤，请参阅[授予财务人员访问权限](/guides/cloud/administration/costs#granting-access-to-finance-personnel)。

## 使用示例（基础）

此示例展示了基于角色的权限管理：创建角色并授予权限，再将角色授予用户，最后撤销角色权限以观察权限变化。

```sql title='Example:'
-- 创建一个名为 'writer' 的新角色
CREATE ROLE writer;

-- 将 'default' schema 中所有对象的所有权限授予给角色 'writer'
GRANT ALL ON default.* TO ROLE writer;

-- 创建一个密码为 'abc123' 的新用户 'eric' 并设置默认角色
CREATE USER eric IDENTIFIED BY 'abc123' WITH DEFAULT_ROLE = 'writer';

-- 将角色 'writer' 授予给用户 'eric'
GRANT ROLE writer TO eric;

-- 显示授予给角色 'writer' 的权限
SHOW GRANTS FOR ROLE writer;

┌───────────────────────────────────────────────────────┐
│                      Grants                           │
├───────────────────────────────────────────────────────┤
│ GRANT ALL ON 'default'.'default'.* TO ROLE 'writer'   │
└───────────────────────────────────────────────────────┘

-- 从角色 'writer' 中撤销 'default' schema 中所有对象的所有权限
REVOKE ALL ON default.* FROM ROLE writer;

-- 显示授予给角色 'writer' 的权限
-- 由于已从角色中撤销权限，因此不显示任何权限
SHOW GRANTS FOR ROLE writer;
```

## 业务系统对齐的角色模型

将角色与业务系统对齐，默认仅访问本域数据，跨域访问通过协作角色授予。

### 参考架构

```text
                         ┌──────────────┐
                         │   身份系统   │
                         │   账号/认证  │
                         └──────┬───────┘
                                │ 用户/权限
                                v
┌──────────────┐   商品/订单     ┌──────────────┐   支付/清算     ┌──────────────┐
│   营销增长   │──────────────>│   交易订单   │──────────────>│   支付结算   │
│   投放渠道   │               │   商品定价   │               │   清算对账   │
└──────┬───────┘               └──────┬───────┘               └──────┬───────┘
       │                              │ 履约/库存                    │ 对账/核算
       │                              v                             v
       │                        ┌──────────────┐             ┌──────────────┐
       │                        │   履约仓储   │             │   财务核算   │
       │                        │   发货配送   │             │   成本利润   │
       │                        └──────────────┘             └──────────────┘
       │
       │ 客服/反馈
       v
┌──────────────┐
│   客服工单   │
│   体验满意   │
└──────────────┘

       ^  风控监控/策略
       │
┌──────────────┐
│   风控反欺诈 │
│   风险事件   │
└──────────────┘
```

### 角色约定

- `<biz>_owner`: 业务域对象所有权角色
- `<biz>_rw`: 写入/建表/变更
- `<biz>_ro`: 只读
- 数据库: `<biz>_raw`, `<biz>_mart`
- Stage: `stage_<biz>_ingest`

### Ownership 行为

对象创建后，Ownership 会自动归属到“创建对象时的当前角色”。请在创建对象前先 `SET ROLE <biz>_owner`。详见 [Ownership](03-ownership.md)。

## 使用示例（业务系统）

以下示例基于上述业务协作关系，展示业务系统隔离、Ownership 归属以及跨域协作授权。

```sql title='Example:'
-- 1) 业务系统角色
CREATE ROLE identity_owner;
CREATE ROLE identity_rw;
CREATE ROLE identity_ro;

CREATE ROLE commerce_owner;
CREATE ROLE commerce_rw;
CREATE ROLE commerce_ro;

CREATE ROLE payment_owner;
CREATE ROLE payment_rw;
CREATE ROLE payment_ro;

CREATE ROLE fulfillment_owner;
CREATE ROLE fulfillment_rw;
CREATE ROLE fulfillment_ro;

CREATE ROLE marketing_owner;
CREATE ROLE marketing_rw;
CREATE ROLE marketing_ro;

CREATE ROLE finance_owner;
CREATE ROLE finance_rw;
CREATE ROLE finance_ro;

CREATE ROLE support_owner;
CREATE ROLE support_rw;
CREATE ROLE support_ro;

CREATE ROLE risk_owner;
CREATE ROLE risk_rw;
CREATE ROLE risk_ro;

-- 2) 业务系统资源
CREATE DATABASE identity_raw;
CREATE DATABASE identity_mart;
CREATE STAGE stage_identity_ingest;

CREATE DATABASE commerce_raw;
CREATE DATABASE commerce_mart;
CREATE STAGE stage_commerce_ingest;

CREATE DATABASE payment_raw;
CREATE DATABASE payment_mart;
CREATE STAGE stage_payment_ingest;

CREATE DATABASE fulfillment_raw;
CREATE DATABASE fulfillment_mart;
CREATE STAGE stage_fulfillment_ingest;

CREATE DATABASE marketing_raw;
CREATE DATABASE marketing_mart;
CREATE STAGE stage_marketing_ingest;

CREATE DATABASE finance_raw;
CREATE DATABASE finance_mart;
CREATE STAGE stage_finance_ingest;

CREATE DATABASE support_raw;
CREATE DATABASE support_mart;
CREATE STAGE stage_support_ingest;

CREATE DATABASE risk_raw;
CREATE DATABASE risk_mart;
CREATE STAGE stage_risk_ingest;

-- 3) Ownership 归属给 owner 角色
GRANT OWNERSHIP ON identity_raw.* TO ROLE identity_owner;
GRANT OWNERSHIP ON identity_mart.* TO ROLE identity_owner;
GRANT OWNERSHIP ON STAGE stage_identity_ingest TO ROLE identity_owner;

GRANT OWNERSHIP ON commerce_raw.* TO ROLE commerce_owner;
GRANT OWNERSHIP ON commerce_mart.* TO ROLE commerce_owner;
GRANT OWNERSHIP ON STAGE stage_commerce_ingest TO ROLE commerce_owner;

GRANT OWNERSHIP ON payment_raw.* TO ROLE payment_owner;
GRANT OWNERSHIP ON payment_mart.* TO ROLE payment_owner;
GRANT OWNERSHIP ON STAGE stage_payment_ingest TO ROLE payment_owner;

GRANT OWNERSHIP ON fulfillment_raw.* TO ROLE fulfillment_owner;
GRANT OWNERSHIP ON fulfillment_mart.* TO ROLE fulfillment_owner;
GRANT OWNERSHIP ON STAGE stage_fulfillment_ingest TO ROLE fulfillment_owner;

GRANT OWNERSHIP ON marketing_raw.* TO ROLE marketing_owner;
GRANT OWNERSHIP ON marketing_mart.* TO ROLE marketing_owner;
GRANT OWNERSHIP ON STAGE stage_marketing_ingest TO ROLE marketing_owner;

GRANT OWNERSHIP ON finance_raw.* TO ROLE finance_owner;
GRANT OWNERSHIP ON finance_mart.* TO ROLE finance_owner;
GRANT OWNERSHIP ON STAGE stage_finance_ingest TO ROLE finance_owner;

GRANT OWNERSHIP ON support_raw.* TO ROLE support_owner;
GRANT OWNERSHIP ON support_mart.* TO ROLE support_owner;
GRANT OWNERSHIP ON STAGE stage_support_ingest TO ROLE support_owner;

GRANT OWNERSHIP ON risk_raw.* TO ROLE risk_owner;
GRANT OWNERSHIP ON risk_mart.* TO ROLE risk_owner;
GRANT OWNERSHIP ON STAGE stage_risk_ingest TO ROLE risk_owner;

-- 4) 系统内读写分离
GRANT USAGE ON identity_raw.* TO ROLE identity_rw;
GRANT SELECT ON identity_raw.* TO ROLE identity_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON identity_mart.* TO ROLE identity_rw;
GRANT USAGE ON identity_mart.* TO ROLE identity_ro;
GRANT SELECT ON identity_mart.* TO ROLE identity_ro;
GRANT READ, WRITE ON STAGE stage_identity_ingest TO ROLE identity_rw;

GRANT USAGE ON commerce_raw.* TO ROLE commerce_rw;
GRANT SELECT ON commerce_raw.* TO ROLE commerce_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON commerce_mart.* TO ROLE commerce_rw;
GRANT USAGE ON commerce_mart.* TO ROLE commerce_ro;
GRANT SELECT ON commerce_mart.* TO ROLE commerce_ro;
GRANT READ, WRITE ON STAGE stage_commerce_ingest TO ROLE commerce_rw;

GRANT USAGE ON payment_raw.* TO ROLE payment_rw;
GRANT SELECT ON payment_raw.* TO ROLE payment_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON payment_mart.* TO ROLE payment_rw;
GRANT USAGE ON payment_mart.* TO ROLE payment_ro;
GRANT SELECT ON payment_mart.* TO ROLE payment_ro;
GRANT READ, WRITE ON STAGE stage_payment_ingest TO ROLE payment_rw;

GRANT USAGE ON fulfillment_raw.* TO ROLE fulfillment_rw;
GRANT SELECT ON fulfillment_raw.* TO ROLE fulfillment_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON fulfillment_mart.* TO ROLE fulfillment_rw;
GRANT USAGE ON fulfillment_mart.* TO ROLE fulfillment_ro;
GRANT SELECT ON fulfillment_mart.* TO ROLE fulfillment_ro;
GRANT READ, WRITE ON STAGE stage_fulfillment_ingest TO ROLE fulfillment_rw;

GRANT USAGE ON marketing_raw.* TO ROLE marketing_rw;
GRANT SELECT ON marketing_raw.* TO ROLE marketing_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON marketing_mart.* TO ROLE marketing_rw;
GRANT USAGE ON marketing_mart.* TO ROLE marketing_ro;
GRANT SELECT ON marketing_mart.* TO ROLE marketing_ro;
GRANT READ, WRITE ON STAGE stage_marketing_ingest TO ROLE marketing_rw;

GRANT USAGE ON finance_raw.* TO ROLE finance_rw;
GRANT SELECT ON finance_raw.* TO ROLE finance_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON finance_mart.* TO ROLE finance_rw;
GRANT USAGE ON finance_mart.* TO ROLE finance_ro;
GRANT SELECT ON finance_mart.* TO ROLE finance_ro;
GRANT READ, WRITE ON STAGE stage_finance_ingest TO ROLE finance_rw;

GRANT USAGE ON support_raw.* TO ROLE support_rw;
GRANT SELECT ON support_raw.* TO ROLE support_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON support_mart.* TO ROLE support_rw;
GRANT USAGE ON support_mart.* TO ROLE support_ro;
GRANT SELECT ON support_mart.* TO ROLE support_ro;
GRANT READ, WRITE ON STAGE stage_support_ingest TO ROLE support_rw;

GRANT USAGE ON risk_raw.* TO ROLE risk_rw;
GRANT SELECT ON risk_raw.* TO ROLE risk_rw;
GRANT CREATE, INSERT, UPDATE, DELETE, ALTER, DROP ON risk_mart.* TO ROLE risk_rw;
GRANT USAGE ON risk_mart.* TO ROLE risk_ro;
GRANT SELECT ON risk_mart.* TO ROLE risk_ro;
GRANT READ, WRITE ON STAGE stage_risk_ingest TO ROLE risk_rw;

-- 5) Ownership 自动归属示例
SET ROLE commerce_owner;
CREATE TABLE commerce_mart.orders (
  order_id STRING,
  user_id STRING,
  order_ts TIMESTAMP,
  amount DECIMAL(18, 2)
);

-- 6) 跨域协作授权
CREATE ROLE collab_marketing_commerce;
GRANT SELECT ON commerce_mart.orders TO ROLE collab_marketing_commerce;
GRANT ROLE collab_marketing_commerce TO ROLE marketing_ro;

CREATE ROLE collab_fulfillment_commerce;
GRANT SELECT ON commerce_mart.orders TO ROLE collab_fulfillment_commerce;
GRANT ROLE collab_fulfillment_commerce TO ROLE fulfillment_ro;

CREATE ROLE collab_payment_commerce;
GRANT SELECT ON commerce_mart.orders TO ROLE collab_payment_commerce;
GRANT ROLE collab_payment_commerce TO ROLE payment_ro;

CREATE ROLE collab_finance_payment;
GRANT SELECT ON payment_mart.transactions TO ROLE collab_finance_payment;
GRANT ROLE collab_finance_payment TO ROLE finance_ro;

CREATE ROLE collab_support_core;
GRANT SELECT ON commerce_mart.orders TO ROLE collab_support_core;
GRANT SELECT ON payment_mart.transactions TO ROLE collab_support_core;
GRANT ROLE collab_support_core TO ROLE support_ro;

CREATE ROLE collab_risk_core;
GRANT SELECT ON identity_mart.users TO ROLE collab_risk_core;
GRANT SELECT ON commerce_mart.orders TO ROLE collab_risk_core;
GRANT SELECT ON payment_mart.transactions TO ROLE collab_risk_core;
GRANT ROLE collab_risk_core TO ROLE risk_ro;
```
