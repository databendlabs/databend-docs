---
title: 掩码策略
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='掩码策略'/>

掩码策略指的是控制敏感数据展示或访问的规则和设置，旨在保护数据机密性的同时允许授权用户与数据互动。Databend 支持定义掩码策略，用于控制表中敏感列的显示，从而在保护机密数据的同时，允许授权角色访问数据的具体部分。

以一个场景为例，假设您希望在表中仅向经理展示电子邮件地址：

```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

而非经理用户查询该表时，电子邮件地址将显示为：

```sql
id|email    |
--+---------+
 2|*********|
 1|*********|
```

### 实施掩码策略

在创建掩码策略之前，请确保已正确定义或规划用户角色及其相应的访问权限，因为策略的实施依赖于这些角色以确保数据掩码的安全性和有效性。如需管理 Databend 用户和角色，请参阅 [用户与角色](/sql/sql-commands/ddl/user/)。

掩码策略应用于表的列上。要为特定列实施掩码策略，您必须首先创建该策略，然后使用 [ALTER TABLE COLUMN](/sql/sql-commands/ddl/table/alter-table-column) 命令将策略关联到目标列。通过建立这种关联，掩码策略将针对数据隐私至关重要的具体上下文进行定制。需要注意的是，单个掩码策略可以与多个列关联，只要它们符合相同的策略标准。有关在 Databend 中管理掩码策略的命令，请参阅 [掩码策略](/sql/sql-commands/ddl/mask-policy/)。

### 使用示例

本示例展示了根据用户角色设置掩码策略，以有选择地显示或隐藏敏感数据的过程。

```sql
-- 创建表并插入示例数据
CREATE TABLE user_info (
    id INT,
    email STRING
);

INSERT INTO user_info (id, email) VALUES (1, 'sue@example.com');
INSERT INTO user_info (id, email) VALUES (2, 'eric@example.com');

-- 创建角色
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- 创建用户并将角色授予该用户
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- 创建掩码策略
CREATE MASKING POLICY email_mask
AS
  (val string)
  RETURNS string ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = '隐藏电子邮件';

-- 将掩码策略关联到 'email' 列
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```