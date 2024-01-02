import { usePluginData } from "@docusaurus/useGlobalData";
import { IGlobalData } from "@site/src/types/download";

function numberFormat(num: number): string | number {
  return num < 1000 ? num : (num / 1000).toFixed(1) + 'K';
}
const useGetReleases = () => {
  const { releasesList, repoResource, stargazersCount, bendsqlRecource } = usePluginData('fetch-databend-releases') as IGlobalData;
  const tagName = releasesList[0]?.tag_name??'v1.0.22-nightly';
  const formatStargazersCount = numberFormat(stargazersCount);
  return {
    releasesList,
    tagName,
    name: releasesList[0]?.name,
    repoResource,
    stargazersCount,
    formatStargazersCount,
    bendsqlRecource
  };
};
export default useGetReleases;

