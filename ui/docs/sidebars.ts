import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  sidebar: [
    {
      type: "category",
      label: "GET STARTED",
      items: [
        "overview",
        "quickstart",
        "models"
      ],
      collapsible: false,
      collapsed: false,
    },
  ],
};

export default sidebars;