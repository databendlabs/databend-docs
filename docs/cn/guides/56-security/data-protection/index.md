---
title: 数据保护策略
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='DATA PROTECTION POLICIES'/>

Databend 在查询时保护敏感数据，不修改存储内容：

| 策略 | 作用 |
|------|------|
| [脱敏策略](/guides/security/data-protection/masking-policy) | 转换列值 — 未授权用户看到脱敏结果 |
| [行访问策略](/guides/security/data-protection/row-access-policy) | 过滤整行 — 未授权用户完全看不到这些行 |

两种策略对应用透明：无需改代码、无需额外视图、无需复制数据。

## 选择合适的策略

| 场景 | 使用 |
|------|------|
| 隐藏整行 | 行访问 |
| 行仍可见，字段要打码 | 脱敏 |
| 不同角色看到同一列的不同精度 | 脱敏 |
| 多租户 / 区域隔离 | 行访问 |
| 按角色限制可查询时间范围 | 行访问 |
| 隐藏 JSON / VARIANT 中的 key | 脱敏 |
| 行隔离 + 列脱敏 | 两者都用（同一列不能同时绑定） |

示例：`orders` 表含手机号、金额、区域。

| 需求 | 策略 |
|------|------|
| 客服只看本区域 | 行访问绑定 `region` |
| 分析师看到 `138****1234` | 脱敏绑定 `phone` |
| 管理员看全部 | 通过两种策略的角色 |

## 协同工作

```
查询
  → 行访问策略过滤行
  → 脱敏策略转换存活行的列值
  → 返回结果
```

先过滤行，再对剩余行脱敏。

| | 脱敏 | 行访问 |
|---|---|---|
| 范围 | 列值 | 整行 |
| 返回类型 | 与列类型一致 | BOOLEAN |
| 限制 | 每列一个 | 每表一个 |
| 影响操作 | `SELECT` | `SELECT`、`UPDATE`、`DELETE`、`MERGE` |
| 存储 / `INSERT` | 不改 / 不过滤 | 不改 / 不过滤 |

同一张表可以同时用两种策略；**同一列**不能同时绑定两者。

```sql
-- 行：销售只看自己区域
CREATE ROW ACCESS POLICY rap_region
AS (r STRING) RETURNS BOOLEAN ->
CASE
  WHEN is_role_in_session('admin') THEN true
  ELSE is_role_in_session(r)
END;

ALTER TABLE customers ADD ROW ACCESS POLICY rap_region ON (region);

-- 列：非 HR 看到脱敏身份证
CREATE MASKING POLICY mask_ssn
AS (val STRING) RETURNS STRING ->
CASE
  WHEN is_role_in_session('hr') THEN val
  ELSE '***-**-****'
END;

ALTER TABLE customers MODIFY COLUMN ssn SET MASKING POLICY mask_ssn;
```

## 端到端：职责分离

把 RBAC 与两种策略组合，让创建者、绑定者、查询者职责分离。

| 角色 | 职责 | 可见性 |
|------|------|--------|
| `security_admin` | 创建 / 拥有策略 | 无表 SELECT |
| `data_engineer` | 拥有表并绑定策略 | 全部行，手机号明文 |
| `analyst_apac` | 分析 APAC | 仅 APAC，手机号脱敏 |
| `support_global` | 全球客服 | 全部行，手机号明文 |

```sql
-- account_admin：角色、用户、CREATE 权限
CREATE ROLE security_admin;
CREATE ROLE data_engineer;
CREATE ROLE analyst_apac;
CREATE ROLE support_global;

CREATE USER sec_user IDENTIFIED BY 'password123';
CREATE USER eng_user IDENTIFIED BY 'password123';
CREATE USER analyst_user IDENTIFIED BY 'password123';
CREATE USER support_user IDENTIFIED BY 'password123';

GRANT ROLE security_admin TO USER sec_user;
GRANT ROLE data_engineer TO USER eng_user;
GRANT ROLE analyst_apac TO USER analyst_user;
GRANT ROLE support_global TO USER support_user;

GRANT CREATE DATABASE ON *.* TO ROLE data_engineer;
GRANT CREATE MASKING POLICY ON *.* TO ROLE security_admin;
GRANT CREATE ROW ACCESS POLICY ON *.* TO ROLE security_admin;
GRANT GRANT ON *.* TO ROLE security_admin;

-- data_engineer：表 OWNERSHIP
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
  (1, 'Alice',   '13812345678', 'APAC', 299.00, '2025-01-15 10:00:00'),
  (2, 'Bob',     '14987654321', 'EMEA', 150.00, '2025-01-16 11:00:00'),
  (3, 'Charlie', '13698765432', 'APAC', 520.00, '2025-01-17 09:30:00'),
  (4, 'Diana',   '15012349876', 'AMER',  89.00, '2025-01-18 14:00:00');

-- security_admin：创建策略（自动 OWNERSHIP）
SET ROLE security_admin;
SET enable_experimental_row_access_policy = 1;

CREATE MASKING POLICY mask_phone
AS (val STRING) RETURNS STRING ->
CASE
  WHEN is_role_in_session('data_engineer') OR is_role_in_session('support_global') THEN val
  ELSE CONCAT(SUBSTRING(val, 1, 3), '****', SUBSTRING(val, 8))
END;

CREATE ROW ACCESS POLICY rap_region
AS (r STRING) RETURNS BOOLEAN ->
CASE
  WHEN is_role_in_session('data_engineer') OR is_role_in_session('support_global') THEN true
  WHEN is_role_in_session('analyst_apac') AND r = 'APAC' THEN true
  ELSE false
END;

GRANT APPLY ON MASKING POLICY mask_phone TO ROLE data_engineer;
GRANT APPLY ON ROW ACCESS POLICY rap_region TO ROLE data_engineer;

-- data_engineer：绑定（需要表 ALTER + 策略 APPLY）
SET ROLE data_engineer;
SET enable_experimental_row_access_policy = 1;
ALTER TABLE ecommerce.orders MODIFY COLUMN phone SET MASKING POLICY mask_phone;
ALTER TABLE ecommerce.orders ADD ROW ACCESS POLICY rap_region ON (region);

-- account_admin：通过角色授权表访问
GRANT USAGE ON ecommerce.* TO ROLE analyst_apac;
GRANT USAGE ON ecommerce.* TO ROLE support_global;
GRANT SELECT ON ecommerce.orders TO ROLE analyst_apac;
GRANT SELECT ON ecommerce.orders TO ROLE support_global;
```

结果：

| 角色 | 行 | 手机号 |
|------|----|--------|
| `analyst_apac` | 仅 APAC | 脱敏（`138****5678`） |
| `support_global` | 全部 | 明文 |
| `security_admin` | — | 无 SELECT，拒绝访问 |

```sql
SET ROLE analyst_apac;
SELECT * FROM ecommerce.orders;
-- 仅 Alice / Charlie，手机号脱敏

SET ROLE support_global;
SELECT * FROM ecommerce.orders;
-- 4 行，手机号明文

SET ROLE security_admin;
SELECT * FROM ecommerce.orders;
-- ERROR: Permission denied
```

撤销角色即可收回访问，无需改表授权：

```sql
REVOKE ROLE analyst_apac FROM USER analyst_user;
```

**要点**

- 创建策略 ≠ 查数据；绑定需要策略 `APPLY` **和** 表 `ALTER`
- 权限优先授给角色，而不是用户
- 创建者角色自动获得 OWNERSHIP
- `CREATE MASKING/ROW ACCESS POLICY` 只能授给角色
- 审计：`SHOW GRANTS ON MASKING POLICY ...`、`SHOW GRANTS ON ROW ACCESS POLICY ...`、`POLICY_REFERENCES(...)`

## 下一步

- [脱敏策略](/guides/security/data-protection/masking-policy) — 条件脱敏、VARIANT key
- [行访问策略](/guides/security/data-protection/row-access-policy) — 向量 / RAG 可见性、时间窗口、DML
