import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import FooterCopyright from "@theme/Footer/Copyright";

function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();

  if (!footer) {
    return null;
  }
  const { copyright } = footer;

  return (
    <footer>
      {/* Main footer content with light background */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        
      </div>
      
      {/* Copyright section with dark background */}
      <div className="bg-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <FooterCopyright copyright={copyright} />
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
