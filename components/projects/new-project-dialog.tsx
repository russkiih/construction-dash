'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { supabase } from "@/app/auth/supabase-client"
import { useRouter } from "next/navigation"

export function NewProjectDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      contractor: formData.get("contractor"),
      contact: formData.get("contact"),
      due_date: formData.get("dueDate"),
      status: "pending",
    }

    try {
      const { data: project, error } = await supabase
        .from("projects")
        .insert([data])
        .select()
        .single()

      if (error) throw error

      setOpen(false)
      if (project) {
        router.push(`/projects/${project.id}`)
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Project Name
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label
              htmlFor="contractor"
              className="mb-2 block text-sm font-medium"
            >
              General Contractor
            </label>
            <Input
              id="contractor"
              name="contractor"
              required
              placeholder="Enter contractor name"
            />
          </div>
          <div>
            <label
              htmlFor="contact"
              className="mb-2 block text-sm font-medium"
            >
              Contact
            </label>
            <Input
              id="contact"
              name="contact"
              placeholder="Enter contact name"
            />
          </div>
          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-sm font-medium"
            >
              Due Date
            </label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 