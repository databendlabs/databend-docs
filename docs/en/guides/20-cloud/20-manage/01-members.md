---
title: Members
---

To view all the members in your organization, go to **Manage** > **Members**. This page provides a list of all members, including their email addresses, roles, join times, and last active times. If you're an `account_admin`, you can also change a member's role or remove a member from your organization.

- The roles listed show the roles assigned to users when they were invited. While these roles can be changed on the page, they cannot be revoked using SQL. However, you can grant additional roles or privileges to users based on their email addresses. These user accounts, identified by their email addresses, can also function as SQL users in Databend Cloud. Example:

    ```sql
    GRANT ROLE writer to 'eric@databend.com';
    GRANT SELECT ON *.* TO 'eric@databend.com';
    ```

- The page does not display users created using SQL. To view the SQL users that have been created, use the [SHOW USERS](/sql/sql-commands/ddl/user/user-show-users) command.

## Inviting New Members

To invite a new member to your organization, navigate to the **Manage** > **Members** page and click on **Invite New Member**. In the dialog box that appears, enter the user's email address and select a role from the list. This list includes built-in roles and any created roles created for your organization. For more information about the roles, see [Roles](/guides/security/access-control/roles).

An invitation email will be sent to the invited user. Inside the email, there will be a link that the user can click on to initiate the signup process.

:::note
- Inviting new members to the organization is a privilege restricted to account_admin roles only.

- If your organization is under the Trial Plan, it permits a maximum of one user. In such a case, you won't have the capability to extend invitations to additional members.
:::