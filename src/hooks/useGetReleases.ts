import { usePluginData } from "@docusaurus/useGlobalData";
import { IGlobalData } from "@site/src/types/download";

function numberFormat(num: number): string | number {
  return num < 1000 ? num : (num / 1000).toFixed(1) + 'K';
}
const useGetReleases = () => {
  const { releasesList, repoResource, stargazersCount, bendsqlRecource } = usePluginData('fetch-databend-releases') as IGlobalData;
  const name = releasesList[0]?.name || 'v1.2.307';
  const formatStargazersCount = numberFormat(stargazersCount);
  return {
    releasesList,
    tagName: name,
    name,
    repoResource,
    stargazersCount,
    formatStargazersCount,
    bendsqlRecource
  };
};
export default useGetReleases;

