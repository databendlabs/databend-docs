---
title: 数据保护策略
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='DATA PROTECTION POLICIES'/>

Databend 提供两种互补的策略类型，在不改变存储数据的前提下保护敏感信息：

- **脱敏策略（Masking Policy）** — 在查询时转换列值，未授权用户看到的是脱敏后的数据。
- **行访问策略（Row Access Policy）** — 在查询时过滤整行，未授权用户完全看不到这些行。

两种策略对应用透明：无需改代码、无需额外视图、无需复制数据。

## 选择合适的策略

假设有一张 `orders` 表，包含客户手机号、订单金额和所属区域。三类角色需要查询：

- **客服** 需要手机号（联系客户），但只能看到自己负责区域的订单。
- **分析师** 需要所有区域的数据做报表，但手机号必须脱敏。
- **管理员** 看到一切。

一个需求拆成两个策略：

| 需求 | 策略类型 |
|------|---------|
| 客服只能看到自己区域的行 | 行访问策略 |
| 分析师看到 `138****1234` 而非真实手机号 | 脱敏策略 |

## 什么场景用哪个

| 场景 | 使用 |
|------|------|
| 某些用户不该看到某些行 | 行访问策略 |
| 所有人都能看到行，但敏感字段要脱敏 | 脱敏策略 |
| 不同角色看到同一列的不同精度 | 脱敏策略 |
| 多租户隔离——租户只能看自己的数据 | 行访问策略 |
| 按角色限制可查询的时间范围 | 行访问策略 |
| 隐藏 JSON/VARIANT 列中的特定 key | 脱敏策略 |
| 行级隔离 + 列级脱敏组合使用 | 两者都用（但同一列不能同时绑定两种策略） |

## 协同工作原理

```
查询
  → 行访问策略过滤行（不满足条件的行消失）
  → 脱敏策略转换列值（敏感字段被替换）
  → 返回结果给用户
```

行过滤先执行，脱敏只作用于存活的行。

## 快速对比

| | 脱敏策略 | 行访问策略 |
|---|---|---|
| 保护粒度 | 列（值被替换） | 行（整行不可见） |
| 返回类型 | 必须与列类型相同 | 固定为 BOOLEAN |
| 每表限制 | 每列一个策略 | 每表一个策略 |
| 影响的操作 | SELECT | SELECT、UPDATE、DELETE、MERGE |
| 存储数据是否改变 | 否 | 否 |
| INSERT 是否受影响 | 否 | 否 |

## 组合使用

可以在同一张表上同时使用脱敏策略和行访问策略——它们自然组合。唯一的约束是：同一个列不能同时被脱敏策略绑定和行访问策略绑定。

**示例**：一张 `customers` 表：
- 行访问策略绑定 `region` 列，确保每个销售只能看到自己负责区域的客户
- 脱敏策略绑定 `ssn` 列，确保非 HR 角色看到 `***-**-****`

```sql
-- 行级：按区域过滤
CREATE ROW ACCESS POLICY rap_region
AS (r STRING) RETURNS BOOLEAN ->
  CASE
    WHEN is_role_in_session('admin') THEN true
    ELSE is_role_in_session(r)
  END;

ALTER TABLE customers ADD ROW ACCESS POLICY rap_region ON (region);

-- 列级：脱敏身份证号
CREATE MASKING POLICY mask_ssn
AS (val STRING) RETURNS STRING ->
  CASE
    WHEN is_role_in_session('hr') THEN val
    ELSE '***-**-****'
  END;

ALTER TABLE customers MODIFY COLUMN ssn SET MASKING POLICY mask_ssn;
```

## 进阶实践：端到端访问控制

本节演示一个生产级配置，将 RBAC、Ownership、表权限和策略权限组合使用。看完后你会清楚：谁创建策略、谁绑定策略、谁查询数据——职责分离如何落地。

### 场景

一家电商公司有一张 `orders` 表，包含敏感客户数据。四个角色需要不同级别的访问：

| 角色 | 职责 | 数据可见性 |
|------|------|-----------|
| `security_admin` | 创建和管理所有策略 | 不能直接查数据 |
| `data_engineer` | 建表、绑定策略 | 看到全部数据（管理员级别） |
| `analyst_apac` | 分析 APAC 区域数据 | 只看 APAC 行，手机号脱敏 |
| `support_global` | 全球客服 | 看所有行，手机号完整可见 |

<details>
<summary>全局视图（点击展开）</summary>

```text
+--------------------------------------------------------------------------------+
| ecommerce.orders (raw data)                                                    |
+----------+---------------+-------------+--------+--------+---------------------+
| order_id | customer_name | phone       | region | amount | created_at          |
+----------+---------------+-------------+--------+--------+---------------------+
| 1        | Alice         | 13812345678 | APAC   | 299.00 | 2025-01-15 10:00:00 |
| 2        | Bob           | 14987654321 | EMEA   | 150.00 | 2025-01-16 11:00:00 |
| 3        | Charlie       | 13698765432 | APAC   | 520.00 | 2025-01-17 09:30:00 |
| 4        | Diana         | 15012349876 | AMER   |  89.00 | 2025-01-18 14:00:00 |
+---------------------------------------+----------------------------------------+
                                        |
                                        v
                   +------------------------------------------------+
                   | 1) Row Access Policy: rap_region               |
                   |    ON (region)                                 |
                   |                                                |
                   |    data_engineer / support_global -> ALL       |
                   |    analyst_apac -> region = 'APAC' only        |
                   |    others -> NONE                              |
                   +------------------------+-----------------------+
                                            |
                                            v
                   +------------------------------------------------+
                   | 2) Masking Policy: mask_phone                  |
                   |    ON (phone)                                  |
                   |                                                |
                   |    data_engineer / support_global -> raw       |
                   |    others -> CONCAT(LEFT(3), '****', ...)      |
                   +------------------------+-----------------------+
                                            |
                                            v
          +-------------------------+-----------------------------+-----------------------------+
          |                         |                             |                             |
          v                         v                             v                             v
+--------------------+ +---------------------------+ +---------------------------+ +---------------------------+
| security_admin     | | data_engineer             | | analyst_apac              | | support_global            |
+--------------------+ +---------------------------+ +---------------------------+ +---------------------------+
| permission denied  | | id name    phone          | | id name    phone          | | id name    phone          |
| no SELECT          | | 1  Alice   13812345678    | | 1  Alice   138****5678    | | 1  Alice   13812345678    |
|                    | | 2  Bob     14987654321    | | 3  Charlie 136****5432    | | 2  Bob     14987654321    |
|                    | | 3  Charlie 13698765432    | |                           | | 3  Charlie 13698765432    |
|                    | | 4  Diana   15012349876    | |                           | | 4  Diana   15012349876    |
|                    | |                           | |                           | |                           |
| 0 rows             | | 4 rows, all regions       | | 2 rows, APAC only         | | 4 rows, all regions       |
|                    | | phone: visible            | | phone: masked             | | phone: visible            |
+--------------------+ +---------------------------+ +---------------------------+ +---------------------------+
```

</details>

以下步骤展示如何从零搭建这套配置。

### 第一步：创建角色和用户

```sql
-- 以 account_admin 执行

CREATE ROLE security_admin;
CREATE ROLE data_engineer;
CREATE ROLE analyst_apac;
CREATE ROLE support_global;

CREATE USER 'sec_user' IDENTIFIED BY 'password123';
CREATE USER 'eng_user' IDENTIFIED BY 'password123';
CREATE USER 'analyst_user' IDENTIFIED BY 'password123';
CREATE USER 'support_user' IDENTIFIED BY 'password123';

GRANT ROLE security_admin TO USER 'sec_user';
GRANT ROLE data_engineer TO USER 'eng_user';
GRANT ROLE analyst_apac TO USER 'analyst_user';
GRANT ROLE support_global TO USER 'support_user';
```

### 第二步：建表与 Ownership

授予 `data_engineer` 建库权限，然后以该角色创建表。Ownership 自动归属创建者的角色。

```sql
-- 以 account_admin 执行
GRANT CREATE DATABASE ON *.* TO ROLE data_engineer;

-- 切换到 data_engineer
SET ROLE data_engineer;

CREATE DATABASE ecommerce;
CREATE TABLE ecommerce.orders (
    order_id INT,
    customer_name STRING,
    phone STRING,
    region STRING,
    amount DECIMAL(10,2),
    created_at TIMESTAMP
);

INSERT INTO ecommerce.orders VALUES
    (1, 'Alice', '13812345678', 'APAC', 299.00, '2025-01-15 10:00:00'),
    (2, 'Bob', '14987654321', 'EMEA', 150.00, '2025-01-16 11:00:00'),
    (3, 'Charlie', '13698765432', 'APAC', 520.00, '2025-01-17 09:30:00'),
    (4, 'Diana', '15012349876', 'AMER', 89.00, '2025-01-18 14:00:00');
```

此时 `data_engineer` 拥有 `ecommerce.orders` 的 Ownership，对该表有完全控制权。

### 第三步：授予策略创建权限

策略创建权限是全局的（`*.*`），且必须授予角色而非用户。如果希望 `security_admin` 自己委派策略的 APPLY 权限，还需要授予 `GRANT` 权限。

```sql
-- 以 account_admin 执行
GRANT CREATE MASKING POLICY ON *.* TO ROLE security_admin;
GRANT CREATE ROW ACCESS POLICY ON *.* TO ROLE security_admin;
GRANT GRANT ON *.* TO ROLE security_admin;
```

现在 `security_admin` 可以创建策略并委派 APPLY 权限，但仍然无法查询任何表。

### 第四步：创建策略（以 security_admin 执行）

```sql
SET ROLE security_admin;
SET enable_experimental_row_access_policy = 1;

-- 脱敏策略：对没有 support_global 或 data_engineer 角色的用户隐藏手机号
CREATE MASKING POLICY mask_phone
AS (val STRING)
RETURNS STRING ->
  CASE
    WHEN is_role_in_session('data_engineer') OR is_role_in_session('support_global') THEN val
    ELSE CONCAT(SUBSTRING(val, 1, 3), '****', SUBSTRING(val, 8))
  END;

-- 行访问策略：按区域过滤
CREATE ROW ACCESS POLICY rap_region
AS (r STRING)
RETURNS BOOLEAN ->
  CASE
    WHEN is_role_in_session('data_engineer') OR is_role_in_session('support_global') THEN true
    WHEN is_role_in_session('analyst_apac') AND r = 'APAC' THEN true
    ELSE false
  END;
```

`security_admin` 现在拥有两个策略的 OWNERSHIP（自动授予）。但它无法将策略绑定到 `ecommerce.orders`，因为它没有表的 ALTER 权限。

### 第五步：授予策略绑定权限

策略所有者（`security_admin`）将 APPLY 权限委派给 `data_engineer`，后者拥有表并可以绑定策略。

```sql
-- 以 security_admin 执行（策略的 owner）
GRANT APPLY ON MASKING POLICY mask_phone TO ROLE data_engineer;
GRANT APPLY ON ROW ACCESS POLICY rap_region TO ROLE data_engineer;
```

### 第六步：先绑定脱敏策略（以 data_engineer 执行）

`data_engineer` 同时拥有表的 ALTER（通过 ownership）和脱敏策略的 APPLY。两者缺一不可。

```sql
SET ROLE data_engineer;
ALTER TABLE ecommerce.orders MODIFY COLUMN phone SET MASKING POLICY mask_phone;
```

此时表已经有列脱敏，但还没有行过滤。拥有 SELECT 的用户仍然能看到所有行，但未授权角色看到的手机号会被脱敏。

### 第七步：通过角色授予表访问权限

表权限授予角色，而不是直接授予用户。第一步已经把这些角色授予对应用户，因此用户的表访问权限来自角色成员关系。

```sql
-- 以 account_admin 执行
GRANT SELECT ON ecommerce.orders TO ROLE analyst_apac;
GRANT SELECT ON ecommerce.orders TO ROLE support_global;
GRANT USAGE ON ecommerce.* TO ROLE analyst_apac;
GRANT USAGE ON ecommerce.* TO ROLE support_global;
```

### 第八步：验证未绑定 Row Access Policy 时的结果

**analyst_user** 拥有 `analyst_apac` 角色，因此可以查询表。由于还没有绑定 Row Access Policy，它能看到所有行；由于已经绑定脱敏策略，手机号会被脱敏。

```sql
-- 以 analyst_user 登录
SET ROLE analyst_apac;
SELECT * FROM ecommerce.orders;
```

```
order_id | customer_name | phone       | region | amount | created_at
---------|---------------|-------------|--------|--------|--------------------
       1 | Alice         | 138****5678 | APAC   | 299.00 | 2025-01-15 10:00:00
       2 | Bob           | 149****4321 | EMEA   | 150.00 | 2025-01-16 11:00:00
       3 | Charlie       | 136****5432 | APAC   | 520.00 | 2025-01-17 09:30:00
       4 | Diana         | 150****9876 | AMER   | 89.00  | 2025-01-18 14:00:00
```

### 第九步：绑定 Row Access Policy

现在绑定行访问策略。它会在已有手机号脱敏的基础上增加行过滤。

```sql
-- 以 data_engineer 执行
SET ROLE data_engineer;
SET enable_experimental_row_access_policy = 1;

ALTER TABLE ecommerce.orders ADD ROW ACCESS POLICY rap_region ON (region);
```

### 第十步：验证绑定 Row Access Policy 后的结果

**analyst_user** — 只看到 APAC 行，手机号脱敏：

```sql
-- 以 analyst_user 登录
SET ROLE analyst_apac;
SELECT * FROM ecommerce.orders;
```

```
order_id | customer_name | phone       | region | amount | created_at
---------|---------------|-------------|--------|--------|--------------------
       1 | Alice         | 138****5678 | APAC   | 299.00 | 2025-01-15 10:00:00
       3 | Charlie       | 136****5432 | APAC   | 520.00 | 2025-01-17 09:30:00
```

**support_user** — 所有行，手机号完整可见：

```sql
-- 以 support_user 登录
SET ROLE support_global;
SELECT * FROM ecommerce.orders;
```

```
order_id | customer_name | phone       | region | amount | created_at
---------|---------------|-------------|--------|--------|--------------------
       1 | Alice         | 13812345678 | APAC   | 299.00 | 2025-01-15 10:00:00
       2 | Bob           | 14987654321 | EMEA   | 150.00 | 2025-01-16 11:00:00
       3 | Charlie       | 13698765432 | APAC   | 520.00 | 2025-01-17 09:30:00
       4 | Diana         | 15012349876 | AMER   | 89.00  | 2025-01-18 14:00:00
```

**sec_user** — 没有 SELECT 权限，拒绝访问：

```sql
-- 以 sec_user 登录
SET ROLE security_admin;
SELECT * FROM ecommerce.orders;
-- ERROR: Permission denied
```

### 第十一步：撤销角色访问

因为表权限授予的是角色，所以从用户上撤销角色后，不需要修改表授权，用户就会自然失去表访问权限。

```sql
-- 以 account_admin 执行
REVOKE ROLE analyst_apac FROM USER 'analyst_user';

-- 重新以 analyst_user 登录
SELECT * FROM ecommerce.orders;
-- ERROR: Permission denied
```

### 权限流向

```
account_admin
  │
  ├─ GRANT CREATE MASKING POLICY ON *.* ─────────► security_admin
  ├─ GRANT CREATE ROW ACCESS POLICY ON *.* ─────► security_admin
  ├─ GRANT GRANT ON *.* ────────────────────────► security_admin
  └─ GRANT CREATE DATABASE ON *.* ──────────────► data_engineer
                                                     │
security_admin                                       │
  │ (通过自动 OWNERSHIP 拥有策略)                      │
  ├─ GRANT APPLY ON MASKING POLICY ─────────────► data_engineer
  └─ GRANT APPLY ON ROW ACCESS POLICY ─────────► data_engineer
                                                     │
data_engineer                                        │
  │ (通过自动 OWNERSHIP 拥有表)                        │
  │ (拥有策略的 APPLY 权限)                            │
  ├─ ALTER TABLE ... SET MASKING POLICY              │
  └─ ALTER TABLE ... ADD ROW ACCESS POLICY           │
                                                     │
account_admin                                        │
  ├─ GRANT SELECT ON ecommerce.orders ─────────► analyst_apac ──► analyst_user
  ├─ GRANT SELECT ON ecommerce.orders ─────────► support_global ─► support_user
  └─ REVOKE ROLE analyst_apac FROM USER ───────► analyst_user 失去访问权限
```

### 核心要点

- **职责分离**：创建策略的角色（`security_admin`）不能查数据；查数据的角色（`analyst_apac`）不能修改策略。
- **最小权限**：绑定策略需要同时拥有策略的 `APPLY` 权限和表的 `ALTER` 权限——缺一不可。
- **脱敏和行访问相互独立**：只绑定脱敏策略会隐藏列值，但不会过滤行；再绑定 Row Access Policy 后，先过滤行，再执行脱敏。
- **通过角色授予表访问**：用户通过 `analyst_apac` 等角色查询表；从用户撤销角色后，用户会失去访问权限，而不需要修改表授权。
- **Ownership 自动授予**：创建者的角色自动获得新策略/表的 OWNERSHIP，无需额外 GRANT。
- **CREATE 权限只能授予角色**：`CREATE MASKING POLICY` 和 `CREATE ROW ACCESS POLICY` 不能直接授予用户，必须先授予角色。
- **审计配置**：用 `SHOW GRANTS ON MASKING POLICY mask_phone`、`SHOW GRANTS ON ROW ACCESS POLICY rap_region` 和 `POLICY_REFERENCES(POLICY_NAME => 'mask_phone')` 验证谁有权限、策略绑定在哪里。

## 下一步

- [脱敏策略](/guides/security/data-protection/masking-policy) — 完整语法、条件脱敏、VARIANT 子字段脱敏
- [行访问策略](/guides/security/data-protection/row-access-policy) — 完整语法、DML 行为、多参数策略、时间范围示例
