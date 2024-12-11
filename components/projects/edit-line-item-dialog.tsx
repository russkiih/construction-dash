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

interface LineItem {
  id: string
  service: string
  quantity: number
  unit: string
  unit_price: number
}

interface EditLineItemDialogProps {
  lineItem: LineItem
  onLineItemUpdated: () => void
  onDelete: () => void
}

export function EditLineItemDialog({
  lineItem,
  onLineItemUpdated,
  onDelete,
}: EditLineItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      service: formData.get("service"),
      quantity: parseFloat(formData.get("quantity") as string) || 0,
      unit: formData.get("unit"),
      unit_price: parseFloat(formData.get("unitPrice") as string) || 0,
    }

    try {
      const { error } = await supabase
        .from("line_items")
        .update(data)
        .eq("id", lineItem.id)

      if (error) throw error

      setOpen(false)
      onLineItemUpdated()
    } catch (error) {
      console.error("Error updating line item:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("line_items")
        .delete()
        .eq("id", lineItem.id)

      if (error) throw error

      setOpen(false)
      onDelete()
    } catch (error) {
      console.error("Error deleting line item:", error)
    } finally {
      setLoading(false)
      setConfirmDelete(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Line Item</DialogTitle>
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
              defaultValue={lineItem.service}
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
              defaultValue={lineItem.quantity}
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
              defaultValue={lineItem.unit}
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
              defaultValue={lineItem.unit_price}
              required
              placeholder="Enter unit price"
            />
          </div>
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              {confirmDelete ? "Click again to confirm" : "Delete"}
            </Button>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  setConfirmDelete(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 