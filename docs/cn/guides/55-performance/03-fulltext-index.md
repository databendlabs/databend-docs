---
title: 全文索引
---

# 全文索引：实现闪电般快速的自动文本搜索

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='INVERTED INDEX'/>

全文索引（倒排索引）通过建立词条到文档的映射关系，自动实现海量文档集合的闪电式文本检索，无需执行缓慢的全表扫描。

## 解决哪些问题？

大规模数据集上的文本搜索面临显著性能挑战：

| 问题 | 影响 | 全文索引解决方案 |
|---------|--------|-------------------------|
| **LIKE 查询缓慢** | `WHERE content LIKE '%keyword%'` 需扫描整表 | 直接词条定位，跳过无关文档 |
| **全表扫描** | 每次文本搜索都需读取所有行 | 仅读取包含搜索词条的文档 |
| **搜索体验差** | 用户需等待数秒/分钟获取结果 | 亚秒级搜索响应时间 |
| **搜索功能有限** | 仅支持基础模式匹配 | 支持高级功能：模糊搜索、相关性评分 |
| **资源消耗高** | 文本搜索过度消耗 CPU/内存 | 索引搜索仅需最少资源 |

**示例**：在 1000 万条日志中搜索 "kubernetes error"。无全文索引时需扫描全部 1000 万行，使用全文索引可直接定位约 1000 个匹配文档，瞬间返回结果。

## 工作原理

全文索引创建词条到文档的反向映射：

| 词条 | 文档 ID |
|------|-------------|
| "kubernetes" | 101, 205, 1847 |
| "error" | 101, 892, 1847 |
| "pod" | 205, 1847, 2901 |

搜索 "kubernetes error" 时，索引直接定位同时包含两个词条的文档 (101, 1847)，无需扫描整表。

## 快速配置

```sql
-- 创建含文本字段的表
CREATE TABLE logs(id INT, message TEXT, timestamp TIMESTAMP);

-- 创建全文索引 - 自动索引新数据
CREATE INVERTED INDEX logs_message_idx ON logs(message);

-- 仅需对索引创建前已存在的数据执行一次性刷新
REFRESH INVERTED INDEX logs_message_idx ON logs;

-- 使用 MATCH 函数搜索 - 自动优化执行
SELECT * FROM logs WHERE MATCH(message, 'error kubernetes');
```

**自动索引管理**：
- **新数据**：插入时自动索引，无需人工干预
- **存量数据**：仅需对索引创建前存在的数据执行一次性刷新
- **持续维护**：Databend 自动维护最优搜索性能

## 搜索函数

| 函数 | 用途 | 示例 |
|----------|---------|---------|
| `MATCH(column, 'terms')` | 基础文本搜索 | `MATCH(content, 'database performance')` |
| `QUERY('column:terms')` | 高级查询语法 | `QUERY('title:"full text" AND content:search')` |
| `SCORE()` | 相关性评分 | `SELECT *, SCORE() FROM docs WHERE MATCH(...)` |

## 高级搜索功能

### 模糊搜索
```sql
-- 支持容错匹配（fuzziness=1 允许 1 个字符差异）
SELECT * FROM logs WHERE MATCH(message, 'kuberntes', 'fuzziness=1');
```

### 相关性评分
```sql
-- 获取带相关性评分的结果，按阈值过滤
SELECT id, message, SCORE() as relevance 
FROM logs 
WHERE MATCH(message, 'critical error') AND SCORE() > 0.5
ORDER BY SCORE() DESC;
```

### 复合查询
```sql
-- 支持布尔运算符的高级查询语法
SELECT * FROM docs WHERE QUERY('title:"user guide" AND content:(tutorial OR example)');
```

## 完整示例

此示例演示在 Kubernetes 日志数据上创建全文索引并执行多样化搜索：

```sql
-- 创建含计算列的表
CREATE TABLE k8s_logs (
    event_id INT,
    event_data VARIANT,
    event_timestamp TIMESTAMP,
    event_message VARCHAR AS (event_data['message']::VARCHAR) STORED
);

-- 在 event_message 列创建倒排索引
CREATE INVERTED INDEX event_message_fulltext ON k8s_logs(event_message);

-- 插入示例数据
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

-- 基础搜索：查找含 "PersistentVolume" 的事件
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

-- 使用 EXPLAIN 验证索引使用
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

-- 模糊搜索示例（支持拼写容错）
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

**示例核心要点**：
- `inverted pruning: 5 to 1` 表明索引将扫描块数从 5 降至 1
- 相关性评分实现按匹配质量排序结果
- 模糊搜索支持拼写差异（如 "create" 与 "created"）

## 最佳实践

| 实践方案 | 优势 |
|----------|---------|
| **为高频搜索列创建索引** | 聚焦搜索查询中的目标列 |
| **使用 MATCH 替代 LIKE** | 充分发挥索引性能优势 |
| **监控索引使用状态** | 通过 EXPLAIN 验证索引生效情况 |
| **考虑多索引方案** | 不同列可建立独立索引 |

## 核心命令

| 命令 | 用途 | 使用场景 |
|---------|---------|-------------|
| `CREATE INVERTED INDEX name ON table(column)` | 新建全文索引 | 初始配置 - 新数据自动索引 |
| `REFRESH INVERTED INDEX name ON table` | 索引存量数据 | 仅需对索引前数据执行一次 |
| `DROP INVERTED INDEX name ON table` | 删除索引 | 不再需要索引时 |

## 重要说明

:::tip
**适用场景**：
- 海量文本数据集（文档/日志/评论）
- 高频文本搜索操作
- 需要高级搜索功能（模糊匹配/相关性评分）
- 性能敏感的搜索应用

**非适用场景**：
- 小型文本数据集
- 仅需精确字符串匹配
- 低频搜索操作
:::

## 索引限制

- 单列仅能归属一个倒排索引
- 数据插入后需手动刷新（针对索引创建前已存在的数据）
- 需额外存储空间存放索引数据

---

*全文索引是处理海量文档集合并实现高速、复杂文本搜索的关键组件。*