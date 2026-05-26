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

## 下一步

- [脱敏策略](/guides/security/masking-policy) — 完整语法、条件脱敏、VARIANT 子字段脱敏
- [行访问策略](/guides/security/row-access-policy) — 完整语法、DML 行为、多参数策略、时间范围示例
