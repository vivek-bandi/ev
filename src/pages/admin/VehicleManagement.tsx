import React, { useState } from 'react';
import { useVehicles } from '@/contexts/VehicleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import ColorImageManager from '@/components/ColorImageManager';
import Modal from '@/components/ui/modal';

const VehicleManagement = () => {
  const { vehicles, addVehicle, deleteVehicle, updateVehicle } = useVehicles();
  const { toast } = useToast();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: '',
    price: '',
    year: '',
    fuelType: 'Electric',
    chargingTime: '',
    range: '',
    battery: '',
    topSpeed: '',
    colors: '',
  });

  const [colorImages, setColorImages] = useState<Array<{
    color: string;
    images: string[];
    primaryImage?: string;
  }>>([]);

  // Edit state
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    brand: '',
    price: '',
    year: '',
    fuelType: 'Electric',
    chargingTime: '',
    range: '',
    battery: '',
    topSpeed: '',
    colors: '',
  });
  const [editColorImages, setEditColorImages] = useState<Array<{
    color: string;
    images: string[];
    primaryImage?: string;
  }>>([]);

  const handleAddVehicle = async () => {
    if (!vehicleForm.name || !vehicleForm.brand || !vehicleForm.price || !vehicleForm.year) {
      toast({ title: 'Error', description: 'Please fill all required fields (Name, Brand, Price, Year)', variant: 'destructive' });
      return;
    }

    const year = parseInt(vehicleForm.year);
    const price = parseFloat(vehicleForm.price);

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 2) {
      toast({ title: 'Error', description: 'Please enter a valid year', variant: 'destructive' });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid price', variant: 'destructive' });
      return;
    }

    try {
      await addVehicle({
        ...vehicleForm,
        price: price,
        year: year,
        colors: vehicleForm.colors.split(',').map(c => c.trim()).filter(c => c),
        colorImages: colorImages,
        category: 'scooter',
        inventory: {
          stock: 0,
          reserved: 0,
          status: 'available'
        },
        isActive: true,
        featured: false
      });

      toast({ title: 'Success', description: 'Vehicle added successfully' });
      setVehicleForm({
        name: '',
        brand: '',
        price: '',
        year: '',
        fuelType: 'Electric',
        chargingTime: '',
        range: '',
        battery: '',
        topSpeed: '',
        colors: '',
      });
      setColorImages([]);
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add vehicle', variant: 'destructive' });
    }
  };

  // Edit functions
  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle._id);
    setEditForm({
      name: vehicle.name,
      brand: vehicle.brand,
      price: vehicle.price.toString(),
      year: vehicle.year.toString(),
      fuelType: vehicle.fuelType || 'Electric',
      chargingTime: vehicle.chargingTime || '',
      range: vehicle.range || '',
      battery: vehicle.battery || '',
      topSpeed: vehicle.topSpeed || '',
      colors: vehicle.colors ? vehicle.colors.join(', ') : '',
    });
    setEditColorImages(vehicle.colorImages || []);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
    setEditForm({
      name: '',
      brand: '',
      price: '',
      year: '',
      fuelType: 'Electric',
      chargingTime: '',
      range: '',
      battery: '',
      topSpeed: '',
      colors: '',
    });
    setEditColorImages([]);
    setIsEditModalOpen(false);
  };

  const handleUpdateVehicle = async () => {
    if (!editForm.name || !editForm.brand || !editForm.price || !editForm.year) {
      toast({ title: 'Error', description: 'Please fill all required fields (Name, Brand, Price, Year)', variant: 'destructive' });
      return;
    }

    const year = parseInt(editForm.year);
    const price = parseFloat(editForm.price);

    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 2) {
      toast({ title: 'Error', description: 'Please enter a valid year', variant: 'destructive' });
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid price', variant: 'destructive' });
      return;
    }

    try {
      await updateVehicle(editingVehicle!, {
        name: editForm.name,
        brand: editForm.brand,
        price: price,
        year: year,
        fuelType: editForm.fuelType,
        chargingTime: editForm.chargingTime,
        range: editForm.range,
        battery: editForm.battery,
        topSpeed: editForm.topSpeed,
        colors: editForm.colors.split(',').map(c => c.trim()).filter(c => c),
        colorImages: editColorImages,
      });

      toast({ title: 'Success', description: 'Vehicle updated successfully' });
      handleCancelEdit();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update vehicle', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold">Vehicle Management</h2>

      {/* Add Vehicle Button */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Vehicle Management</CardTitle>
          <CardDescription>Add new vehicles to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Vehicle
          </Button>
        </CardContent>
      </Card>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Vehicle"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Vehicle Name *</Label>
              <Input
                id="name"
                value={vehicleForm.name}
                onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                placeholder="e.g., EcoRide X1"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={vehicleForm.brand}
                onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                placeholder="e.g., Tesla"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={vehicleForm.price}
                onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                placeholder="e.g., 45000"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={vehicleForm.year}
                onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                placeholder="e.g., 2024"
              />
            </div>
            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Input
                id="fuelType"
                value={vehicleForm.fuelType}
                onChange={(e) => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })}
                placeholder="Electric"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="chargingTime">Charging Time</Label>
              <Input
                id="chargingTime"
                value={vehicleForm.chargingTime}
                onChange={(e) => setVehicleForm({ ...vehicleForm, chargingTime: e.target.value })}
                placeholder="e.g., 6 hours"
              />
            </div>
            <div>
              <Label htmlFor="range">Range</Label>
              <Input
                id="range"
                value={vehicleForm.range}
                onChange={(e) => setVehicleForm({ ...vehicleForm, range: e.target.value })}
                placeholder="e.g., 95 km"
              />
            </div>
            <div>
              <Label htmlFor="battery">Battery</Label>
              <Input
                id="battery"
                value={vehicleForm.battery}
                onChange={(e) => setVehicleForm({ ...vehicleForm, battery: e.target.value })}
                placeholder="e.g., 2.3 kWh"
              />
            </div>
            <div>
              <Label htmlFor="topSpeed">Top Speed</Label>
              <Input
                id="topSpeed"
                value={vehicleForm.topSpeed}
                onChange={(e) => setVehicleForm({ ...vehicleForm, topSpeed: e.target.value })}
                placeholder="e.g., 65 km/hr"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="colors">Color Options (comma-separated)</Label>
            <Input
              id="colors"
              value={vehicleForm.colors}
              onChange={(e) => setVehicleForm({ ...vehicleForm, colors: e.target.value })}
              placeholder="e.g., Red, Blue, White, Black"
            />
          </div>

          {/* Color Images Manager */}
          {vehicleForm.colors.trim() && (
            <ColorImageManager
              colors={vehicleForm.colors.split(',').map(c => c.trim()).filter(c => c)}
              colorImages={colorImages}
              onColorImagesChange={setColorImages}
            />
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleAddVehicle} 
              className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
            <Button 
              onClick={() => setIsAddModalOpen(false)}
              variant="outline"
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Vehicle Form */}
      {editingVehicle && (
        <Card className="shadow-lg border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Edit Vehicle</CardTitle>
            <CardDescription>Modify vehicle details and specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Vehicle Name *</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g., Tesla Model 3"
                />
              </div>
              <div>
                <Label htmlFor="edit-brand">Brand *</Label>
                <Input
                  id="edit-brand"
                  value={editForm.brand}
                  onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                  placeholder="e.g., Tesla"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  placeholder="e.g., 45000"
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-chargingTime">Charging Time</Label>
                <Input
                  id="edit-chargingTime"
                  value={editForm.chargingTime}
                  onChange={(e) => setEditForm({ ...editForm, chargingTime: e.target.value })}
                  placeholder="e.g., 6 hours"
                />
              </div>
              <div>
                <Label htmlFor="edit-range">Range</Label>
                <Input
                  id="edit-range"
                  value={editForm.range}
                  onChange={(e) => setEditForm({ ...editForm, range: e.target.value })}
                  placeholder="e.g., 95 km"
                />
              </div>
              <div>
                <Label htmlFor="edit-battery">Battery</Label>
                <Input
                  id="edit-battery"
                  value={editForm.battery}
                  onChange={(e) => setEditForm({ ...editForm, battery: e.target.value })}
                  placeholder="e.g., 2.3 kWh"
                />
              </div>
              <div>
                <Label htmlFor="edit-topSpeed">Top Speed</Label>
                <Input
                  id="edit-topSpeed"
                  value={editForm.topSpeed}
                  onChange={(e) => setEditForm({ ...editForm, topSpeed: e.target.value })}
                  placeholder="e.g., 65 km/hr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-colors">Color Options (comma-separated)</Label>
              <Input
                id="edit-colors"
                value={editForm.colors}
                onChange={(e) => setEditForm({ ...editForm, colors: e.target.value })}
                placeholder="e.g., Red, Blue, White, Black"
              />
            </div>

            {/* Edit Color Images Manager */}
            {editForm.colors.trim() && (
              <ColorImageManager
                colors={editForm.colors.split(',').map(c => c.trim()).filter(c => c)}
                colorImages={editColorImages}
                onColorImagesChange={setEditColorImages}
              />
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleUpdateVehicle}
                className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Save className="mr-2 h-4 w-4" />
                Update Vehicle
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Existing Vehicles ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{vehicle.name}</TableCell>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>₹{vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>{vehicle.range}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditVehicle(vehicle)}
                        variant="outline"
                        size="sm"
                        className="hover:scale-110 transition-transform"
                        disabled={editingVehicle === vehicle._id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            await deleteVehicle(vehicle._id);
                            toast({ title: 'Deleted', description: 'Vehicle removed successfully' });
                          } catch (error: any) {
                            toast({ title: 'Error', description: error.message || 'Failed to delete vehicle', variant: 'destructive' });
                          }
                        }}
                        variant="destructive"
                        size="sm"
                        className="hover:scale-110 transition-transform"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No vehicles added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleManagement;
