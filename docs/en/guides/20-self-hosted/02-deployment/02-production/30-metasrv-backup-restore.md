---
title: Back Up and Restore Databend Meta Service Cluster
sidebar_label: Backup and Restore Meta Service
description: How to back up and restore Meta Service cluster data
---

This guideline will introduce how to back up and restore the meta service cluster data.

## Export Data From databend-meta

It supports to export either from a databend-meta data dir or from a running databend-meta server.
Since Raft replicates the data to all nodes, it is enough to export from any one node.

### Export from running databend-meta

Similar to exporting from data dir, but with the service endpoint argument `--grpc-api-address <ip:port>` in place of the `--raft-dir`,
where `<ip:port>` is the `grpc_api_address` in [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml), e.g.:

```shell
databend-metactl export --grpc-api-address "127.0.0.1:9191" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ...
```

### Export from data dir

Shutdown the `databend-meta` service.

Then export the data from the dir(`<your_meta_dir>`) in which the `databend-meta` stores meta to a local file `output_fn`, in multi-line JSON format.
E.g., every line in the output file is a JSON of an exported key-value record.

```sh

databend-metactl export --raft-dir "<your_meta_dir>" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ["state_machine/0",{"Nodes":{"key":3,"value":{"name":"","endpoint":{"addr":"localhost","port":28303}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"LastApplied","value":{"LogId":{"term":1,"index":378}}}}]
# ["state_machine/0",{"StateMachineMeta":{"key":"Initialized","value":{"Bool":true}}}]
# ...
```

Note: without the `--db` argument, the exported data will output to the stdio instead.

## Restore a databend-meta

To restore a databend-meta node, use the following command.

```sh
databend-metactl import --raft-dir "<your_meta_dir>" --db <output_fn>

# Then it is ready to start the databend-meta node.
# databend-meta --raft-dir "<your_meta_dir>" ...
```

Note: without the `--db` argument, the import data come from stdio instead, like:

```sh
cat "<output_fn>" | databend-metactl import --raft-dir "<your_meta_dir>"
```

Note that the backup data contains node id,
so it is necessary to ensure the node id in the backup data is consistent with the node id in the restored databend-meta node.
To restore a different node, i.e., restore node-2 with the backup data of node-1, you need to specify the cluster config when importing, see the next section.

**Caveat**: Data in `<your_meta_dir>` will be cleared when importing.

## Import data as a new databend-meta cluster

With the `--initial-cluster` argument, the `databend-metactl` import the data and re-initialize the cluster info and node ids.
The `--initial-cluster` value format is: `<node_id>=<raft_advertise_host>:<raft_api_port>`,
`raft_advertise_host`,`raft_api_port` is the same as the fields in the toml config file.

For example, to restore a databend-meta cluster with three nodes:

```
databend-metactl import --raft-dir ./.databend/new_meta1 --db meta.db \
    --id=1 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta2 --db meta.db \
    --id=2 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta3 --db meta.db \
    --id=3 \
    --initial-cluster 1=localhost:29103 \
    --initial-cluster 2=localhost:29203 \
    --initial-cluster 3=localhost:29303
```

In the above commands, the cluster info are all identical.
But each databend-meta node has a different node id specified.

After that, it is ready to start a new three nodes databend-meta cluster.

## Dump Raft Log WAL

The `dump-raft-log-wal` subcommand inspects the raw Raft write-ahead log stored on disk. This is useful for diagnosing meta service issues.

```shell
databend-metactl dump-raft-log-wal --raft-dir .databend/meta1
```

### --decode-values

By default, protobuf-encoded values are displayed as raw bytes. Use the `--decode-values` (`-V`) flag to decode them into human-readable structs based on key prefixes (e.g., `__fd_database_by_id`, `__fd_roles`):

```shell
databend-metactl dump-raft-log-wal --raft-dir .databend/meta1 --decode-values
```

Example output:

```text
RaftLog:
ChunkId(00_000_000_000_000_000_000)
  R-00015: ... Append(... txn:TxnRequest{if:[...] then:[Put(Put key=__fd_database_by_id/1),...] else:[]})
    txn.if_then[0].put __fd_database_by_id/1:
      DatabaseMeta { engine: "", engine_options: {}, options: {}, ... }
    txn.if_then[1].put __fd_db_id_list/test_tenant/default:
      DbIdList { id_list: [1] }
```

### --raw

Use the `--raw` (`-R`) flag to display the raw protobuf bytes for values:

```shell
databend-metactl dump-raft-log-wal --raft-dir .databend/meta1 --raw
```

Both flags can be combined:

```shell
databend-metactl dump-raft-log-wal --raft-dir .databend/meta1 --decode-values --raw
```
