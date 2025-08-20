import EngagementTable from '@/modules/engagement/EngagementTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/engagementDetails')({
  component: EngagementTable,
})


