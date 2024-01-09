---
title: 掩码策略
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='掩码策略'/>

掩码策略指的是控制对敏感数据的显示或访问的规则和设置，以保护数据的机密性，同时允许授权用户与数据进行交互。Databend允许您为表中的敏感列定义掩码策略，从而在授权角色能够访问数据的特定部分的同时，保护机密数据。

举个例子，考虑一个场景，您想仅向经理展示表中的电子邮件地址：

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

在创建掩码策略之前，请确保您已经正确定义或规划了用户角色及其相应的访问权限，因为策略的实施依赖于这些角色以确保安全有效的数据掩码。要管理Databend的用户和角色，请参见[用户与角色](/sql/sql-commands/ddl/user/)。

掩码策略应用于表的列。要为特定列实施掩码策略，您必须首先创建掩码策略，然后使用 [ALTER TABLE COLUMN](/sql/sql-commands/ddl/table/alter-table-column) 命令将策略与预期列关联起来。通过建立这种关联，掩码策略变得适用于数据隐私至关重要的确切上下文。值得注意的是，单个掩码策略可以与多个列关联，只要它们符合相同的策略标准。有关在Databend中管理掩码策略的命令，请参见[掩码策略](/sql/sql-commands/ddl/mask-policy/)。

### 使用示例

此示例说明了根据用户角色选择性地显示或掩盖敏感数据的掩码策略设置过程。

```sql
-- 创建一个表并插入示例数据
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
  (val string)
  RETURNS string ->
  CASE
  WHEN current_role() IN ('MANAGERS') THEN
    val
  ELSE
    '*********'
  END
  COMMENT = 'hide_email';

-- 将掩码策略与'email'列关联
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- 以Root用户查询
SELECT * FROM user_info;

id|email    |
--+---------+
 2|*********|
 1|*********|
```