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

const queryClient = new QueryClient();

const App = () => (
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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;