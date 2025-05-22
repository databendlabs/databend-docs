> [!WARNING]  
> **Important Notice for Contributors**  
> If you delete a document, you **must** provide the old URL and the new URL for a 301 redirect to ensure proper navigation. Additionally, please notify @Chasen-Zhang about the change, or you can directly modify the redirect configuration in the file: [docusaurus.config.ts#L210](https://github.com/databendlabs/databend-docs/blob/main/docusaurus.config.ts#L210). Failure to do so may disrupt user access.  

# Databend Docs: Your Contributions Matter

[![GitHub stars](https://img.shields.io/github/stars/datafuselabs/databend-docs.svg?style=social&label=Stars)](https://github.com/datafuselabs/databend-docs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/datafuselabs/databend-docs.svg?style=social&label=Forks)](https://github.com/datafuselabs/databend-docs/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/graphs/contributors)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/DatabendLabs?style=social)](https://x.com/DatabendLabs)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red?style=flat&logo=youtube)](https://www.youtube.com/@DatabendLabs)

Welcome to the official documentation repository for Databend! We invite you to contribute and help improve the Databend Docs.

## A Sneak Peek into Databend Docs

The Databend docs are thoughtfully organized to provide users with a structured and comprehensive resource. Navigating through the documentation page at [https://docs.databend.com/](https://docs.databend.com/), you'll find key information categorized into distinct tabs. Each tab serves a specific purpose, offering detailed insights into different aspects of Databend:

| Tab            | Folder in this Repo                                                                                  | Description                                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Guides         | [docs/guides](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides)                | Includes insights into the core features, data import/export, third-party tool integration, and programming interfaces across all Databend editions. Additionally, it offers valuable information on deploying Databend on-premises. |
| Databend Cloud | [docs/guides/cloud](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides/20-cloud) | Includes details on account registration, operational guidance, and organization management tailored for Databend Cloud. Whether you're new to the cloud environment or an experienced user, contribute here to share your insights. |
| SQL Reference  | [docs/sql-reference](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/sql-reference)  | Explains Databend general essentials and a variety of available SQL functions and commands. Contribute to this section to help fellow users navigate the world of SQL in Databend.                                                   |
| Releases       | -                                                                                                    | Contains release notes for Databend Cloud and updates on nightly builds.                                                                                                                                                             |

## What You can Contribute

Share your expertise by contributing documents for new functions or commands you develop, or even improvements to existing sections. We also welcome your input for error spotting or suggestions for clarification. While the "Releases" section is dedicated to official updates, every other part of the documentation is open for your insights.

## How to Contribute

To ensure a smooth collaboration process, we recommend following these best practices:

1. Fork and Branch:

- We recommend forking the repository on GitHub and creating a new branch for your edits. This allows for better version control and easier tracking of changes.
- Edit the documentation on your branch and submit a Pull Request (PR) when you are ready for review.

2. Follow Existing Formats: For consistency, follow the existing documentation format. For example, if you are adding documentation for a new function, consider copying an existing markdown file from the same folder and modifying it accordingly.

3. Preview Locally:

- To preview your changes locally and ensure they meet your expectations, ensure you have [Node.js](https://nodejs.org/)(**Please install a version greater than 20**) installed on your machine. Run the following commands in your terminal to initiate a local preview:

**If you have multiple Node.js versions on your machine, we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node versions.**

```bash
yarn install
```

```bash
yarn run dev
```

- Confirm that the formatting is correct, links work as intended, and the content aligns with your vision BEFORE you submit.

## Versioning

The Databend documentation website always showcases the latest content for the product. To indicate when specific features, such as commands or functions, were introduced or modified, insert a code snippet like this:

```markdown
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.34"/>
```

## Need Help?

If you have any questions or need support, please feel free to reach out via email:

[![Email](https://img.shields.io/badge/Email-soyeric128%40yahoo.com-blue?style=flat-square&logo=yahoo-mail)](mailto:soyeric128@yahoo.com)

Happy contributing!
