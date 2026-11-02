import { useState, useEffect } from "react"

import { Card, Button, Typography, Tag, Space, Row, Col, Badge } from "antd"

import {
  RocketOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"
const { Title, Paragraph, Text } = Typography

interface HealthStatus {
  success: boolean
  data?: {
    status: string
  }
}

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "")

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/health`)

      .then((res) => res.json())

      .then((data: HealthStatus) => {
        setHealth(data)

        setLoading(false)
      })

      .catch(() => {
        setHealth({ success: false })

        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Tag
            color="blue"
            className="px-3 py-1 text-sm font-semibold rounded-full"
          >
            ⚡ Powered by Vite 6 + React 19
          </Tag>
          <Title
            level={1}
            className="!text-4xl md:!text-5xl !font-extrabold tracking-tight"
          >
            Agentic Full-Stack Boilerplate
          </Title>
          <Paragraph className="!text-lg !text-slate-600 max-w-2xl mx-auto">
            High-velocity development stack for human developers and autonomous
            AI agents. Vite 6, Ant Design 5, Tailwind CSS 4, and Node.js 22 LTS.
          </Paragraph>

          <Space size="middle" className="pt-2">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              href={`${apiBaseUrl}/api/health`}
              target="_blank"
            >
              Inspect Backend Health
            </Button>
          </Space>
        </div>

        {/* Backend Live Status Card */}
        <Card className="shadow-sm border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Title level={4} className="!mb-1 flex items-center gap-2">
                <ApiOutlined className="text-blue-500" /> API Gateway Link
              </Title>
              <Text type="secondary">
                Verifies cross-workspace communication between Vite frontend and
                Node.js API service.
              </Text>
            </div>
            <div>
              {loading ? (
                <Tag color="processing">Checking connection...</Tag>
              ) : health?.success ? (
                <Badge status="success" text="API Online" />
              ) : (
                <Badge status="error" text="API Offline or Unreachable" />
              )}
            </div>
          </div>
        </Card>

        {/* Feature Cards Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable className="h-full border-slate-200">
              <Space direction="vertical" size="small">
                <SafetyCertificateOutlined className="text-2xl text-emerald-500" />
                <Title level={4} className="!mb-0">
                  Shared Contracts
                </Title>
                <Paragraph type="secondary" className="!mb-0">
                  Zod schemas and TypeScript types in{" "}
                  <code>@workspace/contracts</code> eliminate cross-boundary
                  drift.
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable className="h-full border-slate-200">
              <Space direction="vertical" size="small">
                <ThunderboltOutlined className="text-2xl text-amber-500" />
                <Title level={4} className="!mb-0">
                  Instant Vite HMR
                </Title>
                <Paragraph type="secondary" className="!mb-0">
                  Sub-second module replacement and native ESM bundling with
                  Tailwind v4 engine.
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable className="h-full border-slate-200">
              <Space direction="vertical" size="small">
                <RocketOutlined className="text-2xl text-indigo-500" />
                <Title level={4} className="!mb-0">
                  Pluggable DB
                </Title>
                <Paragraph type="secondary" className="!mb-0">
                  Switch between offline in-memory storage and PostgreSQL with
                  zero code changes.
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  )
}
