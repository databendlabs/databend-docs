---
title: SQL 函数参考
---

Databend 为各类数据处理提供了全面的 SQL 函数。函数按重要性和使用频率组织。

## 核心数据函数

| 类别 | 描述 |
|----------|-------------|
| [数值函数](./04-numeric-functions/index.md) | 数学运算与计算 |
| [字符串函数](./06-string-functions/index.md) | 文本操作与字符串处理 |
| [日期和时间函数](./05-datetime-functions/index.md) | 日期、时间及时间相关操作 |
| [转换函数](./02-conversion-functions/index.md) | 类型转换与数据格式转换 |
| [条件函数](./03-conditional-functions/index.md) | 逻辑与控制流操作 |

## 分析函数

| 类别 | 描述 |
|----------|-------------|
| [聚合函数](./07-aggregate-functions/index.md) | 跨多行的统计计算 |
| [窗口函数](./08-window-functions/index.md) | 基于窗口操作的高级分析 |

## 结构化和半结构化数据

| 类别 | 描述 |
|----------|-------------|
| [结构化和半结构化函数](./10-semi-structured-functions/index.md) | JSON、数组、对象及嵌套数据处理 |

## 搜索函数

| 类别 | 描述 |
|----------|-------------|
| [全文搜索函数](./10-search-functions/index.md) | 全文搜索与相关性评分 |

## 向量函数

| 类别 | 描述 |
|----------|-------------|
| [向量函数](./11-vector-functions/index.md) | 向量相似度与距离计算 |

## 地理空间函数

| 类别 | 描述 |
|----------|-------------|
| [地理空间函数](./09-geospatial-functions/index.md) | 几何、GeoHash 与 H3 空间操作 |

## 数据管理

| 类别 | 描述 |
|----------|-------------|
| [表函数](./17-table-functions/index.md) | 文件检查、数据生成与系统信息 |
| [系统函数](./16-system-functions/index.md) | 系统信息与管理操作 |
| [上下文函数](./15-context-functions/index.md) | 当前会话、用户及数据库信息 |

## 安全与完整性

| 类别 | 描述 |
|----------|-------------|
| [哈希函数](./12-hash-functions/index.md) | 数据哈希与完整性验证 |
| [位图函数](./01-bitmap-functions/index.md) | 高性能位图操作与分析 |
| [UUID 函数](./13-uuid-functions/index.md) | 通用唯一标识符生成 |
| [IP 地址函数](./14-ip-address-functions/index.md) | 网络地址操作与验证 |

## 实用工具函数

| 类别 | 描述 |
|----------|-------------|
| [间隔函数](./05-interval-functions/index.md) | 时间单位转换与间隔创建 |
| [序列函数](./18-sequence-functions/index.md) | 自增序列值生成 |
| [字典函数](./19-dictionary-functions/index.md) | 实时外部数据源查询（MySQL、Redis） |
| [测试函数](./19-test-functions/index.md) | 测试与调试工具 |
| [其他函数](./20-other-functions/index.md) | 杂项辅助与实用工具 |