const axios = require("axios");
const bytes = require("bytes");
const { site_env } = process.env;
const isProduction = site_env === "production";
const mockData = require("./mock-data");
// Define constant
const LINUX_GENERIC_X86 = "Linux Generic (x86, 64-bit)";
const LINUX_GENERIC_ARM = "Linux Generic (ARM, 64-bit)";
const LINUX_UBUNTU_X86 = "Ubuntu (x86, 64-bit)";
const LINUX_UBUNTU_ARM = "Ubuntu (ARM, 64-bit)";
const MAC_X86 = "Mac Intel Chip (x86, 64-bit)";
const MAC_ARM = "Mac Apple Chip (ARM, 64-bit)";
const WINDOWS_X86 = "Windows (x86, 64-bit)";
const REPO_DATABEND = "https://repo.databend.com";
const GITHUB_DOWNLOAD =
  "https://github.com/databendlabs/databend/releases/download";
const GITHUB_REPO = "https://api.github.com/repos/databendlabs/databend";
const DATABEND_RELEASES = "https://repo.databend.com/databend/releases.json";
const DATABEND_DOWNLOAD = "https://repo.databend.com/databend";
const BENDSQL_RELEASES = "https://repo.databend.com/bendsql/releases.json";
const DATABEND_LATEST_RELEASE =
  "https://api.github.com/repos/databendlabs/databend/releases/latest";

const IGNORE_TEXT =
  /<!-- Release notes generated using configuration in .github\/release.yml at [\w.-]+ -->/;
const REG = /https:\/\/github\.com\/databendlabs\/databend\/pull\/(\d+)/g;
const REG_BENDSQL =
  /https:\/\/github\.com\/databendlabs\/bendsql\/pull\/(\d+)/g;
const REPLACE_TEXT = "[#$1](https://github.com/databendlabs/databend/pull/$1)";
const REPLACE_TEXT_BENS_SQL =
  "[#$1](https://github.com/databendlabs/bendsql/pull/$1)";
const PARTTERN =
  /https:\/\/github\.com\/databendlabs\/databend\/compare\/.*(\n|$)/;
const PARTTERN_BENDSQL =
  /https:\/\/github\.com\/databendlabs\/bendsql\/compare\/.*(\n|$)/;

module.exports = function fetchDatabendReleasesPlugin() {
  return {
    name: "fetch-databend-releases",
    async contentLoaded({ _, actions }) {
      const { setGlobalData } = actions;
      if (isProduction) {
        let releasesList = mockData.reOrigionList;
        let repoResource = {};
        let bendsqlRecource = [];
        try {
          const { data } = await axios.get(DATABEND_RELEASES);
          const { data: repo } = await axios.get(GITHUB_REPO);
          const { data: bendsqlReleases } = await axios.get(BENDSQL_RELEASES);
          releasesList = data?.filter(
            (item) => !item?.name?.includes("-nightly")
          );
          if (releasesList.length <= 0) {
            try {
              const { data: latestData } = await axios.get(
                DATABEND_LATEST_RELEASE
              );
              releasesList = [latestData];
            } catch (error) {
              releasesList = [data[0]];
            }
          }
          repoResource = repo;
          bendsqlRecource = dealBendsqlRecource(bendsqlReleases[0]);
        } catch (error) {
          releasesList = mockData.reOrigionList;
          repoResource = { stargazers_count: 8700 };
        }
        // Preprocessing data, Just part of it
        const releases = releasesList
          ?.filter((release) => release.assets?.length)
          .slice(0, 30);
        const processedData = releases?.map((release) => {
          const filterAssets = namesToMatch(release);
          const afterProcessedAssets = filterAssets
            .map((asset) => {
              const isApple = asset.name.includes("apple");
              const isAarch64 = asset.name.includes("aarch64");
              const isUbuntu = asset.name.includes("linux-gnu");
              const osTypeDesc = isApple
                ? isAarch64
                  ? MAC_ARM
                  : MAC_X86
                : isAarch64
                ? isUbuntu
                  ? LINUX_UBUNTU_ARM
                  : LINUX_GENERIC_ARM
                : isUbuntu
                ? LINUX_UBUNTU_X86
                : LINUX_GENERIC_X86;
              return {
                ...asset,
                isApple,
                isUbuntu,
                osTypeDesc,
                tag_name: release?.tag_name,
              };
            })
            .sort(
              (systemLinux, systemMac) =>
                systemMac.isUbuntu - systemLinux.isUbuntu
            )
            .sort(
              (systemLinux, systemMac) =>
                systemMac.isApple - systemLinux.isApple
            )
            .map((asset) => {
              const downloadUrl = asset?.browser_download_url?.replace(
                GITHUB_DOWNLOAD,
                DATABEND_DOWNLOAD
              );
              return {
                ...asset,
                formatSize: bytes.format(asset?.size, {
                  thousandsSeparator: ",",
                  decimalPlaces: 1,
                }),
                osType: asset?.osTypeDesc.match(/\(([^)]+)\)/)[1].split(",")[0],
                browser_download_url: downloadUrl,
              };
            });
          const tagURL = `https://github.com/databendlabs/databend/releases/tag/${release?.tag_name}`;
          return {
            ...release,
            tag_name: release?.tag_name,
            originAssets: release.assets,
            assets: afterProcessedAssets,
            filterBody: release.body
              .replace(IGNORE_TEXT, "")
              .replace(REG, REPLACE_TEXT)
              .replace(/\@[\w\-]+/g, "**$&**")
              .replace(PARTTERN, tagURL + "$1"),
          };
        });
        // name match list
        function namesToMatch(release) {
          const { assets, tag_name } = release;
          const namesDisplayList = [
            `databend-${tag_name}-aarch64-apple-darwin.tar.gz`,
            `databend-${tag_name}-x86_64-apple-darwin.tar.gz`,
            `databend-${tag_name}-aarch64-unknown-linux-musl.tar.gz`,
            `databend-${tag_name}-x86_64-unknown-linux-gnu.tar.gz`,
            `databend-${tag_name}-aarch64-unknown-linux-gnu.tar.gz`,
            `databend-${tag_name}-x86_64-unknown-linux-musl.tar.gz`,
          ];
          const filteredAssets = assets?.filter((item) => {
            return namesDisplayList?.includes(item?.name);
          });
          return filteredAssets;
        }
        function dealBendsqlRecource(bendsqlRecource) {
          const assets = bendsqlRecource.assets;
          const filterAsstets = assets
            ?.filter(
              (asset) =>
                asset.name?.includes(".tar.gz") ||
                asset.name?.includes("msvc.zip")
            )
            ?.map((asset) => {
              const isApple = asset.name.includes("apple");
              const isAarch64 = asset.name.includes("aarch64");
              const isUbuntu = asset.name.includes("linux-gnu");
              const isWindows = asset.name.includes("pc-windows");
              let osTypeDesc = isApple
                ? isAarch64
                  ? MAC_ARM
                  : MAC_X86
                : isAarch64
                ? isUbuntu
                  ? LINUX_UBUNTU_ARM
                  : LINUX_GENERIC_ARM
                : isUbuntu
                ? LINUX_UBUNTU_X86
                : LINUX_GENERIC_X86;
              osTypeDesc = isWindows ? WINDOWS_X86 : osTypeDesc;
              return {
                ...asset,
                isApple,
                isAarch64,
                isUbuntu,
                osTypeDesc,
                isWindows,
                formatSize: bytes.format(asset?.size, {
                  thousandsSeparator: ",",
                  decimalPlaces: 1,
                }),
                browser_download_url: asset?.browser_download_url
                  ?.replace("https://github.com/databendlabs", REPO_DATABEND)
                  ?.replace("/releases/download", ""),
              };
            })
            .sort(
              (system, systemOther) => system.isWindows - systemOther.isWindows
            )
            .sort(
              (systemLinux, systemMac) =>
                systemMac.isUbuntu - systemLinux.isUbuntu
            )
            .sort(
              (systemLinux, systemMac) =>
                systemMac.isApple - systemLinux.isApple
            );
          const tagURL = `https://github.com/databendlabs/bendsql/releases/tag/${bendsqlRecource?.name}`;
          return {
            ...bendsqlRecource,
            filterBody: bendsqlRecource.body
              .replace(IGNORE_TEXT, "")
              .replace(REG_BENDSQL, REPLACE_TEXT_BENS_SQL)
              .replace(/\@[\w\-]+/g, "**$&**")
              .replace(PARTTERN_BENDSQL, tagURL + "$1"),
            assets: filterAsstets,
          };
        }
        const name = releasesList[0]?.name || "v1.2.530";
        // Set global data
        setGlobalData({
          releasesList: processedData,
          repoResource,
          name,
          stargazersCount: repoResource.stargazers_count,
          bendsqlRecource,
        });
      } else {
        setGlobalData(mockData);
      }
    },
  };
};
