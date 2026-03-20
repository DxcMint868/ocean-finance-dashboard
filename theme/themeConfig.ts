import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      headerBg: "#001529",
      siderBg: "#001529",
    },
    Menu: {
      darkItemBg: "#001529",
      darkSubMenuItemBg: "#000c17",
    },
  },
};

export default themeConfig;
