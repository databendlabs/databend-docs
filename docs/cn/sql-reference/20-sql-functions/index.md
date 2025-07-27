---
title: SQL 函数参考
---

本页按类别提供了 Databend 中所有可用 SQL 函数的参考。

## 核心 SQL 函数

| 类别 | 描述 |
|----------|-------------|
| [数值函数](./04-numeric-functions/index.md) | 用于数值数据处理和分析的数学运算 |
| [字符串函数](./06-string-functions/index.md) | 用于数据处理的文本操作和模式匹配运算 |
| [日期和时间函数](./05-datetime-functions/index.md) | 用于时序数据分析的日期和时间操作 |
| [聚合函数](./07-aggregate-functions/index.md) | 对多行数据执行计算的函数 |
| [窗口函数](./08-window-functions/index.md) | 对与当前行相关的一组行进行操作的函数 |

## 数据类型函数

| 类别 | 描述 |
|----------|-------------|
| [转换函数](./02-conversion-functions/index.md) | 不同数据类型之间的类型转换和强制转换操作 |
| [结构化和半结构化函数](./10-semi-structured-functions/index.md) | 用于处理 JSON、数组、对象、映射和其他结构化数据类型的函数 |

## 逻辑和控制函数

| 类别 | 描述 |
|----------|-------------|
| [条件函数](./03-conditional-functions/index.md) | 基于逻辑的数据转换和流控制函数 |
| [间隔函数](./05-interval-functions/index.md) | 创建和操作用于日期计算的时间间隔 |

## 系统和元数据函数

| 类别 | 描述 |
|----------|-------------|
| [表函数](./17-table-functions/index.md) | 以表的形式返回结果集的函数 |
| [系统函数](./16-system-functions/index.md) | 用于访问系统信息和管理的函数 |
| [上下文函数](./15-context-functions/index.md) | 用于访问会话和环境信息的函数 |

## 专业分析函数

| 类别 | 描述 |
|----------|-------------|
| [地理函数](./09-geo-functions/index.md) | 地理坐标和 H3 地理空间操作 |
| [几何函数](./09-geometry-functions/index.md) | 几何形状操作和空间计算 |
| [搜索函数](./10-search-functions/index.md) | 全文搜索功能和文本相关性 |

## AI 和向量函数

| 类别 | 描述 |
|----------|-------------|
| [AI 函数](./11-ai-functions/index.md) | 自然语言处理和 AI 功能 |
| [向量函数](./11-vector-functions/index.md) | 向量相似度和距离计算 |

## 数据完整性函数

| 类别 | 描述 |
|----------|-------------|
| [哈希函数](./12-hash-functions/index.md) | 数据哈希和指纹算法 |
| [UUID 函数](./13-uuid-functions/index.md) | 通用唯一标识符的生成和处理 |
| [IP 地址函数](./14-ip-address-functions/index.md) | IP 地址操作和转换 |
| [位图函数](./01-bitmap-functions/index.md) | 位级运算和操作 |

## 实用函数

| 类别 | 描述 |
|----------|-------------|
| [序列函数](./18-sequence-functions/index.md) | 序列生成和操作 |
| [字典函数](./19-dictionary-functions/index.md) | 外部数据源集成 |
| [测试函数](./19-test-functions/index.md) | 用于测试和开发目的的函数 |