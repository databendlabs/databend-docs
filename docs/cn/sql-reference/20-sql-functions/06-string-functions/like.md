---
title: LIKE
---

判断字符串是否匹配 SQL 模式。比较区分大小写，且必须覆盖整个字符串。匹配时返回 `true`，否则返回 `false`。大小写不敏感的匹配请使用 `ILIKE`，正则表达式请使用 [REGEXP](regexp.md)。

## 语法

```sql
<expr> [ NOT ] LIKE <pattern> [ ESCAPE <escape> ]

<expr> [ NOT ] ILIKE <pattern> [ ESCAPE <escape> ]

<expr> LIKE ANY ( <pattern> [ , <pattern> ... ] ) [ ESCAPE <escape> ]
```

不支持 `NOT LIKE ANY`。要对结果取反，请写成 `NOT ( <expr> LIKE ANY ( ... ) )`。

| 参数        | 说明 |
|-------------|------|
| `<expr>`    | 待判断的字符串。 |
| `<pattern>` | SQL 模式。`%` 和 `_` 是通配符，其他字符按字面匹配。 |
| `<escape>`  | 可选。单个字符，放在 `<pattern>` 中的 `%`、`_` 或它自身之前，使其按字面匹配。默认为反斜杠（`\`）。 |

## 返回值

`BOOLEAN`。`<expr>` 或 `<pattern>` 为 `NULL` 时返回 `NULL`。

| 形式       | 返回 `true` 的条件 |
|------------|--------------------|
| `LIKE`     | 字符串匹配模式。 |
| `NOT LIKE` | 字符串不匹配模式。 |
| `ILIKE`    | 忽略大小写后字符串匹配模式。 |
| `LIKE ANY` | 字符串匹配其中至少一个模式。 |

## 模式规则

### 通配符

| 通配符 | 匹配内容 |
|--------|----------|
| `%`    | 零个或多个任意字符，包括换行符。 |
| `_`    | 恰好一个任意字符。 |

模式两端都是锚定的。`'db%'` 匹配 `db01`，但不匹配 `mydb01`；要在任意位置查找子串，需要在两边加上 `%`：

```sql
SELECT 'mydb01' LIKE 'db%', 'mydb01' LIKE '%db%';
-- false, true
```

### 默认转义字符

要把 `%` 或 `_` 当作普通字符匹配，在其前面加上转义字符。默认转义字符是反斜杠（`\`）。

反斜杠在 SQL 字符串字面量中同样是转义字符，因此在字面量里要写两个。下表给出输入的 SQL、服务端实际收到的模式以及匹配结果：

| SQL 字面量   | 模式     | 匹配内容 |
|--------------|----------|----------|
| `'50%'`      | `50%`    | 所有以 `50` 开头的字符串：`50% off`、`500 items` 等。 |
| `'50\\%%'`   | `50\%%`  | 所有以 `50%` 开头的字符串。 |
| `'db\\_01'`  | `db\_01` | 仅 `db_01`。 |
| `'D:\\\\%'`  | `D:\\%`  | 所有以 `D:\` 开头的字符串。 |

转义字符后面只有 `%`、`_` 和 `\` 具有特殊含义，其他字符不需要转义。

### 自定义转义字符

`ESCAPE <escape>` 会在该次比较中替换默认转义字符：

- `<escape>` 后紧跟 `%` 或 `_`，按字面匹配该字符。
- `<escape>` 后紧跟 `<escape>`，匹配转义字符自身。
- 反斜杠变为普通字符。`'D:\\%' ESCAPE '#'` 是模式 `D:\%`，其中 `\` 按字面匹配。

```sql
SELECT '50%'   LIKE '50#%'  ESCAPE '#',  -- true
       '#'     LIKE '##'    ESCAPE '#',  -- true
       'a\\b'  LIKE 'a\\b'  ESCAPE '#';  -- true
```

如果 `<escape>` 超过一个字符，只使用其第一个字符。

### NULL

任意一侧为 `NULL` 时结果为 `NULL`，因此 `NULL` 永远不匹配，`NULL LIKE NULL` 也不匹配。在 `WHERE` 子句中，`LIKE` 和 `NOT LIKE` 都会排除值为 `NULL` 的行。

```sql
SELECT NULL LIKE 'a%', 'abc' LIKE NULL;
-- NULL, NULL
```

## 示例

```sql
CREATE OR REPLACE TABLE tags(tag VARCHAR);
INSERT INTO tags VALUES
  ('db_01'), ('db-01'), ('dbx01'), ('db01'),
  ('50% off'), ('500 items'),
  ('D:\\logs'), ('Daily'),
  (''), (NULL);
```

### 前缀匹配及其取反

```sql
SELECT tag FROM tags WHERE tag LIKE 'db%' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db-01 │
│ db01  │
│ db_01 │
│ dbx01 │
╰───────╯

SELECT tag FROM tags WHERE tag NOT LIKE 'db%' ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│           │
│ 50% off   │
│ 500 items │
│ D:\logs   │
│ Daily     │
╰───────────╯
```

空字符串会被 `NOT LIKE` 返回；`NULL` 行在两个查询中都不会返回。

### 单字符通配符

`_` 匹配任意一个字符，因此 `db_01` 也会匹配 `db-01` 和 `dbx01`：

```sql
SELECT tag FROM tags WHERE tag LIKE 'db_01' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db-01 │
│ db_01 │
│ dbx01 │
╰───────╯
```

### 转义 `%` 和 `_`

不转义时，`50%` 匹配所有以 `50` 开头的字符串：

```sql
SELECT tag FROM tags WHERE tag LIKE '50%' ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│ 50% off   │
│ 500 items │
╰───────────╯
```

转义后，只有字面的百分号才匹配：

```sql
SELECT tag FROM tags WHERE tag LIKE '50\\%%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ 50% off │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE 'db\\_01' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db_01 │
╰───────╯
```

### 匹配反斜杠

字面的反斜杠需要用另一个反斜杠转义，也就是在 SQL 字面量中写四个反斜杠：

```sql
SELECT tag FROM tags WHERE tag LIKE 'D:\\\\%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
╰─────────╯
```

### ESCAPE 子句

```sql
SELECT tag FROM tags WHERE tag LIKE '50#%%' ESCAPE '#' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ 50% off │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE 'db#_01' ESCAPE '#' ORDER BY tag;

╭───────╮
│  tag  │
├───────┤
│ db_01 │
╰───────╯
```

使用自定义转义字符时反斜杠是普通字符，因此字面量里写一组 `\\` 即可：

```sql
SELECT tag FROM tags WHERE tag LIKE 'D:\\%' ESCAPE '#' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
╰─────────╯
```

### ILIKE 与 LIKE ANY

```sql
SELECT tag FROM tags WHERE tag ILIKE 'd%' ORDER BY tag;

╭─────────╮
│   tag   │
├─────────┤
│ D:\logs │
│ Daily   │
│ db-01   │
│ db01    │
│ db_01   │
│ dbx01   │
╰─────────╯

SELECT tag FROM tags WHERE tag LIKE ANY ('db-%', '%items') ORDER BY tag;

╭───────────╮
│    tag    │
├───────────┤
│ 500 items │
│ db-01     │
╰───────────╯
```

## 另请参阅

- [NOT LIKE](not-like.md)
- [REGEXP](regexp.md)
- [REGEXP_LIKE](regexp-like.md)
