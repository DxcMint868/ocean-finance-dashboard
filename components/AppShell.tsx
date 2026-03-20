"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import DashboardLayout from "@/components/DashboardLayout";
import themeConfig from "@/theme/themeConfig";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={themeConfig}>
        <DashboardLayout>{children}</DashboardLayout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
