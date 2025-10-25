import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customerAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Phone, Mail, MapPin, Calendar, Car, Users, TrendingUp } from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  purchaseHistory: Array<{
    vehicleId: string;
    purchaseDate: string;
    amount: number;
  }>;
  testDriveHistory: Array<{
    vehicleId: string;
    scheduledDate: string;
    status: string;
  }>;
  createdAt: string;
}

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll({ limit: 50 });
      setCustomers(response.data.customers || response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch customers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email) {
      toast({
        title: 'Error',
        description: 'Please fill required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await customerAPI.create(newCustomer);
      toast({ title: 'Success', description: 'Customer added successfully' });
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        }
      });
      setShowAddForm(false);
      fetchCustomers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add customer',
        variant: 'destructive'
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = !filterCity || filterCity === 'all' || customer.address?.city?.toLowerCase().includes(filterCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(customers.map(c => c.address?.city).filter(Boolean))];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer database</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription className="hidden sm:block">
            Search and filter customers by name, email, or city
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="search" className="font-medium">Search Customers</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="font-medium">Filter by City</Label>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterCity('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="border-primary shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle>Add New Customer</CardTitle>
            <CardDescription>Enter customer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={newCustomer.address.city}
                  onChange={(e) => setNewCustomer({ 
                    ...newCustomer, 
                    address: { ...newCustomer.address, city: e.target.value }
                  })}
                  placeholder="Mumbai"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  value={newCustomer.address.state}
                  onChange={(e) => setNewCustomer({ 
                    ...newCustomer, 
                    address: { ...newCustomer.address, state: e.target.value }
                  })}
                  placeholder="Maharashtra"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={handleAddCustomer}
                className="w-full sm:w-auto flex-1 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers Table */}
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Scroll horizontally to view all details
            </span>
          </div>
          <CardDescription>Customer database and contact information</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading customers...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Contact</TableHead>
                    <TableHead className="min-w-[180px]">Location</TableHead>
                    <TableHead className="min-w-[100px]">Purchases</TableHead>
                    <TableHead className="min-w-[100px]">Test Drives</TableHead>
                    <TableHead className="min-w-[140px]">Member Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer._id} className="hover:bg-muted/50 transition-colors group">
                      <TableCell>
                        <div>
                          <p className="font-medium truncate">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{customer.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.address?.city && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {customer.address.city}, {customer.address.state}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 whitespace-nowrap">
                          <Car className="h-3 w-3" />
                          {customer.purchaseHistory.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 whitespace-nowrap">
                          <Users className="h-3 w-3" />
                          {customer.testDriveHistory.length}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="h-8 w-8 mb-2 opacity-50" />
                          <p>No customers found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;
