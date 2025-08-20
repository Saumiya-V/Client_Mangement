import OwnerDetails from '@/modules/engagement/OwnerDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/engagements/$id')({
  component: OwnerDetails,
})


