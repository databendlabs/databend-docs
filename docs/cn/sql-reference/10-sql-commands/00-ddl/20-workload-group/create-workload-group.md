---
title: CREATE WORKLOAD GROUP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.743"/>

创建一个具有指定配额设置的工作负载组（Workload Group）。工作负载组（Workload Group）通过与用户绑定来控制资源分配和查询（Query）并发。当用户提交查询（Query）时，系统会根据用户所属的工作负载组（Workload Group）自动应用相应的资源限制。

## 语法

```sql
CREATE WORKLOAD GROUP [IF NOT EXISTS] <group_name>
[WITH cpu_quota = '<percentage>', query_timeout = '<duration>']
```

## 参数

| 参数                   | 类型             | 是否必需 | 默认值      | 描述                                                                         |
|------------------------|------------------|----------|-------------|------------------------------------------------------------------------------|
| `cpu_quota`            | string           | 否       | (无限制)    | CPU 资源配额，以百分比字符串表示（例如 `"20%"`）                             |
| `query_timeout`        | duration         | 否       | (无限制)    | 查询（Query）超时时长（单位：`s`/`sec`=秒，`m`/`min`=分钟，`h`/`hour`=小时，`d`/`day`=天，`ms`=毫秒，无单位=秒） |
| `memory_quota`         | string 或 integer | 否       | (无限制)    | 工作负载组（Workload Group）的最大内存使用限制（百分比或绝对值）             |
| `max_concurrency`      | integer          | 否       | (无限制)    | 工作负载组（Workload Group）的最大并发数                                     |
| `query_queued_timeout` | duration         | 否       | (无限制)    | 工作负载组（Workload Group）超出最大并发时的最大排队等待时间（单位：`s`/`sec`=秒，`m`/`min`=分钟，`h`/`hour`=小时，`d`/`day`=天，`ms`=毫秒，无单位=秒） |

## 示例

### 基本示例

```sql
-- 创建工作负载组
CREATE WORKLOAD GROUP IF NOT EXISTS interactive_queries 
WITH cpu_quota = '30%', memory_quota = '20%', max_concurrency = 2;

CREATE WORKLOAD GROUP IF NOT EXISTS batch_processing 
WITH cpu_quota = '70%', memory_quota = '80%', max_concurrency = 10;
```

### 用户分配

用户必须分配到工作负载组（Workload Group）才能启用资源限制。当用户执行查询（Query）时，系统会自动应用该工作负载组（Workload Group）的限制。

```sql
-- 创建并分配用户
CREATE USER analytics_user IDENTIFIED BY 'password123';
ALTER USER analytics_user WITH SET WORKLOAD GROUP = 'interactive_queries';

-- 重新分配到不同工作负载组
ALTER USER analytics_user WITH SET WORKLOAD GROUP = 'batch_processing';

-- 从工作负载组移除（用户将使用默认无限制资源）
ALTER USER analytics_user WITH UNSET WORKLOAD GROUP;

-- 检查用户的工作负载组
DESC USER analytics_user;
```

## 资源配额归一化

### 配额限制
- 每个工作负载组（Workload Group）的 `cpu_quota` 和 `memory_quota` 最高可设为 `100%` (1.0)
- 所有工作负载组（Workload Group）的配额总和可超过 100%
- 实际资源分配会基于相对比例进行**归一化**

### 配额归一化原理

资源按各组配额占总配额的比例分配：

```
实际分配 = (组配额) / (所有组配额总和) × 100%
```

**示例 1：总配额 = 100%**
- 组 A：30% 配额 → 获得 30% 资源 (30/100)
- 组 B：70% 配额 → 获得 70% 资源 (70/100)

**示例 2：总配额 > 100%**
- 组 A：60% 配额 → 获得 40% 资源 (60/150)
- 组 B：90% 配额 → 获得 60% 资源 (90/150)
- 总配额：150%

**示例 3：总配额 < 100%**
- 组 A：20% 配额 → 获得 67% 资源 (20/30)
- 组 B：10% 配额 → 获得 33% 资源 (10/30)
- 总配额：30%

**特殊情况：** 当仅存在一个工作负载组（Workload Group）时，无论其配置配额如何，都将获得 100% 的计算集群（Warehouse）资源。