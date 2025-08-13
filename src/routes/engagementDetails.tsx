import EngagementTable from '@/modules/engagement/engagementTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/engagementDetails')({
  component: EngagementTable,
})


