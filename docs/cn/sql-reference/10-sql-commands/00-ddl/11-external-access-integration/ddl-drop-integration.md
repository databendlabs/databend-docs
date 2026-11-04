---
title: DROP INTEGRATION
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

删除 External Access Integration。需要全局 `SUPER` 权限。

## 语法

```sql
DROP [ EXTERNAL ACCESS ] INTEGRATION [ IF EXISTS ] <integration_name>
```

对于该对象，`DROP INTEGRATION` 和 `DROP EXTERNAL ACCESS INTEGRATION` 等价。`IF EXISTS` 忽略 integration 不存在的错误。元数据服务错误仍会导致语句失败。

删除 integration 不会删除其中的规则或引用它的 UDF。策略变更传播后，引用缺失 integration 的 UDF 会拒绝后续请求，不会回退到配置 allow list 放行。

:::caution
删除对象后，integration 授权仍会保留。使用相同名称重建后，这些授权可能再次生效。请在删除 integration 之前撤销不再需要的授权。
:::

## 示例

假定角色和 integration 均已存在：

```sql
REVOKE USAGE ON INTEGRATION udf_access FROM ROLE udf_developer;
DROP INTEGRATION udf_access;
```

使用完整形式执行可选清理：

```sql
DROP EXTERNAL ACCESS INTEGRATION IF EXISTS udf_access;
```

传播时机与权限行为见[外部访问集成](/guides/security/external-access-integration)。
