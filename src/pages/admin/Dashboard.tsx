import React from 'react';
import { useVehicles } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Home, TrendingUp, Car, Users, AlertCircle, Check, RefreshCw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { vehicles, offers, refreshData, loading, resetContext, clearError } = useVehicles();

  const totalRevenue = vehicles.reduce((sum, v) => sum + v.price, 0);
  const avgDiscount = offers.length > 0 
    ? offers.reduce((sum, o) => sum + o.discount, 0) / offers.length 
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Button 
            onClick={() => {
              resetContext();
              setTimeout(() => refreshData(), 100);
            }} 
            variant="outline" 
            size="sm"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Reset & Refresh</span>
            <span className="sm:hidden">Reset</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{vehicles.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active inventory</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{offers.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Running promotions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold truncate">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{avgDiscount.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all offers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle>Recent Vehicles</CardTitle>
            <CardDescription>Latest additions to inventory</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {vehicles.slice(-3).reverse().map((vehicle) => (
                <div 
                  key={vehicle._id} 
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{vehicle.brand}</p>
                  </div>
                  <p className="font-bold text-primary ml-4">₹{vehicle.price.toLocaleString()}</p>
                </div>
              ))}
              {vehicles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Car className="h-8 w-8 mb-2 opacity-50" />
                  <p>No vehicles yet</p>
                  <p className="text-sm">Add your first vehicle</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => navigate('/admin/vehicles')} 
                className="h-20 flex-col gap-2 sm:text-sm"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                <span className="text-center">Add Vehicle</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/offers')} 
                className="h-20 flex-col gap-2 sm:text-sm"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                <span className="text-center">Create Offer</span>
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="h-20 flex-col gap-2 sm:text-sm"
                variant="outline"
              >
                <Home className="h-5 w-5" />
                <span className="text-center">View Site</span>
              </Button>
              <Button 
                onClick={() => navigate('/admin/achievements')} 
                className="h-20 flex-col gap-2 sm:text-sm"
                variant="outline"
              >
                <Award className="h-5 w-5" />
                <span className="text-center">Add Achievement</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
