---
title: ALTER STAGE
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.867"/>

修改现有内部或外部 Stage 的属性。使用 `SET` 更新属性。使用 `UNSET` 重置文件格式或清除注释。

## 语法

```sql
ALTER STAGE [ IF EXISTS ] <stage_name>
  SET <set_option> [ , <set_option> ... ]

ALTER STAGE [ IF EXISTS ] <stage_name>
  UNSET { FILE_FORMAT | COMMENT } [ , { FILE_FORMAT | COMMENT } ... ]
```

其中：

```sql
set_option ::=
    URL = '<protocol>://<location>' [ CONNECTION = ( <connection_parameters> ) ]
  | FILE_FORMAT = ( { FORMAT_NAME = '<format_name>' | TYPE = <format_type> [ formatTypeOptions ] } )
  | COMMENT = '<string_literal>'
```

## 参数

| 参数 | 描述 |
|-----------|-------------|
| `IF EXISTS` | 如果 Stage 不存在，不返回 Stage 不存在的错误。 |
| `<stage_name>` | 现有内部或外部 Stage 的名称。不包含 `@` 前缀。 |
| `URL` | 替换外部 Stage 的存储位置和连接配置。请提供新位置所需的连接参数。 |
| `CONNECTION` | 作为 `URL` 选项的一部分指定存储连接参数。使用命名连接时，指定 `CONNECTION = (CONNECTION_NAME = '<connection_name>')`。请参阅[连接参数](../../../00-sql-reference/51-connect-parameters.md)。 |
| `FILE_FORMAT` | 替换 Stage 的文件格式。可指定命名文件格式，或指定格式类型及其选项。请参阅[输入和输出文件格式](../../../00-sql-reference/50-file-format-options.md)。 |
| `COMMENT` | 设置 Stage 的注释。使用空字符串可清除注释。 |

## 使用说明

- `SET` 至少需要一个选项。可以在一条语句中更新多个属性。
- 语句中未指定的属性保持不变。
- 只有外部 Stage 支持设置 `URL`。此操作只修改 Stage 配置，不会移动或复制文件。
- 更新 `URL` 会替换存储配置，不会将新连接参数与原配置合并。请提供所有必需的连接参数，或引用命名连接。
- 不能单独设置 `CONNECTION`。如需更新凭证，请同时指定 `URL` 和新的 `CONNECTION` 参数。
- `SET FILE_FORMAT` 会替换文件格式配置，不会将选项与原配置合并。
- `UNSET FILE_FORMAT` 会恢复默认的 Parquet 文件格式，而不是恢复创建 Stage 时指定的格式。
- `UNSET COMMENT` 会清除注释。不能对 `URL` 或 `CONNECTION` 使用 `UNSET`。
- 不能修改用户 Stage（`~`）。

## 访问控制要求

启用 `enable_experimental_rbac_check` 时，您必须同时具有该 Stage 的 `READ` 和 `WRITE` 权限，或拥有该 Stage 的所有权。禁用此设置时，该操作需要全局 `SUPER` 权限。

更多信息请参阅[权限](/guides/security/access-control/privileges)。

## 示例

### 更新文件格式和注释

创建内部 Stage，然后设置其文件格式和注释：

```sql
CREATE STAGE my_internal_stage;

ALTER STAGE my_internal_stage SET
  FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1),
  COMMENT = 'CSV files with a header row';

DESC STAGE my_internal_stage;
```

### 重置属性

将上例中的 Stage 重置为默认的 Parquet 文件格式，并清除注释：

```sql
ALTER STAGE my_internal_stage UNSET FILE_FORMAT, COMMENT;
```

### 修改外部 Stage 的位置

此示例需要一个 S3 存储桶和一个命名连接。请将占位符替换为实际的存储信息：

```sql
CREATE CONNECTION my_s3_connection
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE STAGE my_s3_stage
  URL = 's3://<your-bucket>/incoming/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection');

ALTER STAGE my_s3_stage SET
  URL = 's3://<your-bucket>/archive/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection'),
  COMMENT = 'Archived files';
```

该 Stage 现在指向 `archive/` 路径。`incoming/` 中的文件仍保留在原位置。

### 处理不存在的 Stage

使用 `IF EXISTS` 可在 Stage 不存在时避免返回 Stage 不存在的错误：

```sql
ALTER STAGE IF EXISTS missing_stage SET COMMENT = 'Updated comment';
```

## 相关命令

- [CREATE STAGE](01-ddl-create-stage.md)
- [DESC STAGE](03-ddl-desc-stage.md)
- [DROP STAGE](02-ddl-drop-stage.md)
