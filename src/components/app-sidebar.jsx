import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
 
  SidebarGroup,
  SidebarGroupContent,
  
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
    {
    title: "Create Task",
    url: "/create-task",
    icon: Calendar,
  },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Pending Task",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
]

export function AppSidebar() {
  return (
    <Sidebar variant=""  collapsible="icon" className="pt-14">
      <SidebarContent>
        <SidebarGroup>
         
          <SidebarGroupContent>
           
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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

  