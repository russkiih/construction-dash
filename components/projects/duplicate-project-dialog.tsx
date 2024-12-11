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

interface Project {
  name: string
  contractor: string
  contact: string
  due_date: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
}

interface LineItem {
  service: string
  quantity: number
  unit: string
  unit_price: number
}

interface DuplicateProjectDialogProps {
  project: Project
  projectId: string
  onProjectDuplicated: () => void
}

export function DuplicateProjectDialog({
  project,
  projectId,
  onProjectDuplicated,
}: DuplicateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const newName = formData.get("name") as string

      // 1. Create new project
      const { data: newProject, error: projectError } = await supabase
        .from("projects")
        .insert([
          {
            name: newName,
            contractor: project.contractor,
            contact: project.contact,
            due_date: project.due_date,
            status: "pending", // Always start as pending
          },
        ])
        .select()
        .single()

      if (projectError) throw projectError

      // 2. Get line items from original project
      const { data: lineItems, error: lineItemsError } = await supabase
        .from("line_items")
        .select("*")
        .eq("project_id", projectId)

      if (lineItemsError) throw lineItemsError

      // 3. Create new line items for the new project
      if (lineItems && lineItems.length > 0) {
        const newLineItems = lineItems.map((item: LineItem) => ({
          project_id: newProject.id,
          service: item.service,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
        }))

        const { error: newLineItemsError } = await supabase
          .from("line_items")
          .insert(newLineItems)

        if (newLineItemsError) throw newLineItemsError
      }

      setOpen(false)
      onProjectDuplicated()
    } catch (error) {
      console.error("Error duplicating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Duplicate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              New Project Name
            </label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={`${project.name} (Copy)`}
              placeholder="Enter project name"
            />
          </div>
          <div className="text-sm text-gray-500">
            This will create a new project with:
            <ul className="mt-2 list-inside list-disc">
              <li>All line items copied over</li>
              <li>Same contractor and contact information</li>
              <li>Same due date</li>
              <li>Status set to pending</li>
            </ul>
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
              {loading ? "Duplicating..." : "Duplicate Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 