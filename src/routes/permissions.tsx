import PermissionTable from '@/modules/permissions/PermissonTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/permissions')({
  component: PermissionTable 
})


