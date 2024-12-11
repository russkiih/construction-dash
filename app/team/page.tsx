import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Input } from "@/components/ui/input"

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Project Manager",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Brown",
      email: "mike@example.com",
      role: "Estimator",
      status: "pending",
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <Button>Invite Member</Button>
      </div>

      <Card>
        <div className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Search team members..."
              className="max-w-sm"
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Role
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
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="whitespace-nowrap px-4 py-3">
                      {member.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {member.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {member.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          member.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
} 