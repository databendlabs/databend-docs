---
title: Back Up and Restore Databend Meta Service Cluster
sidebar_label: Backup and Restore Meta Service
description: How to back up and restore Meta Service cluster data
---

This guideline will introduce how to back up and restore the meta service cluster data.

## Export Data From Meta Service

It supports to export from a databend-meta data dir or from a running databend-meta server.

### Export from a running server

Similar to exporting from data dir, but with the service endpoint argument `--grpc-api-address <ip:port>` in place of the `--raft-dir`,
where `<ip:port>` is the `grpc_api_address` in [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml), e.g.:

```shell
databend-metactl export --grpc-api-address "127.0.0.1:9191" --db <output_fn>

# tail "<output_fn>"
# ["state_machine/0",{"Nodes":{"key":2,"value":{"name":"","endpoint":{"addr":"localhost","port":28203}}}}]
# ...
```

### Export from data dir

Shutdown the `databend-meta` service.

Then export sled DB from the dir(`<your_meta_dir>`) in which the `databend-meta` stores meta to a local file `output_fn`, in multi-line JSON format.
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

The following command rebuild a meta service db in `<your_meta_dir>` from
exported metadata:

```sh
databend-metactl import --raft-dir "<your_meta_dir>" --db <output_fn>

databend-meta --raft-dir "<your_meta_dir>" ...
```

Note: without the `--db` argument, the import data come from stdio instead, like:

```sh
cat "<output_fn>" | databend-metactl import --raft-dir "<your_meta_dir>"
```

**Caveat**: Data in `<your_meta_dir>` will be cleared.

## Import data as a new databend-meta cluster

With specifies the `--initial-cluster` argument, the `databend-metactl` can import the data as a new cluster.
The `--initial-cluster` format is: `node_id=raft_advertise_host:raft_api_port`, each node config is separated by space, the meaning of `raft_advertise_host`,`raft_api_port` is the same in raft config.

E.g.:

```
databend-metactl import --raft-dir ./.databend/new_meta1 --id=1 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta2 --id=2 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
databend-metactl import --raft-dir ./.databend/new_meta3 --id=3 --db meta.db --initial-cluster 1=localhost:29103 --initial-cluster 2=localhost:29203 --initial-cluster 3=localhost:29303
```

The script above imports the exported data from `meta.db` and initializes the three cluster nodes: id 1, which raft directory is `./.databend/new_meta1`, and so are id 2 and 3 with different raft directory.
Note that the `--initial-cluster` argument in these three command line is the same.

After that, can start a new three nodes databend-meta cluster with the new config and imported data.
