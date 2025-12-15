import { Calendar, ChevronUp, Home, Search, Settings, User2, LayoutDashboardIcon, Shield } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Core/Components/shadcnComponents/Ui/sidebar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../shadcnComponents/Ui/dropdown-menu"
import { Toaster } from "../shadcnComponents/Ui/sonner";
import { useAuth } from "@/Core/lib/utils/useAuth";

const items = [
  {
    title: "Página principal",
    url: "/AtmosInsight",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/AtmosInsight/Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Administração",
    url: "/AtmosInsight/Administration",
    icon: Shield,
    roles: ["admin"]
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { role, username, logout } = useAuth()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AtmosInsight</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items
              .filter(item => !item.roles || item.roles.includes(role!))
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild {...(location.pathname === item.url ? { isActive: true } : {})}>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <span>Conta</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Histórico</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Toaster position="bottom-left"/>
    </Sidebar>
  )
}