const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "./docs/release-stable");
const releaseNote = path.join(__dirname, "./docs/en/release-notes");
const releaseNoteCN = path.join(__dirname, "./docs/cn/release-notes");
const outputPath = path.join(releaseNote, "databend.md");
const outputPathCN = path.join(releaseNoteCN, "databend.md");
function formatTime(dateStr) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-US", options);
}

const mdFiles = fs
  .readdirSync(docsDir)
  .filter((file) => file.endsWith(".md") && file !== "index.md")
  ?.reverse();

let imports = "";
let content = "";

mdFiles?.forEach((file, index) => {
  const [time, version] = file.split("_");
  const V = version.slice(0, -3);
  const varName = `MD${index + 1}`;
  imports += `import ${varName} from '@site/docs/release-stable/${file}';\n`;
  content += `\n\n<StepContent outLink="https://github.com/databendlabs/databend/releases/tag/${V}" number="${
    index === 0 ? "-1" : ""
  }">

## ${formatTime(time)} (${V})

<${varName} />

</StepContent>`;
  // posts.push({title: V, link: `https://github.com/databendlabs/databend/releases/tag/${V}`, description: 'Databend release notes', pubDate: time})
});

const outputData = `---
sidebar_label: Databend Releases
title: Databend Releases
sidebar_position: 1
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

This page provides information about recent features, enhancements, and bug fixes for <a href="https://github.com/databendlabs/databend">Databend</a>.



${imports}

<StepsWrap> 

${content}

</StepsWrap> 
`;

fs.writeFileSync(outputPath, outputData);
fs.writeFileSync(outputPathCN, outputData);

console.log("generated");
