---
title: Fine Grained Storage Security
description: Add fine grained storage security to replace allow_insecure
---

- RFC PR: [datafuselabs/databend-docs#291](https://github.com/datafuselabs/databend-docs/pull/291)
- Tracking Issue: [datafuselabs/databend#0000](https://github.com/datafuselabs/databend/issues/0000)

## Summary

Add fine grained storage security to replace `allow_insecure`.

## Motivation

Databend previously disabled all insecure storage services by default, preventing the use of `fs` or `s3` services over the HTTP protocol. This measure protects our users from attempts to steal data or probe for internal network services. For instance, using an SQL query like `SELECT * FROM 'http://192.168.100.100:8000'` could potentially expose sensitive information and serve as a gateway to more significant attacks.

We support only a basic switch named `allow_insecure`. This is overly restrictive for users looking to access data from public HTTP services, yet too permissive for those who wish to avoid reading from the local filesystem. We need a more fine-grained approach to storage security.

## Guide-level explanation

Users can now have more control over storage security via `[storage.security]`:

```toml
[storage.security]
blocked_service = ["fs"]
blocked_domain = ["databend.localhost"]
blocked_cidr = ["10.10.0.0/16"]
```

`storage.security` has three fields:

- `blocked_service`: A list of blocked services.
- `blocked_domain`: A list of blocked domains, matched by the suffix. For example, `.databend.cloud` will match all `abc.databend.cloud`.
- `blocked_cidr`: A list of blocked cidr.

Users can blocked services, domains, cidr based on their own need.

## Reference-level explanation

For all storage services, we check the security settings before creating the service. If the service is blocked, we will return an error like `storage_blocked`.

## Drawbacks

Much more complex than a simple `allow_insecure`

## Rationale and alternatives

None

## Prior art

### Network Policy

Databend has [Network Policy](https://databend.rs/sql/sql-commands/ddl/network-policy/) to control the users network access.

Admins can create network policy:

```sql
CREATE NETWORK POLICY [IF NOT EXISTS] policy_name
    ALLOWED_IP_LIST=('allowed_ip1', 'allowed_ip2', ...)
    [BLOCKED_IP_LIST=('blocked_ip1', 'blocked_ip2', ...)]
    [COMMENT='comment']
```

And assign the policy to users:

```sql
ALTER USER sample_user WITH SET NETWORK POLICY='sample_policy';
```

Only users comply with the policy can access the network.

## Unresolved questions

None

## Future possibilities

### Session Configuration

Enhance session configuration by allowing admins to modify storage security settings at runtime.

### Storage Security Object

Extend Storage Security to a new object that stored inside Metasrv like we do for network policy.
