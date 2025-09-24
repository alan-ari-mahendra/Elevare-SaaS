import AuthRoute from "@/contexts/authRoute";
import type React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthRoute>{children}</AuthRoute>
    </>
  );
}
