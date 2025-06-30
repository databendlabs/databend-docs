---
title: FLATTEN
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.213"/>

将嵌套的 JSON 或数组 (array) 数据转换为表格格式（即展平 (flatten)），其中每个元素或字段都表示为单独的一行。

## 语法

```sql
[LATERAL] FLATTEN (
  INPUT => <expr>
  [, PATH => <expr>]
  [, OUTER => TRUE | FALSE]
  [, RECURSIVE => TRUE | FALSE]
  [, MODE => 'OBJECT' | 'ARRAY' | 'BOTH']
)
```

## 参数

| 参数 | 描述 | 默认值 |
|-----------|-------------|---------|
| `INPUT` | 要展平的 JSON 或数组数据 | 必需 |
| `PATH` | 要展平的数组/对象的路径 | 无 |
| `OUTER` | 包括结果为零的行（值为 NULL） | `FALSE` |
| `RECURSIVE` | 展平嵌套元素 | `FALSE` |
| `MODE` | 展平对象、数组或两者 | `'BOTH'` |
| `LATERAL` | 启用与前面表表达式的交叉引用 | 可选 |

## 输出列

| 列名 | 描述 |
|--------|-------------|
| `SEQ` | 输入的序列号 |
| `KEY` | 展开值的键（如果没有则为 NULL） |
| `PATH` | 指向被展平元素的路径 |
| `INDEX` | 数组索引（对于对象则为 NULL） |
| `VALUE` | 被展平元素的值 |
| `THIS` | 正在被展平的元素 |

**注意：** 使用 LATERAL 时，由于动态交叉引用，输出列可能会有所不同。

## 示例

### 基本展平

```sql
-- 展平一个带有嵌套结构的 JSON 对象
SELECT * FROM FLATTEN(
  INPUT => PARSE_JSON(
    '{"name": "John", "languages": ["English", "Spanish"], "address": {"city": "New York"}}'
  )
);
```

结果将展平顶层键：

```text
| seq | key       | path      | index | value                | this                 |
|-----|-----------|-----------|-------|----------------------|----------------------|
| 1   | name      | name      | NULL  | "John"               | {original JSON}      |
| 1   | languages | languages | NULL  | ["English","Spanish"]| {original JSON}      |
| 1   | address   | address   | NULL  | {"city":"New York"}  | {original JSON}      |
```

### 使用 PATH 参数

```sql
-- 通过指定 PATH 仅展平 languages 数组
SELECT * FROM FLATTEN(
  INPUT => PARSE_JSON(
    '{"name": "John", "languages": ["English", "Spanish"]}'
  ),
  PATH => 'languages'
);
```

结果将展平数组元素：

```text
| seq | key  | path         | index | value     | this               |
|-----|------|--------------|-------|-----------|-------------------|
| 1   | NULL | languages[0] | 0     | "English" | ["English","Spanish"] |
| 1   | NULL | languages[1] | 1     | "Spanish" | ["English","Spanish"] |
```

### 递归展平

```sql
-- 递归展平嵌套的对象和数组
SELECT * FROM FLATTEN(
  INPUT => PARSE_JSON(
    '{"name": "John", "address": {"city": "New York", "zip": 10001}}'
  ),
  RECURSIVE => TRUE
);
```

结果将展平嵌套对象：

```text
| seq | key     | path         | index | value       | this            |
|-----|---------|--------------|-------|-------------|-----------------|
| 1   | name    | name         | NULL  | "John"      | {original JSON} |
| 1   | address | address      | NULL  | {"city":...}| {original JSON} |
| 1   | city    | address.city | NULL  | "New York"  | {"city":...}    |
| 1   | zip     | address.zip  | NULL  | 10001       | {"city":...}    |
```

### 使用 LATERAL FLATTEN

```sql
-- 使用 LATERAL FLATTEN 将 JSON 数组转换为行
-- 这允许在没有表的情况下直接访问数组元素
SELECT 
  f.value:item::STRING AS item_name,
  f.value:price::FLOAT AS price
FROM 
  LATERAL FLATTEN(
    INPUT => PARSE_JSON('[
      {"item":"coffee", "price":2.50}, 
      {"item":"donut", "price":1.20}
    ]')
  ) f;
```

结果：

```text
| item_name | price |
|-----------|-------|
| coffee    | 2.5   |
| donut     | 1.2   |
```