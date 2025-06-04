---
title: SQL 函数参考
---

本页面提供了 Databend 中所有可用 SQL 函数的参考，按类别组织。

## 核心 SQL 函数

| 类别 | 描述 |
|----------|-------------|
| [数值函数（Numeric Functions）](./04-numeric-functions/index.md) | 数值数据处理和分析的数学运算 |
| [字符串函数（String Functions）](./06-string-functions/index.md) | 文本操作和模式匹配的数据处理 |
| [日期时间函数（Date & Time Functions）](./05-datetime-functions/index.md) | 时间数据分析的日期和时间操作 |
| [聚合函数（Aggregate Functions）](./07-aggregate-functions/index.md) | 对多行执行计算的函数 |
| [窗口函数（Window Functions）](./08-window-functions/index.md) | 对与当前行相关的行集进行操作的函数 |

## 数据类型函数

| 类别 | 描述 |
|----------|-------------|
| [转换函数（Conversion Functions）](./02-conversion-functions/index.md) | 不同数据类型间的类型转换和强制转换操作 |
| [数组函数（Array Functions）](./00-array-functions/index.md) | 创建和操作数组集合的函数 |
| [映射函数（Map Functions）](./10-map-functions/index.md) | 处理键值对集合的函数 |
| [半结构化函数（Semi-structured Functions）](./10-semi-structured-functions/index.md) | 处理 JSON 和其他半结构化数据的函数 |

## 逻辑和控制函数

| 类别 | 描述 |
|----------|-------------|
| [条件函数（Conditional Functions）](./03-conditional-functions/index.md) | 基于逻辑的数据转换和流程控制函数 |
| [间隔函数（Interval Functions）](./05-interval-functions/index.md) | 用于日期计算的时间间隔创建和操作 |

## 系统和元数据函数

| 类别 | 描述 |
|----------|-------------|
| [表函数（Table Functions）](./17-table-functions/index.md) | 返回结果集作为表的函数 |
| [系统函数（System Functions）](./16-system-functions/index.md) | 访问系统信息和管理的函数 |
| [上下文函数（Context Functions）](./15-context-functions/index.md) | 访问会话和环境信息的函数 |

## 专业分析函数

| 类别 | 描述 |
|----------|-------------|
| [地理函数（Geo Functions）](./09-geo-functions/index.md) | 地理坐标和 H3 地理空间操作 |
| [几何函数（Geometry Functions）](./09-geometry-functions/index.md) | 几何形状操作和空间计算 |
| [搜索函数（Search Functions）](./10-search-functions/index.md) | 全文搜索功能和文本相关性 |

## AI 和向量函数

| 类别 | 描述 |
|----------|-------------|
| [AI 函数（AI Functions）](./11-ai-functions/index.md) | 自然语言处理和 AI 功能 |
| [向量距离函数（Vector Distance Functions）](./11-vector-distance-functions/index.md) | 向量相似性和距离计算 |

## 数据完整性函数

| 类别 | 描述 |
|----------|-------------|
| [哈希函数（Hash Functions）](./12-hash-functions/index.md) | 数据哈希和指纹算法 |
| [UUID 函数（UUID Functions）](./13-uuid-functions/index.md) | 通用唯一标识符生成和处理 |
| [IP 地址函数（IP Address Functions）](./14-ip-address-functions/index.md) | IP 地址操作和转换 |
| [位图函数（Bitmap Functions）](./01-bitmap-functions/index.md) | 位级操作 |

## 实用函数

| 类别 | 描述 |
|----------|-------------|
| [序列函数（Sequence Functions）](./18-sequence-functions/index.md) | 序列生成和操作 |
| [字典函数（Dictionary Functions）](./19-dictionary-functions/index.md) | 外部数据源集成 |
| [测试函数（Test Functions）](./19-test-functions/index.md) | 用于测试和开发目的的函数 |