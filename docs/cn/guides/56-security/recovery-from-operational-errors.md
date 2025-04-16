---
title: 从操作错误中恢复
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

# 从操作错误中恢复

本指南提供了从 Databend 中常见操作错误恢复的分步说明。

## 简介

Databend 可以帮助您从以下常见操作错误中恢复：
- **意外删除数据库**
- **意外删除表**
- **不正确的数据修改（UPDATE/DELETE 操作）**
- **意外截断表**
- **数据加载错误**
- **Schema 演变回滚**（恢复表结构更改）
- **删除列或约束**

这些恢复能力由 Databend 的 FUSE 引擎及其类似 Git 的存储设计提供支持，该设计维护了不同时间点的数据快照。

## 恢复场景和解决方案

### 场景：意外删除数据库

如果您意外删除了数据库，可以使用 `UNDROP DATABASE` 命令恢复它：

1. 识别已删除的数据库：

    ```sql
   SHOW DROP DATABASES LIKE '%sales_data%';
    ```

2. 恢复已删除的数据库：

   ```sql
   UNDROP DATABASE sales_data;
   ```

3. 验证数据库是否已恢复：

   ```sql
   SHOW DATABASES;
   ```

4. 恢复所有权（如果需要）：

   ```sql
   GRANT OWNERSHIP on sales_data.* to ROLE <role_name>;
   ```

**重要提示**：删除的数据库只能在保留期内恢复（默认为 24 小时）。

有关更多详细信息，请参见 [UNDROP DATABASE](/sql/sql-commands/ddl/database/undrop-database) 和 [SHOW DROP DATABASES](/sql/sql-commands/ddl/database/show-drop-databases)。

### 场景：意外删除表

如果您意外删除了表，可以使用 `UNDROP TABLE` 命令恢复它：

1. 识别已删除的表：

   ```sql
   SHOW DROP TABLES LIKE '%order%';
   ```

2. 恢复已删除的表：

   ```sql
   UNDROP TABLE sales_data.orders;
   ```

3. 验证表是否已恢复：

   ```sql
   SHOW TABLES FROM sales_data;
   ```

4. 恢复所有权（如果需要）：

   ```sql
   GRANT OWNERSHIP on sales_data.orders to ROLE <role_name>;
   ```

**重要提示**：删除的表只能在保留期内恢复（默认为 24 小时）。

有关更多详细信息，请参见 [UNDROP TABLE](/sql/sql-commands/ddl/table/ddl-undrop-table) 和 [SHOW DROP TABLES](/sql/sql-commands/ddl/table/show-drop-tables)。

### 场景：不正确的数据更新或删除

如果您意外修改或删除了表中的数据，可以使用 `FLASHBACK TABLE` 命令将其恢复到之前的状态：

1. 识别不正确操作之前的快照 ID 或时间戳：

```sql
SELECT * FROM fuse_snapshot('sales_data', 'orders');
```
   
```text
   snapshot_id: c5c538d6b8bc42f483eefbddd000af7d
   snapshot_location: 29356/44446/_ss/c5c538d6b8bc42f483eefbddd000af7d_v2.json
   format_version: 2
   previous_snapshot_id: NULL
   [... ...]
   timestamp: 2023-04-19 04:20:25.062854
```

2. 将表恢复到之前的状态：

```sql
   -- 使用快照 ID
ALTER TABLE sales_data.orders FLASHBACK TO (SNAPSHOT => 'c5c538d6b8bc42f483eefbddd000af7d');

-- 或使用时间戳
ALTER TABLE sales_data.orders FLASHBACK TO (TIMESTAMP => '2023-04-19 04:20:25.062854'::TIMESTAMP);
```

3. 验证数据是否已恢复：

```sql
SELECT * FROM sales_data.orders LIMIT 3;
```

**重要提示**：回溯操作仅适用于现有表，并且在保留期内。

有关更多详细信息，请参见 [FLASHBACK TABLE](/sql/sql-commands/ddl/table/flashback-table)。

### 场景：Schema 演变回滚
如果您对表的结构进行了不必要的更改，可以恢复到之前的 schema：

1. 创建一个表并添加一些数据：

```sql
CREATE OR REPLACE TABLE customers (id INT, name VARCHAR, email VARCHAR);
INSERT INTO customers VALUES (1, 'John', 'john@example.com');
```

2. 进行 schema 更改：
```sql
ALTER TABLE customers ADD COLUMN phone VARCHAR;
DESC customers;
```

输出：
```text
┌─────────┬─────────┬──────┬─────────┬─────────┐
│ Field   │ Type    │ Null │ Default │ Extra   │
├─────────┼─────────┼──────┼─────────┼─────────┤
│ id      │ INT     │ YES  │ NULL    │         │
│ name    │ VARCHAR │ YES  │ NULL    │         │
│ email   │ VARCHAR │ YES  │ NULL    │         │
│ phone   │ VARCHAR │ YES  │ NULL    │         │
└─────────┴─────────┴──────┴─────────┴─────────┘
```

3. 查找 schema 更改之前的快照 ID：
```sql
SELECT * FROM fuse_snapshot('default', 'customers');
```

输出：
```text
snapshot_id: 01963cefafbb785ea393501d2e84a425  timestamp: 2025-04-16 04:51:03.227000  previous_snapshot_id: 01963ce9cc29735b87886a08d3ca7e2f
snapshot_id: 01963ce9cc29735b87886a08d3ca7e2f  timestamp: 2025-04-16 04:44:37.289000  previous_snapshot_id: NULL
```

4. 恢复到之前的 schema（使用较早的快照）：
```sql
ALTER TABLE customers FLASHBACK TO (SNAPSHOT => '01963ce9cc29735b87886a08d3ca7e2f');
```

5. 验证 schema 是否已恢复：
```sql 
DESC customers;
```
输出：
```text
┌─────────┬─────────┬──────┬─────────┬─────────┐
│ Field   │ Type    │ Null │ Default │ Extra   │
├─────────┼─────────┼──────┼─────────┼─────────┤
│ id      │ INT     │ YES  │ NULL    │         │
│ name    │ VARCHAR │ YES  │ NULL    │         │
│ email   │ VARCHAR │ YES  │ NULL    │         │
└─────────┴─────────┴──────┴─────────┴─────────┘
```


## 重要注意事项和限制

- **时间限制**：恢复仅在保留期内有效（默认：24 小时）。
- **名称冲突**：如果存在具有相同名称的对象，则无法取消删除 - 首先[重命名数据库](/sql/sql-commands/ddl/database/ddl-alter-database)或[重命名表](/sql/sql-commands/ddl/table/ddl-rename-table)。
- **所有权**：所有权不会自动恢复 - 恢复后手动授予它。
- **临时表**：回溯不适用于临时表（不存储快照）。

**对于紧急情况**：遇到严重数据丢失？立即联系 Databend 支持以获得帮助。
[联系 Databend 支持](https://www.databend.cn/contact-us/)
