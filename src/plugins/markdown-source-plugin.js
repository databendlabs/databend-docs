const fs = require('fs');
const path = require('path');

function cleanMarkdownForDisplay(content) {
  content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  content = content.replace(/^\s*\n/, '');
  return content;
}

module.exports = function (context, options) {
  return {
    name: 'markdown-source-plugin',
    async postBuild({ plugins, outDir }) {
      console.log('[markdown-source-plugin] Generating .md source files...');
      let processedCount = 0;
      
      const docsPlugins = plugins.filter(p => p.name === 'docusaurus-plugin-content-docs');
      
      for (const plugin of docsPlugins) {
        if (plugin.content && plugin.content.loadedVersions) {
          for (const version of plugin.content.loadedVersions) {
            for (const doc of version.docs) {
              try {
                let sourcePath = doc.source;
                let realSourcePath = sourcePath;
                if (sourcePath.startsWith('@site/')) {
                  realSourcePath = path.join(context.siteDir, sourcePath.replace('@site/', ''));
                }

                if (!fs.existsSync(realSourcePath)) continue;

                const rawContent = fs.readFileSync(realSourcePath, 'utf8');
                const cleanedContent = cleanMarkdownForDisplay(rawContent);

                let permalink = doc.permalink;
                if (permalink.endsWith('/')) {
                  permalink = permalink.slice(0, -1);
                }
                permalink = decodeURIComponent(permalink);

                let destPath = path.join(outDir, permalink + '.md');
                if (permalink === '' || permalink === '/') {
                  destPath = path.join(outDir, 'index.md');
                }

                const dir = path.dirname(destPath);
                if (!fs.existsSync(dir)) {
                  fs.mkdirSync(dir, { recursive: true });
                }

                fs.writeFileSync(destPath, cleanedContent, 'utf8');
                processedCount++;
              } catch (error) {
                console.error(`[markdown-source-plugin] Error processing doc:`, error.message);
              }
            }
          }
        }
      }
      console.log(`[markdown-source-plugin] Successfully generated ${processedCount} .md files.`);
    }
  };
};
