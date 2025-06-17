---
title: Prepare Package Environment
---

## Prerequisites

- A Linux-based operating system
- `wget` or `curl` for downloading files
- `tar` for extracting the package
- `sudo` privileges for system-wide installation

## Check System Architecture

1. Check your system architecture:
   ```bash
   uname -m
   ```

   The output will help you determine which package to download:
   - If the output is `x86_64`, download the x86_64 package
   - If the output is `aarch64`, download the aarch64 package

## Download the Package

1. Visit the [Databend GitHub Releases](https://github.com/datafuselabs/databend/releases) page.

2. Choose the latest stable release version. For example, if you want to install version v1.2.755-nightly, you'll need to download:
   - `databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz` for x86_64 Linux systems
   - `databend-v1.2.755-nightly-aarch64-unknown-linux-gnu.tar.gz` for aarch64 Linux systems

3. Download the package using wget (replace `v1.2.755-nightly` with your desired version):
   ```bash
   wget https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   Or using curl (replace `v1.2.755-nightly` with your desired version):
   ```bash
   curl -L -O https://github.com/datafuselabs/databend/releases/download/v1.2.755-nightly/databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

   Note: Make sure to replace `v1.2.755-nightly` in both the URL and filename with your desired version number.

## Extract the Package

1. Extract the package in the current directory:
   ```bash
   tar xzf databend-v1.2.755-nightly-x86_64-unknown-linux-gnu.tar.gz
   ```

## Verify the Installation

1. Check the extracted files:
   ```bash
   ls --tree
   ```

   You should see the following directory structure:
   ```
   .
   ├── bin
   │   ├── bendsql
   │   ├── databend-bendsave
   │   ├── databend-meta
   │   ├── databend-metactl
   │   └── databend-query
   ├── configs
   │   ├── databend-meta.toml
   │   └── databend-query.toml
   ├── readme.txt
   ├── scripts
   │   ├── postinstall.sh
   │   └── preinstall.sh
   └── systemd
       ├── databend-meta.default
       ├── databend-meta.service
       ├── databend-query.default
       └── databend-query.service
   ```

2. Verify the binaries are executable:
   ```bash
   ./bin/databend-meta --version
   ./bin/databend-query --version
   ./bin/bendsql --version
   ```

## Create Databend User

1. Run the preinstall script to create the databend user and group:
   ```bash
   sudo ./scripts/preinstall.sh
   ```

   This script will:
   - Create a `databend` user and group if they don't exist
   - Set up necessary system configurations
   - Create required directories with proper permissions

## Next Steps

Now that you have prepared the environment, you can proceed to:
- [Deploy Meta Service](02-deploy-metasrv.md)
- [Deploy Query Service](03-deploy-query.md) 
