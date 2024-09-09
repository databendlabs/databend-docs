---
title: 掩码策略
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

掩码策略指的是控制敏感数据展示或访问的规则和设置，以保护机密性，同时允许授权用户与数据交互。Databend 使您能够为表中的敏感列定义掩码策略，从而在允许授权角色访问特定数据部分的同时保护机密数据。

举例来说，假设您希望仅向经理展示表中的电子邮件地址：

```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

而当非经理用户查询表时，电子邮件地址将显示为：

```sql
id|email    |
--+---------+
 2|*********|
 1|*********|
```

### 实施掩码策略

在创建掩码策略之前，请确保已正确定义或规划用户角色及其相应的访问权限，因为策略的实施依赖于这些角色以确保安全和有效的数据掩码。要管理 Databend 用户和角色，请参阅 [用户与角色](/sql/sql-commands/ddl/user/)。

掩码策略应用于表的列。要为特定列实施掩码策略，您必须首先创建掩码策略，然后使用 [ALTER TABLE COLUMN](/sql/sql-commands/ddl/table/alter-table-column) 命令将策略关联到目标列。通过建立这种关联，掩码策略将针对数据隐私至关重要的特定上下文进行定制。需要注意的是，单个掩码策略可以与多个列关联，只要它们符合相同的策略标准。有关用于管理 Databend 中掩码策略的命令，请参阅 [掩码策略](/sql/sql-commands/ddl/mask-policy/)。

### 使用示例

此示例展示了基于用户角色选择性展示或掩码敏感数据的掩码策略设置过程。

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

-- 创建用户并授予角色给用户
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
  COMMENT = 'hide_email';

-- 将掩码策略关联到 'email' 列
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 使用 Root 用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```