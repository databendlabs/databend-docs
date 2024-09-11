const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

const sitemapPath = path.join(__dirname, "sitemap.xml");

const outputFilePath = path.join(__dirname, "pdf", "docs.databend.com-sql.txt");

if (!fs.existsSync(path.dirname(outputFilePath))) {
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
}

if (fs.existsSync(outputFilePath)) {
  console.log(`file ${outputFilePath} existed, delete it...`);
  fs.unlinkSync(outputFilePath);
}

const excludeUrls = [
  "https://docs.databend.com/",
  "https://docs.databend.com/download/",
  "https://docs.databend.com/search",
];

try {
  const xmlData = fs.readFileSync(sitemapPath, "utf8");

  xml2js.parseString(xmlData, (err, result) => {
    if (err) {
      console.error("XML pasrder errors", err);
      return;
    }

    const urls = result.urlset.url
      .map((entry) => entry.loc[0])
      .filter((url) => !excludeUrls.includes(url));

    fs.writeFileSync(outputFilePath, urls.join("\n"), "utf8");

    console.log(`${urls.length}, ${outputFilePath}`);
  });
} catch (error) {
  console.error("file read errors:", error);
}
