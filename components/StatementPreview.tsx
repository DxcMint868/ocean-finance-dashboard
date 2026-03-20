"use client";

import {
  Card,
  Descriptions,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ParsedStatement, ParsedTransaction } from "@/lib/preprocess";

interface StatementPreviewProps {
  statement: ParsedStatement;
}

function formatAmount(value: string | null): string {
  if (value === null) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const columns: ColumnsType<ParsedTransaction> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 130,
    render: (val: string) => (
      <Typography.Text style={{ whiteSpace: "nowrap" }}>{val}</Typography.Text>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
  },
  {
    title: "Debit",
    dataIndex: "debit",
    key: "debit",
    width: 120,
    align: "right",
    render: (val: string | null) =>
      val ? (
        <Typography.Text style={{ color: "#cf1322", fontVariantNumeric: "tabular-nums" }}>
          {formatAmount(val)}
        </Typography.Text>
      ) : (
        <Typography.Text type="secondary">—</Typography.Text>
      ),
  },
  {
    title: "Credit",
    dataIndex: "credit",
    key: "credit",
    width: 120,
    align: "right",
    render: (val: string | null) =>
      val ? (
        <Typography.Text style={{ color: "#389e0d", fontVariantNumeric: "tabular-nums" }}>
          {formatAmount(val)}
        </Typography.Text>
      ) : (
        <Typography.Text type="secondary">—</Typography.Text>
      ),
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    width: 130,
    align: "right",
    render: (val: string | null) => (
      <Typography.Text strong style={{ fontVariantNumeric: "tabular-nums" }}>
        {formatAmount(val)}
      </Typography.Text>
    ),
  },
];

export default function StatementPreview({ statement }: StatementPreviewProps) {
  const { header, summary, transactions } = statement;

  const currency = header.currency ?? "SGD";

  const statSuffix = <span style={{ fontSize: 12, color: "#8c8c8c", marginLeft: 4 }}>{currency}</span>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card
        title="Account Information"
        size="small"
        style={{ borderRadius: 8 }}
      >
        <Descriptions
          column={{ xs: 1, sm: 2, md: 2, lg: 4 }}
          size="small"
          styles={{ label: { color: "#8c8c8c", fontWeight: 500 } }}
        >
          <Descriptions.Item label="Account Holder">
            {header.accountHolder ?? (
              <Typography.Text type="secondary">Unknown</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            {header.accountNumber ? (
              <Tag color="blue">{header.accountNumber}</Tag>
            ) : (
              <Typography.Text type="secondary">Unknown</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {header.currency ? (
              <Tag>{header.currency}</Tag>
            ) : (
              <Typography.Text type="secondary">Unknown</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Statement Period">
            {header.statementPeriod ?? (
              <Typography.Text type="secondary">Unknown</Typography.Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Summary" size="small" style={{ borderRadius: 8 }}>
        <Row gutter={[24, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Opening Balance"
              value={summary.openingBalance ?? "—"}
              suffix={summary.openingBalance ? statSuffix : undefined}
              valueStyle={{ fontSize: 18, fontVariantNumeric: "tabular-nums" }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Closing Balance"
              value={summary.closingBalance ?? "—"}
              suffix={summary.closingBalance ? statSuffix : undefined}
              valueStyle={{
                fontSize: 18,
                fontVariantNumeric: "tabular-nums",
                color: "#1677ff",
              }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Total Debit"
              value={summary.totalDebit ?? "—"}
              suffix={summary.totalDebit ? statSuffix : undefined}
              valueStyle={{
                fontSize: 18,
                fontVariantNumeric: "tabular-nums",
                color: "#cf1322",
              }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Total Credit"
              value={summary.totalCredit ?? "—"}
              suffix={summary.totalCredit ? statSuffix : undefined}
              valueStyle={{
                fontSize: 18,
                fontVariantNumeric: "tabular-nums",
                color: "#389e0d",
              }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <span>
            Transactions{" "}
            <Tag color="default" style={{ fontWeight: 400 }}>
              {transactions.length} rows
            </Tag>
          </span>
        }
        size="small"
        style={{ borderRadius: 8 }}
      >
        <Table<ParsedTransaction>
          columns={columns}
          dataSource={transactions.map((tx, i) => ({ ...tx, key: i }))}
          pagination={{ pageSize: 10, showSizeChanger: false, size: "small" }}
          size="small"
          scroll={{ x: 600 }}
          locale={{ emptyText: "No transactions found" }}
        />
      </Card>
    </div>
  );
}
