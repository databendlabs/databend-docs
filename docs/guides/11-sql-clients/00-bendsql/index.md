---
title: BendSQL
---

[BendSQL](https://github.com/datafuselabs/BendSQL) is a command line tool that has been designed specifically for Databend. It allows users to establish a connection with Databend and execute queries directly from a CLI window.

BendSQL is particularly useful for those who prefer a command line interface and need to work with Databend on a regular basis. With BendSQL, users can easily and efficiently manage their databases, tables, and data, and perform a wide range of queries and operations with ease.

## Installing BendSQL

BendSQL can be installed on various platforms using different package managers. The following sections outline the installation steps for BendSQL using Cargo (Rust Package Manager), Homebrew (for macOS), and Apt (for Ubuntu/Debian). Alternatively, you can download the installation package from the [BendSQL release page](https://github.com/datafuselabs/BendSQL/releases) on GitHub and install BendSQL manually.

### Cargo (Rust Package Manager)

To install BendSQL using Cargo, utilize the `cargo-binstall` tool or build from source using the provided commands.

```bash
# Using cargo-binstall
cargo binstall bendsql

# Alternatively, build from source
cargo install bendsql
```

### Homebrew (for macOS)

BendSQL can be easily installed on macOS using Homebrew with a simple command:

```bash
brew install databendcloud/homebrew-tap/bendsql
```

### Apt (for Ubuntu/Debian)

On Ubuntu and Debian systems, BendSQL can be installed via the Apt package manager. Choose the appropriate instructions based on the distribution version.

#### DEB822-STYLE format (Ubuntu-22.04/Debian-12 and later)

```bash
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.sources https://repo.databend.rs/deb/datafuselabs.sources
```

#### Old format (Ubuntu-20.04/Debian-11 and earlier)

```bash
sudo curl -L -o /usr/share/keyrings/datafuselabs-keyring.gpg https://repo.databend.rs/deb/datafuselabs.gpg
sudo curl -L -o /etc/apt/sources.list.d/datafuselabs.list https://repo.databend.rs/deb/datafuselabs.list
```

Finally, update the package list and install BendSQL:

```bash
sudo apt update
sudo apt install bendsql
```

## Connecting to Databend

- [Tutorial-1: Connecting to Databend using BendSQL](00-connect-to-databend.md)
- [Tutorial-2: Connecting to Databend Cloud using BendSQL](01-connect-to-databend-cloud.md)

**Related video:**

<iframe width="853" height="505" className="iframe-video" src="https://www.youtube.com/embed/3cFmGvtU-ws" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>