const fs = require("fs-extra");
const path = require("path");
// List of files to process
const filesToProcess = require("./generate-language-block-url.js");

// Regular expressions for English and Chinese blocks
const EN_BLOCK_REGEX = /<!-- #ifendef -->\s*([\s\S]*?)\s*<!-- #endendef -->/g;
const CN_BLOCK_REGEX = /<!-- #ifcndef -->\s*([\s\S]*?)\s*<!-- #endcndef -->/g;

async function processFiles(language, action) {
  for (const file of filesToProcess) {
    const filePath = path.resolve(file);
    if (fs.existsSync(filePath)) {

      let fileContent = await fs.readFile(filePath, "utf-8");

      if (language === "en") {
        if (action === "block_before") {
          // Comment out Chinese blocks and keep English blocks
          fileContent = fileContent.replace(CN_BLOCK_REGEX, (match, p1) => {
            return `<!-- #ifcndef -->\n<!--\n${p1}\n-->\n<!-- #endcndef -->`; // Comment out and ensure line breaks
          });
        } else if (action === "block_after") {
          // Restore Chinese blocks by removing comments and cleaning up extra line breaks
          fileContent = fileContent.replace(
            /<!-- #ifcndef -->\n<!--\n([\s\S]*?)\n-->\n<!-- #endcndef -->/g,
            (match, p1) => {
              // Restore content directly and ensure no extra line breaks
              return `<!-- #ifcndef -->\n${p1.trim()}\n<!-- #endcndef -->`;
            }
          );
        }
      } else if (language === "cn") {
        if (action === "block_before") {
          // Comment out English blocks and keep Chinese blocks
          fileContent = fileContent.replace(EN_BLOCK_REGEX, (match, p1) => {
            return `<!-- #ifendef -->\n<!--\n${p1}\n-->\n<!-- #endendef -->`; // Comment out and ensure line breaks
          });
        } else if (action === "block_after") {
          // Restore English blocks by removing comments and cleaning up extra line breaks
          fileContent = fileContent.replace(
            /<!-- #ifendef -->\n<!--\n([\s\S]*?)\n-->\n<!-- #endendef -->/g,
            (match, p1) => {
              // Restore content directly and ensure no extra line breaks
              return `<!-- #ifendef -->\n${p1.trim()}\n<!-- #endendef -->`;
            }
          );
        }
      }

      // Write back to the file
      await fs.writeFile(filePath, fileContent, "utf-8");
    } else {
      console.log(`File not found: ${filePath}`);
    }
  }
}

// Run the appropriate function based on command line arguments
const args = process.argv.slice(2);
if (args[0] === "block_before:en") {
  processFiles("en", "block_before");
} else if (args[0] === "block_after:en") {
  processFiles("en", "block_after");
} else if (args[0] === "block_before:cn") {
  processFiles("cn", "block_before");
} else if (args[0] === "block_after:cn") {
  processFiles("cn", "block_after");
} else {
  console.log(
    "Please use block_before:en, block_after:en, block_before:cn, or block_after:cn"
  );
}
