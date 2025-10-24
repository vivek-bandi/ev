import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehicleAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Package, AlertTriangle, CheckCircle, XCircle, Plus, Edit } from 'lucide-react';

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  inventory: {
    stock: number;
    reserved: number;
    status: string;
  };
}

const InventoryManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { toast } = useToast();

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [inventoryForm, setInventoryForm] = useState({
    stock: '',
    reserved: '',
    status: 'available'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getAll({ limit: 100 });
      setVehicles(response.data.vehicles || response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch vehicles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInventory = async () => {
    if (!editingVehicle) return;

    try {
      await vehicleAPI.updateInventory(editingVehicle._id, {
        stock: parseInt(inventoryForm.stock),
        reserved: parseInt(inventoryForm.reserved),
        status: inventoryForm.status
      });

      toast({ title: 'Success', description: 'Inventory updated successfully' });
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update inventory',
        variant: 'destructive'
      });
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setInventoryForm({
      stock: vehicle.inventory.stock.toString(),
      reserved: vehicle.inventory.reserved.toString(),
      status: vehicle.inventory.status
    });
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = !filterStatus || filterStatus === 'all' || vehicle.inventory.status === filterStatus;
    const matchesCategory = !filterCategory || filterCategory === 'all' || vehicle.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const categories = [...new Set(vehicles.map(v => v.category))];
  const statuses = ['available', 'out_of_stock', 'discontinued'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'out_of_stock':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'discontinued':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'discontinued':
        return <Badge variant="secondary">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground mt-1">Track stock levels and availability</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterStatus('');
                  setFilterCategory('');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory ({filteredVehicles.length})</CardTitle>
          <CardDescription>Manage stock levels and vehicle status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading inventory...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => {
                  const available = vehicle.inventory.stock - vehicle.inventory.reserved;
                  return (
                    <TableRow key={vehicle._id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-500" />
                          {vehicle.inventory.stock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          {vehicle.inventory.reserved}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={available <= 0 ? 'text-red-500 font-semibold' : ''}>
                            {available}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(vehicle.inventory.status)}
                          {getStatusBadge(vehicle.inventory.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => openEditModal(vehicle)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No vehicles found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingVehicle && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Update Inventory</CardTitle>
              <CardDescription>
                Update stock levels for {editingVehicle.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={inventoryForm.stock}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, stock: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="reserved">Reserved Quantity</Label>
                <Input
                  id="reserved"
                  type="number"
                  value={inventoryForm.reserved}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, reserved: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={inventoryForm.status} onValueChange={(value) => setInventoryForm({ ...inventoryForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateInventory}>Update Inventory</Button>
                <Button variant="outline" onClick={() => setEditingVehicle(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;
