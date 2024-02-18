---
title: 删除密码策略
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.283"/>

从Databend中删除一个已存在的密码策略。请注意，在删除密码策略之前，确保此策略未与任何用户关联。

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