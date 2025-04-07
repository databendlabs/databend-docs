---
title: 掩码策略
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

掩码策略指的是控制敏感数据展示或访问的规则和设置，它在保护机密性的同时，允许授权用户与数据交互。Databend 允许你定义掩码策略来展示表中敏感的列，从而保护机密数据，同时允许授权角色访问数据的特定部分。

例如，假设你想仅向管理者展示表中的电子邮件地址：

```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

当非管理者用户查询该表时，电子邮件地址将显示为：

```sql
id|email    |
--+---------+
 2|*********|
 1|*********|
```

### 实施掩码策略

在创建掩码策略之前，请确保已正确定义或规划用户角色及其相应的访问权限，因为策略的实施依赖于这些角色来确保安全有效的数据掩码。要管理 Databend 用户和角色，请参阅 [User & Role](/sql/sql-commands/ddl/user/)。

掩码策略应用于表的列。要为特定列实施掩码策略，必须首先创建掩码策略，然后使用 [ALTER TABLE COLUMN](/sql/sql-commands/ddl/table/alter-table-column) 命令将该策略与目标列相关联。通过建立这种关联，掩码策略将根据数据隐私至关重要的确切上下文进行定制。重要的是要注意，单个掩码策略可以与多个列相关联，只要它们符合相同的策略标准。有关用于管理 Databend 中掩码策略的命令，请参阅 [Masking Policy](/sql/sql-commands/ddl/mask-policy/)。

### 使用示例

此示例说明了设置掩码策略以基于用户角色选择性地显示或掩码敏感数据的过程。

```sql
-- 创建表并插入示例数据
CREATE TABLE user_info (
    id INT,
    email STRING
);

INSERT INTO user_info (id, email) VALUES (1, 'sue@example.com');
INSERT INTO user_info (id, email) VALUES (2, 'eric@example.com');

-- 创建一个角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建一个用户并将角色授予该用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建一个掩码策略
CREATE MASKING POLICY email_mask
AS
  (val nullable(string))
  RETURNS nullable(string) ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = 'hide_email';

-- 将掩码策略与 'email' 列相关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```