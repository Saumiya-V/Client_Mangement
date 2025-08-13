import { Accessibility, Building, Calendar, Folder, Shield, ShieldCheckIcon, User } from 'lucide-react'
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
import { useState } from 'react'
import path from 'path'

const AppSidebar = () => {
  const [isActive,setIsActive] = useState(false)
  const [title,setTitle] = useState("")
    
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
    icon: ShieldCheckIcon,
  },
  {
    title: "Engagements",
    path:"/engagementDetails",
    icon:Calendar
  }
]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-md mt-5 font-bold mb-5'>Global Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title} onClick={() => {
                  setTitle(item.title);
                  setIsActive(true);
                }}>
                  <SidebarMenuButton className={`hover:bg-sky-100 dir-ltr py-2 hover:border-s-3 hover:border-sky-800 hover:text-sky-800 hover:font-bold rounded-none`} asChild>
                    <Link to={item.path} className={`${isActive && title === item.title ? 'bg-sky-100 border-s-3 border-sky-800 text-sky-800 font-bold' : ''}`}>
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