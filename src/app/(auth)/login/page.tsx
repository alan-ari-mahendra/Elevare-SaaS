"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/** Kredensial admin praterisi untuk demo/showcase ke klien & tester. */
const DEMO_ADMIN_EMAIL = "admin@gmail.com";
const DEMO_ADMIN_PASSWORD = "password";

export default function LoginPage() {
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
    const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log("38 res")
    console.log(res)
    setIsLoading(false);

    if (res?.error) {
      toast({
        title: "Login failed",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login successful",
        description: "Welcome back to Elevare!",
      });
      router.push("/dashboard");
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 mb-6"
          >
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Elevare
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 space-y-1">
            <h3 className="text-xl font-semibold text-slate-900">Sign in</h3>
            <p className="text-sm text-slate-500">
              Enter your email and password to access your account
            </p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-indigo-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-500">
                Don&apos;t have an account?{" "}
              </span>
              <Link href="/register" className="text-indigo-500 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
