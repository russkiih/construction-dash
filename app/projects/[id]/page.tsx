import { Suspense } from "react"
import { ProjectDetails } from "./project-details"

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectDetails id={id} />
    </Suspense>
  )
} 