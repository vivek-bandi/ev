import React, { useState, useEffect } from 'react';
import { useVehicles, Vehicle, Offer } from '@/contexts/VehicleContext';
import { useSavedVehicles } from '@/contexts/SavedVehiclesContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import OfferBannerCarousel from '@/components/OfferBannerCarousel';
import OfferNotification from '@/components/OfferNotification';
import AchievementCard from '@/components/AchievementCard';
import SaveButton from '@/components/SaveButton';
import ShareModal from '@/components/ShareModal';
import { 
  Car, 
  Tag, 
  Star, 
  Search, 
  Filter, 
  Battery, 
  Zap, 
  Gauge, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Users,
  Shield,
  Award,
  Leaf,
  ChevronRight,
  AlertCircle,
  Share2
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { vehicles, offers, achievements, loading, error, clearError } = useVehicles();
  const { isSaved, toggleSave } = useSavedVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedVehicleForShare, setSelectedVehicleForShare] = useState<Vehicle | null>(null);

  // Filter and search vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || filterCategory === 'all' || vehicle.category === filterCategory;
    const matchesBrand = !filterBrand || filterBrand === 'all' || vehicle.brand === filterBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return 0;
    }
  });

  const categories = [...new Set(vehicles.map(v => v.category))];
  const brands = [...new Set(vehicles.map(v => v.brand))];

  const getVehicleOffer = (vehicleId: string) => {
    return offers.find(offer => offer.vehicleId === vehicleId && offer.isActive);
  };

  const handleShare = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedVehicleForShare(vehicle);
    setShareModalOpen(true);
  };

  const featuredVehicles = vehicles.filter(v => v.featured).slice(0, 3);
  const activeOffers = offers.filter(o => o.isActive);

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in p-4 md:p-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                <p className="text-red-700 font-medium text-sm md:text-base">Connection Issue</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearError}
                className="text-red-600 border-red-300 hover:bg-red-100 text-xs md:text-sm"
              >
                Dismiss
              </Button>
            </div>
            <p className="text-red-600 text-xs md:text-sm mt-2">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Offer Notification */}
      <OfferNotification />
      
      {/* Dynamic Hero Section with Offers */}
      <section className="space-y-4 md:space-y-6">
        {/* Offer Banners as Primary Hero */}
        {activeOffers.length > 0 ? (
          <div className="space-y-4">
            <OfferBannerCarousel offers={offers} />
          </div>
        ) : (
          /* Fallback Hero Section */
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-6 md:p-12 text-center">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Leaf className="h-6 w-6 md:h-8 md:w-8" />
                <h1 className="text-2xl md:text-4xl font-bold">Welcome to EV Store</h1>
                <Leaf className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <p className="text-sm md:text-xl mb-4 md:mb-6 max-w-2xl mx-auto">
                Discover our premium collection of electric vehicles designed for a sustainable future
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button size="lg" variant="secondary" onClick={() => navigate('/user/vehicles')} className="text-sm md:text-base">
                  <Car className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Explore Vehicles
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-sm md:text-base">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Book Test Drive
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Button size="lg" variant="outline" onClick={() => navigate('/user/vehicles')} className="text-sm md:text-base">
            <Car className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Explore All Vehicles
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/user/test-drive')} className="text-sm md:text-base">
            <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Book Test Drive
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {loading && (
          <div className="col-span-2 md:col-span-4 text-center py-4">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-primary"></div>
              Updating data...
            </div>
          </div>
        )}
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-green-100 rounded-full">
                <Car className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{vehicles.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Available Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-full">
                <Tag className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">{activeOffers.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Active Offers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-purple-100 rounded-full">
                <Users className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">500+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-orange-100 rounded-full">
                <Award className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-lg md:text-2xl font-bold">5★</p>
                <p className="text-xs md:text-sm text-muted-foreground">Customer Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Vehicles */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Our top-rated electric vehicles</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/user/vehicles')} className="text-sm md:text-base">
            View All <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredVehicles.map((vehicle) => {
            const offer = getVehicleOffer(vehicle._id);
            const finalPrice = offer ? (vehicle.price * (100 - offer.discount)) / 100 : vehicle.price;

            // Get primary image from colorImages or fallback to general images
            const getPrimaryImage = () => {
              const firstColorImages = vehicle.colorImages?.[0];
              return firstColorImages?.primaryImage || firstColorImages?.images?.[0] || vehicle.images?.[0];
            };
            const primaryImage = getPrimaryImage();

            return (
              <Card 
                key={vehicle._id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                 onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
              >
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {vehicle.brand}
                      </CardDescription>
                    </div>
                    {offer && (
                      <Badge variant="destructive" className="text-sm px-2 py-1">
                        -{offer.discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.range && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Gauge className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Range</p>
                          <p className="text-sm font-bold">{vehicle.range}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.chargingTime && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Charging</p>
                          <p className="text-sm font-bold">{vehicle.chargingTime}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                      {offer && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{vehicle.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {vehicle.year} • {vehicle.fuelType}
                    </p>
                    
                    {/* Save and Share Buttons */}
                    <div className="flex gap-2">
                      <SaveButton 
                        vehicleId={vehicle._id} 
                        vehicleData={vehicle}
                        className="flex-1"
                        showText={true}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleShare(vehicle, e)}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Active Offers */}
        {activeOffers && activeOffers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Tag className="h-8 w-8 text-green-500" />
                Special Offers
              </h2>
              <p className="text-muted-foreground mt-1">Limited time deals on electric vehicles</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/user/offers')}>
              View All Offers <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOffers.slice(0, 6).map((offer) => {
              const vehicle = vehicles.find(v => v._id === offer.vehicleId);
              if (!vehicle) return null;

              return (
                <Card key={offer._id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <CardDescription>{vehicle.name} - {vehicle.brand}</CardDescription>
                      </div>
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        -{offer.discount}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold">Save ₹{(vehicle.price * offer.discount / 100).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Valid until: {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'No expiry'}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}>
                        View Deal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Find Your Perfect EV</CardTitle>
            <CardDescription className="text-sm">Search and filter through our vehicle collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm md:text-base"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Vehicle Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <h2 className="text-2xl md:text-3xl font-bold">All Vehicles ({sortedVehicles.length})</h2>
          <Button variant="outline" onClick={() => navigate('/user/vehicles')} className="text-sm md:text-base">
            View All <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedVehicles.slice(0, 6).map((vehicle) => {
            const offer = getVehicleOffer(vehicle._id);
            const finalPrice = offer ? (vehicle.price * (100 - offer.discount)) / 100 : vehicle.price;

            return (
              <Card 
                key={vehicle._id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                 onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
              >
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {vehicle.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {vehicle.brand}
                      </CardDescription>
                    </div>
                    {offer && (
                      <Badge variant="destructive" className="text-sm px-2 py-1">
                        -{offer.discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {vehicle.range && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Gauge className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Range</p>
                          <p className="text-sm font-bold">{vehicle.range}</p>
                        </div>
                      </div>
                    )}
                    
                    {vehicle.chargingTime && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Charging</p>
                          <p className="text-sm font-bold">{vehicle.chargingTime}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                      {offer && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{vehicle.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {vehicle.year} • {vehicle.fuelType}
                    </p>
                    
                    {/* Save and Share Buttons */}
                    <div className="flex gap-2">
                      <SaveButton 
                        vehicleId={vehicle._id} 
                        vehicleData={vehicle}
                        className="flex-1"
                        showText={true}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleShare(vehicle, e)}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Achievements Section */}
      {achievements.filter(a => a.isActive).length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Award className="h-8 w-8 text-yellow-500" />
                Our Achievements
              </h2>
              <p className="text-muted-foreground mt-1">Recognitions and milestones that define our success</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements
              .filter(a => a.isActive)
              .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
              .slice(0, 6)
              .map((achievement) => (
                <AchievementCard key={achievement._id} achievement={achievement} />
              ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section>
        <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="p-4 md:p-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Go Electric?</h2>
              <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied customers who have made the switch to sustainable transportation
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/user/test-drive')} className="text-sm md:text-base">
                  <Car className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Book Test Drive
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/user/contact')} className="text-sm md:text-base">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Share Modal */}
      {selectedVehicleForShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedVehicleForShare(null);
          }}
          vehicle={selectedVehicleForShare}
        />
      )}
    </div>
  );
};

export default UserDashboard;
