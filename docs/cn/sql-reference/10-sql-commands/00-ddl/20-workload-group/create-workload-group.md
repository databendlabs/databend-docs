---
title: CREATE WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于: v1.2.743"/>

创建具有指定配额设置的工作负载组。

## 语法

```sql
CREATE WORKLOAD GROUP [IF NOT EXISTS] <group_name>
[WITH cpu_quota = '<percentage>', query_timeout = '<duration>']
```

## 参数

| 参数            | 类型     | 必需 | 默认值      | 描述                                                                 |
|-----------------|----------|------|------------|----------------------------------------------------------------------|
| `cpu_quota`     | string   | 否   | (无限制)   | CPU 资源配额，以百分比字符串表示 (例如 `"20%"`)                        |
| `query_timeout` | duration | 否   | (无限制)   | 查询超时时长 (单位: `s`/`sec`=秒, `m`/`min`=分钟, `h`/`hour`=小时, `d`/`day`=天, `ms`=毫秒, 无单位=秒) |


## 示例

```sql
CREATE WORKLOAD GROUP analytics WITH cpu_quota = '20%', query_timeout = '10m';
```