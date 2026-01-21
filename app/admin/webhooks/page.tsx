"use client";

import * as React from "react";
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Admin page để quản lý và test webhook
 */
export default function AdminWebhooks() {
  const [webhookUrl, setWebhookUrl] = React.useState("");
  const [testResult, setTestResult] = React.useState<any>(null);
  const [testing, setTesting] = React.useState(false);

  React.useEffect(() => {
    // Get webhook URL
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/webhooks/bank-payment`);
    }
  }, []);

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const description = `Nap tien vao vi ${Date.now()}`;
      const response = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          amount: 50000,
          transactionId: `TXN-${Date.now()}`,
        }),
      });

      const data = await response.json();
      setTestResult({
        success: response.ok,
        status: response.status,
        data,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      alert("Đã sao chép webhook URL!");
    } catch (error) {
      console.error("Error copying:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Quản lý Webhook
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cấu hình và test webhook từ ngân hàng
        </p>
      </div>

      {/* Webhook URL */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg border bg-muted p-3 font-mono text-sm">
              {webhookUrl}
            </div>
            <Button variant="outline" onClick={handleCopyUrl}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Đăng ký URL này với ngân hàng để nhận webhook tự động
          </p>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Secret Key</span>
              <Badge variant={process.env.NEXT_PUBLIC_BANK_WEBHOOK_SECRET ? "default" : "outline"}>
                {process.env.NEXT_PUBLIC_BANK_WEBHOOK_SECRET ? "Đã cấu hình" : "Chưa cấu hình"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Set environment variable: <code className="bg-muted px-1 rounded">BANK_WEBHOOK_SECRET</code>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Algorithm</span>
              <Badge variant="outline">SHA256</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Thuật toán hash để verify signature
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Signature Header</span>
              <Badge variant="outline">x-signature</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Header name chứa signature từ ngân hàng
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Test Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Test webhook với dữ liệu mẫu. Chỉ hoạt động trong development mode.
          </p>

          <Button
            onClick={handleTestWebhook}
            disabled={testing || process.env.NODE_ENV === "production"}
            className="w-full"
          >
            {testing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang test...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Webhook
              </>
            )}
          </Button>

          {process.env.NODE_ENV === "production" && (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Test endpoint chỉ khả dụng trong development mode
                </p>
              </div>
            </div>
          )}

          {testResult && (
            <div
              className={`rounded-lg border p-4 ${
                testResult.success
                  ? "bg-green-500/10 border-green-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-medium">
                    {testResult.success ? "Test thành công!" : "Test thất bại"}
                  </div>
                  {testResult.status && (
                    <div className="text-xs text-muted-foreground">
                      HTTP Status: {testResult.status}
                    </div>
                  )}
                  <pre className="text-xs bg-black/5 dark:bg-white/5 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(testResult.data || testResult.error, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Đăng ký webhook URL với ngân hàng</p>
          <p>2. Nhận secret key từ ngân hàng</p>
          <p>3. Set environment variable: <code className="bg-muted px-1 rounded">BANK_WEBHOOK_SECRET</code></p>
          <p>4. Test webhook với nút "Test Webhook"</p>
          <p>5. Xem logs để debug nếu cần</p>
        </CardContent>
      </Card>
    </div>
  );
}
