import React, { useEffect } from "react";
import { useHistory } from "@docusaurus/router";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default function HomeRedirect() {
  const history = useHistory();
  useEffect(() => {
    if (ExecutionEnvironment?.canUseDOM) {
      history.replace("/guides/");
    }
  }, []);
  return null;
}
