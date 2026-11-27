---
title: How to Profile Databend
---

import FunctionDescription from '@site/src/components/FunctionDescription';

## CPU profiling

```
go tool pprof -http="0.0.0.0:8081" http://localhost:8080/debug/pprof/profile?seconds=30
```

Open `<your-ip>:8081` and select `Flame Graph` from the VIEW menus in the site header:
<img alt="CPU profiling" src="https://user-images.githubusercontent.com/172204/208336392-5b64bb9b-cce8-4562-9e05-c3d538e9d8a6.png"/>

## Query Level CPU Profiling

`EXPLAIN PERF <statement>` can also be used for CPU profiling, which focuses on a specific query and gathers CPU profiling data from other nodes to help analyze query performance. Check [EXPLAIN PERF](/sql/sql-commands/explain-cmds/explain-perf) for more details.

## Profile an Already Running Query

<FunctionDescription description="Introduced or updated: Unreleased"/>

Use the Query Admin API to collect CPU samples after a slow query starts. You do not need to rerun the query with `EXPLAIN PERF`. Use a trusted admin connection. Do not expose the admin port to public networks. These endpoints are not on the SQL HTTP port.

1. Open `/v1/processlist` on the Query Admin API address, such as `http://127.0.0.1:8080`.
2. Copy the running query's `current_query_id`.
3. Open `/v1/queries/<query_id>/perf` on the same address.
4. Start sampling in the viewer.
5. Stop sampling when you have enough data.

The viewer refreshes the cumulative flamegraph every 30 seconds by default. Each cluster node has a separate flamegraph. You can also use the API directly:

```shell
ADMIN_URL='http://127.0.0.1:8080'
QUERY_ID='replace-with-current-query-id'
PERF_URL="$ADMIN_URL/v1/queries/$QUERY_ID/perf"

curl -sS -X POST "$PERF_URL/start?frequency=99&seconds=300"
curl -sS "$PERF_URL/status"
# Allow time to collect samples, then stop and download them.
curl -sS -X POST "$PERF_URL/stop"
curl -fS "$PERF_URL/flamegraph?format=html" -o query-flamegraph.html
```

Open `query-flamegraph.html` in a browser. To export folded stacks for other profiling tools, use `GET .../flamegraph?format=folded`.

| Target | Base path | Default sampling | Maximum duration |
|---|---|---|---|
| One running query | `/v1/queries/<query_id>/perf` | 99 Hz for 300 seconds | 3,600 seconds |
| All threads on all cluster nodes | `/v1/perf` | 49 Hz for 60 seconds | 600 seconds |

Both base paths support the viewer, `POST /start`, `POST /stop`, `GET /status`, and `GET /flamegraph`. Whole-process sampling can cost more than query sampling. Use a short interval first. Its overhead on a large Linux host has not been measured.

### Interpret Results and Limits

- Check each entry in the response's `nodes` object. A `200 OK` response does not mean every node started sampling. Read each node's `state` and `message`.
- If the query runs nowhere and no profile remains, `nodes` can be empty. A missing query does not by itself cause `404`. The HTML flamegraph returns `404` when no samples exist. Folded output can be empty.
- Each node permits one active CPU profiler. Query sampling, whole-process sampling, `EXPLAIN PERF`, and `/debug/pprof/profile` compete for it. Finish the active session before you start another.
- Samples accumulate from the start. Stop and restart to inspect a recent interval. Restarting replaces the previous samples.
- Query fragments that start on a node after sampling begins are not included there. A short query can finish before enough samples are collected.

## Memory profiling

`databend-query` and `databend-meta` can be built optionally with `jemalloc`,
which provides various memory profiling features.

Currently, it does not work on Mac, with either intel or Arm.

### Enable memory profiling

1. Build `databend-query` with `memory-profiling` feature enabled:

```
cargo build --bin databend-query --release --features memory-profiling
```

2. Fire up `databend`, using environment variable `MALLOC_CONF` to enable memory profiling:

```
MALLOC_CONF=prof:true,lg_prof_interval:30 ./target/release/databend-query
```

### Generate heap profile

Generate a call graph in `pdf` illustrating memory allocation during this interval:

```
jeprof --pdf ./target/release/databend-query heap.prof > heap.pdf
```

<img alt="Generate heap profile" src="https://user-images.githubusercontent.com/172204/204963954-f6eacf10-d8bd-4469-9c8d-7d30955f1a78.png" width="600"/>

### Fast jeprof

jeprof is very slow for large heap analysis, the bottleneck is `addr2line`, if you want to speed up from **30 minutes to 3s**, please use :

```
git clone https://github.com/gimli-rs/addr2line
cd addr2line
cargo b --examples -r
cp ./target/release/examples/addr2line <your-addr2line-find-with-whereis-addr2line>
```
