'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/app/auth/supabase-client"
import { useRouter } from "next/navigation"

interface DeleteProjectDialogProps {
  projectId: string
  projectName: string
}

export function DeleteProjectDialog({
  projectId,
  projectName,
}: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)

    try {
      // 1. Delete all line items first (due to foreign key constraint)
      const { error: lineItemsError } = await supabase
        .from("line_items")
        .delete()
        .eq("project_id", projectId)

      if (lineItemsError) throw lineItemsError

      // 2. Delete the project
      const { error: projectError } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)

      if (projectError) throw projectError

      // 3. Verify the project was actually deleted
      const { data: checkProject } = await supabase
        .from("projects")
        .select()
        .eq("id", projectId)
        .single()

      if (checkProject) {
        throw new Error("Project still exists after deletion attempt")
      }

      setOpen(false)
      // First navigate, then refresh to ensure the list updates
      await router.push("/projects")
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project. Please check if you have the necessary permissions.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{projectName}"? This action cannot be undone.
            All line items associated with this project will also be deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 