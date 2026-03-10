---
title: Upgrade Query Service
---

## Overview

This guide will walk you through the process of upgrading your Databend Query Service to a newer version. The upgrade process involves downloading the new release package, replacing the binary, and restarting the service.

## Download New Release

1. Follow the download instructions in [Prepare Package Environment](01-prepare.md) to download the new release package.

2. Extract the package:
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## Upgrade Query Service

1. Replace the binary files:
   ```bash
   sudo cp bin/databend-query /usr/bin/
   sudo cp bin/bendsql /usr/bin/
   sudo chmod +x /usr/bin/databend-query
   sudo chmod +x /usr/bin/bendsql
   ```

2. Restart the Query Service:
   ```bash
   sudo systemctl restart databend-query
   ```

3. Check the service status:
   ```bash
   sudo systemctl status databend-query
   ```

4. Verify the upgrade:
   ```bash
   bendsql -h 127.0.0.1 -u root
   ```

   After connecting, you can check the version:
   ```sql
   SELECT version();
   ```

## Troubleshooting

If you encounter issues during the upgrade:

1. Check the service status:
   ```bash
   sudo systemctl status databend-query
   ```

2. View the logs for detailed error messages:
   ```bash
   sudo journalctl -u databend-query -f
   ```

3. If the upgrade fails, you can rollback by:
   - Restoring the previous binary
   - Restarting the service

## Next Steps

After successfully upgrading the Query Service, you can:
- [Scale Query Service Nodes](05-scale-query.md) (for multi-node deployment)
- [Upgrade Meta Service](06-upgrade-metasrv.md) (if needed) 
