import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Tag, ArrowRight, Sparkles, Zap, Gift } from 'lucide-react';
import { useVehicles, Offer, Vehicle } from '@/contexts/VehicleContext';

interface OfferBannerProps {
  offer: Offer;
  vehicle: Vehicle;
  onClose?: () => void;
}

const OfferBanner = ({ offer, vehicle, onClose }: OfferBannerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);

  // Calculate time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const validUntil = new Date(offer.validUntil).getTime();
      const difference = validUntil - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setTimeLeft('Expired');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [offer.validUntil]);

  // Get vehicle image
  const getVehicleImage = () => {
    if (vehicle.colorImages && vehicle.colorImages.length > 0) {
      const firstColor = vehicle.colorImages[0];
      return firstColor.primaryImage || firstColor.images[0];
    }
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    return null;
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const vehicleImage = getVehicleImage();
  const finalPrice = offer.type === 'percentage' 
    ? vehicle.price * (1 - offer.discount / 100)
    : vehicle.price - offer.discount;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Close Button */}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-red-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-0">
          {/* Left Side - Content */}
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-red-500" />
                <Badge variant="destructive" className="text-lg font-bold px-4 py-2">
                  {offer.discount}% OFF
                </Badge>
              </div>
              <Badge variant="outline" className="text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {timeLeft}
              </Badge>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {offer.title}
            </h3>
            
            <p className="text-gray-700 mb-4 text-lg">
              {offer.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  {vehicle.brand} {vehicle.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ₹{finalPrice.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{vehicle.price.toLocaleString()}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Save ₹{(vehicle.price - finalPrice).toLocaleString()}
              </Badge>
            </div>
          </div>

          {/* Right Side - Vehicle Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-48 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                {vehicleImage ? (
                  <img
                    src={vehicleImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`${vehicleImage ? 'hidden' : ''} w-full h-full flex items-center justify-center`}>
                  <Gift className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg">
            <span>Shop Now</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </CardContent>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full translate-y-12 -translate-x-12"></div>
    </Card>
  );
};

export default OfferBanner;