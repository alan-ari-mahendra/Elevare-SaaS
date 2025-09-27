"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {Textarea} from "@/components/ui/textarea"
import {useTheme} from "next-themes"
import {useSessionUser} from "@/hooks/useSessionUser"
import {User, Bell, Shield, Palette, Upload, Save, RefreshCw} from "lucide-react"
import {useSession} from "next-auth/react"
import {toast} from "sonner"
import Link from "next/link"

export default function SettingsPage() {
    const {theme, setTheme} = useTheme()
    const {user: sessionUser, isLoading, isAuthenticated} = useSessionUser()
    const {update} = useSession()
    console.log("sessionUser di SettingsPage:", sessionUser)

    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        avatarUrl: "",
        bio: "",
        location: "",
        website: "",
        company: "",
        timezone: "America/Los_Angeles",
        language: "en"
    })

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
    })

    const [isUpdating, setIsUpdating] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    const fetchUserData = async () => {
        try {
            setIsFetching(true)
            const response = await fetch('/api/user/profile')

            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }

            const data = await response.json()
            setUser(prev => ({
                ...prev,
                id: data.user.id,
                name: data.user.name || "",
                email: data.user.email || "",
                bio: data.user.bio || "",
                location: data.user.location || "",
                website: data.user.website || "",
                company: data.user.company || "",
                timezone: data.user.timezone || "America/Los_Angeles",
                language: data.user.language || "en"
            }))
            console.log("User data:", data)
            toast.success('User data refreshed successfully!')
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast.error('Failed to fetch user data. Please try again.')
        } finally {
            setIsFetching(false)
        }
    }
    useEffect(() => {
        if (sessionUser?.id) {
            fetchUserData()
        }
    }, [sessionUser?.id])
    const handleSaveProfile = async () => {
        try {
            setIsUpdating(true)

            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: user.name,
                    bio: user.bio,
                    location: user.location,
                    website: user.website,
                    company: user.company,
                    timezone: user.timezone,
                    language: user.language,
                }),
            })
            console.log("Response profile:", response)
            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            await update({
                name: user.name,
                bio: user.bio,
                location: user.location,
                website: user.website,
                company: user.company,
                timezone: user.timezone,
                language: user.language,
            })

            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleSaveNotifications = async () => {
        try {
            console.log("Saving notifications:", notifications)
            toast.success('Notification settings saved!')
        } catch (error) {
            console.error('Error saving notifications:', error)
            toast.error('Failed to save notification settings.')
        }
    }

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB')
            return
        }

        try {
            setIsUpdating(true)
            const formData = new FormData()
            formData.append('avatar', file)

            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload avatar')
            }

            const data = await response.json()

            setUser(prev => ({ ...prev, avatar_url: data.avatarUrl }))

            await update({ image: data.avatarUrl })

            toast.success('Avatar updated successfully!')
        } catch (error) {
            console.error('Error uploading avatar:', error)
            toast.error('Failed to upload avatar. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col justify-center items-center h-screen space-y-4">
                <h1 className="text-2xl font-semibold">Authentication Required</h1>
                <p className="text-muted-foreground">Please sign in to view this page.</p>
                <Link href="/auth/signin">
                    <Button>Sign In</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchUserData}
                    disabled={isFetching}
                >
                    {isFetching ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2"/>
                            Refresh Data
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary"/>
                            <CardTitle>Profile Settings</CardTitle>
                        </div>
                        <CardDescription>Update your personal information and profile picture.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name}/>
                                <AvatarFallback className="text-lg">
                                    {user.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "UN"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    disabled={isUpdating}
                                >
                                    <Upload className="h-4 w-4 mr-2"/>
                                    Upload Photo
                                </Button>
                                <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={user.name}
                                    onChange={(e) => setUser({...user, name: e.target.value})}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={user.company}
                                    onChange={(e) => setUser({...user, company: e.target.value})}
                                    placeholder="Enter your company"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={user.location}
                                    onChange={(e) => setUser({...user, location: e.target.value})}
                                    placeholder="Enter your location"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={user.website}
                                    onChange={(e) => setUser({...user, website: e.target.value})}
                                    placeholder="https://your-website.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select value={user.timezone} onValueChange={(value) => setUser({...user, timezone: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                        <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                        <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                                        <SelectItem value="Asia/Jakarta">Jakarta (WIB)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={user.bio}
                                onChange={(e) => setUser({...user, bio: e.target.value})}
                                placeholder="Tell us about yourself..."
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <Link href={{
                                pathname: "/settings/profile",
                                query: {
                                    name: user.name,
                                    email: user.email,
                                    bio: user.bio,
                                    location: user.location,
                                    website: user.website,
                                    company: user.company,
                                    timezone: user.timezone,
                                    language: user.language,
                                    avatarUrl: user.avatarUrl
                                }
                            }}>
                                <Button variant="outline">Advanced Profile Settings</Button>
                            </Link>
                            <Button onClick={handleSaveProfile} disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2"/>
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Palette className="h-5 w-5 text-primary"/>
                            <CardTitle>Theme Preferences</CardTitle>
                        </div>
                        <CardDescription>Choose how ProjectFlow looks and feels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Select theme"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">System theme will match your device settings.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select value={user.language} onValueChange={(value) => setUser({...user, language: value})}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue placeholder="Select language"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                    <SelectItem value="ja">Japanese</SelectItem>
                                    <SelectItem value="zh">Chinese</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-primary"/>
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
                                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                                >
                                    {notifications.email ? "Enabled" : "Disabled"}
                                </Button>
                            </div>

                            <Separator/>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                                </div>
                                <Button
                                    variant={notifications.push ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setNotifications({...notifications, push: !notifications.push})}
                                >
                                    {notifications.push ? "Enabled" : "Disabled"}
                                </Button>
                            </div>

                            <Separator/>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
                                </div>
                                <Button
                                    variant={notifications.marketing ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setNotifications({
                                        ...notifications,
                                        marketing: !notifications.marketing
                                    })}
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

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-primary"/>
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
                            <Badge variant="secondary"
                                   className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Active
                            </Badge>
                        </div>

                        <Separator/>

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