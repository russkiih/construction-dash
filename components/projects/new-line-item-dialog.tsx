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

interface NewLineItemDialogProps {
  projectId: string
  onLineItemAdded: () => void
}

export function NewLineItemDialog({ projectId, onLineItemAdded }: NewLineItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      project_id: projectId,
      service: formData.get("service"),
      quantity: parseFloat(formData.get("quantity") as string) || 0,
      unit: formData.get("unit"),
      unit_price: parseFloat(formData.get("unitPrice") as string) || 0,
    }

    try {
      const { error } = await supabase
        .from("line_items")
        .insert([data])
        .select()

      if (error) throw error

      setOpen(false)
      onLineItemAdded()
    } catch (error) {
      console.error("Error creating line item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Line Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Line Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="service"
              className="mb-2 block text-sm font-medium"
            >
              Service Description
            </label>
            <Input
              id="service"
              name="service"
              required
              placeholder="Enter service description"
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium"
            >
              Quantity
            </label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              required
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <label
              htmlFor="unit"
              className="mb-2 block text-sm font-medium"
            >
              Unit
            </label>
            <Input
              id="unit"
              name="unit"
              required
              placeholder="Enter unit (e.g., SF, LF)"
            />
          </div>
          <div>
            <label
              htmlFor="unitPrice"
              className="mb-2 block text-sm font-medium"
            >
              Unit Price
            </label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              step="0.01"
              required
              placeholder="Enter unit price"
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
              {loading ? "Adding..." : "Add Line Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 