import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { toggle } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile && (
          <header className="flex items-center justify-between px-4 h-16 border-b bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggle}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-bold text-primary">Rankify</h1>
            </div>
            <div className="w-10" /> {/* Spacer to balance the layout */}
          </header>
        )}
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 p-8 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};