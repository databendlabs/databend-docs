---
title: SQL 函数参考
---

Databend 为所有类型的数据处理提供了全面的 SQL 函数。函数按重要性和使用频率进行组织。

## 核心数据函数

| 类别 | 描述 |
|----------|-------------|
| [数值函数](./04-numeric-functions/index.md) | 数学运算和计算 |
| [字符串函数](./06-string-functions/index.md) | 文本操作和字符串处理 |
| [日期和时间函数](./05-datetime-functions/index.md) | 日期、时间和时态操作 |
| [时间间隔函数](./05-interval-functions/index.md) | 时间单位转换和时间间隔创建 |
| [转换函数](./02-conversion-functions/index.md) | 类型转换和数据格式转换 |
| [条件函数](./03-conditional-functions/index.md) | 逻辑和控制流操作 |

## 分析函数

| 类别 | 描述 |
|----------|-------------|
| [聚合函数](./07-aggregate-functions/index.md) | 跨多行的统计计算 |
| [窗口函数](./08-window-functions/index.md) | 使用窗口操作进行高级分析 |
| [位图函数](./01-bitmap-functions/index.md) | 高性能位图操作和分析 |

## 半结构化数据

| 类别 | 描述 |
|----------|-------------|
| [半结构化函数](./10-semi-structured-functions/index.md) | JSON、数组、对象和嵌套数据处理 |

## AI 与搜索

| 类别 | 描述 |
|----------|-------------|
| [向量函数](./11-vector-functions/index.md) | 向量相似度和距离计算 |
| [搜索函数](./10-search-functions/index.md) | 全文搜索和相关性评分 |

## 数据管理

| 类别 | 描述 |
|----------|-------------|
| [表函数](./17-table-functions/index.md) | 文件检查、数据生成和系统信息 |
| [字典函数](./19-dictionary-functions/index.md) | 实时外部数据源查询（MySQL、Redis） |
| [序列函数](./18-sequence-functions/index.md) | 自增序列值生成 |

## 空间函数

| 类别 | 描述 |
|----------|-------------|
| [地理函数](./09-geo-functions/index.md) | 地理坐标和 H3 地理空间操作 |
| [几何函数](./09-geometry-functions/index.md) | 几何形状和空间计算 |

## 安全与完整性

| 类别 | 描述 |
|----------|-------------|
| [哈希函数](./12-hash-functions/index.md) | 数据哈希和完整性验证 |
| [UUID 函数](./13-uuid-functions/index.md) | 通用唯一标识符生成 |
| [IP 地址函数](./14-ip-address-functions/index.md) | 网络地址操作和验证 |

## 系统函数

| 类别 | 描述 |
|----------|-------------|
| [系统函数](./16-system-functions/index.md) | 系统信息和管理操作 |
| [上下文函数](./15-context-functions/index.md) | 当前会话、用户和数据库信息 |

## 开发工具

| 类别 | 描述 |
|----------|-------------|
| [测试函数](./19-test-functions/index.md) | 测试和调试工具 |