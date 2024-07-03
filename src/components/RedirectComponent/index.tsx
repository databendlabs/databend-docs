import React, { memo, useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const RedirectComponent = ({ to }: { to: string }) => {
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM && window.location.hostname === 'databend.rs') {
      window.location.href = window.location.href?.replace(window.location.origin, to);
    }
  }, [to]);
  return <></>;
};

export default memo(RedirectComponent);
