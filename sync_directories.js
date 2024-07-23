const fs = require("fs");
const path = require("path");

const EN_DIR = path.join(__dirname, "docs/en");
const CN_DIR = path.join(__dirname, "docs/cn");
const EXCLUSIONS_FILE = path.join(__dirname, "sync_exclusions.txt");

let exclusions = [];

function loadExclusions() {
  try {
    exclusions = fs
      .readFileSync(EXCLUSIONS_FILE, "utf-8")
      .split("\n")
      .map((line) => path.join(__dirname, line.trim())) // 使用完整路径匹配
      .filter((line) => line !== "");
  } catch (err) {
    console.error(`Error reading exclusions file: ${err}`);
  }
}

function isExcluded(cnFilePath) {
  // 确保路径以统一的方式比较
  return exclusions.some((exclusion) => cnFilePath.startsWith(exclusion));
}

function deleteExtraFilesInCN(cnPath, enPath) {
  fs.readdir(cnPath, { withFileTypes: true }, (err, cnFiles) => {
    if (err) {
      console.error(`Error reading directory ${cnPath}: ${err}`);
      return;
    }

    cnFiles.forEach((cnFile) => {
      const cnFilePath = path.join(cnPath, cnFile.name);
      const enFilePath = path.join(enPath, cnFile.name);

      if (!fs.existsSync(enFilePath) && !isExcluded(cnFilePath)) {
        // File or directory does not exist in EN and is not excluded, delete it from CN
        fs.rm(cnFilePath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error removing ${cnFilePath}: ${err}`);
          } else {
            console.log(`Removed: ${cnFilePath}`);
          }
        });
      } else if (cnFile.isDirectory() && fs.existsSync(enFilePath)) {
        // Recursively check this directory
        deleteExtraFilesInCN(cnFilePath, enFilePath);
      }
    });
  });
}

// Start the synchronization process
fs.access(EN_DIR, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`The directory ${EN_DIR} does not exist.`);
  } else {
    fs.access(CN_DIR, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`The directory ${CN_DIR} does not exist.`);
      } else {
        loadExclusions();
        deleteExtraFilesInCN(CN_DIR, EN_DIR);
      }
    });
  }
});
