---
title: 全文索引
---

# 全文索引：实现自动化的极速文本搜索

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

全文索引（倒排索引）通过建立词汇到文档的映射关系，无需全表扫描即可在大型文档集合中实现自动化的极速文本搜索。

## 解决什么问题？

大规模数据集上的文本搜索操作面临显著性能挑战：

| 问题 | 影响 | 全文索引解决方案 |
|------|------|----------------|
| **LIKE 查询缓慢** | `WHERE content LIKE '%keyword%'` 需要扫描整表 | 直接词汇定位，跳过无关文档 |
| **全表扫描** | 每次文本搜索都需读取所有行 | 仅读取包含搜索词的文档 |
| **搜索体验差** | 用户需等待数秒/分钟获取结果 | 亚秒级搜索响应 |
| **搜索功能有限** | 仅支持基础模式匹配 | 支持高级功能：模糊搜索、相关性评分 |
| **资源消耗高** | 文本搜索占用大量 CPU/内存 | 索引搜索仅需最小资源 |

**示例**：在 1000 万条日志条目中搜索 "kubernetes error"。无全文索引需扫描全部 1000 万行，有全文索引可直接定位约 1000 条匹配文档。

## 工作原理

全文索引创建从词汇到文档的反向映射：

| 词汇 | 文档 ID |
|------|--------|
| "kubernetes" | 101, 205, 1847 |
| "error" | 101, 892, 1847 |
| "pod" | 205, 1847, 2901 |

当搜索 "kubernetes error" 时，索引会直接找到同时包含两个词汇的文档（101, 1847），无需扫描整表。

## 快速设置

```sql
-- 创建包含文本内容的表
CREATE TABLE logs(id INT, message TEXT, timestamp TIMESTAMP);

-- 创建全文索引 - 自动索引新数据
CREATE INVERTED INDEX logs_message_idx ON logs(message);

-- 仅需对索引创建前已存在的数据执行一次性刷新
REFRESH INVERTED INDEX logs_message_idx ON logs;

-- 使用 MATCH 函数搜索 - 全自动优化
SELECT * FROM logs WHERE MATCH(message, 'error kubernetes');
```

**自动索引管理**：
- **新数据**：插入时自动索引 - 无需手动操作
- **现有数据**：仅需对索引创建前存在的数据执行一次性刷新
- **持续维护**：Databend 自动保持最优搜索性能

## 搜索函数

| 函数 | 用途 | 示例 |
|------|------|------|
| `MATCH(column, 'terms')` | 基础文本搜索 | `MATCH(content, 'database performance')` |
| `QUERY('column:terms')` | 高级查询语法 | `QUERY('title:"full text" AND content:search')` |
| `SCORE()` | 相关性评分 | `SELECT *, SCORE() FROM docs WHERE MATCH(...)` |

## 高级搜索功能

### 模糊搜索
```sql
-- 即使存在拼写错误也能找到文档（fuzziness=1 允许 1 个字符差异）
SELECT * FROM logs WHERE MATCH(message, 'kuberntes', 'fuzziness=1');
```

### 相关性评分
```sql
-- 获取带相关性评分的结果，按最小分数过滤
SELECT id, message, SCORE() as relevance 
FROM logs 
WHERE MATCH(message, 'critical error') AND SCORE() > 0.5
ORDER BY SCORE() DESC;
```

### 复杂查询
```sql
-- 支持布尔运算符的高级查询语法
SELECT * FROM docs WHERE QUERY('title:"user guide" AND content:(tutorial OR example)');
```

## 完整示例

此示例演示如何在 Kubernetes 日志数据上创建全文搜索索引，并使用多种函数进行搜索：

```sql
-- 创建包含计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 在 event_message 列上创建倒排索引
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);

-- 插入综合示例数据
INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (1,
    PARSE_JSON('{
        "message": "Pod scheduled",
        "object_type": "Pod",
        "name": "frontend-1",
        "namespace": "production",
        "node": "node-01",
        "status": "Scheduled"
    }'),
    '2024-04-08T08:00:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (2,
    PARSE_JSON('{
        "message": "Deployment scaled",
        "object_type": "Deployment",
        "name": "backend",
        "namespace": "development",
        "replicas": 3
    }'),
    '2024-04-08T09:15:00Z');

INSERT INTO k8s_logs (event_id, event_data, event_timestamp)
VALUES
    (3,
    PARSE_JSON('{
        "message": "Node condition changed",
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
    '2024-04-08T12:00:00Z');

-- 基础搜索包含 "PersistentVolume" 的事件
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

-- 使用 EXPLAIN 验证索引使用情况
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
    ├── partitions total: 5
    ├── partitions scanned: 1
    ├── pruning stats: [segments: <range pruning: 5 to 5>, blocks: <range pruning: 5 to 5, inverted pruning: 5 to 1>]
    ├── push downs: [filters: [k8s_logs._search_matched (#4)], limit: NONE]
    └── estimated rows: 5.00

-- 带相关性评分的高级搜索
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

**示例关键点**：
- `inverted pruning: 5 to 1` 显示索引将扫描块从 5 减少到 1
- 相关性评分帮助按匹配质量排序结果
- 模糊搜索即使存在拼写错误（"create" vs "created"）也能找到结果

## 最佳实践

| 实践 | 优势 |
|------|------|
| **索引高频搜索列** | 聚焦于搜索查询使用的列 |
| **使用 MATCH 替代 LIKE** | 利用自动索引性能优势 |
| **监控索引使用** | 使用 EXPLAIN 验证索引利用率 |
| **考虑多索引** | 不同列可建立独立索引 |

## 核心命令

| 命令 | 用途 | 使用时机 |
|------|------|----------|
| `CREATE INVERTED INDEX name ON table(column)` | 创建新全文索引 | 初始设置 - 对新数据自动生效 |
| `REFRESH INVERTED INDEX name ON table` | 索引现有数据 | 仅对索引创建前存在的数据执行一次 |
| `DROP INVERTED INDEX name ON table` | 删除索引 | 当索引不再需要时 |

## 重要提示

:::tip
**适用场景**：
- 大型文本数据集（文档、日志、评论）
- 频繁的文本搜索操作
- 需要高级搜索功能（模糊匹配、评分）
- 性能关键的搜索应用

**不适用场景**：
- 小型文本数据集
- 仅需精确字符串匹配
- 低频搜索操作
:::

## 索引限制

- 每列只能属于一个倒排索引
- 数据插入后需刷新（若数据在索引创建前已存在）
- 需要额外存储空间存放索引数据

---

*全文索引对于需要在大规模文档集合中实现快速、复杂文本搜索能力的应用至关重要。*