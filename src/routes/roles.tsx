import RoleTable from '@/modules/roles/RolesTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/roles')({
  component: RoleTable
})


