import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import ThemeProvider from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import FinancialPlanner from "./pages/FinancialPlanner";
import MarketDashboard from "./pages/MarketDashboard";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
              <Route path="/planner" element={<ProtectedRoute><Layout><FinancialPlanner /></Layout></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><Layout><MarketDashboard /></Layout></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Layout><Marketplace /></Layout></ProtectedRoute>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
