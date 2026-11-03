---
title: Environment Variables
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.956"/>

Databend empowers you to harness the flexibility of environment variables, allowing you to both point to custom configuration files and make precise adjustments to individual configurations. This capability not only enables you to make modifications without disrupting the default setups but also proves especially beneficial when you require swift adjustments, work with containerized environments, or need to safeguard sensitive data.

:::note

- Not all configurations can be managed solely through environment variables. In some cases, adjustments might necessitate modifications within the configuration files rather than relying on environment variables.
  :::

## Setting Configuration File Paths

METASRV_CONFIG_FILE and CONFIG_FILE are environment variables used to designate the locations of your configuration files, [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) and [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml). They provide a way to tailor the paths of configuration files in Databend. If you'd like to depart from the default setup and opt for custom configuration file locations, these variables empower you to specify the exact paths for your files.

```sql title='Example'
export METASRV_CONFIG_FILE='/etc/databend/databend-meta.toml'
export CONFIG_FILE='/etc/databend/databend-query.toml'
```

## Meta Environment Variables

Below is a list of available environment variables, each correspondingly mapped to parameters found in the configuration file [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml). For detailed explanations of each parameter, see [Meta Configurations](metasrv-config.md).

| Environment Variable            | Mapped to               |
| ------------------------------- | ----------------------- |
| METASRV_LOG_DIR                 | log_dir                 |
| ADMIN_API_ADDRESS               | admin_api_address       |
| METASRV_GRPC_API_ADDRESS        | grpc_api_address        |
| METASRV_GRPC_API_ADVERTISE_HOST | grpc_api_advertise_host |
| KVSRV_ID                        | id                      |
| KVSRV_RAFT_DIR                  | raft_dir                |
| KVSRV_API_PORT                  | raft_api_port           |
| KVSRV_LISTEN_HOST               | raft_listen_host        |
| KVSRV_ADVERTISE_HOST            | raft_advertise_host     |
| KVSRV_SINGLE                    | single                  |

## Query Environment Variables

The parameters under the [query] and [storage] sections in the configuration file [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) can be configured using environment variables. The names of the environment variables are formed by combining the word QUERY or STORAGE with the corresponding parameter names using underscores.

Databend also accepts environment variables from storage services when they match Databend's environment variables. This allows you to work with the environment variable naming conventions you are most familiar with, eliminating the need to remember additional variable names and simplifying your configuration process.

To illustrate with an example, if you want to set the access key ID for S3 using an environment variable, you have the flexibility to use either STORAGE_S3_ACCESS_KEY_ID provided by Databend or the well-known AWS_ACCESS_KEY_ID typically associated with AWS S3.

### Alibaba Cloud OSS Credential Aliases

Since v1.2.956, the Query service loads these Alibaba Cloud aliases into its OSS configuration:

| Alibaba Cloud variable | Databend variable | Configuration field |
|------------------------|-------------------|---------------------|
| `ALIBABA_CLOUD_ROLE_ARN` | `STORAGE_OSS_ROLE_ARN` | `storage.oss.role_arn` |
| `ALIBABA_CLOUD_ACCESS_KEY_ID` | `STORAGE_OSS_ACCESS_KEY_ID` | `storage.oss.access_key_id` |
| `ALIBABA_CLOUD_ACCESS_KEY_SECRET` | `STORAGE_OSS_ACCESS_KEY_SECRET` | `storage.oss.access_key_secret` |

The role alias applies only when `STORAGE_OSS_ROLE_ARN` is unset or empty. The access-key aliases apply as a pair: both Databend access-key variables must be unset or empty, and both Alibaba Cloud access-key variables must be nonempty. A half pair is ignored. The loader does not combine one Databend access-key variable with one Alibaba Cloud alias.

Configuration precedence is, from lowest to highest: configuration file, environment, command-line arguments. Within the environment layer, nonempty Databend variables take precedence over these aliases. An accepted alias can override a value in the configuration file. Other configuration fields are unchanged.

For an RRSA deployment, the pod can provide the role and OIDC inputs without static access keys:

```bash
export ALIBABA_CLOUD_ROLE_ARN='<role-arn>'
export ALIBABA_CLOUD_OIDC_PROVIDER_ARN='<oidc-provider-arn>'
export ALIBABA_CLOUD_OIDC_TOKEN_FILE='/var/run/secrets/ack.alibabacloud.com/rrsa-tokens/token'
```

Use the token-file path mounted by your deployment. The Query service must be able to read it. `ALIBABA_CLOUD_ROLE_ARN` now populates `storage.oss.role_arn`. The OIDC provider and token-file variables remain credential-loader inputs; this change does not add configuration fields for them or new session-token aliases.

This alignment prevents a keyless RRSA configuration from enabling anonymous OSS fallback merely because the role was supplied through the Alibaba Cloud variable. Credential-loading failures can then use the existing temporary-error retry path. This is not a guarantee that all STS failures recover or that all OSS `403` responses are transient. Check federation, role permissions, bucket policy, and STS availability when requests fail.

Keep access keys and projected tokens out of shared logs. Use deployment secret injection instead of saving real credentials in shell history.
