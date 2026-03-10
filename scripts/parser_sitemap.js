// https://www.princexml.com/ download princexml first
const fs = require("fs");
const path = require("path");
const https = require("https");
const xml2js = require("xml2js");

const site = process.env.site;

if (!site || !["cn", "en"].includes(site)) {
  process.exit(1);
}

const domain = site === "cn" ? "cn" : "com";
const sitemapUrl = `https://docs.databend.${domain}/sitemap.xml`;
const sitemapPath = path.join(__dirname, `sitemap-${site}.xml`);
const outputFilePath = path.join("./", "pdf", `docs.databend.${site}-sql.txt`);

const excludeUrls = [
  `https://docs.databend.${domain}/`,
  `https://docs.databend.${domain}/download/`,
  `https://docs.databend.${domain}/search`,
];

if (!fs.existsSync(path.dirname(outputFilePath))) {
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
}

if (fs.existsSync(outputFilePath)) {
  console.log(`File ${outputFilePath} existed, delete it...`);
  fs.unlinkSync(outputFilePath);
}

function downloadSitemap(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      return resolve();
    }

    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed, error code：${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => reject(err));
      });
  });
}

(async () => {
  try {
    console.log(`sitemap：${site} (${sitemapUrl})`);

    await downloadSitemap(sitemapUrl, sitemapPath);
    console.log(`Finished：${sitemapPath}`);

    const xmlData = fs.readFileSync(sitemapPath, "utf8");

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("❌", err);
        return;
      }

      const urls = result.urlset.url
        .map((entry) => entry.loc[0]?.trim())
        .filter((url) => !excludeUrls.includes(url))
        .sort((a, b) => {
          const aHasGuides = a.includes("/guides/");
          const bHasGuides = b.includes("/guides/");
          if (aHasGuides && !bHasGuides) return -1;
          if (!aHasGuides && bHasGuides) return 1;
          return 0;
        });

      fs.writeFileSync(outputFilePath, urls.join("\n"), "utf8");
      console.log(`✅ Successed ${urls.length}, ${outputFilePath}`);
    });
  } catch (error) {
    console.error("❌ Failed:", error);
  }
})();
