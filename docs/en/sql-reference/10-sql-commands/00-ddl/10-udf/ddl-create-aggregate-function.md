---
title: CREATE AGGREGATE FUNCTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Creates a user-defined aggregate function (UDAF) that runs inside Databend's JavaScript or Python runtime.

### Supported Languages

- `javascript`
- `python`

## Syntax

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

| Parameter | Description |
| --- | --- |
| `<function_name>` | Name of the aggregate function. |
| `<parameter_list>` | Optional comma-separated list of input parameters and types (for example `value DOUBLE`). |
| `STATE { <state_field_list> }` | Struct definition that Databend stores between partial/final aggregation steps (for example `STATE { sum DOUBLE, count DOUBLE }`). |
| `<return_type>` | Data type returned by the aggregate (`DOUBLE`, `INT`, etc.). |
| `LANGUAGE` | Runtime used to execute the script. Supported values: `javascript`, `python`. |
| `IMPORTS` / `PACKAGES` | Accepted by the statement syntax, but local Python aggregates do not install packages or imports. Do not rely on these clauses for Python UDAF dependencies. |
| `<language_specific_code>` | Script body that must expose `create_state`, `accumulate`, `merge`, and `finish` entry points. |
| `DESC` | Optional description. |

The script must implement these functions:

- `create_state()` – allocate and return an initial state object.
- `accumulate(state, *args)` – update the state for each input row.
- `merge(state1, state2)` – merge two partial states.
- `finish(state)` – produce the final result (return `None` for SQL `NULL`).

## Runtime Restrictions

Since v1.2.957, Python UDAFs run in the same query-owned worker pool, OS sandbox, and quotas as scalar Python UDFs. Aggregate state remains in the query process and travels with worker requests. Workers are not reused across queries.

- `enable_udf_python_script` must allow Python at creation, binding, and execution.
- `enable_udf_sandbox = true` selects an external service for scalar Python functions. That service has no aggregate API, so Python UDAFs are rejected in that mode. This setting is not a bypass for the mandatory local OS sandbox.
- Linux deployment and dependency-installation boundaries are described in [CREATE SCALAR FUNCTION](ddl-create-function.md#python). macOS is for local development only and does not provide the OS sandbox.
- Python worker count and request timeouts do not enforce a worker memory limit. See [Script UDF Resources](/guides/self-hosted/references/node-config/query-config#script-udf-resources).
- JavaScript UDAFs use the configured in-process heap and operation deadline, including `create_state`, `accumulate`, `merge`, and `finish`.
- WASM aggregate functions are not supported.

## Access control requirements

| Privilege | Object Type   | Description    |
|:----------|:--------------|:---------------|
| SUPER     | Global, Table | Operates a UDF |

To create a user-defined function, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the SUPER [privilege](/guides/security/access-control/privileges).

## Controlled Python HTTP(S) Access

<FunctionDescription description="Introduced or updated: Unreleased"/>

For a local Python aggregate, append `EXTERNAL_ACCESS_INTEGRATIONS = (<integration_name>, ...)` after the closing `$$`. The operator must enable `query.enable_python_udf_external_access` on every executing node. Creating or altering the definition also requires `USAGE` on every named integration, in addition to existing privileges. JavaScript does not support this binding.

The Linux worker sandbox remains mandatory. Use approved HTTP(S) destinations through synchronous proxy-aware clients, not native sockets. See [Local Python UDF Access](/guides/security/external-access-integration#local-python-udf-access) for setup, examples, revocation, and network limits. The average examples below do not use external access and remain unchanged.

## Examples

### Python average UDAF

The following Python aggregate computes the average of a column:

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

### JavaScript average UDAF

The next example shows the same calculation implemented in JavaScript:

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
