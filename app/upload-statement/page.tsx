"use client";

import { Typography } from "antd";
import UploadPanel from "@/components/UploadPanel";

export default function UploadStatementPage() {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>
        Upload Statement
      </Typography.Title>
      <UploadPanel />
    </div>
  );
}
