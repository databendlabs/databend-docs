---
title: 'Connecting to Databend Cloud using BendSQL'
sidebar_label: 'Connecting to Databend Cloud'
---
import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

In this tutorial, we will guide you through the process of connecting to Databend Cloud using BendSQL.

<StepsWrap>
<StepContent number="0" title="Before You Start">

- Ensure that BendSQL is installed on your machine. See [Installing BendSQL](index.md#installing-bendsql) for instructions on how to install BendSQL using various package managers.
- Ensure that you already have a Databend Cloud account and can log in successfully.

</StepContent>

<StepContent number="1" title="Obtain Connection Information">

1. Log in to Databend Cloud, and then click **Connect**.

![Alt text](/img/connect/bendsql-4.gif)

2. Select the database you want to connect to, for example, "default"; then choose a warehouse. If you forget the password, reset it.

3. In the **Examples** part, copy the content from the **BendSQL** tab.

![Alt text](/img/connect/bendsql-5.gif)

</StepContent>
<StepContent number="2" title="Launch BendSQL">

To launch BendSQL, paste the content you copied into your terminal or command prompt. If the password you copied displays as "******", replace them with your actual password.

![Alt text](/img/connect/bendsql-6.gif)

</StepContent>

<StepContent number="3" title="Execute Queries">

Once connected, you can execute SQL queries in the BendSQL shell. For instance, type `SELECT NOW();` to return the current time:

![Alt text](/img/connect/bendsql-7.gif)

</StepContent>
<StepContent number="4" title="Quit BendSQL">

To quit BendSQL, type `quit`.

![Alt text](/img/connect/bendsql-8.gif)

</StepContent>
</StepsWrap>
