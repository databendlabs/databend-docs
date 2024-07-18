---
title: Password Policy
---

Databend includes a password policy to strengthen system security and make user account management smoother. This policy sets rules for creating or changing passwords, covering aspects like length, types of characters, age restrictions, retry limits, lockout durations, and password history. When creating a password policy, you can customize specific rules to suit your needs. For a detailed list of the password policy factors, see [Password Policy Attributes](/sql/sql-commands/ddl/password-policy/create-password-policy#password-policy-attributes).

## How Password Policy Works

In Databend, SQL users don't initially have a predefined password policy. This implies that there are no specific rules to follow when setting or changing a password for a user until a password policy is assigned to them. To assign a password policy, you can either create a new user with a password policy using the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) command or link an existing user to a password policy using the [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) command. Please note that, the password policy does not apply to admin users configured through the [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file.

When you set or change the password for a user with a password policy, Databend conducts thorough checks to ensure the chosen password follows the rules defined by the password policy. The following aspects are verified:

:::note
Generally, users cannot change their own passwords unless they are assigned the built-in role `account-admin`. An `account-admin` user can set or change passwords for all users. To change password for a user, use the [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) command.
:::

- **Complexity Requirements**:
    - **Minimum and Maximum Length**: Validates password length within defined boundaries.
    - **Uppercase, Lowercase, Numeric, and Special Characters**: Confirms adherence to specific character type requirements.

- **Additional Checks during Password Change**:
    - **Minimum Age Requirement**: Ensures passwords are not changed too frequently.
    - **History Check**: Verifies that new passwords do not replicate recent ones.

When a user attempts to log in with a password policy in place, Databend performs essential checks to enhance security and regulate user access. The following verifications take place:

- **Consecutive Incorrect Password Attempts**:
    - Ensures limits on consecutive incorrect password attempts are not exceeded.
    - Exceeding limits results in a temporary lock on user login.

- **Maximum Age Requirement**:
    - Checks if the maximum password change interval has been exceeded.
    - If the interval is exceeded, the user can change the password after login, and cannot perform any other operations before the password is changed.

## Managing Password Policies

Databend offers a range of commands for managing password policies. For more details, see [Password Policy](/sql/sql-commands/ddl/password-policy/).

## Usage Examples

This example establishes the following password policies and implements them for users:

- `DBA` for admins users: Customizes each password policy attribute strictly.
- `ReadOnlyUser` for general users: Uses the default attribute values.

```sql
-- Create the 'DBA' password policy with customized attribute values
CREATE PASSWORD POLICY DBA
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_MAX_LENGTH = 18
    PASSWORD_MIN_UPPER_CASE_CHARS = 2
    PASSWORD_MIN_LOWER_CASE_CHARS = 2
    PASSWORD_MIN_NUMERIC_CHARS = 2
    PASSWORD_MIN_SPECIAL_CHARS = 1
    PASSWORD_MIN_AGE_DAYS = 1
    PASSWORD_MAX_AGE_DAYS = 30
    PASSWORD_MAX_RETRIES = 3
    PASSWORD_LOCKOUT_TIME_MINS = 30
    PASSWORD_HISTORY = 5;

-- Create the 'ReadOnlyUser' password policy with default values for all attributes
CREATE PASSWORD POLICY ReadOnlyUser;

SHOW PASSWORD POLICIES;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│     name     │ comment │                                                                                                 options                                                                                                 │
├──────────────┼─────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ DBA          │         │ MIN_LENGTH=12, MAX_LENGTH=18, MIN_UPPER_CASE_CHARS=2, MIN_LOWER_CASE_CHARS=2, MIN_NUMERIC_CHARS=2, MIN_SPECIAL_CHARS=1, MIN_AGE_DAYS=1, MAX_AGE_DAYS=30, MAX_RETRIES=3, LOCKOUT_TIME_MINS=30, HISTORY=5 │
│ ReadOnlyUser │         │ MIN_LENGTH=8, MAX_LENGTH=256, MIN_UPPER_CASE_CHARS=1, MIN_LOWER_CASE_CHARS=1, MIN_NUMERIC_CHARS=1, MIN_SPECIAL_CHARS=0, MIN_AGE_DAYS=0, MAX_AGE_DAYS=90, MAX_RETRIES=5, LOCKOUT_TIME_MINS=15, HISTORY=0 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Imagine you already have a DBA user named 'eric' and apply the DBA password policy to that user using the [ALTER USER](/sql/sql-commands/ddl/user/user-alter-user) command:

```sql
-- Apply 'DBA' password policy to the user 'eric'
ALTER USER eric WITH SET PASSWORD POLICY = 'DBA';
```

Now, let's create a new user named 'frank' and apply the 'ReadOnlyUser' password policy using the [CREATE USER](/sql/sql-commands/ddl/user/user-create-user) command:

```sql
-- Note: The password set for the user 'frank' must adhere to the constraints
-- defined by the associated 'ReadOnlyUser' password policy.
CREATE USER frank IDENTIFIED BY 'Abc12345'
    WITH SET PASSWORD POLICY = 'ReadOnlyUser';
```