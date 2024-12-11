'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/app/auth/auth-context"
import { supabase } from "@/app/auth/supabase-client"
import { useRouter } from "next/navigation"

export function AvatarUpload() {
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url)
    }
  }, [user])

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      // Update user metadata with avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl.publicUrl }
      })

      if (updateError) throw updateError

      setAvatarUrl(publicUrl.publicUrl)
      router.refresh()
    } catch (error) {
      console.error("Error uploading avatar:", error)
      alert("Error uploading avatar!")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback>
          {user?.email?.[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          id="avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
        <label htmlFor="avatar">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? "Uploading..." : "Change Profile Picture"}
            </span>
          </Button>
        </label>
        <p className="text-sm text-gray-500">
          Recommended: Square image, at least 100x100px
        </p>
      </div>
    </div>
  )
} 