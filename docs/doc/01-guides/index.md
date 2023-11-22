---
title: Quick Start Resources
---
Welcome to our Quick Start Resources page! 

Whether you're a newbie to Databend or looking to refresh your knowledge, this page is designed to help you get up and running quickly 🚀. We've compiled a list of key documents to help you navigate our documentation and learn the essentials of Databend. From deployment guides to usecases, this page will provide you with everything you need to begin using Databend effectively.

## Databend Setup

Learn various deployment modes and connection options with Databend to customize your setup.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Deploy" label="Deploy" default>

* [Understanding Deployment Modes](/doc/deploy/understanding-deployment-modes)
* [Deploying a Standalone Databend](/doc/deploy/deploying-databend)
* [Expanding a Standalone Databend](/doc/deploy/expanding-to-a-databend-cluster)
* [Deploying a Query Cluster on Kubernetes](/doc/deploy/cluster/deploying-databend-on-kubernetes)
* [Docker and Local Deployments](/doc/deploy/deploying-local)

</TabItem>

<TabItem value="Connect" label="Connect">

* [Connecting to Databend with BendSQL](/doc/sql-clients/bendsql)
* [Connecting to Databend with JDBC](/doc/sql-clients/jdbc)
* [Connecting to Databend with MySQL-Compatible Clients](/doc/sql-clients/mysql)

</TabItem>

<TabItem value="Manage" label="Manage">

* [Managing Databend Settings](/sql/sql-reference/manage-settings)
* [Backing Up and Restoring a Meta Service Cluster](/doc/deploy/cluster/metasrv-backup-restore)
* [Backing Up and Restoring Schema Data](/doc/deploy/upgrade/backup-and-restore-schema)
* [Upgrading Databend](/doc/deploy/upgrade/upgrade)

</TabItem>
</Tabs>

## Data Load & Unload

Databend makes it easy to load data from various sources, stage, Amazon S3, local and remote files, and so on.

<Tabs>
<TabItem value="Stage" label="Stage" default>

* [Understanding Stages](/doc/load-data/stage/whystage)
* [Managing Stages](/doc/load-data/stage/manage-stages)
* [Staging Files](/doc/load-data/stage/manage-stages)

</TabItem>

<TabItem value="Query&Transform" label="Query & Transform" default>

* [Querying Staged Files](/doc/load-data/transform/querying-stage)
* [Retrieving Metadata](/doc/load-data/transform/querying-metadata)
* [Transforming Data on Load](/doc/load-data/transform/data-load-transform)

</TabItem>

<TabItem value="Load&Unload" label="Load & Unload">

* [Loading from Stage](/doc/load-data/load/stage)
* [Loading from Bucket](/doc/load-data/load/s3)
* [Loading from Local File](/doc/load-data/load/local)
* [Loading from Remote File](/doc/load-data/load/http)
* [Unloading Data](/doc/load-data/unload)

</TabItem>

</Tabs>


## Data & User Management

To make the most of Databend, learn how to manage your database by inserting, updating, and deleting data, creating and dropping databases and tables, and managing user-defined functions and views. Explore advanced features like generating SQL with AI and managing users, roles, and privileges for fine-grained control.

<Tabs>
<TabItem value="Data" label="Data" default>

* [How to Insert Data into a Table](/sql/sql-commands/dml/dml-insert)
* [How to Update Data in a Table](/sql/sql-commands/dml/dml-update)
* [How to Replace a Row in a Table](/sql/sql-commands/dml/dml-replace)
* [How to Delete One or More Rows from a Table](/sql/sql-commands/dml/dml-delete-from)

</TabItem>

<TabItem value="Database" label="Database" >

* [How to Create a Database](/sql/sql-commands/ddl/database/ddl-create-database)
* [How to Drop a Database](/sql/sql-commands/ddl/database/ddl-drop-database)

</TabItem>

<TabItem value="Table" label="Table" >

* [How to Create a Table](/sql/sql-commands/ddl/table/ddl-create-table)
* [How to Drop a Table](/sql/sql-commands/ddl/table/ddl-drop-table)
* [How to Rename a Table](/sql/sql-commands/ddl/table/ddl-rename-table)
* [How to Truncate a Table](/sql/sql-commands/ddl/table/ddl-truncate-table)
* [How to Add/Drop Table Column](/sql/sql-commands/ddl/table/alter-table-column)
* [How to Flash Back a Table](/sql/sql-commands/ddl/table/flashback-table)

</TabItem>

<TabItem value="View" label="View" >

* [How to Create a View](/sql/sql-commands/ddl/view/ddl-create-view)
* [How to Drop a View](/sql/sql-commands/ddl/view/ddl-drop-view)
* [How to Alter a View](/sql/sql-commands/ddl/view/ddl-alter-view)

</TabItem>

<TabItem value="Function" label="Function" >

* [User-Defined Functions](/sql/sql-commands/ddl/udf/)
* [External Functions](/sql/sql-commands/ddl/external-function/)
* [Generating SQL with AI](/sql/sql-functions/ai-functions/ai-to-sql)
* [Creating Embedding Vectors](/sql/sql-functions/ai-functions/ai-embedding-vector)
* [Text Completion with AI](/sql/sql-functions/ai-functions/ai-text-completion)
* [Computing Text Similarities](/sql/sql-functions/ai-functions/ai-cosine-distance)

</TabItem>

<TabItem value="User" label="User" >

* [How to Create a User](/sql/sql-commands/ddl/user/user-create-user)
* [How to Grant Privileges to a User](/sql/sql-commands/ddl/user/grant-privileges)
* [How to Revoke Privileges from a User](/sql/sql-commands/ddl/user/revoke-privileges)
* [How to Create a Role](/sql/sql-commands/ddl/user/user-create-role)
* [How to Grant Privileges to a Role](/sql/sql-commands/ddl/user/grant-privileges)
* [How to Grant Role to a User](/sql/sql-commands/ddl/user/grant-role)
* [How to Revoke Role from a User](/sql/sql-commands/ddl/user/revoke-role)

</TabItem>
</Tabs>

## Integrations

Databend's rich ecosystem offers a range of powerful tools and integrations, allowing you to work more efficiently and effectively.

<Tabs>
<TabItem value="Visualizations" label="Visualizations" default>

* [Deepnote](../12-visualize/deepnote.md)
* [Grafana](../12-visualize/grafana.md)
* [Jupyter Notebook](../12-visualize/jupyter.md)
* [Metabase](../12-visualize/metabase.md)
* [MindsDB](../12-visualize/mindsdb.md)
* [Redash](../12-visualize/redash.md)
* [Tableau](../12-visualize/tableau.md)

</TabItem>

<TabItem value="APIs" label="APIs" default>

* [REST API](../03-develop/00-apis/index.md)

</TabItem>

<TabItem value="Languages" label="Languages">

* [Golang](../03-develop/00-golang.md)
* [Python](../03-develop/01-python.md)
* [Node.js](../03-develop/02-nodejs.md)
* [Java](../03-develop/03-jdbc.md)
* [Rust](../03-develop/04-rust.md)

</TabItem>
</Tabs>

## Next Steps

Congratulations on completing the Quick Start materials 👏👏👏! 

We hope you found them helpful in getting up and running with Databend. To continue your journey with Databend, we encourage you to check out our documentation, which provides in-depth information on Databend's features and capabilities. You can also join our [community](../00-overview/index.md#community) to connect with other Databend users and get help with any questions or issues you may have.
