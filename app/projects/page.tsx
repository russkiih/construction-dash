'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"
import { StatusBadge } from "@/components/projects/status-badge"
import { StatusFilter } from "@/components/projects/status-filter"
import { supabase } from "@/app/auth/supabase-client"
import Link from "next/link"

interface Project {
  id: string
  name: string
  contractor: string
  contact: string
  due_date: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
}

interface LineItem {
  quantity: number
  unit_price: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectTotals, setProjectTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // Fetch projects
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data: projectsData, error: projectsError } = await query

      if (projectsError) throw projectsError
      setProjects(projectsData || [])

      // Fetch line items for all projects
      const { data: lineItemsData, error: lineItemsError } = await supabase
        .from("line_items")
        .select("project_id, quantity, unit_price")

      if (lineItemsError) throw lineItemsError

      // Calculate totals for each project
      const totals: Record<string, number> = {}
      lineItemsData?.forEach((item: LineItem & { project_id: string }) => {
        const total = item.quantity * item.unit_price
        totals[item.project_id] = (totals[item.project_id] || 0) + total
      })
      setProjectTotals(totals)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = () => {
    fetchProjects()
  }

  const handleFilterChange = (value: string) => {
    setStatusFilter(value)
    setLoading(true)
    fetchProjects()
  }

  return (
    <DashboardLayout>
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <NewProjectDialog />
        </div>

        <div className="flex items-center justify-between">
          <StatusFilter value={statusFilter} onChange={handleFilterChange} />
          <div className="text-sm text-gray-500">
            {projects.length} project{projects.length === 1 ? "" : "s"} found
          </div>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Project Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  General Contractor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center">
                    {statusFilter === "all"
                      ? "No projects found. Create your first project!"
                      : "No projects found with the selected status."}
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-primary hover:underline"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {project.contractor}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {project.contact}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(project.due_date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      ${(projectTotals[project.id] || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge
                        projectId={project.id}
                        initialStatus={project.status}
                        onStatusChange={handleStatusChange}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
} 