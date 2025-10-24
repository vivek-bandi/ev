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
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold">Offer Management</h2>

      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle>Create New Offer</CardTitle>
          <CardDescription>Add promotions and discounts for vehicles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="offerVehicle">Select Vehicle *</Label>
              <select
                id="offerVehicle"
                value={offerForm.vehicleId}
                onChange={(e) => setOfferForm({ ...offerForm, vehicleId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-300 focus:scale-105"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} - {v.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="offerTitle">Offer Title *</Label>
              <Input
                id="offerTitle"
                value={offerForm.title}
                onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                placeholder="e.g., Summer Sale"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="offerDescription">Description</Label>
            <Textarea
              id="offerDescription"
              value={offerForm.description}
              onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
              placeholder="Describe the offer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">Discount (%) *</Label>
              <Input
                id="discount"
                type="number"
                value={offerForm.discount}
                onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                placeholder="e.g., 15"
              />
            </div>
            <div>
              <Label htmlFor="validUntil">Valid Until</Label>
              <Input
                id="validUntil"
                type="date"
                value={offerForm.validUntil}
                onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={handleAddOffer} 
            className="w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Offer
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Active Offers ({offers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => {
                const vehicle = vehicles.find((v) => v._id === offer.vehicleId);
                return (
                  <TableRow key={offer._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell>{vehicle?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-semibold">
                        {offer.discount}%
                      </span>
                    </TableCell>
                    <TableCell>{offer.validUntil || 'No expiry'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditOffer(offer)}
                          variant="outline"
                          size="sm"
                          className="hover:scale-110 transition-transform"
                        >
                          <Edit className="h-4 w-4" />
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
                          variant="destructive"
                          size="sm"
                          className="hover:scale-110 transition-transform"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {offers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No offers created yet
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editOfferVehicle">Select Vehicle *</Label>
              <select
                id="editOfferVehicle"
                value={editForm.vehicleId}
                onChange={(e) => setEditForm({ ...editForm, vehicleId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-300 focus:scale-105"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name} - {v.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="editOfferTitle">Offer Title *</Label>
              <Input
                id="editOfferTitle"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="e.g., Summer Sale"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editOfferDiscount">Discount (%) *</Label>
              <Input
                id="editOfferDiscount"
                type="number"
                value={editForm.discount}
                onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                placeholder="e.g., 25"
                min="0"
                max="100"
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <div>
              <Label htmlFor="editOfferValidUntil">Valid Until</Label>
              <Input
                id="editOfferValidUntil"
                type="date"
                value={editForm.validUntil}
                onChange={(e) => setEditForm({ ...editForm, validUntil: e.target.value })}
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="editOfferDescription">Description</Label>
            <Textarea
              id="editOfferDescription"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Describe the offer details..."
              className="transition-all duration-300 focus:scale-105"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleUpdateOffer} 
              className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
