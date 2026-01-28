import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useMount } from "ahooks";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

function Download() {
  const {
    siteConfig: {
      customFields: { homeLink },
    },
  } = useDocusaurusContext() as any;
  useMount(() => {
    if (ExecutionEnvironment?.canUseDOM) {
      window.location.href = `${homeLink}/download/`;
    }
  });
  return null;
}

export default Download;
