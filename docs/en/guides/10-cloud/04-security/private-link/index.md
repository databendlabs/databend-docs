---
title: Advanced Usage
---

import IndexOverviewList from '@site/src/components/IndexOverviewList';

# Why PrivateLink

PrivateLink-style private endpoints offered by major clouds (AWS PrivateLink, Azure Private Link, Google Private Service Connect, etc.) let you reach Databend Cloud through private IP addresses inside your own network boundary, so no traffic has to traverse the public internet. That keeps your datasets, credentials, and admin actions on the provider's backbone and aligned with the network policies you already operate.

## Benefits

- Network isolation: traffic never leaves your VPC/VPN boundary, removing exposure to public endpoints.
- Compliance ready: easier to satisfy internal audits and industry requirements that forbid internet egress.
- Stable performance: traffic follows the cloud provider backbone instead of unpredictable internet routes.
- Simplified controls: reuse your existing security groups, route tables, and monitoring to govern access.

## How It Works

After Databend Cloud approves the cloud account or project you plan to connect, you create a private endpoint that points to the Databend PrivateLink service for your region. The cloud provider automatically allocates private IP addresses and, once private DNS is enabled, your Databend Cloud domains resolve to those addresses so every session stays on the secure, private path.

<IndexOverviewList />
