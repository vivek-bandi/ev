import React, { useState } from 'react';
import { useVehicles } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import SaveButton from '@/components/SaveButton';
import ShareModal from '@/components/ShareModal';
import { 
  Car, 
  Star, 
  Search, 
  Filter, 
  Battery, 
  Zap, 
  Gauge, 
  Clock, 
  Grid3X3,
  List,
  SlidersHorizontal,
  Share2
} from 'lucide-react';

const VehiclesPage = () => {
  const navigate = useNavigate();
  const { vehicles, offers } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedVehicleForShare, setSelectedVehicleForShare] = useState<any>(null);

  // Filter and search vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || filterCategory === 'all' || vehicle.category === filterCategory;
    const matchesBrand = !filterBrand || filterBrand === 'all' || vehicle.brand === filterBrand;
    
    let matchesPrice = true;
    if (filterPriceRange && filterPriceRange !== 'all') {
      const [min, max] = filterPriceRange.split('-').map(Number);
      matchesPrice = vehicle.price >= min && vehicle.price <= max;
    }
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
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
      case 'range':
        return (b.range || '').localeCompare(a.range || '');
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

  const handleShare = (vehicle: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedVehicleForShare(vehicle);
    setShareModalOpen(true);
  };

  const VehicleCard = ({ vehicle }: { vehicle: any }) => {
    const offer = getVehicleOffer(vehicle._id);
    const finalPrice = offer ? (vehicle.price * (100 - offer.discount)) / 100 : vehicle.price;

    if (viewMode === 'list') {
      return (
        <Card 
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
           onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
        >
          <div className="flex">
            <div className="w-40 sm:w-64 h-32 sm:h-48 bg-muted rounded-l-lg flex items-center justify-center overflow-hidden">
              {(() => {
                // Get first available image
                const firstColorImages = vehicle.colorImages?.[0];
                const firstImage = firstColorImages?.primaryImage || firstColorImages?.images?.[0] || vehicle.images?.[0];
                
                if (firstImage) {
                  return (
                    <img
                      src={firstImage}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  );
                }
                
                return (
                  <>
                    <Car className="h-16 w-16 text-muted-foreground" />
                    <div className="absolute inset-0 flex items-center justify-center bg-muted" style={{ display: 'none' }}>
                      <Car className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{vehicle.brand}</span>
                    <Badge variant="outline" className="ml-2">
                      {vehicle.category?.charAt(0).toUpperCase() + vehicle.category?.slice(1)}
                    </Badge>
                  </div>
                </div>
                {offer && (
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    -{offer.discount}%
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                {vehicle.range && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Range</p>
                      <p className="text-sm font-semibold">{vehicle.range}</p>
                    </div>
                  </div>
                )}
                {vehicle.chargingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Charging</p>
                      <p className="text-sm font-semibold">{vehicle.chargingTime}</p>
                    </div>
                  </div>
                )}
                {vehicle.battery && (
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Battery</p>
                      <p className="text-sm font-semibold">{vehicle.battery}</p>
                    </div>
                  </div>
                )}
                {vehicle.topSpeed && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Top Speed</p>
                      <p className="text-sm font-semibold">{vehicle.topSpeed}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-baseline gap-2">
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
                <Button onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}>View Details</Button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card 
        key={vehicle._id} 
        className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50 cursor-pointer"
           onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-glow to-primary" />
        
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
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {(() => {
              // Get first available image
              const firstColorImages = vehicle.colorImages?.[0];
              const firstImage = firstColorImages?.primaryImage || firstColorImages?.images?.[0] || vehicle.images?.[0];
              
              if (firstImage) {
                return (
                  <img
                    src={firstImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                );
              }
              
              return (
                <>
                  <Car className="h-16 w-16 text-muted-foreground" />
                  <div className="absolute inset-0 flex items-center justify-center bg-muted" style={{ display: 'none' }}>
                    <Car className="h-16 w-16 text-muted-foreground" />
                  </div>
                </>
              );
            })()}
          </div>
          
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">All Vehicles</h1>
          <p className="text-muted-foreground mt-1">Discover our complete collection of electric vehicles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
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
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriceRange} onValueChange={setFilterPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-2500000">Under ₹25,00,000</SelectItem>
                <SelectItem value="2500000-4000000">₹25,00,000 - ₹40,00,000</SelectItem>
                <SelectItem value="4000000-6000000">₹40,00,000 - ₹60,00,000</SelectItem>
                <SelectItem value="6000000-8000000">₹60,00,000 - ₹80,00,000</SelectItem>
                <SelectItem value="8000000-9999999">Over ₹80,00,000</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="range">Range</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterBrand('all');
                setFilterPriceRange('all');
                setSortBy('featured');
              }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {sortedVehicles.length} Vehicle{sortedVehicles.length !== 1 ? 's' : ''} Found
          </h2>
          {(searchTerm || filterCategory || filterBrand || filterPriceRange) && (
            <Badge variant="secondary">
              Filtered Results
            </Badge>
          )}
        </div>
      </div>

      {/* Vehicle Grid/List */}
      {sortedVehicles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Car className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
              setFilterBrand('');
              setFilterPriceRange('');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {sortedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}

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

export default VehiclesPage;
