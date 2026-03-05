---
title: 全文索引（Full-Text Index）
---

:::info
想要动手实践？请参考 [JSON 与搜索指南](/guides/query/json-search)。
:::

# 全文索引（Full-Text Index）：自动实现闪电般快速的文本搜索

全文索引（倒排索引）通过将词条映射到文档，自动在大规模文档集合中实现闪电般快速的文本搜索，彻底告别缓慢的表扫描。

## 它解决了什么问题？

在大数据量场景下，文本搜索面临严峻的性能挑战：

| 问题 | 影响 | 全文索引解决方案 |
|---------|--------|-------------------------|
| **LIKE 查询慢** | `WHERE content LIKE '%keyword%'` 需全表扫描 | 直接词条查找，跳过无关文档 |
| **全表扫描** | 每次文本搜索都要读取所有行 | 仅读取包含搜索词条的文档 |
| **搜索体验差** | 用户需等待数秒甚至数分钟 | 亚秒级响应 |
| **搜索能力有限** | 仅支持基础模式匹配 | 支持模糊搜索、相关性评分等高级功能 |
| **资源消耗高** | 文本搜索占用大量 CPU/内存 | 索引搜索资源消耗极低 |

**示例**：在 1000 万条日志中搜索 "kubernetes error"。无全文索引时需扫描 1000 万行；有全文索引时瞬间定位约 1000 条匹配文档。

## 工作原理

全文索引建立“词条 → 文档”的倒排映射：

| 词条 | 文档 ID |
|------|-------------|
| "kubernetes" | 101, 205, 1847 |
| "error" | 101, 892, 1847 |
| "pod" | 205, 1847, 2901 |

搜索 "kubernetes error" 时，索引直接返回同时包含这两个词条的文档（101、1847），无需全表扫描。

## 快速上手

```sql
-- 创建带文本列的表
CREATE TABLE logs(id INT, message TEXT, timestamp TIMESTAMP);

-- 创建全文索引——新数据自动进入索引
CREATE INVERTED INDEX logs_message_idx ON logs(message);

-- 仅对索引创建前已存在的数据需一次性刷新
REFRESH INVERTED INDEX logs_message_idx ON logs;

-- 使用 MATCH 函数搜索，优化全自动
SELECT * FROM logs WHERE MATCH(message, 'error kubernetes');
```

**索引自动管理**：
- **新数据**：写入即自动索引，无需干预
- **旧数据**：仅需在索引创建后执行一次 REFRESH
- **后续维护**：Databend 自动保持最佳性能

## 搜索函数

| 函数 | 用途 | 示例 |
|----------|---------|---------|
| `MATCH(column, 'terms')` | 基础文本搜索 | `MATCH(content, 'database performance')` |
| `QUERY('column:terms')` | 高级查询语法 | `QUERY('title:"full text" AND content:search')` |
| `SCORE()` | 相关性评分 | `SELECT *, SCORE() FROM docs WHERE MATCH(...)` |

## 高级搜索特性

### 模糊搜索
```sql
-- 容忍 1 个字符拼写错误（fuzziness=1）
SELECT * FROM logs WHERE MATCH(message, 'kubernetes', 'fuzziness=1');
```

### 相关性评分
```sql
-- 返回带评分的结果，并按分值过滤/排序
SELECT id, message, SCORE() as relevance 
FROM logs 
WHERE MATCH(message, 'critical error') AND SCORE() > 0.5
ORDER BY SCORE() DESC;
```

### 复杂查询
```sql
-- 布尔运算符组合多条件
SELECT * FROM docs WHERE QUERY('title:"user guide" AND content:(tutorial OR example)');
```

## 完整示例

以下示例在 Kubernetes 日志上创建全文索引，并演示多种搜索方式：

```sql
-- 创建含计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 为 event_message 列创建倒排索引
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);

-- 写入示例数据
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

-- 基础搜索：包含 "PersistentVolume" 的事件
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

-- 用 EXPLAIN 验证索引生效
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

-- 高级搜索：带相关性评分
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

-- 模糊搜索：拼写错误也能命中
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

**示例亮点**：
- `inverted pruning: 5 to 1` 表明索引把待扫描块从 5 减到 1
- 相关性评分按匹配质量排序
- 模糊搜索容忍拼写差异（"create" vs "created"）

## 最佳实践

| 实践 | 收益 |
|----------|---------|
| **为高频搜索列建索引** | 聚焦出现在 WHERE 中的文本列 |
| **用 MATCH 替代 LIKE** | 自动享受索引加速 |
| **监控索引使用** | EXPLAIN 确认命中索引 |
| **可建多个索引** | 不同文本列可独立索引 |

## 常用命令

| 命令 | 用途 | 使用场景 |
|---------|---------|-------------|
| `CREATE INVERTED INDEX name ON table(column)` | 新建全文索引 | 初始部署；新数据自动索引 |
| `REFRESH INVERTED INDEX name ON table` | 为历史数据建索引 | 仅对索引创建前已存在的数据执行一次 |
| `DROP INVERTED INDEX name ON table` | 删除索引 | 索引不再需要时 |

## 使用建议

:::tip
**适合全文索引的场景**：
- 大文本数据集（文档、日志、评论）
- 频繁文本搜索
- 需要模糊搜索、相关性评分等高级能力
- 对搜索性能敏感的应用

**不适合的场景**：
- 小文本数据集
- 仅做精确字符串匹配
- 搜索频率极低
:::

## 索引限制

- 每列只能加入一个倒排索引
- 索引创建前已存在的数据需手动 REFRESH
- 会占用额外存储空间

---

*全文索引是面向大规模文档集合、需要快速复杂文本搜索能力的应用必备利器。*
