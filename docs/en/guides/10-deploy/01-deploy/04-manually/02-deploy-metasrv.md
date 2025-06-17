---
title: Deploy Meta Service
---

## Overview

The Meta Service is a critical component of Databend that manages metadata and cluster coordination. This guide will walk you through the process of deploying a Meta Service node.

## Prerequisites

- Completed the [Prepare Package Environment](01-prepare.md) steps
- Have the extracted Databend package ready
- Have sudo privileges

## Install Binary Files

1. Copy the Meta Service binary to the system binary directory:
   ```bash
   sudo cp bin/databend-meta /usr/bin/
   sudo chmod +x /usr/bin/databend-meta
   ```

2. Copy the Meta Service control tool binary:
   ```bash
   sudo cp bin/databend-metactl /usr/bin/
   sudo chmod +x /usr/bin/databend-metactl
   ```

## Configure Meta Service

1. Navigate to the extracted package directory and copy the default configuration:
   ```bash
   sudo mkdir -p /etc/databend
   sudo cp configs/databend-meta.toml /etc/databend/databend-meta.toml
   ```

2. Edit the configuration file:
   ```bash
   sudo vim /etc/databend/databend-meta.toml
   ```

   The default configuration looks like this:
   ```toml
   admin_api_address       = "0.0.0.0:28002"
   grpc_api_address        = "0.0.0.0:9191"
   grpc_api_advertise_host = "localhost" # change this

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [raft_config]
   id            = 0 # keep this as 0 for single-node deployment or first node in cluster
   raft_dir      = "/var/lib/databend/raft"
   raft_api_port = 28004
   raft_listen_host = "0.0.0.0"
   raft_advertise_host = "localhost" # change this
   single        = true # keep this as true for single-node deployment or first node in cluster
   ```

   Modify the following settings based on your environment:
   - `grpc_api_advertise_host`: The hostname or IP address for gRPC communication, should be the same as the host name or IP address of the machine.
   - `raft_advertise_host`: The hostname or IP address that other nodes will use to connect, should be the same as the host name or IP address of the machine.

## Set Up Systemd Service

1. Copy the systemd service file:
   ```bash
   sudo cp systemd/databend-meta.service /etc/systemd/system/
   ```

2. Copy the default environment file:
   ```bash
   sudo cp systemd/databend-meta.default /etc/default/databend-meta
   ```

3. Edit the environment file (Optional):
   ```bash
   sudo vim /etc/default/databend-meta
   ```

   Set the following variables when needed (Optional):
   ```bash
   RUST_BACKTRACE=1 # enable backtrace for debugging
   ```

4. Reload systemd to recognize the new service:
   ```bash
   sudo systemctl daemon-reload
   ```

5. Enable the service to start on boot:
   ```bash
   sudo systemctl enable databend-meta
   ```

## Start Meta Service

1. Start the Meta Service:
   ```bash
   sudo systemctl start databend-meta
   ```

2. Check the service status:
   ```bash
   sudo systemctl status databend-meta
   ```

3. View the logs:
   ```bash
   sudo journalctl -u databend-meta -f
   ```

## Verify Meta Service

1. Check if the Meta Service is listening on the configured ports:
   ```bash
   sudo netstat -tulpn | grep databend-meta
   ```

2. Test the admin API endpoint:
   ```bash
   curl http://127.0.0.1:28002/v1/health
   ```

   You should receive a response indicating the service is healthy.

3. Check the Meta Service status using metactl:
   ```bash
   databend-metactl --status
   ```

   You should see the current status of the Meta Service, including:
   - Node ID
   - Raft status
   - Leader information
   - Cluster configuration

## Troubleshooting

If you encounter issues:

1. Check the service status:
   ```bash
   sudo systemctl status databend-meta
   ```

2. View the logs for detailed error messages:
   ```bash
   sudo journalctl -u databend-meta -f
   ```

3. Common issues and solutions:
   - Permission denied: Ensure the databend user has proper permissions in previous steps
   - Port already in use: Check if another service is using the configured ports
   - Configuration errors: Verify the configuration file syntax and paths

## Next Steps

Now that you have deployed the Meta Service, you can proceed to:
- [Deploy Query Service](03-deploy-query.md)
- [Scale Meta Service Nodes](04-scale-metasrv.md) (for multi-node deployment) 
