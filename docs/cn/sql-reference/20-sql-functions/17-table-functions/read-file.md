---
title: READ_FILE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.882"/>

从 Stage 中读取文件内容，以 `BINARY` 类型返回。适用于将原始文件内容（图片、PDF、二进制数据等）直接加载到表的列中。

## 语法

```sql
-- 单参数：Stage 路径与文件路径合并传入
READ_FILE('<stage_path>')

-- 双参数：Stage 与文件路径分开传入
READ_FILE('<stage>', '<file_path>')
```

## 参数

| 参数           | 说明                                                                                                      |
|----------------|-----------------------------------------------------------------------------------------------------------|
| `stage_path`   | 以 `@` 开头的完整 Stage 文件路径，例如 `'@my_stage/path/to/file.png'`。                                  |
| `stage`        | 以 `@` 开头的 Stage 名称，例如 `'@my_stage'`。若为常量，会在绑定阶段进行校验。 |
| `file_path`    | Stage 内的相对文件路径，例如 `'path/to/file.png'`。                                                      |

## 返回类型

`BINARY`。若任意参数为 `NULL`，则返回 `NULL`。

## 示例

### 读取单个文件

```sql
-- 使用完整 Stage 路径读取文件
SELECT to_hex(read_file('@my_stage/data/file.csv'));

-- 使用 Stage 与路径分开的形式读取文件
SELECT to_hex(read_file('@my_stage', 'data/file.csv'));
```

### 从表列中批量读取文件

```sql
-- 创建存储文件路径的表
CREATE TABLE file_paths(path STRING);
INSERT INTO file_paths VALUES
    ('@my_stage/images/01.png'),
    ('@my_stage/images/02.png'),
    (NULL);

-- 读取表中所有文件的内容
SELECT path, to_hex(read_file(path)) AS content_hex FROM file_paths;

┌──────────────────────────────────────────────────┐
│           path           │       content_hex      │
├──────────────────────────┼────────────────────────┤
│ @my_stage/images/01.png  │ 89504e47...            │
│ @my_stage/images/02.png  │ 89504e47...            │
│ NULL                     │ NULL                   │
└──────────────────────────────────────────────────┘
```

### 使用双参数形式配合相对路径

```sql
-- 创建存储相对路径的表
CREATE TABLE rel_paths(path STRING);
INSERT INTO rel_paths VALUES
    ('data/file1.csv'),
    ('data/file2.csv');

-- 固定 Stage，从表中读取相对路径对应的文件
SELECT path, to_hex(read_file('@my_stage', path)) AS content_hex FROM rel_paths;
```
