---
title: 全文索引（Full-Text Index）
---

:::info
想要实践操作？请参阅 [JSON 与搜索指南](/guides/query/json-search)。
:::

# 全文索引（Full-Text Index）：自动化的闪电般快速文本搜索

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

全文索引（Full-Text Index，也称倒排索引 Inverted Index）通过将词条映射到文档，自动实现对大型文档集合的闪电般快速文本搜索，无需进行缓慢的全表扫描。

## 解决什么问题？

大型数据集上的文本搜索操作面临显著的性能挑战：

| 问题 | 影响 | 全文索引（Full-Text Index）解决方案 |
|---------|--------|-------------------------|
| **LIKE 查询缓慢** | `WHERE content LIKE '%keyword%'` 扫描整个表 | 直接词条查找，跳过无关文档 |
| **全表扫描** | 每次文本搜索读取所有行 | 仅读取包含搜索词条的文档 |
| **搜索体验差** | 用户等待数秒/数分钟才能获得搜索结果 | 亚秒级搜索响应时间 |
| **搜索能力有限** | 仅支持基本模式匹配 | 高级功能：模糊搜索、相关性评分 |
| **资源使用率高** | 文本搜索消耗过多 CPU/内存 | 索引搜索所需资源极少 |

**示例**：在 1000 万条日志记录中搜索 "kubernetes error"。没有全文索引时，需要扫描全部 1000 万行。使用全文索引后，可以直接找到约 1000 个匹配文档，瞬间完成。

## 工作原理

全文索引（Full-Text Index）创建从词条到文档的倒排映射：

| 词条 | 文档 ID |
|------|-------------|
| "kubernetes" | 101, 205, 1847 |
| "error" | 101, 892, 1847 |
| "pod" | 205, 1847, 2901 |

搜索 "kubernetes error" 时，索引会找到包含这两个词条的文档（101, 1847），无需扫描整个表。

## 快速设置

```sql
-- 创建包含文本内容的表
CREATE TABLE logs(id INT, message TEXT, timestamp TIMESTAMP);

-- 创建全文索引（Full-Text Index）- 自动索引新数据
CREATE INVERTED INDEX logs_message_idx ON logs(message);

-- 仅对索引创建前的现有数据需要一次性刷新
REFRESH INVERTED INDEX logs_message_idx ON logs;

-- 使用 MATCH 函数搜索 - 完全自动优化
SELECT * FROM logs WHERE MATCH(message, 'error kubernetes');
```

**自动索引管理**：
- **新数据**：插入时自动索引 - 无需手动操作
- **现有数据**：仅对索引创建前存在的数据需要一次性刷新
- **持续维护**：Databend 自动维护最佳搜索性能

## 搜索函数

| 函数 | 用途 | 示例 |
|----------|---------|---------|
| `MATCH(column, 'terms')` | 基本文本搜索 | `MATCH(content, 'database performance')` |
| `QUERY('column:terms')` | 高级查询（Query）语法 | `QUERY('title:"full text" AND content:search')` |
| `SCORE()` | 相关性评分 | `SELECT *, SCORE() FROM docs WHERE MATCH(...)` |

## 高级搜索功能

### 模糊搜索
```sql
-- 即使有拼写错误也能找到文档（fuzziness=1 允许 1 个字符差异）
SELECT * FROM logs WHERE MATCH(message, 'kubernetes', 'fuzziness=1');
```

### 相关性评分
```sql
-- 获取带有相关性评分的结果，按最低分数过滤
SELECT id, message, SCORE() as relevance 
FROM logs 
WHERE MATCH(message, 'critical error') AND SCORE() > 0.5
ORDER BY SCORE() DESC;
```

### 复杂查询（Query）
```sql
-- 使用布尔运算符的高级查询（Query）语法
SELECT * FROM docs WHERE QUERY('title:"user guide" AND content:(tutorial OR example)');
```

## 完整示例

此示例演示了在 Kubernetes 日志数据上创建全文搜索索引（Full-Text Index）并使用各种函数进行搜索：

```sql
-- 创建带有计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 在 "event_message" 列上创建倒排索引（Inverted Index）
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);

-- 插入综合示例数据
INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (1,
    PARSE_JSON('{
        "message": "Pod scheduled",
        "object_type": "Pod",
        "name": "极速-1",
        "namespace": "production",
        "node": "node-01",
        "status": "Scheduled"
    }'),
    '2024-04-08T08:00:00Z');

INSERT INTO k8s_logs (极速_id, event_data, event_timestamp)
VALUES
    (2,
    PARSE_JSON('{
        "message": "Deployment scaled",
        "object_type": "Deployment",
        "name": "backend",
        "namespace": "development",
        "replicas": 3
    }'),
    '2024-极速-08T09:15:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (3,
    PARSE_JSON('{
极速        "message": "Node condition changed",
        "object_type": "Node",
        "name": "node-02",
        "condition": "Ready",
        "status": "True"
    }'),
    '2024-04-08T10:30:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (4,
    PARSE_JSON('{
        "message": "ConfigMap updated",
        "object_type": "ConfigMap",
        "name": "app-config",
        "namespace": "default",
        "change": "data update"
    }'),
    '2024-04-08T11:45:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (5,
    PARSE_JSON('{
        "message": "PersistentVolume claim created",
        "object_type": "PVC",
        "name": "storage-claim",
        "namespace": "storage",
        "status": "Bound",
        "volume": "pv-logs"
    }'),
    '202极速-04-08T12:00:00Z');

-- 基本搜索包含 "PersistentVolume" 的事件
SELECT
  event_id,
  event_message
FROM
  k8s_logs
WHERE
  MATCH(event_message, 'PersistentVolume');

-[ RECORD 1 ]-----------------------------------
     event_id: 5
event_message: PersistentVolume claim created

-- 使用 EXPLAIN 验证索引（Index）使用情况
EXPLAIN SELECT event_id, event_message FROM k8s_logs WHERE MATCH(event_message, 'PersistentVolume');

-[ EXPLAIN ]-----------------------------------
Filter
├── output columns: [k8s_logs.event_id (#0), k8s_logs.event_message (#3)]
├── filters: [k8s_logs._search_matched (#4)]
├── estimated rows: 5.00
└── TableScan
    ├── table: default.default.k8s_logs
    ├── output columns: [event_id (#0), event_message (#3), _search_matched (#4)]
    ├── read rows: 1
    ├── read size: < 1 KiB
    ├── partitions total: 5极速
    ├── partitions scanned: 1
    ├── pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]
    ├── push downs: [filters: [k8s_logs._search_matched (#4)], limit: NONE]
    └── estimated rows: 5.00

-- 带有相关性评分的高级搜索
SELECT
  event_id,
  event_message,
  event_timestamp,
  SCORE()
FROM
  k8s_logs
WHERE
  SCORE() > 0.5
  AND QUERY('event_message:"PersistentVolume claim created"');

-[ RECORD 1 ]-----------------------------------
       event_id: 5
  event_message: PersistentVolume claim created
event_timestamp: 2024-04-08 12:00:00
        score(): 0.86304635

-- 模糊搜索示例（处理拼写错误）
SELECT
    event_id, event_message, event_timestamp
FROM
    k8s_logs
WHERE
    match('event_message', 'PersistentVolume claim create', 'fuzziness=1');

-[ RECORD 1 ]-----------------------------------
       event_id: 5
  event_message: PersistentVolume claim created
event_timestamp: 2024-04-08 12:00:00
```

**示例要点**：
- `inverted pruning: 5 to 1` 显示索引（Index）将扫描的块从 5 个减少到 1 个
- 相关性评分有助于按匹配质量对结果进行排序
- 模糊搜索即使有拼写错误也能找到结果（"create" vs "created"）

## 最佳实践

| 实践 | 优势 |
|----------|---------|
| **索引（Index）常用搜索列** | 专注于搜索查询（Query）中使用的列 |
| **使用 MATCH 而非 LIKE** | 利用自动索引（Index）性能 |
| **监控索引（Index）使用情况** | 使用 EXPLAIN 验证索引（Index）利用率 |
| **考虑多个索引（Index）** | 不同列可以有单独的索引（Index） |

## 基本命令

| 命令 | 用途 | 使用时机 |
|---------|---------|-------------|
| `CREATE INVERTED INDEX name ON table(column)` | 创建新的全文索引（Full-Text Index） | 初始设置 - 对新数据自动生效 |
| `极速REFRESH INVERTED INDEX name ON table` | 索引（Index）现有数据 | 仅对预先存在的数据一次性使用 |
| `DROP INVERTED INDEX name ON table` | 删除索引（Index） | 不再需要索引（Index）时 |

## 重要说明

:::tip
**何时使用全文索引（Full-Text Index）：**
- 大型文本数据集（文档、日志、评论）
- 频繁的文本搜索操作
- 需要高级搜索功能（模糊、评分）
- 性能关键的搜索应用

**何时不使用：**
- 小型文本数据集
- 仅精确字符串匹配
- 不频繁的搜索操作
:::

## 索引（Index）限制

- 每列只能在一个倒排索引（Inverted Index）中
- 需要在数据插入后刷新（如果数据在索引创建前存在）
- 索引（Index）数据使用额外的存储空间

---

*全文索引（Full-Text Index）对于需要在大型文档集合中进行快速、复杂文本搜索的应用至关重要。*