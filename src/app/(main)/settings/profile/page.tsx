"use client"

import {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {ArrowLeft, Upload, User, MapPin, Globe, Save, RefreshCw} from "lucide-react"
import Link from "next/link"
import {toast} from "sonner"

export default function ProfileSettingsPage() {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        avatarUrl: "",
        bio: "",
        location: "",
        website: "",
        company: "",
        timezone: "",
        language: "",
    })

    const [isLoading, setIsLoading] = useState(true)
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
            setUser({
                id: data.user.id,
                name: data.user.name || "",
                email: data.user.email || "",
                avatarUrl: data.user.avatarUrl || "",
                bio: data.user.bio || "",
                location: data.user.location || "",
                website: data.user.website || "",
                company: data.user.company || "",
                timezone: data.user.timezone || "America/Los_Angeles",
                language: data.user.language || "en",
            })
            console.log("User data fetched:", data)
        } catch (error) {
            console.error('Error fetching user data:', error)
            toast.error('Failed to fetch user data. Please try again.')
        } finally {
            setIsFetching(false)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const handleSave = async () => {
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

            if (!response.ok) {
                throw new Error('Failed to update profile')
            }

            const data = await response.json()
            console.log("Profile updated:", data)
            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleCancel = () => {
        window.history.back()
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

            setUser(prev => ({...prev, avatarUrl: data.avatarUrl}))

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

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/settings">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            Back to Settings
                        </Button>
                    </Link>
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

            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your detailed profile information and preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary"/>
                            <CardTitle>Profile Picture & Basic Information</CardTitle>
                        </div>
                        <CardDescription>Update your profile picture and basic details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name}/>
                                <AvatarFallback className="text-xl">
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
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    disabled={isUpdating}
                                >
                                    <Upload className="h-4 w-4 mr-2"/>
                                    Change Photo
                                </Button>
                                <Button variant="ghost" size="sm">
                                    Remove Photo
                                </Button>
                                <p className="text-xs text-muted-foreground">Recommended: Square image, at least
                                    400x400px, max 2MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={user.name.split(" ")[0] || ""}
                                    onChange={(e) => {
                                        const lastName = user.name.split(" ").slice(1).join(" ")
                                        setUser({...user, name: `${e.target.value} ${lastName}`})
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={user.name.split(" ").slice(1).join(" ") || ""}
                                    onChange={(e) => {
                                        const firstName = user.name.split(" ")[0]
                                        setUser({...user, name: `${firstName} ${e.target.value}`})
                                    }}
                                />
                            </div>
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
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us a bit about yourself..."
                                value={user.bio}
                                onChange={(e) => setUser({...user, bio: e.target.value})}
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                Brief description for your profile. Maximum 160 characters.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-primary"/>
                            <CardTitle>Location & Contact</CardTitle>
                        </div>
                        <CardDescription>Add your location and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City, State/Country"
                                    value={user.location}
                                    onChange={(e) => setUser({...user, location: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    placeholder="Your company name"
                                    value={user.company}
                                    onChange={(e) => setUser({...user, company: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://yourwebsite.com"
                                value={user.website}
                                onChange={(e) => setUser({...user, website: e.target.value})}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Globe className="h-5 w-5 text-primary"/>
                            <CardTitle>Preferences</CardTitle>
                        </div>
                        <CardDescription>Set your language and timezone preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select value={user.timezone}
                                        onValueChange={(value) => setUser({...user, timezone: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                        <SelectItem value="Asia/Jakarta">Jakarta (WIB)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select value={user.language}
                                        onValueChange={(value) => setUser({...user, language: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                        <SelectItem value="ja">日本語</SelectItem>
                                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isUpdating}>
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
            </div>
        </div>
    )
}