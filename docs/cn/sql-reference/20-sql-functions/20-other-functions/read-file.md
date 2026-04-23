---
title: READ_FILE
---

从 Stage 中读取文件，并将文件内容作为原始二进制数据返回。

`READ_FILE` 适合把已经存放在 Stage 中的文档、图片或其他原始资产读入查询，再进一步封装成下游数据集，例如导出为 Lance 训练数据集。

## 语法

```sql
READ_FILE('@<stage>/<path-to-file>')
READ_FILE('@<stage>', '<path-to-file>')
```

## 参数

| 参数 | 描述 |
|------|------|
| `@<stage>/<path-to-file>` | 完整的 Stage 文件路径。该表达式最终必须解析为以 `@` 开头的 Stage 文件路径。 |
| `@<stage>` | 双参数形式中的 Stage 名称。请使用常量 Stage 引用，例如 `@assets`。 |
| `<path-to-file>` | 相对于 Stage 的文件路径。可以是字符串字面量、列值，或最终解析为字符串的表达式。 |

## 返回类型

`BINARY`

如果任一参数为 `NULL`，结果也为 `NULL`。

## 使用说明

- `READ_FILE` 读取的是 Stage 中的文件，不会读取 Databend 服务器本地文件。
- 目标必须是文件，不能是目录。
- 调用方需要具备相应 Stage 的读取权限。

## 示例

使用完整 Stage 路径读取文件：

```sql
SELECT TO_HEX(READ_FILE('@data/csv/prefix/ab.csv'));
```

结果：

```text
31
```

使用 Stage 名称和相对路径读取文件：

```sql
SELECT TO_HEX(READ_FILE('@data', 'csv/prefix/ab.csv'));
```

结果：

```text
31
```

将常量 Stage 与逐行变化的相对路径组合，批量读取多个文件：

```sql
CREATE OR REPLACE TABLE read_file_rel_paths(path STRING);

INSERT INTO read_file_rel_paths VALUES
  ('csv/prefix/ab.csv'),
  ('csv/prefix/ab/cd.csv'),
  (NULL);

SELECT path, TO_HEX(READ_FILE('@data', path))
FROM read_file_rel_paths
ORDER BY path;
```

结果：

```text
+----------------------+--------------------------------+
| path                 | to_hex(read_file('@data',path)) |
+----------------------+--------------------------------+
| csv/prefix/ab.csv    | 31                             |
| csv/prefix/ab/cd.csv | 32                             |
| NULL                 | NULL                           |
+----------------------+--------------------------------+
```
