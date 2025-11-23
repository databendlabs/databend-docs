---
title: "Connect with BendSQL (Self-hosted)"
sidebar_label: "Connect with BendSQL (Self-hosted)"
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to a self-hosted Databend instance using BendSQL.

<StepsWrap>
<StepContent number="1">

### Before You Start

- Ensure that [Docker](https://www.docker.com/) is installed on your local machine, as it will be used to launch Databend.
- Ensure that BendSQL is installed on your machine. See [Installing BendSQL](/guides/sql-clients/bendsql/#installing-bendsql) for instructions on how to install BendSQL using various package managers.

</StepContent>
<StepContent number="2">

### Start Databend

Run the following command in your terminal to launch a Databend instance:

```bash
docker run -d --name databend \
  -e QUERY_DEFAULT_USER=eric \
  -e QUERY_DEFAULT_PASSWORD=abc123 \
  -p 3307:3307 -p 8000:8000 -p 8124:8124 -p 8900:8900 \
  datafuselabs/databend:nightly
```

This command starts a Databend instance locally in a Docker container with the following connection info:

- Host: `127.0.0.1`
- Port: `8000`
- User: `eric`
- Password: `abc123`

</StepContent>
<StepContent number="3">

### Launch BendSQL

Once the Databend instance is running, you can connect to it using BendSQL. Open a terminal and use the following command to connect:

```bash
bendsql --host 127.0.0.1 --port 8000 --user eric --password abc123
```

This will connect to Databend using the HTTP API at `127.0.0.1:8000` with the user `eric` and the password `abc123`. After running this command, you should see a successful connection message, like the one below:

```bash
Welcome to BendSQL 0.24.7-ff9563a(2024-12-27T03:23:17.723492000Z).
Connecting to 127.0.0.1:8000 as user eric.
Connected to Databend Query v1.2.725-nightly-25ee2d6e65(rust-1.88.0-nightly-2025-04-16T13:54:25.363718584Z)
Loaded 1432 auto complete keywords from server.
Started web server at 127.0.0.1:8080
```

</StepContent>
<StepContent number="4">

### Execute Queries

Once connected, you can execute SQL queries in the BendSQL shell. For instance, type `SELECT NOW();` to return the current time:

```bash
eric@127.0.0.1:8000/default> SELECT NOW();

SELECT NOW()

┌────────────────────────────┐
│            now()           │
│          Timestamp         │
├────────────────────────────┤
│ 2025-04-24 13:24:06.640616 │
└────────────────────────────┘
1 row read in 0.025 sec. Processed 1 row, 1 B (40 rows/s, 40 B/s)
```

</StepContent>
<StepContent number="5">

### Quit BendSQL

To quit BendSQL, type `quit`.

```bash
eric@127.0.0.1:8000/default> quit
Bye~
➜  ~
```

### Bendsql UI
With `--ui` option, BendSQL will start a web server and open a browser to show the UI interface.
We can execute sql or analyze query performance with BendSQL in the browser.
Also we can share the results with others by copying the url.

```bash
❯ Bendsql -h 127.0.0.1 --port 8000 --ui
```

</StepContent>
</StepsWrap>
