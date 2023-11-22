const fs = require('fs');
const path = require('path');


const docsDir = path.join(__dirname, './docs/release-nightly');
const releaseNote = path.join(__dirname, './docs/release-notes');
const releaseNoteCN = path.join(__dirname, './docs/release-notes-cn');
const outputPath = path.join(releaseNote, 'databend.md');
const outputPathCN = path.join(releaseNoteCN, 'databend.md');

function formatTime(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('en-US', options);
}

const mdFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.md') && file !== 'index.md')?.reverse();

let imports = '';
let content = '';

mdFiles?.forEach((file, index) => {
  const [time, version] = file.split('_');
  const V = version.slice(0, -3);
  const varName = `MD${index + 1}`;
  imports += `import ${varName} from '../release-nightly/${file}';\n`;
  content += `\n\n<StepContent outLink="https://github.com/datafuselabs/databend/releases/tag/${V}" number="" title="${formatTime(time)} (${V})">\n<${varName} />\n\n</StepContent>`;
  // posts.push({title: V, link: `https://github.com/datafuselabs/databend/releases/tag/${V}`, description: 'Databend release notes', pubDate: time})
});

const outputData = `---
sidebar_label: Databend Nightly
title: Databend Nightly Builds
sidebar_position: 2
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

This page presents a detailed record of Databend's Nightly Builds, offering insight into the daily progress of Databend with the latest updates and improvements.



${imports}

<StepsWrap> 

${content}

</StepsWrap> 
`;


fs.writeFileSync(outputPath, outputData);
fs.writeFileSync(outputPathCN, outputData);


