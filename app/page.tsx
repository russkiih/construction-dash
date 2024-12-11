import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🏗️</span>
          <span>Construction Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold">
            Construction Estimating Made Simple
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Streamline your construction estimating process with our powerful tool.
            Manage projects, collaborate with your team, and make data-driven decisions.
          </p>
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
        </section>

        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Key Features
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Project Management</h3>
                <p className="text-gray-600">
                  Easily manage and track your construction projects in one place.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Team Collaboration</h3>
                <p className="text-gray-600">
                  Work together with your team in real-time on estimates and proposals.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Data Visualization</h3>
                <p className="text-gray-600">
                  Get insights from your project data with interactive visualizations.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Construction Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
