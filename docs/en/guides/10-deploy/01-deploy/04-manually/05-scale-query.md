---
title: Scale Query Service Nodes
---

## Overview

This guide will walk you through the process of scaling your Databend Query Service cluster. You can either add new nodes (scale up) or remove existing nodes (scale down) from your cluster.

## Prerequisites

- Have completed [Deploy Query Service](03-deploy-query.md) and have a running Query Service node
- Have completed [Prepare Package Environment](01-prepare.md) on the new node (for scale up)
- Have sudo privileges on the nodes

## Scale Up: Add New Query Service Node

To add a new Query Service node, follow the steps in [Deploy Query Service](03-deploy-query.md) on the new node. Make sure to:

1. Copy the configuration from an existing node:
   ```bash
   sudo mkdir -p /etc/databend
   sudo scp root@<existing-node-ip>:/etc/databend/databend-query.toml /etc/databend/
   ```

2. Follow the deployment steps in [Deploy Query Service](03-deploy-query.md) to install and start the service.

3. After deployment, verify the new node is added to the cluster:
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

   ```sql
   SELECT * FROM system.clusters;
   ```

## Scale Down: Remove Query Service Node

To remove a Query Service node from the cluster, simply stop the service on that node:

```bash
sudo systemctl stop databend-query
```

The node will be automatically removed from the cluster. You can verify the cluster status from any remaining node:

```bash
bendsql -h 127.0.0.1 -u root
```

```sql
SELECT * FROM system.clusters;
```

## Troubleshooting

If you encounter issues:

1. Check the service status:
   ```bash
   sudo systemctl status databend-query
   ```

2. View the logs for detailed error messages:
   ```bash
   sudo journalctl -u databend-query -f
   ```

3. Common issues and solutions:
   - Permission denied: Ensure the databend user has proper permissions
   - Port already in use: Check if another service is using the configured ports
   - Configuration errors: Verify the configuration file syntax and paths
   - Meta Service connection issues: Ensure the Meta Service is accessible from the new node

## Next Steps

After successfully scaling your Query Service cluster, you can:
- [Scale Meta Service Nodes](04-scale-metasrv.md) (if needed)
- [Upgrade Query Service](07-upgrade-query.md) (if needed) 
