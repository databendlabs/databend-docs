const fs = require("fs");
const path = require("path");
const axios = require("axios");

const RELEASES_API =
  "https://api.github.com/repos/databendlabs/databend/releases";
const MAX_RELEASES = 30;
const MAX_PAGES = 5;
const GITHUB_RELEASE_BASE =
  "https://github.com/databendlabs/databend/releases/tag";
const IGNORE_TEXT =
  /<!-- Release notes generated using configuration in .github\/release.yml at [\w.-]+ -->/g;
const REG =
  /(?<!\]\()https:\/\/github\.com\/databendlabs\/databend\/pull\/(\d+)/g;
const REPLACE_TEXT =
  "[#$1](https://github.com/databendlabs/databend/pull/$1)";
const PARTTERN =
  /https:\/\/github\.com\/databendlabs\/databend\/compare\/.*(\n|$)/;

const docsDir = path.join(__dirname, "./docs/release-stable");
const releaseNote = path.join(__dirname, "./docs/en/release-notes");
const releaseNoteCN = path.join(__dirname, "./docs/cn/release-notes");
const outputPath = path.join(releaseNote, "databend.md");
const outputPathCN = path.join(releaseNoteCN, "databend.md");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function formatTime(dateStr) {
  if (!dateStr) {
    return "Unknown date";
  }
  const options = { year: "numeric", month: "short", day: "numeric" };
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-US", options);
}

function sanitizeBody(body = "", tag = "") {
  if (!body.trim()) {
    return "_No release notes provided._";
  }
  const tagURL = `${GITHUB_RELEASE_BASE}/${tag}`;
  return body
    .replace(/\r\n/g, "\n")
    .replace(IGNORE_TEXT, "")
    .replace(/\@[\w\-]+/g, "**$&**")
    .replace(PARTTERN, `${tagURL}$1`)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(REG, REPLACE_TEXT)
    .trim();
}

function buildTemplate(content = "") {
  return `---
sidebar_label: Databend Releases
title: Databend Releases
sidebar_position: 1
slug: /
---

import StepsWrap from '@site/src/components/StepsWrap';
import StepContent from '@site/src/components/Steps/step-content';

This page provides information about recent features, enhancements, and bug fixes for <a href="https://github.com/databendlabs/databend">Databend</a>.

${content}
`;
}

function normalizeGithubRelease(release) {
  const version = release?.tag_name || release?.name || "Unknown version";
  const releaseDate = release?.published_at || release?.created_at || "";
  const releaseUrl =
    release?.html_url || `${GITHUB_RELEASE_BASE}/${version}`;

  return {
    version,
    releaseDate,
    outLink: releaseUrl,
    body: release?.body || "",
  };
}

function parseLocalReleases() {
  try {
    const mdFiles = fs
      .readdirSync(docsDir)
      .filter((file) => file.endsWith(".md") && file !== "index.md");

    return mdFiles
      .map((file) => {
        const filePath = path.join(docsDir, file);
        const raw = fs.readFileSync(filePath, "utf8");
        const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!match) {
          return null;
        }
        const [, frontMatter, body = ""] = match;
        const meta = {};
        frontMatter
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .forEach((line) => {
            const [key, ...rest] = line.split(":");
            if (!key || rest.length === 0) {
              return;
            }
            meta[key.trim()] = rest.join(":").trim();
          });

        const [timePart, versionWithExt] = file.split("_");
        const versionFromFile = versionWithExt?.replace(/\.md$/i, "");
        const version = meta.tag || meta.title || versionFromFile;
        const releaseDate = meta.created || `${timePart}T00:00:00Z`;
        const outLink =
          meta.url || `${GITHUB_RELEASE_BASE}/${version || versionFromFile}`;

        return {
          version: version || "Unknown version",
          releaseDate,
          outLink,
          body: body.trim(),
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.warn(
      `Failed to parse local release entries: ${error?.message || error}`
    );
    return [];
  }
}

function buildContent(releases) {
  if (!releases?.length) {
    return "";
  }

  return (
    "<StepsWrap> \n\n" +
    releases
      .map((release, index) => {
        const number = index === 0 ? "-1" : "";
        const releaseDate = release.releaseDate || "";
        const version = release.version || "Unknown version";
        const outLink = release.outLink || `${GITHUB_RELEASE_BASE}/${version}`;
        const body = sanitizeBody(release.body || "", version);
        const defaultCollapsed = index >= 2 ? "true" : "false";

        return `<StepContent outLink="${outLink}" number="${number}" defaultCollapsed={${defaultCollapsed}}>

## ${formatTime(releaseDate)} (${version})

${body}

</StepContent>`;
      })
      .join("\n\n") +
    "\n\n</StepsWrap> "
  );
}

function sortAndTrimReleases(releases = []) {
  return releases
    .filter((release) => release?.version)
    .sort((a, b) => {
      const timeA = new Date(a.releaseDate || 0).getTime();
      const timeB = new Date(b.releaseDate || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, MAX_RELEASES);
}

function mergeReleases(primary = [], secondary = []) {
  const seen = new Set();
  const merged = [];

  primary.forEach((release) => {
    if (!release?.version || seen.has(release.version)) {
      return;
    }
    merged.push(release);
    seen.add(release.version);
  });

  secondary.forEach((release) => {
    if (!release?.version || seen.has(release.version)) {
      return;
    }
    merged.push(release);
    seen.add(release.version);
  });

  return merged;
}

async function fetchRemoteReleases() {
  try {
    const collected = [];
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      if (collected.length >= MAX_RELEASES) {
        break;
      }
      const requestConfig = {
        params: {
          per_page: 100,
          page,
        },
        headers: {
          "User-Agent": "databend-docs-release-index-generator",
          Accept: "application/vnd.github+json",
          ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
        },
        timeout: 15000,
      };
      let data;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const response = await axios.get(RELEASES_API, requestConfig);
          data = response.data;
          break;
        } catch (error) {
          if (attempt === 3) {
            throw error;
          }
          await sleep(500 * attempt);
        }
      }

      if (!Array.isArray(data) || data.length === 0) {
        break;
      }

      const filtered = data.filter(
        (release) => !release.draft && release.tag_name
      );

      collected.push(...filtered);
    }

    if (collected.length === 0) {
      return null;
    }

    return sortAndTrimReleases(
      collected.map((release) => normalizeGithubRelease(release))
    );
  } catch (error) {
    console.warn(
      `Failed to fetch releases from GitHub: ${error?.message || error}`
    );
    return null;
  }
}

async function fetchRepoReleases() {
  try {
    const { data } = await axios.get(
      "https://repo.databend.com/databend/releases.json",
      {
        timeout: 15000,
      }
    );

    if (!Array.isArray(data)) {
      return null;
    }

    const filtered = data.filter(
      (release) => !release.draft && release.tag_name
    );

    return sortAndTrimReleases(
      filtered.map((release) => normalizeGithubRelease(release))
    );
  } catch (error) {
    console.warn(
      `Failed to fetch releases from repo.databend.com: ${
        error?.message || error
      }`
    );
    return null;
  }
}

async function main() {
  let releases = await fetchRemoteReleases();

  if (!releases || releases.length === 0) {
    const repoReleases = await fetchRepoReleases();
    if (repoReleases?.length) {
      releases = mergeReleases(repoReleases, parseLocalReleases());
      releases = sortAndTrimReleases(releases);
    } else {
      releases = sortAndTrimReleases(parseLocalReleases());
    }
  }

  const content = buildContent(releases);
  const outputData = buildTemplate(content);

  fs.writeFileSync(outputPath, outputData);
  fs.writeFileSync(outputPathCN, outputData);

  console.log("generated");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
