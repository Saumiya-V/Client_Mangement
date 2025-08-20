import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../ui/breadcrumb'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const BreadCrumb = () => {
  return (
    <div className='mt-5 ml-140'>
        <Breadcrumb>
         <BreadcrumbItem>
          <BreadcrumbLink>
          <Link to={'/engagementDetails'} className='flex items-center justify-center gap-3'><ArrowLeft size={15}/><p className='text-sm'>Back to Engagements</p></Link>
          </BreadcrumbLink>
         </BreadcrumbItem>
        </Breadcrumb>
    </div>
  )
}

export default BreadCrumb