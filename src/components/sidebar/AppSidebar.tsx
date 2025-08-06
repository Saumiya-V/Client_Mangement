import { Accessibility, Building, Folder, User } from 'lucide-react'
 import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from '@tanstack/react-router'

const AppSidebar = () => {
    
    const items = [
  {
    title: "Clients",
    path:'/clients',
    icon: Building,
  },
  {
    title: "Functional Area",
    path:'/functionalArea',
    icon: Folder,
  },
  {
    title: "Roles",
    path:'/roles',
    icon: User,
  },
  {
    title: "Permissions",
    path:'/permissions',
    icon: Accessibility,
  },
]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-md mt-5 font-bold mb-5'>Global Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className='hover:bg-sky-100 dir-ltr hover:border-s-3 hover:border-sky-800 hover:text-sky-800 hover:font-bold rounded-none' asChild>
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar