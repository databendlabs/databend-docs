---
title: CREATE AGGREGATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.799"/>

创建用户自定义聚合函数（UDAF），在 Databend 内置的 JavaScript 或 Python 运行时中执行。

### 支持的语言

- `javascript`
- `python`

## 语法

```sql
CREATE [ OR REPLACE ] FUNCTION [ IF NOT EXISTS ] <function_name>
    ( [ <parameter_list> ] )
    STATE { <state_field_list> }
    RETURNS <return_type>
    LANGUAGE <language_name>
    [ IMPORTS = (<stage_files>) ]
    [ PACKAGES = (<python_packages>) ]
AS $$
<language_specific_code>
$$
[ DESC='<description>' ]
```

| 参数 | 说明 |
| --- | --- |
| `<function_name>` | 聚合函数名称。 |
| `<parameter_list>` | 可选的输入参数及其类型，例如 `value DOUBLE`。 |
| `STATE { <state_field_list> }` | 定义聚合过程中需要在部分聚合和最终聚合步骤间持久化的状态结构（例如 `STATE { sum DOUBLE, count DOUBLE }`）。 |
| `<return_type>` | 聚合返回的数据类型。 |
| `LANGUAGE` | 运行脚本的语言，支持 `javascript`、`python`。 |
| `IMPORTS` / `PACKAGES` | 可选列表，用于加载额外文件（imports）或 PyPI 包（仅限 Python）。 |
| `<language_specific_code>` | 脚本主体，必须实现并暴露 `create_state`、`accumulate`、`merge` 和 `finish` 入口函数。 |
| `DESC` | 可选描述。 |

脚本需要实现以下函数：

- `create_state()` – 分配并返回初始状态对象。
- `accumulate(state, *args)` – 针对每个输入行更新状态。
- `merge(state1, state2)` – 合并两个部分聚合状态。
- `finish(state)` – 生成最终结果（返回 `None` 表示 SQL `NULL`）。

## 访问控制要求

| 权限 | 对象类型 | 描述 |
|:-----|:---------|:-----|
| SUPER | 全局、表 | 操作 UDF |

创建 UDF 的用户或其 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [权限](/guides/security/access-control/privileges)。

## 示例

### Python 平均值 UDAF

以下 Python 聚合函数示例用于计算列的平均值：

```sql
CREATE OR REPLACE FUNCTION py_avg (value DOUBLE)
    STATE { sum DOUBLE, count DOUBLE }
    RETURNS DOUBLE
    LANGUAGE python
AS $$
class State:
    def __init__(self):
        self.sum = 0.0
        self.count = 0.0

def create_state():
    return State()

def accumulate(state, value):
    if value is not None:
        state.sum += value
        state.count += 1
    return state

def merge(state1, state2):
    state1.sum += state2.sum
    state1.count += state2.count
    return state1

def finish(state):
    if state.count == 0:
        return None
    return state.sum / state.count
$$;

SELECT py_avg(number) AS avg_val FROM numbers(5);
```

```
+---------+
| avg_val |
+---------+
|       2 |
+---------+
```

### JavaScript 平均值 UDAF

下面示例演示如何使用 JavaScript 完成相同的平均值计算：

```sql
CREATE OR REPLACE FUNCTION js_avg (value DOUBLE)
    STATE { sum DOUBLE, count DOUBLE }
    RETURNS DOUBLE
    LANGUAGE javascript
AS $$
export function create_state() {
    return { sum: 0, count: 0 };
}

export function accumulate(state, value) {
    if (value !== null) {
        state.sum += value;
        state.count += 1;
    }
    return state;
}

export function merge(state1, state2) {
    state1.sum += state2.sum;
    state1.count += state2.count;
    return state1;
}

export function finish(state) {
    if (state.count === 0) {
        return null;
    }
    return state.sum / state.count;
}
$$;

SELECT js_avg(number) AS avg_val FROM numbers(5);
```

```
+---------+
| avg_val |
+---------+
|       2 |
+---------+
```
