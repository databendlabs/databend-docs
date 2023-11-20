---
title: Members
---

## User Roles

In Databend Cloud, user management is facilitated through roles. An organization within Databend Cloud is equipped with default roles, each serving distinct purposes:

- account_admin: Positioned at the apex of the role hierarchy, this role embodies the highest level of authority within an organization. It is intended for users who undertake the responsibilities of database administrators.

- public: This role encompasses all users within the organization, providing a baseline level of access and permissions.

Furthermore, Databend Cloud offers the capability to craft custom roles using SQL commands for a more nuanced and tailored user management approach. This empowers you with the flexibility to establish roles that align with specific requirements. For instance, roles can be devised to correspond to users' positions, thus establishing a hierarchical role structure for your organization:

![Alt text](@site/static/img/documents/org-and-users/role.png)

When inviting a new user, it's necessary to assign a role to them. You can also manage roles for all users in your organization through the **Manage** > **Members** page or by using SQL commands.

:::note
- The default roles within an organization are not editable or removable.

- Only users assigned to the *account_admin* role can create roles and manage user roles for their organization.
:::

## Inviting New Members

In Databend Cloud, you can invite new members using their email addresses to join your organization. To do this, navigate to the **Manage** > **Members** page and click on **Invite New Member**. In the dialog box that appears, enter the user's email address and select a role from the list. This list includes both default roles and any custom roles created for your organization.

An invitation email will be sent to the invited user. Inside the email, there will be a link that the user can click on to initiate the signup process.

:::note
- Inviting new members to the organization is a privilege restricted to account_admin roles only.

- If your organization is under the Trial Plan, it permits a maximum of one user. In such a case, you won't have the capability to extend invitations to additional members.
:::