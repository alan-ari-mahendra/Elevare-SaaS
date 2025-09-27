"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { mockUser } from "@/lib/mock-data";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // simpan AbortController biar bisa cancel request lama
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // bikin debounce 500ms
    const handler = setTimeout(async () => {
      // cancel request sebelumnya kalau ada
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setResults(data);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Request dibatalkan");
        } else {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login";
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, tasks..."
              className="w-64 pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Result Dropdown */}
            {query && results.length > 0 && (
              <div className="absolute mt-1 w-64 rounded-md border bg-background shadow-lg">
                {results.map((item) => (
                  <Link
                    href={
                      item.type === "project"
                        ? `/projects/${item.id}`
                        : `/tasks/${item.id}`
                    }
                    key={item.id}
                    className="flex flex-row items-center justify-between cursor-pointer px-3 py-2 text-sm hover:bg-muted"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground capitalize">
                        ({item.type})
                      </span>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="absolute mt-1 w-64 rounded-md border bg-background shadow-lg p-2 text-sm text-muted-foreground">
                Loading...
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={mockUser.avatar_url || "/placeholder.svg"}
                    alt={mockUser.name}
                  />
                  <AvatarFallback>
                    {mockUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {mockUser.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
