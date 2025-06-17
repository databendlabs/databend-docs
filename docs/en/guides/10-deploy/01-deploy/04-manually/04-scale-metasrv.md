---
title: Scale Meta Service Nodes
---

## Overview

This guide will walk you through the process of scaling your Databend Meta Service cluster. You can either add new nodes (scale up) or remove existing nodes (scale down) from your cluster.

## Prerequisites

- Have completed [Deploy Meta Service](02-deploy-metasrv.md) and have a running Meta Service node
- Have completed [Prepare Package Environment](01-prepare.md) on the new node (for scale up)
- Have sudo privileges on the nodes

## Scale Up: Add New Meta Service Node

To add a new Meta Service node, follow the steps in [Deploy Meta Service](02-deploy-metasrv.md) on the new node. Make sure to:

1. Copy the configuration from an existing node:
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-meta.toml /etc/databend/
   ```

2. Modify the configuration file:
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   Update the following settings:
   ```toml
   [raft_config]
   id = 1  # Change this to a unique ID for each node (1, 2, 3, etc.)
   single = false  # Change this to false for multi-node deployment
   join = ["127.0.0.1:28004"]  # Add all existing Meta Service nodes here
   ```

3. Follow the deployment steps in [Deploy Meta Service](02-deploy-metasrv.md) to install and start the service on the new node.

4. Verify the new node is added to the cluster:
   ```bash
   databend-metactl status
   ```

5. After confirming the new node is in the cluster, update the configuration on all existing nodes:
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   On each existing node, update the following settings:
   ```toml
   [raft_config]
   single = false  # Change this to false
   join = ["127.0.0.1:28004", "127.0.0.2:28004", "127.0.0.3:28004"]  # Add all Meta Service nodes including the new one
   ```

6. Update the Meta Service endpoints in all Query nodes' configuration:
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   Update the following settings in each Query node:
   ```toml
   [meta]
   endpoints = ["127.0.0.1:9191", "127.0.0.2:9191", "127.0.0.3:9191"]  # Add all Meta Service nodes including the new one
   ```

## Scale Down: Remove Meta Service Node

To remove a Meta Service node from the cluster, follow these steps:

1. First, check if the node to be removed is the current leader:
   ```bash
   databend-metactl status
   ```
   Look for the "leader" information in the output. If the node to be removed is the leader, you need to transfer leadership first.

2. If the node is the leader, transfer leadership to another node:
   ```bash
   databend-metactl transfer-leader
   ```

3. Verify the leadership transfer:
   ```bash
   databend-metactl status
   ```
   Confirm that the leadership has been transferred to the target node.

4. Now, gracefully remove the node from the cluster using the `databend-meta` command:
   ```bash
   databend-meta --leave-id <node_id_to_remove> --leave-via <node_addr_1> <node_addr_2>...
   ```

   For example, to remove node with ID 1:
   ```bash
   databend-meta --leave-id 1 --leave-via 127.0.0.1:28004
   ```

   Note:
   - `--leave-id` specifies the ID of the node to remove
   - `--leave-via` specifies the list of node advertise addresses to send the leave request to
   - The command can be run from any node with `databend-meta` installed
   - The node will be blocked from cluster interaction until the leave request is completed

5. Check if the node has been successfully removed from the cluster:
   ```bash
   databend-metactl status
   ```
   Verify that the node ID is no longer listed in the cluster members.

6. After confirming the node is removed from the cluster, stop the service:
   ```bash
   sudo systemctl stop databend-meta
   ```

7. Verify the cluster status from any remaining node:
   ```bash
   databend-metactl status
   ```

8. After confirming the cluster is stable, update the configuration on all remaining Meta nodes:
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   On each remaining node, update the following settings:
   ```toml
   [raft_config]
   join = ["127.0.0.2:28004", "127.0.0.3:28004"]  # Remove the leaving node from the list
   ```

9. Update the Meta Service endpoints in all Query nodes' configuration:
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   Update the following settings in each Query node:
   ```toml
   [meta]
   endpoints = ["127.0.0.2:9191", "127.0.0.3:9191"]  # Remove the leaving node from the list
   ```

## Troubleshooting

If you encounter issues:

1. Check the service status:
   ```bash
   sudo systemctl status databend-meta
   ```

2. View the logs for detailed error messages:
   ```bash
   # View systemd logs
   sudo journalctl -u databend-meta -f

   # View log files in /var/log/databend
   sudo tail -f /var/log/databend/databend-meta-*.log
   ```

3. Common issues and solutions:
   - Permission denied: Ensure the databend user has proper permissions
   - Port already in use: Check if another service is using the configured ports
   - Configuration errors: Verify the configuration file syntax and paths
   - Raft connection issues: Ensure all Meta Service nodes can communicate with each other

## Next Steps

After successfully scaling your Meta Service cluster, you can:
- [Scale Query Service Nodes](05-scale-query.md) (if needed)
- [Upgrade Meta Service](06-upgrade-metasrv.md) (if needed) 
