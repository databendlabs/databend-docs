---
sidebar_label: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<p></p>

### Downloading Databend

a. Create a folder named `databend` in the directory `/usr/local`.

b. Download and extract the latest Databend release for your platform from [GitHub Release](https://github.com/datafuselabs/databend/releases):

<Tabs>
<TabItem value="linux-x86_64" label="Linux(X86)">

```shell
curl -LJO https://github.com/datafuselabs/databend/releases/download/${version}/databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

</TabItem>

<TabItem value="linux-arm64" label="Linux(Arm)">

```shell
curl -LJO https://github.com/datafuselabs/databend/releases/download/${version}/databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

</TabItem>
<TabItem value="mac-x86_64" label="MacOS(X86)">

```shell
curl -LJO https://github.com/datafuselabs/databend/releases/download/${version}/databend-${version}-x86_64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-apple-darwin.tar.gz
```

</TabItem>

<TabItem value="mac-arm64" label="MacOS(Arm)">

```shell
curl -LJO https://github.com/datafuselabs/databend/releases/download/${version}/databend-${version}-aarch64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-apple-darwin.tar.gz
```

</TabItem>
</Tabs>

c. Move the extracted folders `bin`, `configs`, and `scripts` to the folder `/usr/local/databend`.