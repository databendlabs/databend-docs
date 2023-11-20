---
title: 使用 BendSQL
---

BendSQL 是一款由 Dababend 团队开发的命令行工具，您可以通过 BendSQL 连接到 Databend Cloud 进行计算集群管理和 SQL 查询等操作。

## 安装 BendSQL

bendsql 有多种安装方式。

### Homebrew:

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt:

* Ubuntu-22.04/Debian-12 或更新的版本:

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

* Ubuntu-20.04/Debian-11 或更早的版本:

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.rs/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.rs/deb/datafuselabs.list
```

然后执行:

```bash
sudo apt update

sudo apt install bendsql
```

### 手工安装

在 [GitHub Release](https://github.com/datafuselabs/bendsql/releases) 页寻找最新的版本。

## Usage

```
❯ bendsql --help
Databend Native Command Line Tool

Usage: bendsql [OPTIONS]

Options:
      --help                     Print help information
      --flight                   Using flight sql protocol
      --tls                      Enable TLS
  -h, --host <HOST>              Databend Server host, Default: 127.0.0.1
  -P, --port <PORT>              Databend Server port, Default: 8000
  -u, --user <USER>              Default: root
  -p, --password <PASSWORD>      [env: BENDSQL_PASSWORD=]
  -D, --database <DATABASE>      Database name
      --set <SET>                Settings
      --dsn <DSN>                Data source name [env: BENDSQL_DSN=]
  -n, --non-interactive          Force non-interactive mode
      --query=<QUERY>            Query to execute
  -d, --data <DATA>              Data to load, @file or @- for stdin
  -f, --format <FORMAT>          Data format to load [default: csv] [possible values: csv, tsv, ndjson, parquet, xml]
      --format-opt <FORMAT_OPT>  Data format options
  -o, --output <OUTPUT>          Output format [possible values: table, csv, tsv, null]
      --progress                 Show progress for query execution in stderr, only works with output format `table` and `null`.
      --stats                    Show stats after query execution in stderr, only works with non-interactive mode.
      --time[=<TIME>]            Only show execution time without results, will implicitly set output format to `null`. [possible values: local, server]
  -V, --version                  Print version
```