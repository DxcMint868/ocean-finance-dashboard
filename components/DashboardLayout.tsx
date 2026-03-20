"use client";

import { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { UploadOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/upload-statement",
    icon: <UploadOutlined />,
    label: <Link href="/upload-statement">Upload Statement</Link>,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ position: "fixed", height: "100vh", left: 0, top: 0, bottom: 0, zIndex: 100 }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? 0 : "0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {!collapsed && (
            <Typography.Text strong style={{ color: "#fff", fontSize: 16, whiteSpace: "nowrap" }}>
              StatementApp
            </Typography.Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "margin-left 0.2s" }}>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 24px",
            background: "#001529",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <Typography.Text strong style={{ color: "#fff", fontSize: 16 }}>
            Dashboard
          </Typography.Text>
        </Header>

        <Content
          style={{
            padding: 32,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
