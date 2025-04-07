---
title: DROP PASSWORD POLICY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.283"/>

从 Databend 中删除现有的密码策略。请注意，在删除密码策略之前，请确保该策略未与任何用户关联。

## 语法

```sql
DROP PASSWORD POLICY [ IF EXISTS ] <policy_name>
```

## 示例

```sql
CREATE PASSWORD POLICY SecureLogin
    PASSWORD_MIN_LENGTH = 10;

DROP PASSWORD POLICY SecureLogin;
```