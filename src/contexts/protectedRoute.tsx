/**
 * Auth Route Component
 *
 * Wrapper component that ensures user is authenticated before accessing protected pages
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSessionUser } from "@/hooks/useSessionUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useSessionUser();
  const router = useRouter();

  useEffect(() => {
    console.log("Protected Route", isAuthenticated);
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[999]">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
            <p className="text-primary-foreground/70">
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}

export default ProtectedRoute;
