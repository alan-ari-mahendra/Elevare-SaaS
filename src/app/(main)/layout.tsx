import ProtectedRoute from "@/contexts/protectedRoute";
import type React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
