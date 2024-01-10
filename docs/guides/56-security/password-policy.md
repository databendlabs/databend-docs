---
title: Password Policy
---

Databend includes a password policy to strengthen system security and make user account management smoother. This policy sets rules for creating or changing passwords, covering aspects like length, types of characters, age restrictions, retry limits, lockout durations, and password history. When creating a password policy, you can choose the specific rules that suit your needs. For a detailed list of available password policy factors, see [Password Policy Attributes](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes).

## How Password Policy Works

In Databend, SQL users don't initially have a predefined password policy. This implies that there are no specific rules to follow when setting or changing a password for a user until a password policy is assigned to them. To assign a password policy, you can either create a new user with a password using the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) command or link an existing user to a password policy using the [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) command. Please note that, the password policy does not apply to admin users configured through the [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file. 

