"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { mockUser } from "@/lib/mock-data"
import { User, Bell, Shield, Palette, Upload } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(mockUser)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  })

  const handleSaveProfile = () => {
    console.log("Saving profile:", user)
    // Here you would typically save to your backend
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications)
    // Here you would typically save to your backend
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Update your personal information and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link href="/settings/profile">
                <Button variant="outline">Advanced Profile Settings</Button>
              </Link>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Theme Preferences</CardTitle>
            </div>
            <CardDescription>Choose how ProjectFlow looks and feels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">System theme will match your device settings.</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Button
                  variant={notifications.email ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                >
                  {notifications.email ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                </div>
                <Button
                  variant={notifications.push ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                >
                  {notifications.push ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
                </div>
                <Button
                  variant={notifications.marketing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                >
                  {notifications.marketing ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Account Management</CardTitle>
            </div>
            <CardDescription>Manage your account security and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Account Status</Label>
                <p className="text-sm text-muted-foreground">Your account is active and in good standing</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full md:w-auto bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full md:w-auto bg-transparent">
                Download Data
              </Button>
              <Button variant="destructive" className="w-full md:w-auto">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
