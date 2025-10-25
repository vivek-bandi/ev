import React, { useState } from 'react';
import { useVehicles } from '@/contexts/VehicleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import Modal from '@/components/ui/modal';

const OfferManagement = () => {
  const { vehicles, offers, addOffer, deleteOffer, updateOffer } = useVehicles();
  const { toast } = useToast();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [offerForm, setOfferForm] = useState({
    vehicleId: '',
    title: '',
    description: '',
    discount: '',
    validUntil: '',
  });

  // Edit state
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    vehicleId: '',
    title: '',
    description: '',
    discount: '',
    validUntil: '',
  });

  const handleAddOffer = async () => {
    if (!offerForm.vehicleId || !offerForm.title || !offerForm.discount) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      await addOffer({
        ...offerForm,
        discount: parseFloat(offerForm.discount),
        validUntil: offerForm.validUntil || undefined,
        type: 'percentage',
        isActive: true
      });

      toast({ title: 'Success', description: 'Offer added successfully' });
      setOfferForm({
        vehicleId: '',
        title: '',
        description: '',
        discount: '',
        validUntil: '',
      });
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add offer', variant: 'destructive' });
    }
  };

  // Edit functions
  const handleEditOffer = (offer: any) => {
    setEditingOffer(offer._id);
    setEditForm({
      vehicleId: offer.vehicleId,
      title: offer.title,
      description: offer.description,
      discount: offer.discount.toString(),
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingOffer(null);
    setEditForm({
      vehicleId: '',
      title: '',
      description: '',
      discount: '',
      validUntil: '',
    });
    setIsEditModalOpen(false);
  };

  const handleUpdateOffer = async () => {
    if (!editForm.vehicleId || !editForm.title || !editForm.discount) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      await updateOffer(editingOffer!, {
        ...editForm,
        discount: parseFloat(editForm.discount),
        validUntil: editForm.validUntil || undefined,
        type: 'percentage',
        isActive: true
      });

      toast({ title: 'Success', description: 'Offer updated successfully' });
      handleCancelEdit();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update offer', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Offer Management</h2>
        <p className="text-sm text-muted-foreground">
          Manage vehicle offers and promotions
        </p>
      </div>

      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="space-y-1">
          <CardTitle>Create New Offer</CardTitle>
          <CardDescription>Add promotions and discounts for vehicles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="offerVehicle" className="font-medium">
                Select Vehicle *
              </Label>
              <select
                id="offerVehicle"
                value={offerForm.vehicleId}
                onChange={(e) => setOfferForm({ ...offerForm, vehicleId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} - {v.brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerTitle" className="font-medium">
                Offer Title *
              </Label>
              <Input
                id="offerTitle"
                value={offerForm.title}
                onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                placeholder="e.g., Summer Sale"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerDescription" className="font-medium">
              Description
            </Label>
            <Textarea
              id="offerDescription"
              value={offerForm.description}
              onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
              placeholder="Describe the offer..."
              className="min-h-[80px] w-full resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="discount" className="font-medium">
                Discount (%) *
              </Label>
              <Input
                id="discount"
                type="number"
                value={offerForm.discount}
                onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                placeholder="e.g., 15"
                className="w-full"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil" className="font-medium">
                Valid Until
              </Label>
              <Input
                id="validUntil"
                type="date"
                value={offerForm.validUntil}
                onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={handleAddOffer} 
            className="w-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>Active Offers ({offers.length})</CardTitle>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Scroll horizontally to view all details
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">Title</TableHead>
                  <TableHead className="min-w-[140px]">Vehicle</TableHead>
                  <TableHead className="min-w-[100px]">Discount</TableHead>
                  <TableHead className="min-w-[120px]">Valid Until</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => {
                  const vehicle = vehicles.find((v) => v._id === offer.vehicleId);
                  return (
                    <TableRow 
                      key={offer._id} 
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <TableCell className="font-medium truncate max-w-[160px]">
                        {offer.title}
                      </TableCell>
                      <TableCell className="truncate max-w-[140px]">
                        {vehicle?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                          {offer.discount}%
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {offer.validUntil ? 
                          new Date(offer.validUntil).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 
                          'No expiry'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleEditOffer(offer)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit offer</span>
                          </Button>
                          <Button
                            onClick={async () => {
                              try {
                                await deleteOffer(offer._id);
                                toast({ title: 'Deleted', description: 'Offer removed successfully' });
                              } catch (error: any) {
                                toast({ title: 'Error', description: error.message || 'Failed to delete offer', variant: 'destructive' });
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 opacity-70 hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete offer</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {offers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="mt-2">No offers created yet</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Offer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Offer"
        size="lg"
      >
        <div className="space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="editOfferVehicle" className="font-medium">
                Select Vehicle *
              </Label>
              <select
                id="editOfferVehicle"
                value={editForm.vehicleId}
                onChange={(e) => setEditForm({ ...editForm, vehicleId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} - {v.brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editOfferTitle" className="font-medium">
                Offer Title *
              </Label>
              <Input
                id="editOfferTitle"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="e.g., Summer Sale"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="editOfferDiscount" className="font-medium">
                Discount (%) *
              </Label>
              <Input
                id="editOfferDiscount"
                type="number"
                value={editForm.discount}
                onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                placeholder="e.g., 25"
                className="w-full"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editOfferValidUntil" className="font-medium">
                Valid Until
              </Label>
              <Input
                id="editOfferValidUntil"
                type="date"
                value={editForm.validUntil}
                onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editOfferDescription" className="font-medium">
              Description
            </Label>
            <Textarea
              id="editOfferDescription"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Describe the offer details..."
              className="min-h-[80px] w-full resize-y"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleUpdateOffer} 
              className="flex-1 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Save className="mr-2 h-4 w-4" />
              Update Offer
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
        </div>
      </Modal>
    </div>
  );
};

export default OfferManagement;
