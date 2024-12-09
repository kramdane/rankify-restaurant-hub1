import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardContent = ({ children }: DashboardLayoutProps) => {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {isMobile && (
        <header className="flex items-center justify-between px-4 h-16 border-b bg-white shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-bold text-primary">Rankify</h1>
          </div>
          <div className="w-10" />
        </header>
      )}
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-8 bg-background">{children}</main>
      </div>
    </div>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};