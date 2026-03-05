---
title: MATCH
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.619"/>

`MATCH` 用于在指定列中搜索包含所提供关键字的行。该函数只能出现在 `WHERE` 子句中。

:::info
Databend 的 MATCH 函数灵感来源于 Elasticsearch 的 [MATCH](https://www.elastic.co/guide/en/elasticsearch/reference/current/sql-functions-search.html#sql-functions-search-match)。
:::

## 语法

```sql
MATCH('<columns>', '<keywords>'[, '<options>'])
```

- `<columns>`：要搜索的列，以逗号分隔。可附加 `^<boost>` 为某列赋予更高权重。
- `<keywords>`：要搜索的词条。可附加 `*` 进行后缀匹配，例如 `rust*`。
- `<options>`：可选的、以分号分隔的 `key=value` 对列表，用于微调搜索。

## 选项

| 选项 | 值 | 描述 | 示例 |
|--------|--------|-------------|---------|
| `fuzziness` | `1` 或 `2` | 匹配在指定 Levenshtein distance（莱文斯坦距离）内的关键字。 | `MATCH('summary, tags', 'pedestrain', 'fuzziness=1')` 匹配包含正确拼写 `pedestrian` 的行。 |
| `operator` | `OR`（默认）或 `AND` | 在未指定布尔操作符时，控制多个关键字的组合方式。 | `MATCH('summary, tags', 'traffic light red', 'operator=AND')` 要求同时包含这两个词。 |
| `lenient` | `true` 或 `false` | 为 `true` 时，抑制解析错误并返回空结果集。 | `MATCH('summary, tags', '()', 'lenient=true')` 返回空行而非报错。 |

## 示例

在许多 AI Pipeline（流水线）中，你可能会在 `VARIANT` 列中捕获结构化元数据，同时为人类可读摘要建立索引以便搜索。以下示例存储了从 JSON 负载中提取的行车记录仪帧摘要和标签。

### 示例：构建可搜索的摘要

```sql
CREATE OR REPLACE TABLE frame_notes (
  id INT,
  camera STRING,
  summary STRING,
  tags STRING,
  INVERTED INDEX idx_notes (summary, tags)
);

INSERT INTO frame_notes VALUES
  (1, 'dashcam_front',
      'Green light at Market & 5th with pedestrian entering the crosswalk',
      'downtown commute green-light pedestrian'),
  (2, 'dashcam_front',
      'Vehicle stopped at Mission & 6th red traffic light with cyclist ahead',
      'stop urban red-light cyclist'),
  (3, 'dashcam_front',
      'School zone caution sign in SOMA with pedestrian waiting near crosswalk',
      'school-zone caution pedestrian');
```

### 示例：布尔 AND

```sql
SELECT id, summary
FROM frame_notes
WHERE MATCH('summary, tags', 'traffic light red', 'operator=AND');
-- 返回 id 2
```

### 示例：模糊匹配

```sql
SELECT id, summary
FROM frame_notes
WHERE MATCH('summary^2, tags', 'pedestrain', 'fuzziness=1');
-- 返回 id 1 和 3
```