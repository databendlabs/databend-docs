---
title: Deploy Query Service
---

## Overview

The Query Service is the main component of Databend that handles SQL queries and data processing. This guide will walk you through the process of deploying a Query Service node.

## Prerequisites

- Completed the [Prepare Package Environment](01-prepare.md) steps
- Have the extracted Databend package ready
- Have sudo privileges
- Have a running Meta Service node (completed [Deploy Meta Service](02-deploy-metasrv.md))

## Install Binary Files

1. Copy the Query Service binary to the system binary directory:
   ```bash
   sudo cp bin/databend-query /usr/bin/
   sudo chmod +x /usr/bin/databend-query
   ```

2. Copy the BendSQL client binary:
   ```bash
   sudo cp bin/bendsql /usr/bin/
   sudo chmod +x /usr/bin/bendsql
   ```

## Configure Query Service

1. Navigate to the extracted package directory and copy the default configuration:
   ```bash
   sudo mkdir -p /etc/databend
   sudo cp configs/databend-query.toml /etc/databend/databend-query.toml
   ```

2. Edit the configuration file:
   ```bash
   sudo vim /etc/databend/databend-query.toml
   ```

   The default configuration looks like this:
   ```toml
   [query]
   max_active_sessions = 256
   shutdown_wait_timeout_ms = 5000
   flight_api_address = "0.0.0.0:9091"
   admin_api_address = "0.0.0.0:8080"
   metric_api_address = "0.0.0.0:7070"
   mysql_handler_host = "0.0.0.0"
   mysql_handler_port = 3307
   clickhouse_http_handler_host = "0.0.0.0"
   clickhouse_http_handler_port = 8124
   http_handler_host = "0.0.0.0"
   http_handler_port = 8000
   flight_sql_handler_host = "0.0.0.0"
   flight_sql_handler_port = 8900
   tenant_id = "default" # change as needed (Optional)
   cluster_id = "default" # change as needed (Optional)

   [[query.users]] # uncomment this block to enable default built-in user "root"
   name = "root"
   auth_type = "no_password"

   [log]
   [log.file]
   level = "WARN"
   format = "text"
   dir = "/var/log/databend"

   [meta]
   endpoints = ["0.0.0.0:9191"] # change this to the address of all your Meta Service nodes
   username = "root"
   password = "root"
   client_timeout_in_second = 10
   auto_sync_interval = 60

   # (Important) Change this to your own storage configs
   [storage]
   # fs | s3 | azblob | gcs | oss | cos | hdfs | webhdfs
   type = "fs"

   [storage.fs]
   data_path = "/var/lib/databend/data"

   # To use an Amazon S3-like storage service
   [storage.s3]
   bucket = "<your-bucket-name>"
   endpoint_url = "<your-endpoint>"
   access_key_id = "<your-key-id>"
   secret_access_key = "<your-account-key>"
   enable_virtual_host_style = false

   [cache]
   data_cache_storage = "none" # change this to "disk" if you want to enable local disk cache

   [cache.disk]
   path = "/var/lib/databend/cache"
   max_bytes = 21474836480
   ```

   Modify the following settings based on your environment:
   - `[meta].endpoints`: The addresses of your Meta Service nodes (format: ["host:port"])
   - `[storage]`: The storage type and configs to store your data. Each tenant should have its own storage configs (Important)
   - `[query].users`: The users for Query Service authentication, you may comment this block later after you have created your own users (Optional)
   - `[query].tenant_id`: The tenant ID for multi-tenant deployment (Optional)
   - `[query].cluster_id`: The cluster ID for multi-cluster deployment (Optional)
   - `[cache]`: The cache configs to use (Optional)

## Set Up Systemd Service

1. Copy the systemd service file:
   ```bash
   sudo cp systemd/databend-query.service /etc/systemd/system/
   ```

2. Copy the default environment file:
   ```bash
   sudo cp systemd/databend-query.default /etc/default/databend-query
   ```

3. Edit the environment file (Optional):
   ```bash
   sudo vim /etc/default/databend-query
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
   sudo systemctl enable databend-query
   ```

## Start Query Service

1. Start the Query Service:
   ```bash
   sudo systemctl start databend-query
   ```

2. Check the service status:
   ```bash
   sudo systemctl status databend-query
   ```

3. View the logs:
   ```bash
   sudo journalctl -u databend-query -f
   ```

## Verify Query Service

1. Check if the Query Service is listening on the configured ports:
   ```bash
   sudo netstat -tulpn | grep databend-query
   ```

2. Test the HTTP endpoint:
   ```bash
   curl http://127.0.0.1:8000/health
   ```

   You should receive a response indicating the service is healthy.

3. Test with BendSQL:
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

## Troubleshooting

If you encounter issues:

1. Check the service status:
   ```bash
   sudo systemctl status databend-query
   ```

2. View the logs for detailed error messages:
   ```bash
   # View systemd logs
   sudo journalctl -u databend-query -f

   # View log files in /var/log/databend
   sudo tail -f /var/log/databend/databend-query-*.log
   ```

3. Common issues and solutions:
   - Permission denied: Ensure the databend user has proper permissions in previous steps
   - Port already in use: Check if another service is using the configured ports
   - Configuration errors: Verify the configuration file syntax and paths
   - Meta Service connection issues: Ensure the Meta Service is running and accessible

## Next Steps

Now that you have deployed both Meta Service and Query Service, you can proceed to:
- [Scale Query Service Nodes](05-scale-query.md) (for multi-node deployment)
- [Upgrade Query Service](07-upgrade-query.md) 
