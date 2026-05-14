---
title: Schema Evolution
description: 在使用 COPY INTO 加载数据时自动演进表结构。
sidebar_label: Schema Evolution
---

# Schema Evolution

Schema Evolution 允许 Databend 在 `COPY INTO` 加载数据时，自动将源 Parquet 文件中存在但表中缺失的列添加到目标表。

## 工作原理

启用后，`COPY INTO` 会：

1. 从源 Parquet 文件推断 schema。
2. 将新列（表中不存在的）作为可空列添加到表中。
3. 加载数据，缺失的值用 `NULL` 填充。

## 启用 Schema Evolution

将表选项 `ENABLE_SCHEMA_EVOLUTION` 设置为 `true`：

```sql
-- 对已有表启用
ALTER TABLE my_table SET OPTIONS(ENABLE_SCHEMA_EVOLUTION = true);

-- 或在建表时启用
CREATE TABLE my_table(id INT) ENABLE_SCHEMA_EVOLUTION = true;
```

如需禁用，设回 `false`：

```sql
ALTER TABLE my_table SET OPTIONS(ENABLE_SCHEMA_EVOLUTION = false);
```

## 教程

以下是一个完整可运行的示例。

### 步骤 1：创建表和 Stage

```sql
CREATE OR REPLACE TABLE invoices(order_id INT);
CREATE OR REPLACE STAGE my_stage;
```

### 步骤 2：生成不同 Schema 的 Parquet 文件

```sql
-- 文件包含列：order_id, amount, currency
COPY INTO @my_stage FROM (
    SELECT 1 AS order_id, 100.50::DOUBLE AS amount, 'USD' AS currency
    UNION ALL
    SELECT 2, 250.50::DOUBLE, 'EUR'
) FILE_FORMAT = (TYPE = parquet);

-- 文件包含列：order_id, amount（无 currency）
COPY INTO @my_stage FROM (
    SELECT 3 AS order_id, 75.50::DOUBLE AS amount
) FILE_FORMAT = (TYPE = parquet);
```

### 步骤 3：启用 Schema Evolution 并加载

```sql
ALTER TABLE invoices SET OPTIONS(ENABLE_SCHEMA_EVOLUTION = true);

COPY INTO invoices
FROM @my_stage/
FILE_FORMAT = (TYPE = parquet MISSING_FIELD_AS = FIELD_DEFAULT);
```

### 步骤 4：验证结果

表现在有三列 — `amount` 和 `currency` 被自动添加：

```sql
DESC invoices;
```

```text
┌─────────────────────────────────────────────────────────────┐
│   Field  │      Type      │  Null  │ Default │    Extra     │
├──────────┼────────────────┼────────┼─────────┼──────────────┤
│ order_id │ INT            │ YES    │ NULL    │              │
│ amount   │ DOUBLE         │ YES    │ NULL    │              │
│ currency │ VARCHAR        │ YES    │ NULL    │              │
└─────────────────────────────────────────────────────────────┘
```

```sql
SELECT * FROM invoices ORDER BY order_id;
```

```text
┌──────────────────────────────────────────────────┐
│ order_id │  amount  │ currency                    │
├──────────┼──────────┼─────────────────────────────┤
│        1 │   100.50 │ USD                         │
│        2 │   250.50 │ EUR                         │
│        3 │    75.50 │ NULL                        │
└──────────────────────────────────────────────────┘
```

第 3 行的 `currency = NULL`，因为其源文件中不包含该列。

## 列匹配模式

默认按不区分大小写匹配列名。使用 `COLUMN_MATCH_MODE` 可启用大小写敏感匹配：

```sql
COPY INTO invoices
FROM @my_stage/
FILE_FORMAT = (TYPE = parquet MISSING_FIELD_AS = FIELD_DEFAULT)
COLUMN_MATCH_MODE = CASE_SENSITIVE;
```

## 限制

- 仅支持 **Parquet** 文件。
- 新列追加到表末尾，始终为可空类型。
- 如果同名列在多个文件中具有**不同数据类型**，加载将失败。
- 不会自动提升类型（如 `INT` → `BIGINT`）。
- 不支持通过 Schema Evolution 删除或重命名列。
