---
title: Deploy and Maintain Manually

---

## Overview

In this guide, you will learn how to deploy Databend manually using the pre-built packages from GitHub releases. This step-by-step guide will walk you through the entire process of setting up and managing your Databend cluster using systemd for service management. The deployment process involves:

1. Downloading and extracting the Databend package from GitHub releases
2. Configuring and starting the Meta Service nodes using systemd
3. Configuring and starting the Query Service nodes using systemd
4. Managing cluster scaling operations:
   - Adding or removing Meta Service nodes
   - Adding or removing Query Service nodes
5. Performing version upgrades:
   - Upgrading Meta Service nodes
   - Upgrading Query Service nodes

This manual deployment approach gives you full control over your Databend cluster configuration and is suitable for environments where automated deployment tools are not available or preferred. Each step is carefully documented with detailed instructions and configuration examples to ensure a smooth deployment process.

## Table of Contents

- [Prepare Package Environment](01-prepare.md)
- [Deploy Meta Service](02-deploy-metasrv.md)
- [Deploy Query Service](03-deploy-query.md)
- [Scale Meta Service Nodes](04-scale-metasrv.md)
- [Scale Query Service Nodes](05-scale-query.md)
- [Upgrade Meta Service](06-upgrade-metasrv.md)
- [Upgrade Query Service](07-upgrade-query.md)
