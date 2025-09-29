import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus, Users } from "lucide-react";

export function DashboardQuickActions() {
  return(
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks to get you started</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/projects/new">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 w-full bg-transparent"
            >
              <Plus className="h-6 w-6" />
              <span>Create Project</span>
            </Button>
          </Link>
          <Link href="/projects">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 w-full bg-transparent"
            >
              <BarChart3 className="h-6 w-6" />
              <span>View Projects</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 w-full bg-transparent"
            >
              <Users className="h-6 w-6" />
              <span>Team Settings</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}