import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import ReviewForm from "./pages/ReviewForm";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign";
import Settings from "./pages/Settings";
import PublicMenu from "./pages/PublicMenu";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/menu" element={<Menu />} />
              <Route path="/dashboard/contact" element={<Contact />} />
              <Route path="/dashboard/reviews" element={<Reviews />} />
              <Route path="/review/:restaurantId" element={<ReviewForm />} />
              <Route path="/dashboard/campaigns" element={<Campaigns />} />
              <Route path="/dashboard/campaigns/new" element={<NewCampaign />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/menu/:restaurantId" element={<PublicMenu />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;