import React, { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const Home = () => {
  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = '/guides';
    }
  }, []);

  return <></>;
};

export default Home;
