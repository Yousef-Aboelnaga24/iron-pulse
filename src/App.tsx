import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { PlansProvider } from "@/contexts/PlansContext";
import { AdminProvider } from "@/contexts/AdminContext";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlanDetails from "./pages/PlanDetails";
import Subscribe from "./pages/Subscribe";
import UserDashboard from "./pages/UserDashboard";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Plans from "./pages/Plans";
import Sessions from "./pages/Sessions";
import Bookings from "./pages/Bookings";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <PlansProvider>
          <AdminProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/plan/:id" element={<PlanDetails />} />
                <Route path="/subscribe/:id" element={<Subscribe />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </PlansProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
