import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useVehicles } from '@/contexts/VehicleContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const TestDrivePage = () => {
  const { vehicles } = useVehicles();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredVehicle: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    message: '',
    licenseNumber: '',
    experience: 'beginner'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.preferredVehicle || !formData.preferredDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Success',
      description: 'Your test drive request has been submitted! We\'ll contact you soon to confirm the details.'
    });

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredVehicle: '',
      preferredDate: '',
      preferredTime: '',
      location: '',
      message: '',
      licenseNumber: '',
      experience: 'beginner'
    });
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const locations = [
    'Main Showroom - Downtown',
    'North Branch - Shopping Mall',
    'South Branch - Business District',
    'East Branch - Residential Area'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Book a Test Drive</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the power and performance of our electric vehicles firsthand. 
          Schedule your test drive today!
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <Car className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Expert Guidance</h3>
            <p className="text-muted-foreground">
              Our trained specialists will guide you through all the features and capabilities.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <Clock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Flexible Scheduling</h3>
            <p className="text-muted-foreground">
              Choose from multiple time slots and locations that work with your schedule.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Pressure</h3>
            <p className="text-muted-foreground">
              Take your time to explore and ask questions without any sales pressure.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Drive Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Test Drive Request Form
              </CardTitle>
              <CardDescription>
                Fill out the form below to schedule your test drive experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Drive Details */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Test Drive Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredVehicle">Preferred Vehicle *</Label>
                      <Select value={formData.preferredVehicle} onValueChange={(value) => setFormData({ ...formData, preferredVehicle: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle._id} value={vehicle._id}>
                              {vehicle.name} - {vehicle.brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Driving Experience</Label>
                      <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="experienced">Experienced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="preferredDate">Preferred Date *</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="licenseNumber">Driver's License Number</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        placeholder="Enter your license number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Special Requests or Questions</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        placeholder="Any specific features you'd like to test or questions you have..."
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Test Drive
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Welcome & Introduction</h4>
                    <p className="text-sm text-muted-foreground">
                      Meet your EV specialist and learn about the vehicle features
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Vehicle Walkthrough</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the interior, exterior, and key features
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Test Drive</h4>
                    <p className="text-sm text-muted-foreground">
                      Experience the vehicle on various road conditions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q&A Session</h4>
                    <p className="text-sm text-muted-foreground">
                      Ask questions and discuss pricing and financing options
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Test Drive Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{location}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Available Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span className="text-sm text-muted-foreground">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span className="text-sm text-muted-foreground">Closed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestDrivePage;
