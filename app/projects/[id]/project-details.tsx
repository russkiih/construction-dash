'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { NewLineItemDialog } from "@/components/projects/new-line-item-dialog"
import { EditLineItemDialog } from "@/components/projects/edit-line-item-dialog"
import { StatusBadge } from "@/components/projects/status-badge"
import { DuplicateProjectDialog } from "@/components/projects/duplicate-project-dialog"
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog"
import { supabase } from "@/app/auth/supabase-client"
import { useRouter } from "next/navigation"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface Project {
  id: string
  name: string
  contractor: string
  contact: string
  due_date: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
}

interface LineItem {
  id: string
  service: string
  quantity: number
  unit: string
  unit_price: number
}

interface ProjectDetailsProps {
  id: string
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      if (projectError) throw projectError
      setProject(projectData)

      // Fetch line items
      const { data: lineItemsData, error: lineItemsError } = await supabase
        .from("line_items")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: true })

      if (lineItemsError) throw lineItemsError
      setLineItems(lineItemsData || [])
    } catch (error) {
      console.error("Error fetching project data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLineItemAdded = () => {
    fetchProjectData()
  }

  const handleLineItemUpdated = () => {
    fetchProjectData()
  }

  const handleLineItemDeleted = () => {
    fetchProjectData()
  }

  const handleStatusChange = () => {
    fetchProjectData()
  }

  const handleProjectDuplicated = () => {
    router.refresh()
  }

  const exportToPDF = () => {
    if (!project) return

    const doc = new jsPDF()
    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    )

    // Add project header
    doc.setFontSize(20)
    doc.text(project.name, 14, 20)

    doc.setFontSize(12)
    doc.text(`Contractor: ${project.contractor}`, 14, 30)
    doc.text(`Contact: ${project.contact}`, 14, 37)
    doc.text(
      `Due Date: ${new Date(project.due_date).toLocaleDateString()}`,
      14,
      44
    )
    doc.text(`Status: ${project.status.replace("-", " ")}`, 14, 51)

    // Add line items table
    autoTable(doc, {
      startY: 60,
      head: [["Service", "Quantity", "Unit", "Unit Price", "Total"]],
      body: lineItems.map((item) => [
        item.service,
        item.quantity,
        item.unit,
        `$${item.unit_price.toFixed(2)}`,
        `$${(item.quantity * item.unit_price).toFixed(2)}`,
      ]),
      foot: [
        [
          "Total Amount",
          "",
          "",
          "",
          `$${totalAmount.toFixed(2)}`,
        ],
      ],
    })

    // Save the PDF
    doc.save(`${project.name}-estimate.pdf`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    )
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div>Project not found</div>
      </DashboardLayout>
    )
  }

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  )

  return (
    <DashboardLayout>
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <StatusBadge
              projectId={project.id}
              initialStatus={project.status}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="flex gap-4">
            <DeleteProjectDialog
              projectId={id}
              projectName={project.name}
            />
            <DuplicateProjectDialog
              project={project}
              projectId={id}
              onProjectDuplicated={handleProjectDuplicated}
            />
            <Button variant="outline" onClick={exportToPDF}>
              Export PDF
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Contractor</h3>
            <p className="mt-1">{project.contractor}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            <p className="mt-1">{project.contact}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
            <p className="mt-1">{new Date(project.due_date).toLocaleDateString()}</p>
          </Card>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Line Items</h2>
            <NewLineItemDialog
              projectId={id}
              onLineItemAdded={handleLineItemAdded}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">{item.service}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.unit}</td>
                    <td className="px-4 py-3">${item.unit_price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <EditLineItemDialog
                        lineItem={item}
                        onLineItemUpdated={handleLineItemUpdated}
                        onDelete={handleLineItemDeleted}
                      />
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2">
                  <td
                    colSpan={4}
                    className="px-4 py-3 text-right font-medium"
                  >
                    Total Amount:
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${totalAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
} 