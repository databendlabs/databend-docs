---
title: Masking Policy
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='MASKING POLICY'/>

Masking policies protect sensitive data by dynamically transforming column values during query execution. They enable role-based access to confidential information—authorized users see actual data, while others see masked values.

## How It Works

Masking policies apply transformation expressions to column data based on the current user's role:

**For managers:**
```sql
id | email           |
---|-----------------|
 2 | eric@example.com|
 1 | sue@example.com |
```

**For other users:**
```sql
id | email    |
---|----------|
 2 | *********|
 1 | *********|
```

## Key Characteristics

- **Query-time masking**: Policies transform data during SELECT operations only
- **Role-based**: Access rules depend on the current user's role using `current_role()`
- **Column-level**: Applied to specific table columns
- **Reusable**: One policy can protect multiple columns across different tables
- **Non-intrusive**: Original data remains unchanged in storage

## Read vs Write Operations

**Important**: Masking policies **only apply to read operations** (SELECT queries). Write operations (INSERT, UPDATE, DELETE) always process original, unmasked data. This ensures:

- Query results are protected based on user permissions
- Applications can store and modify actual data values
- Data integrity is maintained in the underlying storage

## Quick Start

### 1. Create a Masking Policy

```sql
CREATE MASKING POLICY email_mask
AS (val STRING)
RETURNS STRING ->
CASE
  WHEN current_role() IN ('MANAGERS') THEN val
  ELSE '*********'
END;
```

### 2. Apply to Table Column

```sql
ALTER TABLE user_info MODIFY COLUMN email SET MASKING POLICY email_mask;
```

### 3. Test the Policy

```sql
-- Create test data
CREATE TABLE user_info (id INT, email STRING NOT NULL);
INSERT INTO user_info VALUES (1, 'user@example.com');

-- Query as different roles to see masking in action
SELECT * FROM user_info;
```

## Prerequisites

- Define user roles and their access privileges before creating policies
- Ensure users have appropriate roles assigned
- See [User & Role](/sql/sql-commands/ddl/user/) for role management

## Policy Management

For detailed commands to create, modify, and manage masking policies, see:
- [CREATE MASKING POLICY](/sql/sql-commands/ddl/mask-policy/create-mask-policy)
- [ALTER TABLE COLUMN](/sql/sql-commands/ddl/table/alter-table-column)
- [Masking Policy Commands](/sql/sql-commands/ddl/mask-policy/)
  
