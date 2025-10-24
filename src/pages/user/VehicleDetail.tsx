import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicles } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Star, 
  Battery, 
  Zap, 
  Gauge, 
  Clock, 
  Shield, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Car,
  CheckCircle,
  Leaf,
  Award,
  Users,
  TrendingUp,
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react';

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, offers } = useVehicles();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const vehicle = vehicles.find(v => v._id === id);
  const offer = offers.find(o => o.vehicleId === id && o.isActive);

  useEffect(() => {
    if (vehicle && vehicle.colors && vehicle.colors.length > 0) {
      setSelectedColor(vehicle.colors[0]);
      setSelectedImage(0);
    }
  }, [vehicle]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  if (!vehicle) {
    return (
      <div className="text-center py-16">
        <Car className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
        <p className="text-muted-foreground mb-6">The vehicle you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/user/vehicles')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vehicles
        </Button>
      </div>
    );
  }

  const finalPrice = offer ? (vehicle.price * (100 - offer.discount)) / 100 : vehicle.price;
  const savings = vehicle.price - finalPrice;

  // Get images for selected color
  const colorImages = vehicle.colorImages?.find(ci => ci.color === selectedColor);
  const images = colorImages?.images || vehicle.images || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span>Vehicles</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{vehicle.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Product Image */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border">
              {images.length > 0 && selectedImage < images.length ? (
                <img
                  src={images[selectedImage]}
                   alt={`${vehicle.name} - ${selectedColor} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-32 w-32 text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((imageUrl, index) => (
                  <div 
                    key={index}
                     className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 cursor-pointer ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={imageUrl}
                       alt={`${vehicle.name} - ${selectedColor} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            
            {/* Product Name and Rating */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                         className={`h-5 w-5 ${
                          star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.2</span>
                  <span className="text-gray-500">(24 reviews)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">On Road Price:</span>
                <span className="text-sm font-medium text-gray-900">Your City</span>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {offer && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{vehicle.price.toLocaleString()}
                    </span>
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      ₹{savings.toLocaleString()} OFF
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex gap-4 text-sm">
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  View Price Breakup
                </Button>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Running Cost Calculator
                </Button>
              </div>
            </div>

            {/* Key Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Charging</p>
                    <p className="font-semibold">{vehicle.chargingTime || '6 hours'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Gauge className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Range</p>
                    <p className="font-semibold">{vehicle.range || '95 km'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Battery className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Battery</p>
                    <p className="font-semibold">{vehicle.battery || '2.3 kWh'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Top Speed</p>
                    <p className="font-semibold">{vehicle.topSpeed || '65 km/hr'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Options */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color Options</h3>
                <div className="flex gap-3">
                  {vehicle.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                       className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                        color.toLowerCase() === 'red' ? '#ef4444' :
                                        color.toLowerCase() === 'blue' ? '#3b82f6' :
                                        color.toLowerCase() === 'black' ? '#000000' :
                                        color.toLowerCase() === 'silver' ? '#94a3b8' :
                                        '#f3f4f6'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="compare" className="rounded" />
                <label htmlFor="compare" className="text-sm text-gray-700">Add to compare</label>
              </div>
              
              <div className="flex gap-4">
                <Button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3">
                  View Current Offers
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 py-3">
                  Visit {vehicle.brand} Page
                </Button>
              </div>
            </div>

            {/* Variants Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{vehicle.name} Variants</h3>
              <div className="grid grid-cols-1 gap-3">
                {/* Main Variant */}
                <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{vehicle.name}</h4>
                      <p className="text-2xl font-bold text-gray-900">₹{vehicle.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-gray-600" />
                        <span>Top Speed {vehicle.topSpeed || '65 km/hr'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span>Range {vehicle.range || '95 km'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Variants (if available) */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">{vehicle.name} Pro</h4>
                      <p className="text-2xl font-bold text-gray-900">₹{(vehicle.price + 5000).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-gray-600" />
                        <span>Top Speed 70 km/hr</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span>Range 110 km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;