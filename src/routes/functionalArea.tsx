import  FunctionalAreaTable from '@/modules/functionalArea/FunctionalAreaTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/functionalArea')({
  component:FunctionalAreaTable,
})

