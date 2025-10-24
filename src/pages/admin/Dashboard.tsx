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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button 
            onClick={() => {
              resetContext();
              setTimeout(() => refreshData(), 100);
            }} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Reset & Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{vehicles.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Active inventory</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{offers.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Running promotions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Inventory value</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgDiscount.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all offers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Vehicles</CardTitle>
            <CardDescription>Latest additions to inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.slice(-3).reverse().map((vehicle) => (
                <div key={vehicle._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium">{vehicle.name}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                  </div>
                  <p className="font-bold text-primary">₹{vehicle.price.toLocaleString()}</p>
                </div>
              ))}
              {vehicles.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No vehicles yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => navigate('/admin/vehicles')} 
                className="h-20 flex-col gap-2"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                Add Vehicle
              </Button>
              <Button 
                onClick={() => navigate('/admin/offers')} 
                className="h-20 flex-col gap-2"
                variant="outline"
              >
                <Plus className="h-5 w-5" />
                Create Offer
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="h-20 flex-col gap-2"
                variant="outline"
              >
                <Home className="h-5 w-5" />
                View Site
              </Button>
              <Button 
                onClick={() => navigate('/admin/achievements')} 
                className="h-20 flex-col gap-2"
                variant="outline"
              >
                <Award className="h-5 w-5" />
                Add Achievement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
