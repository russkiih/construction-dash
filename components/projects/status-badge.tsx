'use client'

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/app/auth/supabase-client"

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-800",
  "in-progress": "bg-blue-50 text-blue-800",
  completed: "bg-green-50 text-green-800",
  cancelled: "bg-red-50 text-red-800",
} as const

type Status = keyof typeof STATUS_COLORS

interface StatusBadgeProps {
  projectId: string
  initialStatus: Status
  onStatusChange: () => void
}

export function StatusBadge({
  projectId,
  initialStatus,
  onStatusChange,
}: StatusBadgeProps) {
  const [status, setStatus] = useState<Status>(initialStatus)
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: Status) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", projectId)

      if (error) throw error

      setStatus(newStatus)
      onStatusChange()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusDisplay = status.replace("-", " ")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading}>
        <span
          className={`inline-flex cursor-pointer items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
            STATUS_COLORS[status]
          }`}
        >
          {loading ? "Updating..." : statusDisplay}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(STATUS_COLORS).map((statusOption) => (
          <DropdownMenuItem
            key={statusOption}
            className="capitalize"
            onClick={() => updateStatus(statusOption as Status)}
          >
            {statusOption.replace("-", " ")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 