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
    <Sidebar className="bg-accent border-r border-primary/10">
      <SidebarContent className="bg-accent">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Avify
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted font-medium">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={() => navigate(item.url)}>
                    <button className="w-full flex items-center gap-3 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors rounded-lg p-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
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
            className="flex w-full items-center gap-3 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors px-2 py-2 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-3 text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors px-2 py-2 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}