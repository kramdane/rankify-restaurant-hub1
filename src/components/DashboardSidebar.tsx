import { LayoutDashboard, Menu, Star, MessageSquare, LogOut, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",
  },
  {
    title: "Menu Management",
    icon: Menu,
    url: "/dashboard/menu",
  },
  {
    title: "Reviews",
    icon: Star,
    url: "/dashboard/reviews",
  },
  {
    title: "Campaigns",
    icon: MessageSquare,
    url: "/dashboard/campaigns",
  },
  {
    title: "Contacts",
    icon: Users,
    url: "/dashboard/contact",
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">Rankify</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => navigate(item.url)}>
                    <button className="w-full flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4 space-y-2">
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex w-full items-center gap-2 text-gray-600 hover:text-primary transition-colors px-2 py-1.5 rounded-md"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-2 text-gray-600 hover:text-primary transition-colors px-2 py-1.5 rounded-md"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}