const fs = require('fs');
const path = require('path');


const docsDir = path.join(__dirname, './docs/doc/80-releases');
const releaseNote = path.join(__dirname, './docs/release-notes');
const outputPath = path.join(docsDir, 'index.md');

function formatTime(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('en-US', options);
}

const mdFiles = fs.readdirSync(releaseNote).filter(file => file.endsWith('.md') && file !== 'index.md')?.reverse();

let imports = '';
let content = '';

mdFiles?.forEach((file, index) => {
  const [time, version] = file.split('_');
  const V = version.slice(0, -3);
  const varName = `MD${index + 1}`;
  imports += `import ${varName} from '../../release-notes/${file}';\n`;
  content += `\n\n<StepContent outLink="https://github.com/datafuselabs/databend/releases/tag/${V}" number="" title="${formatTime(time)}">\n\n<p>${V}</p>\n<${varName} />\n\n</StepContent>`;
  // posts.push({title: V, link: `https://github.com/datafuselabs/databend/releases/tag/${V}`, description: 'Databend release notes', pubDate: time})
});

const outputData = `---
title: Release notes
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

The latest product updates from [Databend](https://github.com/datafuselabs/databend)



${imports}

<StepsWrap> 

${content}

</StepsWrap> 
`;

fs.writeFileSync(outputPath, outputData);


