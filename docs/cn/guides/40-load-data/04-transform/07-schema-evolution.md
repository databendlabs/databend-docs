---
title: Schema Evolution
description: 在使用 COPY INTO 加载数据时自动演进表结构。
sidebar_label: Schema Evolution
---

# Schema Evolution

Schema Evolution 允许 Databend 在 `COPY INTO` 加载数据时，自动将源文件中存在但目标表中缺失的列添加到目标表。目前支持 **Parquet** 和 **NDJSON**。

## 工作原理

启用后，Databend 会在加载前推断源文件 schema，并将新列追加到表末尾。新列为可空列，缺失值会填充为 `NULL`。

不同文件格式的用法略有差异：

- **Parquet**：启用表选项后，`COPY INTO` 会直接从 Parquet 文件 schema 推断新列。
- **NDJSON**：启用表选项后，`COPY INTO` 会使用 `AUTO` 采样值进行 schema 推断。可以选择设置 `SCHEMA_EVOLUTION = (...)` 来覆盖文件和记录采样限制。

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

## 权限要求

当 `COPY INTO <table>` 从 Stage 或外部位置加载文件，并触发 Schema Evolution 推断时，执行加载的角色需要拥有目标表的 `INSERT` 和 `ALTER` 权限。`ALTER` 权限用于允许 Databend 在加载前自动追加新列。

基于查询的 COPY 不受此限制，例如 `COPY INTO <table> FROM (SELECT ... FROM @stage)`，仍按原有权限要求检查。

## Parquet 示例

以下示例展示如何从不同 schema 的 Parquet 文件加载数据，并自动添加缺失列。

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

表现在有三列，`amount` 和 `currency` 被自动添加：

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

## NDJSON 示例

Databend 使用 `TYPE = ndjson` 加载 NDJSON 文件。NDJSON 文件没有像 Parquet 那样的内嵌列式 schema，Databend 会先对文件内容进行采样，推断目标表中缺失的字段，再追加为可空列。

### 步骤 1：创建表和 Stage

```sql
CREATE OR REPLACE TABLE events(id INT);
CREATE OR REPLACE STAGE events_stage;
```

### 步骤 2：生成不同字段的 NDJSON 文件

```sql
-- 文件包含字段：id, city, score
COPY INTO @events_stage FROM (
    SELECT 1 AS id, 'SF' AS city, 9 AS score
    UNION ALL
    SELECT 2, 'NYC', 8
) FILE_FORMAT = (TYPE = ndjson);

-- 文件包含字段：id, score（无 city）
COPY INTO @events_stage FROM (
    SELECT 3 AS id, 7 AS score
) FILE_FORMAT = (TYPE = ndjson);
```

### 步骤 3：启用 Schema Evolution 并加载

```sql
ALTER TABLE events SET OPTIONS(ENABLE_SCHEMA_EVOLUTION = true);

COPY INTO events
FROM @events_stage/
FILE_FORMAT = (TYPE = ndjson MISSING_FIELD_AS = FIELD_DEFAULT)
SCHEMA_EVOLUTION = (
  SAMPLE_FILES = AUTO,
  SAMPLE_RECORDS_PER_FILE = AUTO,
  SAMPLE_TOTAL_RECORDS = AUTO
);
```

`SCHEMA_EVOLUTION` 的三个采样选项都可以设置为 `AUTO` 或正整数：

| 选项 | 说明 |
|------|------|
| `SAMPLE_FILES` | 采样的文件数量。 |
| `SAMPLE_RECORDS_PER_FILE` | 每个采样文件中最多采样的记录数。 |
| `SAMPLE_TOTAL_RECORDS` | 所有采样文件中最多采样的记录总数。 |

如果省略 `SCHEMA_EVOLUTION`，Databend 会对三个采样选项都使用 `AUTO`。当前 `AUTO` 行为最多采样 64 个文件、每个文件 1,000 条记录、总计 10,000 条记录。这些内部默认值未来版本可能会调整。如果加载结果对采样策略敏感，建议显式设置 `SAMPLE_FILES`、`SAMPLE_RECORDS_PER_FILE` 和 `SAMPLE_TOTAL_RECORDS`。

### NDJSON 推断规则

对 NDJSON 执行 Schema Evolution 时，Databend 会按以下规则推断新列：

- 只从采样到的 NDJSON 记录中推断 schema；未被采样覆盖的字段不会提前加入目标表。
- 每行必须是一个 JSON 对象。Databend 会将对象的顶层字段名作为候选列名。
- 目标表中已存在的列不会重复添加；只追加目标表中缺失的新字段。
- 新字段类型由采样记录中的 JSON 值推断而来，例如整数、浮点数、字符串和布尔值会推断为对应的数据类型。
- Schema Evolution 对 NDJSON 使用浅层推断：顶层字段值如果是对象或数组，会作为 `VARIANT` 列追加，不会递归展开为嵌套列。
- `NULL` 样本只表示该字段可为空，不会把后续非空类型强制改成 `VARCHAR` 或 `VARIANT`。
- 多个文件或多条记录中的同名字段会合并类型：整数和浮点数冲突时合并为 `DOUBLE`；其他标量类型冲突时合并为 `VARCHAR`；任何涉及对象、数组或 `VARIANT` 的冲突都会合并为 `VARIANT`。
- 如果实际加载时遇到采样阶段没有推断出的额外字段，加载会失败并返回这些字段名。此时需要调大 `SAMPLE_FILES`、`SAMPLE_RECORDS_PER_FILE` 或 `SAMPLE_TOTAL_RECORDS`。

:::note
`INFER_SCHEMA` 表函数对 NDJSON 默认不限制嵌套深度；这里描述的是 `COPY INTO` Schema Evolution 的浅层推断规则。
:::

例如，下面的 NDJSON 记录会推断出 `name`、`age`、`active`、`score`、`profile` 和 `tags` 六个新列：

```json
{"id":1,"name":"Alice","age":30,"active":true,"score":1,"profile":{"city":"SF"},"tags":["new"]}
{"id":2,"name":"Bob","age":null,"active":false,"score":1.5,"profile":{"city":"NYC"},"tags":["vip"]}
```

如果目标表只有 `id INT`，加载后 Databend 会追加：

```text
name    VARCHAR   NULL
age     BIGINT    NULL
active  BOOLEAN   NULL
score   DOUBLE    NULL
profile VARIANT   NULL
tags    VARIANT   NULL
```

第二行的 `age` 为 `NULL`，不会影响 `age` 根据第一行推断为 `BIGINT`。`score` 同时出现整数和浮点数，因此合并为 `DOUBLE`。`profile` 和 `tags` 是对象和数组，因此在 Schema Evolution 中作为 `VARIANT` 列追加。

### 步骤 4：验证结果

表现在有三列，`city` 和 `score` 被自动添加：

```sql
DESC events;
```

```text
┌─────────────────────────────────────────────────────────┐
│ Field │     Type     │  Null  │ Default │    Extra     │
├───────┼──────────────┼────────┼─────────┼──────────────┤
│ id    │ INT          │ YES    │ NULL    │              │
│ city  │ VARCHAR      │ YES    │ NULL    │              │
│ score │ BIGINT       │ YES    │ NULL    │              │
└─────────────────────────────────────────────────────────┘
```

```sql
SELECT * FROM events ORDER BY id;
```

```text
┌────────────────────────────┐
│ id │ city │ score          │
├────┼──────┼────────────────┤
│  1 │ SF   │              9 │
│  2 │ NYC  │              8 │
│  3 │ NULL │              7 │
└────────────────────────────┘
```

如果采样没有覆盖到后续数据中的某个字段，加载会失败并返回额外字段名。此时可以调大 `SAMPLE_FILES`、`SAMPLE_RECORDS_PER_FILE` 或 `SAMPLE_TOTAL_RECORDS` 后重试。

## 列匹配模式

默认按不区分大小写匹配列名。使用 `COLUMN_MATCH_MODE` 可启用大小写敏感匹配：

```sql
COPY INTO invoices
FROM @my_stage/
FILE_FORMAT = (TYPE = parquet MISSING_FIELD_AS = FIELD_DEFAULT)
COLUMN_MATCH_MODE = CASE_SENSITIVE;
```

## 限制

- 目前支持 **Parquet** 和 **NDJSON** 文件。
- 新列追加到表末尾，始终为可空类型。
- 如果同名列在多个文件中具有**不同数据类型**，加载将失败。
- 不会自动提升类型（如 `INT` → `BIGINT`）。
- 不支持通过 Schema Evolution 删除或重命名列。
- NDJSON 依赖采样推断 schema；如果采样未覆盖所有字段，需要调大 `SCHEMA_EVOLUTION` 采样参数。
