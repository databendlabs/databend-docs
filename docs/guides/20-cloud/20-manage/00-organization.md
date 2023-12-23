---
title: Organization
---

## What is Organization?

Organization is an essential concept in Databend Cloud. All the users, databases, warehouses, and other objects in Databend Cloud are associated with an organization.  An organization is a group for managing users and their resources.

In an organization of Databend Cloud, data and resources are shared among all users of the organization. Users can collaborate with each other to manage and analyze the organization's data effectively by taking advantage of the cloud-native features.

Please note that each organization in Databend Cloud has its own pricing plan and billing settings. Data is not shared across organizations, and organizations cannot be combined either if your company owns multiple organizations in Databend Cloud.

## Creating an Organization

When you provide an organization name during the signup process, you create an organization in Databend Cloud with your account as an Admin account. You will also need to select a pricing plan, a cloud provider, and a region for the new organization. For more information, see [Activate Databend Cloud](../00-new-account.md)).

![](@site/static/img/documents/getting-started/01.jpeg)

:::tip
If you're invited by a user who already belongs to an organization in Databend Cloud, the textbox will show that organization's name. In this case, you cannot create another organization.
:::

## Switching to Another Organization

If you're a Databend Cloud user who has accepted invitations from multiple organizations, you can switch between these organizations by clicking on the organization name in the top left corner of the page and selecting the organization you want to switch to.

![Alt text](@site/static/img/documents/overview/switch-org.gif)

## Managing Organization Settings

You must be assigned the Admin role to manage the organization settings. The Organization Settings page is visible only to the organization's admin users. To go to the Organization Settings page, click the Settings icon in the left sidebar, then click **Organization**.

The Organization Settings page shows the current settings of the organization. You can change the following settings on the page:

- Organization's display name

- Organization's display slug: When an organization is created, Databend Cloud generates and uses a short random string as the organization slug. The best practice is to change it to your company's name to identify the addresses of your company's resources in Databend Cloud. For example, if you set it to `tpl`, your database URLs will be `https://app.databend.com/tpl/data/databases/<database_name>`.
