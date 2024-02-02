---
sidebar_label: false
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LanguageDocs from '@site/src/components/LanguageDocs';


<LanguageDocs
cn=
{
<>

<p></p>

### 下载 Databend

a. 在目录 `/usr/local` 中创建一个名为 `databend` 的文件夹。

b. 从 [GitHub Release](https://github.com/datafuselabs/databend/releases)下载并解压适用于您平台的最新 Databend 发布版本：

<Tabs>
<TabItem value="linux-x86_64" label="Linux(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

</TabItem>

<TabItem value="linux-arm64" label="Linux(Arm)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

</TabItem>
<TabItem value="mac-x86_64" label="MacOS(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-x86_64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-apple-darwin.tar.gz
```

</TabItem>

<TabItem value="mac-arm64" label="MacOS(Arm)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-apple-darwin.tar.gz
```

</TabItem>
</Tabs>

c. 将解压后的 `bin`、`configs` 和 `scripts` 文件夹移动到 `/usr/local/databend` 目录下。

</>
}
en=
{
<>

<p></p>

### Downloading Databend

a. Create a folder named `databend` in the directory `/usr/local`.

b. Download and extract the latest Databend release for your platform from [GitHub Release](https://github.com/datafuselabs/databend/releases):

<Tabs>
<TabItem value="linux-x86_64" label="Linux(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-unknown-linux-musl.tar.gz
```

</TabItem>

<TabItem value="linux-arm64" label="Linux(Arm)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-unknown-linux-musl.tar.gz
```

</TabItem>
<TabItem value="mac-x86_64" label="MacOS(x86)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-x86_64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-x86_64-apple-darwin.tar.gz
```

</TabItem>

<TabItem value="mac-arm64" label="MacOS(Arm)">

```shell
curl -LJO https://repo.databend.rs/databend/${version}/databend-${version}-aarch64-apple-darwin.tar.gz
```

```shell
tar xzvf databend-${version}-aarch64-apple-darwin.tar.gz
```

</TabItem>
</Tabs>

c. Move the extracted folders `bin`, `configs`, and `scripts` to the folder `/usr/local/databend`.

</>
}
/>

