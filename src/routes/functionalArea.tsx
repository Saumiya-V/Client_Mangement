import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/functionalArea')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/functionalArea"!</div>
}
