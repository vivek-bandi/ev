import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VehicleProvider } from "./contexts/VehicleContext";
import { SavedVehiclesProvider } from "./contexts/SavedVehiclesContext";
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ErrorBoundary from "./components/ErrorBoundary";
import Vehicles from "./pages/Vehicles";
import AdminLayout from "./pages/admin/AdminLayout";
import RequireAdmin from './components/RequireAdmin';
import Dashboard from "./pages/admin/Dashboard";
import VehicleManagement from "./pages/admin/VehicleManagement";
import OfferManagement from "./pages/admin/OfferManagement";
import InventoryManagement from "./pages/admin/InventoryManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import InquiryManagement from "./pages/admin/InquiryManagement";
import Notifications from "./pages/admin/Notifications";
import Setin from "./pages/admin/Setin";
import AchievementManagement from "./pages/admin/AchievementManagement";
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import VehiclesPage from "./pages/user/VehiclesPage";
import VehicleDetail from "./pages/user/VehicleDetail";
import OffersPage from "./pages/user/OffersPage";
import ContactPage from "./pages/user/ContactPage";
import TestDrivePage from "./pages/user/TestDrivePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <VehicleProvider>
        <SavedVehiclesProvider>
          <AuthProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
            <Routes>
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/user/home" replace />} />
              
              {/* User Routes */}
              <Route path="/user" element={<UserLayout />}>
                <Route path="home" element={<UserDashboard />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="vehicle/:id" element={<VehicleDetail />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="test-drive" element={<TestDrivePage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin" element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="vehicles" element={<VehicleManagement />} />
                <Route path="offers" element={<OfferManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="inquiries" element={<InquiryManagement />} />
                <Route path="achievements" element={<AchievementManagement />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="setin" element={<Setin />} />
              </Route>
              
              {/* Legacy route for backward compatibility */}
              <Route path="/vehicles" element={<Vehicles />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </SavedVehiclesProvider>
      </VehicleProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
