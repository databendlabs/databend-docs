![image](https://github.com/datafuselabs/databend-docs/assets/15354455/5173ac4d-41f7-4e80-98e9-85106c956fda)# Databend Docs: Your Contributions Matter

Welcome to the official documentation repository for Databend! We invite you to contribute and help improve the Databend Docs.

## A Sneak Peek into Databend Docs

The Databend docs are thoughtfully organized to provide users with a structured and comprehensive resource. Navigating through the documentation page at [https://docs.databend.com/](https://docs.databend.com/), you'll find key information categorized into distinct tabs. Each tab serves a specific purpose, offering detailed insights into different aspects of Databend:

| Tab            | Folder in this Repo | Description                                                                                                                                                                                                                          |
|----------------|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Databend       | [docs/doc](https://github.com/datafuselabs/databend-docs/tree/main/docs/doc)           | Includes insights into the core features, data import/export, third-party tool integration, and programming interfaces across all Databend editions. Additionally, it offers valuable information on deploying Databend on-premises. |
| Databend Cloud | [docs/cloud/en](https://github.com/datafuselabs/databend-docs/tree/main/docs/cloud/en)       | Includes details on account registration, operational guidance, and organization management tailored for Databend Cloud. Whether you're new to the cloud environment or an experienced user, contribute here to share your insights. |
| SQL Reference  | [docs/sql-reference](https://github.com/datafuselabs/databend-docs/tree/main/docs/sql-reference)  | Explains Databend general essentials and a variety of available SQL functions and commands. Contribute to this section to help fellow users navigate the world of SQL in Databend.                                                   |
| Releases       | -                   | Contains release notes for Databend Cloud and updates on nightly builds. Furthermore, it explains that if you have information on new features, enhancements, or bug fixes, you can share your contributions here.                   |

## What You can Contribute


Share your expertise by contributing documents for new functions or commands you develop, or even improvements to existing sections. We also welcome your input for error spotting or suggestions for clarification. While the "Releases" section is dedicated to official updates, every other part of the documentation is open for your insights.

## How to Contribute

To ensure a smooth collaboration process, we recommend following these best practices:

1. Fork and Branch:
  - We recommend forking the repository on GitHub and creating a new branch for your edits. This allows for better version control and easier tracking of changes.
  - Edit the documentation on your branch and submit a Pull Request (PR) when you are ready for review.

2. Follow Existing Formats: 
    For consistency, follow the existing documentation format. For example,  if you are adding documentation for a new function, consider copying an existing markdown file from the same folder and modifying it accordingly.

3. Preview Locally:
  - To preview your changes locally and ensure they meet your expectations, ensure you have [Node.js](https://nodejs.org/) installed on your machine. Additionally, run the `npm run dev` command in your terminal to initiate a local preview. 
  - Confirm that the formatting is correct, links work as intended, and the content aligns with your vision BEFORE you submit.

## Versioning

The Databend documentation website always showcases the latest content for the product. To indicate when specific features, such as commands or functions, were introduced or modified, we use a code snippet like this:

```markdown title="Example:"
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.2.34"/>
```

### Need Help?

For any questions or support, please contact [soyeric128@yahoo.com](mailto:soyeric128@yahoo.com).

Happy contributing!
