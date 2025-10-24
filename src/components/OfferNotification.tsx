import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Tag, Sparkles, Clock } from 'lucide-react';
import { useVehicles } from '@/contexts/VehicleContext';

interface OfferNotificationProps {
  onClose?: () => void;
}

const OfferNotification: React.FC<OfferNotificationProps> = ({ onClose }) => {
  const { offers } = useVehicles();
  const [isVisible, setIsVisible] = useState(false);
  const [lastOfferCount, setLastOfferCount] = useState(0);

  useEffect(() => {
    const activeOffers = offers.filter(o => o.isActive);
    
    // Show notification when new offers are added (but only if we have a significant increase)
    if (activeOffers.length > lastOfferCount && lastOfferCount > 0 && activeOffers.length - lastOfferCount >= 1) {
      setIsVisible(true);
      
      // Auto-hide after 3 seconds (shorter duration)
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    setLastOfferCount(activeOffers.length);
  }, [offers, lastOfferCount]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  const activeOffers = offers.filter(o => o.isActive);
  const latestOffer = activeOffers[activeOffers.length - 1];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <Card className="w-80 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">New Offer Available!</h4>
                <p className="text-sm text-green-700">
                  {latestOffer?.title || 'A new offer has been added'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {latestOffer?.discount}% OFF
                  </Badge>
                  {latestOffer?.validUntil && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Limited Time
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferNotification;
