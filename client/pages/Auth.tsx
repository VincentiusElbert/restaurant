import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, register } from "@/services/api/auth";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get("mode");
    if (m === "login" || m === "register") setMode(m);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const remember = fd.get("remember") === "on";
    try {
      if (mode === "login") {
        const data = await login(
          String(fd.get("email")),
          String(fd.get("password")),
        );
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("auth_token", data.token);
      } else {
        const data = await register(
          String(fd.get("name")),
          String(fd.get("email")),
          String(fd.get("password")),
        );
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("auth_token", data.token);
      }
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fcf8594e38e724fa3abfa91ad793c6168%2F9dff027f661b4b26834b11a1a7ad91a5?format=webp&width=1200"
          alt="Food visual"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto px-6">
            <div className="mb-6">
              <div className="text-3xl font-extrabold">Welcome Back</div>
              <div className="text-sm text-muted-foreground">
                Good to see you again! Let’s eat
              </div>
            </div>
            <div className="rounded-2xl bg-muted p-1 flex mb-4">
              <button
                className={`flex-1 h-10 rounded-xl ${mode === "login" ? "bg-white font-bold" : "text-muted-foreground"}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`flex-1 h-10 rounded-xl ${mode === "register" ? "bg-white font-bold" : "text-muted-foreground"}`}
                onClick={() => setMode("register")}
                type="button"
              >
                Sign up
              </button>
            </div>
            <form className="space-y-3" onSubmit={onSubmit}>
              {mode === "register" && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
                {error && (
                  <div className="text-xs text-red-600 mt-1">{error}</div>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                {error && (
                  <div className="text-xs text-red-600 mt-1">{error}</div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="remember" className="h-4 w-4" />
                Remember Me
              </label>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Login"
                    : "Register"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
