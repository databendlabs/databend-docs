---
title: Understanding Stages
slug: whystage
---

Databend simplifies handling data files with something called "stages." Think of a stage like a special folder where you keep data files until you're ready to use them in a table or send them somewhere else. It's meant to make your life easier by reducing the fuss about where and how to store files.

## Types of Stages

- **User Stage**: It's like your private storage room given to you when you start. No setup needed!
- **Internal Stage**: Databend's own storage spot. It’s automatically managed for you.
- **External Stage**: For using outside storage spots like an S3 bucket. You tell Databend where and how to access it.

## User Stage

- Automatically yours, no need to create or delete it.
- It's private. Only you can see what’s in it.
- Can't customize storage formats directly here but can when moving data around.

Commands overview:
- `LIST @~` to see what's in your stage.
- `REMOVE @~` to clear your stage.

## Internal Stage

The Internal Stage is Databend's very own managed file storage. Users don't need to set up anything here; it's all taken care of by Databend. To initiate an Internal Stage, you can use the [`CREATE STAGE`](/sql/sql-commands/ddl/stage/ddl-create-stage#example-1-create-internal-stage) command.

## External Stage

For files located outside of Databend, such as those in an S3 bucket. This stage involves specifying the external storage location and providing the necessary access credentials. Create an External Stage with the [`CREATE STAGE`](/sql/sql-commands/ddl/stage/ddl-create-stage#example-2-create-external-stage-with-aws-access-key) command.
