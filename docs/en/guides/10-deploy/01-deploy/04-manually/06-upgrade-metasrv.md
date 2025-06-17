---
title: Upgrade Meta Service
---

## Overview

This guide will walk you through the process of upgrading your Databend Meta Service to a newer version. The upgrade process involves downloading the new release package, replacing the binary, and restarting the service.

## Download New Release

1. Follow the download instructions in [Prepare Package Environment](01-prepare.md) to download the new release package.

2. Extract the package:
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## Upgrade Meta Service

1. Replace the binary files:
   ```bash
   sudo cp bin/databend-meta /usr/bin/
   sudo cp bin/databend-metactl /usr/bin/
   sudo chmod +x /usr/bin/databend-meta
   sudo chmod +x /usr/bin/databend-metactl
   ```

2. Restart the Meta Service:
   ```bash
   sudo systemctl restart databend-meta
   ```

3. Check the service status:
   ```bash
   sudo systemctl status databend-meta
   ```

4. Verify the upgrade:
   ```bash
   curl http://127.0.0.1:28002/v1/health
   ```

## Troubleshooting

If you encounter issues during the upgrade:

1. Check the service status:
   ```bash
   sudo systemctl status databend-meta
   ```

2. View the logs for detailed error messages:
   ```bash
   sudo journalctl -u databend-meta -f
   ```

3. If the upgrade fails, you can rollback by:
   - Restoring the previous binary
   - Restarting the service

## Next Steps

After successfully upgrading the Meta Service, you can:
- [Scale Meta Service Nodes](04-scale-metasrv.md) (for multi-node deployment)
- [Upgrade Query Service](07-upgrade-query.md) (if needed) 
