import ClientTable from '@/modules/client/ClientTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/clients')({
  component: ClientTable,
})


