import React from "react";
import { getReleaseVersion } from "@site/src/utils/tools";

const Version = ({ children }) => {
  const version = getReleaseVersion(); // Fetch the version dynamically

  const replaceVersionInText = (text) => text.replace(/\[version\]/g, version);

  const processChildren = (child) => {
    if (typeof child === "string") {
      return replaceVersionInText(child);
    }
    if (React.isValidElement(child)) {
      const props = child.props as any;
      if (typeof props?.children === "string") {
        return React.cloneElement(child, {
          ...props,
          children: replaceVersionInText(props?.children),
        });
      } else {
        return React.cloneElement(child, {
          ...props,
          children: React.Children.map(props?.children, processChildren),
        });
      }
    }
    return child;
  };

  return <>{React.Children.map(children, processChildren)}</>;
};

export default Version;
