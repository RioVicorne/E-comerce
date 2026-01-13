"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogIn, Lock, User, AlertCircle } from "lucide-react";

import { login, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);

    if (success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      setLoading(false);
    }
  };

  return (
    <div className="app-bg flex min-h-dvh items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-25" />
      
      <Card className="relative w-full max-w-md">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-400/10" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-center">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-cyan-400/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
              <Lock className="h-8 w-8 text-white" />
              <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-cyan-400/20 opacity-0 blur-md transition" />
            </div>
          </div>
          <CardTitle className="mt-4 text-center text-2xl font-extrabold tracking-tight">
            Đăng nhập Admin
          </CardTitle>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Vui lòng đăng nhập để truy cập bảng điều khiển
          </p>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.20)]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-semibold text-foreground"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-11"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
