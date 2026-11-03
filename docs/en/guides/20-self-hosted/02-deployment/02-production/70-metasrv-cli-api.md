---
title: Databend Meta CLI
sidebar_label: Meta Service Command Line API
description:
    Access Databend Meta Service Cluster with Command Line Interface
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

The binary `databend-meta` provides several handy commands to access the KVApi of databend meta service.
`databend-meta --help` also includes a simple guide on using these CLI commands.

:::caution

These are low level API and should be avoided using if possible:


- Some data stored in databend-meta are correlated, adding or deleting may break these internal consistency.
  E.g., deleting a `database` when there are still `table`s belonging to it.

- Most data in databend-mate are raw bytes. Data interpreting is done on the client side, i.e., by databend-query.
  Modifying data may lead to compatibility issues.

:::

:::note

The command line API is limited that:
- only string key and string value are supported.
- `seq` is not supported.

:::


### Set `foo=bar`:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::upsert --key foo --value bar
```
Output is the state before and after applying this command:
```json
{
  "ident": null,
  "prev": {
    "seq": 18,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": {
    "seq": 20,
    "meta": null,
    "data": [ 98, 97, 114 ]
  }
}
```

### Set `foo=bar` and inform databend-meta to delete it after 5 seconds:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::upsert --key foo --value bar --expire-after 5
```
Output is the state before and after applying this command and `expire_at` is set.
```json
{
  "ident": null,
  "prev": {
    "seq": 20,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": {
    "seq": 21,
    "meta": {
      "expire_at": 1668996718
    },
    "data": [ 98, 97, 114 ]
  }
}
```

### Delete `foo`:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::delete --key foo
```
Output is the state before and after applying this command and `result` is always `null`.
```json
{
  "ident": null,
  "prev": {
    "seq": 22,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  "result": null
}
```


### Get `foo`:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::get --key foo
```
Output is the state of key `foo`.
```json
{
  "seq": 23,
  "meta": null,
  "data": [ 98, 97, 114 ]
}
```

### Get multiple keys with mget: `foo,bar,wow`:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::mget --key foo bar wow
```
Output is the states of every specified key.
```json
[
  {
    "seq": 23,
    "meta": null,
    "data": [ 98, 97, 114 ]
  },
  null,
  null
]
```

### List keys starting with `foo/`:
```shell
databend-meta --grpc-api-address 1.2.3.4:5678 --cmd kvapi::list --prefix foo/
```
Output is the key values of every key starting with `prefix`.
```json
[
  [
    "foo/a",
    {
      "seq": 24,
      "meta": null,
      "data": [ 98, 97, 114 ]
    }
  ],
  [
    "foo/b",
    {
      "seq": 25,
      "meta": null,
      "data": [ 119, 111, 119 ]
    }
  ]
]
```

## Lua gRPC Client Options

`databend-metactl lua` provides a separate Lua interface. Since v1.2.953, `metactl.new_grpc_client(address[, opts])` accepts an optional options table. Its default RPC timeout increased from 2 seconds to 60 seconds. This change does not set the timeout for every Meta Service CLI command or for the HTTP APIs.

The options table supports these fields. Omitted fields keep their defaults. Unknown fields cause an error.

| Field | Meaning | Default |
| --- | --- | --- |
| `timeout` | RPC timeout, in seconds | `60` |
| `auto_sync_interval` | Client synchronization interval, in seconds | `1` |
| `username` | gRPC username | Inherited from the CLI client configuration |
| `password` | gRPC password | Inherited from the CLI client configuration |
| `max_msg_size` | Maximum gRPC message size, in bytes | Client library default |

`timeout` and `auto_sync_interval` accept fractional seconds. Each value must be finite, positive, and representable as a nonzero duration. Negative values, zero, overflow, and values that round to zero are rejected.

The client inherits the configured credentials and TLS settings. The Lua table can override the credentials. It cannot override TLS. Configure TLS through the CLI client options, not through this table.

For a read-only example, save this script as `read-meta.lua`. Use a Meta Service endpoint that your existing client configuration can access.

```lua
local client = metactl.new_grpc_client("127.0.0.1:9191", {
    timeout = 120,
    auto_sync_interval = 2
})
local value, err = client:get("example/key")
assert(err == nil, tostring(err))
print(metactl.to_string(value))
```

Run the script with your configured client credentials and TLS settings:

```shell
databend-metactl lua --file read-meta.lua
```

A larger timeout allows more time for an RPC. It does not remove overload or make writes safe to retry. A timed-out write can still commit on the server.

Failed Lua client RPCs are logged at `WARN` with elapsed time. Successful calls that take at least 500 milliseconds are also logged at `WARN`. Use these logs to identify slow or failed calls. They are not a performance guarantee.
