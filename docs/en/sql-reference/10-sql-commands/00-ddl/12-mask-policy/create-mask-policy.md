---
title: CREATE MASKING POLICY
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.341"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

Creates a new masking policy in Databend.

## Syntax

```sql
CREATE [ OR REPLACE ] MASKING POLICY [ IF NOT EXISTS ] <policy_name> AS 
    ( <arg_name_to_mask> <arg_type_to_mask> [ , <arg_1> <arg_type_1> ... ] )
    RETURNS <arg_type_to_mask> -> <expression_on_arg_name>
    [ COMMENT = '<comment>' ]
```

| Parameter              	| Description                                                                                                                           	|
|------------------------	|---------------------------------------------------------------------------------------------------------------------------------------	|
| policy_name              	| The name of the masking policy to be created.                                                                                          	|
| arg_name_to_mask       	| The name of the original data parameter that needs to be masked.                                                                      	|
| arg_type_to_mask       	| The data type of the original data parameter to be masked.                                                                            	|
| expression_on_arg_name 	| An expression that determines how the original data should be treated to generate the masked data.                                    	|
| comment                   | An optional comment providing information or notes about the masking policy.                                                          	|

:::note
Ensure that *arg_type_to_mask* matches the data type of the column where the masking policy will be applied.
:::

## Examples

This example illustrates the process of setting up a masking policy to selectively reveal or mask sensitive data based on user roles.

```sql
-- Create a table and insert sample data
CREATE TABLE user_info (
    user_id INT,
    phone  VARCHAR,
    email VARCHAR
);

INSERT INTO user_info (user_id, phone, email) VALUES (1, '91234567', 'sue@example.com');
INSERT INTO user_info (user_id, phone, email) VALUES (2, '81234567', 'eric@example.com');

-- Create a role
CREATE ROLE 'MANAGERS';
GRANT ALL ON *.* TO ROLE 'MANAGERS';

-- Create a user and grant the role to the user
CREATE USER manager_user IDENTIFIED BY 'databend';
GRANT ROLE 'MANAGERS' TO 'manager_user';

-- Create a masking policy
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

CREATE MASKING POLICY phone_mask AS (val nullable(string)) RETURNS nullable(string) -> CASE
  WHEN current_role() IN ('MANAGERS') THEN val
  ELSE '*********'
END COMMENT = 'hide_phone';

-- Associate the masking policy with the 'email' column
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;

-- Associate the masking policy with the 'phone' column
ALTER TABLE user_info MODIFY COLUMN phone SET MASKING POLICY phone_mask;

-- Query with the Root user
SELECT * FROM user_info;

     user_id     │        phone     │       email      │
 Nullable(Int32) │ Nullable(String) │ Nullable(String) │
─────────────────┼──────────────────┼──────────────────┤
               2 │ *********        │ *********        │
               1 │ *********        │ *********        │

```
