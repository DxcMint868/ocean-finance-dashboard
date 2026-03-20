"use client";

import { useState } from "react";
import { Upload, Button, Spin, Card, Typography, Space, Alert } from "antd";
import {
  InboxOutlined,
  FileOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { extractTextFromPdf } from "@/lib/pdf-extract";
import { parseStatement, type ParsedStatement } from "@/lib/preprocess";
import { validateTemplate } from "@/lib/validate-template";
import StatementPreview from "./StatementPreview";

type UploadState = "idle" | "parsing" | "done" | "error";

interface FileInfo {
  name: string;
  size: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadPanel() {
  const [state, setState] = useState<UploadState>("idle");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [statement, setStatement] = useState<ParsedStatement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleBeforeUpload(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF files are supported.");
      setState("error");
      return false;
    }

    setState("parsing");
    setFileInfo({ name: file.name, size: file.size });
    setStatement(null);
    setErrorMessage(null);

    try {
      console.log("[parse] extracting text…");
      const rawText = await extractTextFromPdf(file);
      console.log("[parse] extracted text length:", rawText.length);
      console.log("[parse] first 500 chars:", rawText.slice(0, 500));

      const parsed = parseStatement(rawText);
      console.log("[parse] header:", parsed.header);
      console.log("[parse] summary:", parsed.summary);
      console.log("[parse] tx rows:", parsed.rawTransactionRowCount);

      const validation = validateTemplate(parsed);
      console.log("[parse] validation:", validation);

      if (!validation.valid) {
        setErrorMessage(validation.reason ?? "File does not match the expected template.");
        setState("error");
        setFileInfo(null);
        return false;
      }

      setStatement(parsed);
      setState("done");
    } catch (err) {
      console.error("[parse] error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Failed to parse PDF: ${msg}`);
      setState("error");
      setFileInfo(null);
    }

    return false;
  }

  function handleClear() {
    setState("idle");
    setFileInfo(null);
    setStatement(null);
    setErrorMessage(null);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {state === "idle" && (
        <Upload.Dragger
          name="file"
          multiple={false}
          showUploadList={false}
          accept=".pdf"
          beforeUpload={handleBeforeUpload}
          style={{ borderRadius: 8 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: "#1677ff" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ fontSize: 16, fontWeight: 500 }}
          >
            Click or drag a PDF file here to upload
          </p>
          <p className="ant-upload-hint" style={{ color: "#8c8c8c" }}>
            Accepts PDF bank statements only. One file at a time.
          </p>
        </Upload.Dragger>
      )}

      {state === "parsing" && (
        <Card
          style={{
            borderRadius: 8,
            textAlign: "center",
            padding: "48px 24px",
          }}
        >
          <Spin size="large" />
          <Typography.Text
            style={{ display: "block", marginTop: 16, color: "#8c8c8c" }}
          >
            Parsing statement...
          </Typography.Text>
        </Card>
      )}

      {state === "error" && (
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Alert
            type="error"
            showIcon
            message="File Rejected"
            description={errorMessage ?? "The uploaded file could not be processed."}
          />
          <Button onClick={handleClear}>Try Again</Button>
        </Space>
      )}

      {state === "done" && fileInfo && statement && (
        <Space direction="vertical" style={{ width: "100%" }} size={20}>
          <Card
            style={{ borderRadius: 8 }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            <Space align="center" size={16}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#f6ffed",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FileOutlined style={{ fontSize: 20, color: "#52c41a" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography.Text
                  strong
                  ellipsis
                  style={{ display: "block", fontSize: 14 }}
                  title={fileInfo.name}
                >
                  {fileInfo.name}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatBytes(fileInfo.size)}
                </Typography.Text>
              </div>
              <Button
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleClear}
              >
                Clear
              </Button>
            </Space>
          </Card>

          <StatementPreview statement={statement} />
        </Space>
      )}

      {(state === "idle" || state === "parsing") && (
        <Space style={{ marginTop: 16, width: "100%", justifyContent: "flex-end" }}>
          <Button
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={state === "parsing"}
          >
            Clear
          </Button>
        </Space>
      )}
    </div>
  );
}
