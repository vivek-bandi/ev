import React, { useState } from 'react';
import { useVehicles } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Clock, 
  Car, 
  Star, 
  Calendar,
  Zap,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react';

const OffersPage = () => {
  const navigate = useNavigate();
  const { vehicles, offers } = useVehicles();
  const [filterType, setFilterType] = useState('all');

  const activeOffers = offers.filter(offer => offer.isActive);
  
  const filteredOffers = activeOffers.filter(offer => {
    if (filterType === 'all') return true;
    if (filterType === 'expiring') {
      if (!offer.validUntil) return false;
      const expiryDate = new Date(offer.validUntil);
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      return expiryDate <= sevenDaysFromNow;
    }
    if (filterType === 'high-discount') {
      return offer.discount >= 20;
    }
    return true;
  });

  const getVehicleOffer = (vehicleId: string) => {
    return offers.find(offer => offer.vehicleId === vehicleId && offer.isActive);
  };

  const expiringOffers = activeOffers.filter(offer => {
    if (!offer.validUntil) return false;
    const expiryDate = new Date(offer.validUntil);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return expiryDate <= sevenDaysFromNow;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Special Offers</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover amazing deals on our premium electric vehicles. Limited time offers with exclusive discounts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeOffers.length}</p>
                <p className="text-sm text-muted-foreground">Active Offers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{expiringOffers.length}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {activeOffers.length > 0 
                    ? Math.round(activeOffers.reduce((sum, o) => sum + o.discount, 0) / activeOffers.length)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground">Avg. Discount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{activeOffers.reduce((sum, offer) => {
                    const vehicle = vehicles.find(v => v._id === offer.vehicleId);
                    return sum + (vehicle ? (vehicle.price * offer.discount / 100) : 0);
                  }, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
        >
          All Offers
        </Button>
        <Button
          variant={filterType === 'expiring' ? 'default' : 'outline'}
          onClick={() => setFilterType('expiring')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Expiring Soon
        </Button>
        <Button
          variant={filterType === 'high-discount' ? 'default' : 'outline'}
          onClick={() => setFilterType('high-discount')}
        >
          <Zap className="h-4 w-4 mr-2" />
          High Discount
        </Button>
      </div>

      {/* Featured Offers */}
      {filteredOffers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {filterType === 'all' ? 'All Offers' : 
               filterType === 'expiring' ? 'Expiring Soon' : 
               'High Discount Offers'}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const vehicle = vehicles.find(v => v._id === offer.vehicleId);
              if (!vehicle) return null;

              const savings = vehicle.price * offer.discount / 100;
              const finalPrice = vehicle.price - savings;
              const isExpiring = offer.validUntil && new Date(offer.validUntil) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              return (
                <Card 
                  key={offer._id} 
                  className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50 cursor-pointer ${
                    isExpiring ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'
                  }`}
                   onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    isExpiring 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`} />
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {offer.title}
                        </CardTitle>
                        <CardDescription className="text-base font-medium flex items-center gap-2">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          {vehicle.name} - {vehicle.brand}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="destructive" 
                          className={`text-lg px-3 py-1 ₹{
                            isExpiring ? 'bg-orange-500' : ''
                          }`}
                        >
                          -{offer.discount}%
                        </Badge>
                        {isExpiring && (
                          <Badge variant="outline" className="mt-1 text-orange-600 border-orange-300">
                            <Clock className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Car className="h-16 w-16 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-green-600">
                            Save ₹{savings.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            From ₹{vehicle.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            ₹{finalPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Final Price</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {offer.validUntil 
                              ? `Valid until ₹{new Date(offer.validUntil).toLocaleDateString()}`
                              : 'No expiry date'
                            }
                          </span>
                        </div>
                        <Button size="sm" className="group-hover:scale-105 transition-transform">
                          View Deal
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* No Offers */}
      {filteredOffers.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Tag className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No offers found</h3>
            <p className="text-muted-foreground mb-6">
              {filterType === 'all' 
                ? 'There are currently no active offers available.'
                : `No offers match the "₹{filterType}" filter.`
              }
            </p>
            <Button onClick={() => setFilterType('all')}>
              View All Offers
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            These offers are limited time only. Book a test drive today to secure your discount.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              <Calendar className="h-5 w-5 mr-2" />
              Book Test Drive
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/user/vehicles')}>
              <Car className="h-5 w-5 mr-2" />
              Browse All Vehicles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersPage;
