'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useAuth } from "@/app/auth/auth-context"
import { supabase } from "@/app/auth/supabase-client"
import { AvatarUpload } from "@/components/settings/avatar-upload"

interface Profile {
  firstName: string
  lastName: string
  company: string
  phone: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
  })

  useEffect(() => {
    if (user?.user_metadata) {
      setProfile({
        firstName: user.user_metadata.firstName || "",
        lastName: user.user_metadata.lastName || "",
        company: user.user_metadata.company || "",
        phone: user.user_metadata.phone || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: profile
      })

      if (error) throw error

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Profile Picture</h2>
          <AvatarUpload />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-medium"
              >
                Company
              </label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
} 