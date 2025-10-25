import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Star, Zap, ShoppingCart, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Offer } from '@/contexts/VehicleContext';

interface OfferBannerCarouselProps {
  offers: Offer[];
  interval?: number; // milliseconds between slides
}

const OfferBannerCarousel: React.FC<OfferBannerCarouselProps> = ({ offers, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = React.useRef<number | null>(null);
  const navigate = useNavigate();

  // Filter active offers
  const activeOffers = offers.filter(offer => {
    if (!offer.isActive) return false;
    if (!offer.validUntil) return true;
    return new Date(offer.validUntil) > new Date();
  });

  // Auto-scroll using a ref so we can reliably start/stop the timer
  useEffect(() => {
    // clear any existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isAutoPlaying || activeOffers.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === activeOffers.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAutoPlaying, activeOffers.length, interval]);

  // Pause auto-play on hover/focus/touch
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  const handleTouchStart = () => setIsAutoPlaying(false);
  const handleTouchEnd = () => setIsAutoPlaying(true);
  const handleFocus = () => setIsAutoPlaying(false);
  const handleBlur = () => setIsAutoPlaying(true);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? activeOffers.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === activeOffers.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (activeOffers.length === 0) {
    return null;
  }

  const currentOffer = activeOffers[currentIndex];
  const finalPrice = currentOffer.vehicle ? 
    (currentOffer.vehicle.price * (100 - currentOffer.discount)) / 100 : 0;
  const savings = currentOffer.vehicle ? 
    currentOffer.vehicle.price - finalPrice : 0;

  // Get vehicle image
  // Prefer the main `vehicle.images[0]` (most common), then fall back to colorImages primaryImage or first color image.
  // This increases the chance of showing an image on mobile where colorImages structure may differ.
  const getVehicleImage = () => {
    if (!currentOffer.vehicle) return null;

    // 1) Prefer top-level images array
    if (currentOffer.vehicle.images && currentOffer.vehicle.images.length > 0) {
      return currentOffer.vehicle.images[0];
    }

    // 2) Fall back to colorImages structure
    const firstColorImages = currentOffer.vehicle.colorImages?.[0];
    return firstColorImages?.primaryImage || firstColorImages?.images?.[0] || null;
  };

  const vehicleImage = getVehicleImage();

  return (
    <div className="relative w-full mb-8">
      {/* Main Banner */}
      <Card 
        className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row h-auto lg:h-64 xl:h-80">
            {/* Left Section - Vehicle Image and Models */}
            <div className="flex-1 relative overflow-hidden h-48 lg:h-full">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                }} />
              </div>
              
              {/* Abstract Arcs - Hidden on mobile for cleaner look */}
              <div className="absolute inset-0 hidden lg:block">
                <div className="absolute top-4 right-8 w-32 h-32 border-4 border-red-400 rounded-full opacity-60" style={{ clipPath: 'circle(50% at 0% 0%)' }} />
                <div className="absolute top-8 right-12 w-24 h-24 border-4 border-pink-400 rounded-full opacity-60" style={{ clipPath: 'circle(50% at 0% 0%)' }} />
                <div className="absolute top-12 right-16 w-20 h-20 border-4 border-blue-400 rounded-full opacity-60" style={{ clipPath: 'circle(50% at 0% 0%)' }} />
                <div className="absolute top-16 right-20 w-16 h-16 border-4 border-cyan-400 rounded-full opacity-60" style={{ clipPath: 'circle(50% at 0% 0%)' }} />
                <div className="absolute top-20 right-24 w-12 h-12 border-4 border-white rounded-full opacity-60" style={{ clipPath: 'circle(50% at 0% 0%)' }} />
              </div>

              {/* Vehicle Image */}
              {vehicleImage ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={vehicleImage}
                    alt={currentOffer.vehicle?.name}
                    loading="lazy"
                    className="max-w-full max-h-full object-contain opacity-90"
                    onError={(e) => {
                      // If image fails to load (CORS or broken URL), hide it gracefully so the UI remains usable.
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                // Small fallback placeholder to avoid layout collapse on small screens
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-20 h-20 bg-white/10 rounded-md flex items-center justify-center">
                    <Car className="h-8 w-8 text-white/60" />
                  </div>
                </div>
              )}

              {/* EV Icon */}
              <div className="absolute top-2 left-2 lg:top-4 lg:left-4">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 lg:h-6 lg:w-6 text-purple-800" />
                </div>
              </div>
            </div>

            {/* Right Section - Offer Details */}
            <div className="flex-1 bg-gradient-to-br from-purple-700 to-purple-900 p-4 md:p-6 flex flex-col justify-between min-h-48 lg:min-h-0">
              {/* Offer Text */}
              <div className="text-center mb-4 md:mb-6">
                <div className="text-white text-lg md:text-xl font-semibold mb-2 md:mb-3">
                  Up to <span className="text-yellow-400 font-bold text-2xl md:text-3xl">{currentOffer.discount}% OFF</span>
                </div>
                <div className="text-white text-sm md:text-base mb-3 md:mb-4">
                  on {currentOffer.vehicle?.name || 'EV Vehicles'}
                </div>
              </div>

              {/* Brand Messaging */}
              <div className="text-center mb-4 md:mb-6">
                <div className="text-white text-xl md:text-2xl font-bold mb-2">Smart EV Shopping</div>
                <div className="text-white text-sm md:text-base">Trusted by Thousands</div>
              </div>

              {/* Call to Action Button */}
              <div className="flex justify-center">
                <Button
                  onClick={() => navigate(`/user/vehicle/${currentOffer.vehicleId}`)}
                  className="bg-white text-purple-800 hover:bg-yellow-400 hover:text-purple-900 font-bold px-8 md:px-12 py-3 md:py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-base md:text-lg w-full sm:w-auto"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      {activeOffers.length > 1 && (
        <>
          {/* Previous Button */}
          <Button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 md:w-10 md:h-10 p-0"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Next Button */}
          <Button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 md:w-10 md:h-10 p-0"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-3 md:mt-4 space-x-2">
            {activeOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default OfferBannerCarousel;