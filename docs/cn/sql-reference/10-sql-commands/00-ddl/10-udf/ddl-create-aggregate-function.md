---
title: CREATE AGGREGATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

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
| `IMPORTS` / `PACKAGES` | 语句语法接受这些子句，但本地 Python 聚合函数不会安装包或导入文件。不要依赖这些子句提供 Python UDAF 依赖。 |
| `<language_specific_code>` | 脚本主体，必须实现并暴露 `create_state`、`accumulate`、`merge` 和 `finish` 入口函数。 |
| `DESC` | 可选描述。 |

脚本需要实现以下函数：

- `create_state()` – 分配并返回初始状态对象。
- `accumulate(state, *args)` – 针对每个输入行更新状态。
- `merge(state1, state2)` – 合并两个部分聚合状态。
- `finish(state)` – 生成最终结果（返回 `None` 表示 SQL `NULL`）。

## 运行时限制

从 v1.2.957 开始，Python UDAF 与 Python 标量 UDF 使用相同的查询专属 Worker 池、OS 沙箱和配额。聚合状态保留在 Query 进程中，并随 Worker 请求传递。Worker 不会跨查询复用。

- 在创建、绑定和执行时，`enable_udf_python_script` 都必须允许 Python。
- `enable_udf_sandbox = true` 会为 Python 标量函数选择外部服务。该服务没有聚合 API，因此此模式下会拒绝 Python UDAF。此设置不能绕过强制使用的本地 OS 沙箱。
- Linux 部署和依赖安装边界请参阅 [CREATE SCALAR FUNCTION](ddl-create-function.md#python)。macOS 仅用于本地开发，不提供 OS 沙箱。
- Python Worker 数量和请求超时不会强制设置 Worker 内存上限。请参阅[脚本 UDF 资源](/guides/self-hosted/references/node-config/query-config#script-udf-resources)。
- JavaScript UDAF 使用配置的进程内堆限制和操作截止时间，覆盖 `create_state`、`accumulate`、`merge` 和 `finish`。
- 不支持 WASM 聚合函数。

## 访问控制要求

| 权限 | 对象类型 | 描述 |
|:-----|:---------|:-----|
| SUPER | 全局、表 | 操作 UDF |

创建 UDF 的用户或其 [current_role](/guides/security/access-control/roles) 必须拥有 SUPER [权限](/guides/security/access-control/privileges)。

## Python 受控 HTTP(S) 访问

<FunctionDescription description="Introduced or updated: Unreleased"/>

对于本地 Python 聚合函数，在结束 `$$` 后添加 `EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...)`。Operator 必须在每个执行节点启用 `query.enable_python_udf_external_access`。创建或修改定义时，除满足原有权限要求外，还需每个被引用 integration 的 `USAGE`。JavaScript 不支持此绑定。

Linux worker 沙箱仍为强制要求。请通过支持代理的同步客户端访问获准的 HTTP(S) 目标，而非使用原生 socket。配置、示例、撤销方式和网络限制见[本地 Python UDF 访问](/guides/security/external-access-integration#本地-python-udf-访问)。下方平均值示例不使用外部访问，内容保持不变。

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
