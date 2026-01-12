---
title: POLICY_REFERENCES
---

返回安全策略（Masking Policy 或 Row Access Policy）与表/视图之间的关联关系。可以通过策略名查找使用该策略的所有表，或通过表名查找应用到该表的所有策略。

另请参阅：

- [MASKING POLICY](/guides/security/masking-policy)

## 语法

```sql
-- 查找使用指定策略的所有表/视图
POLICY_REFERENCES(POLICY_NAME => '<policy_name>')

-- 查找应用到指定表/视图的所有策略
POLICY_REFERENCES(
    REF_ENTITY_NAME => '[<database>.]<table_name>',
    REF_ENTITY_DOMAIN => 'TABLE' | 'VIEW'
)
```

## 输出列

| 列名                 | 描述                                          |
|---------------------|-----------------------------------------------|
| policy_name          | 策略名称                                       |
| policy_kind          | 策略类型：`MASKING POLICY` 或 `ROW ACCESS POLICY` |
| ref_database_name    | 引用的表/视图所在的数据库                        |
| ref_entity_name      | 引用的表或视图名称                              |
| ref_entity_domain    | `TABLE` 或 `VIEW`                             |
| ref_column_name      | 策略应用的列（用于 masking policy）              |
| ref_arg_column_names | 策略使用的参数列                                |
| policy_status        | 策略状态，通常为 `ACTIVE`                       |

## 示例

### 查找使用某个行访问策略的表

```sql
-- 创建行访问策略
CREATE ROW ACCESS POLICY rap_employees AS (department STRING) RETURNS BOOLEAN ->
  CASE
    WHEN current_role() = 'admin' THEN true
    WHEN department = 'Engineering' THEN true
    ELSE false
  END;

-- 将策略应用到表
CREATE TABLE employees(id INT, name STRING, department STRING);
ALTER TABLE employees ADD ROW ACCESS POLICY rap_employees ON (department);

-- 查找使用此策略的所有表
SELECT * FROM policy_references(POLICY_NAME => 'rap_employees');

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   policy_name   │    policy_kind    │ ref_database_name │ ref_entity_name │ ref_entity_domain │ ref_column_name │ ref_arg_column_names │ policy_status │
├─────────────────┼───────────────────┼───────────────────┼─────────────────┼───────────────────┼─────────────────┼──────────────────────┼───────────────┤
│ rap_employees   │ ROW ACCESS POLICY │ default           │ employees       │ TABLE             │ NULL            │ department           │ ACTIVE        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 查找应用到某个表的所有策略

```sql
-- 创建 masking policy
CREATE MASKING POLICY mask_salary AS (val INT) RETURNS INT ->
  CASE WHEN current_role() = 'admin' THEN val ELSE 0 END;

-- 将两个策略都应用到表
ALTER TABLE employees ADD COLUMN salary INT;
ALTER TABLE employees MODIFY COLUMN salary SET MASKING POLICY mask_salary;

-- 查找该表上的所有策略
SELECT * FROM policy_references(
    REF_ENTITY_NAME => 'default.employees',
    REF_ENTITY_DOMAIN => 'TABLE'
);

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   policy_name   │    policy_kind    │ ref_database_name │ ref_entity_name │ ref_entity_domain │ ref_column_name │ ref_arg_column_names │ policy_status │
├─────────────────┼───────────────────┼───────────────────┼─────────────────┼───────────────────┼─────────────────┼──────────────────────┼───────────────┤
│ mask_salary     │ MASKING POLICY    │ default           │ employees       │ TABLE             │ salary          │ NULL                 │ ACTIVE        │
│ rap_employees   │ ROW ACCESS POLICY │ default           │ employees       │ TABLE             │ NULL            │ department           │ ACTIVE        │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 查找使用带多参数 Masking Policy 的表

```sql
-- 创建带条件参数的 masking policy
CREATE MASKING POLICY mask_ssn AS (val STRING, user_role STRING) RETURNS STRING ->
  CASE
    WHEN user_role = current_role() THEN val
    ELSE '***-**-****'
  END;

-- 应用到多个表
CREATE TABLE employees1(id INT, ssn STRING, role STRING);
CREATE TABLE employees2(id INT, ssn STRING, role STRING);

ALTER TABLE employees1 MODIFY COLUMN ssn SET MASKING POLICY mask_ssn USING (ssn, role);
ALTER TABLE employees2 MODIFY COLUMN ssn SET MASKING POLICY mask_ssn USING (ssn, role);

-- 查找使用此策略的所有表
SELECT * FROM policy_references(POLICY_NAME => 'mask_ssn') ORDER BY ref_entity_name;

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ policy_name │   policy_kind  │ ref_database_name │ ref_entity_name │ ref_entity_domain │ ref_column_name │ ref_arg_column_names │ policy_status │
├─────────────┼────────────────┼───────────────────┼─────────────────┼───────────────────┼─────────────────┼──────────────────────┼───────────────┤
│ mask_ssn    │ MASKING POLICY │ default           │ employees1      │ TABLE             │ ssn             │ role                 │ ACTIVE        │
│ mask_ssn    │ MASKING POLICY │ default           │ employees2      │ TABLE             │ ssn             │ role                 │ ACTIVE        │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
