import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link,
  Check,
  ExternalLink
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    _id: string;
    name: string;
    brand: string;
    price: number;
    year: number;
    fuelType: string;
    images?: string[];
    colorImages?: Array<{
      color: string;
      images: string[];
      primaryImage?: string;
    }>;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, vehicle }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const baseUrl = window.location.origin;
  const vehicleUrl = `${baseUrl}/user/vehicle/${vehicle._id}`;
  
  // Get vehicle image
  const getVehicleImage = () => {
    if (vehicle.colorImages && vehicle.colorImages.length > 0) {
      const firstColor = vehicle.colorImages[0];
      return firstColor.primaryImage || firstColor.images?.[0];
    }
    return vehicle.images?.[0];
  };

  const vehicleImage = getVehicleImage();

  // Generate share message
  useEffect(() => {
    const message = `Check out this amazing ${vehicle.brand} ${vehicle.name} (${vehicle.year}) - Electric Vehicle! 🚗⚡\n\nPrice: ₹${vehicle.price.toLocaleString()}\n\nView details: ${vehicleUrl}`;
    setShareMessage(message);
  }, [vehicle, vehicleUrl]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const shareViaEmail = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);
    try {
      const subject = `Check out this ${vehicle.brand} ${vehicle.name}`;
      const body = `Hi!\n\nI wanted to share this amazing electric vehicle with you:\n\n${shareMessage}\n\nBest regards!`;
      
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
      
      toast({
        title: 'Email opened',
        description: 'Your email client should open with the vehicle details',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open email client',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
    toast({
      title: 'WhatsApp opened',
      description: 'WhatsApp should open with the vehicle details',
    });
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vehicleUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    toast({
      title: 'Facebook opened',
      description: 'Facebook share dialog should open',
    });
  };

  const shareViaTwitter = () => {
    const twitterText = `Check out this amazing ${vehicle.brand} ${vehicle.name} (${vehicle.year}) - Electric Vehicle! 🚗⚡`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(vehicleUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    toast({
      title: 'Twitter opened',
      description: 'Twitter share dialog should open',
    });
  };

  const shareViaLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(vehicleUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
    toast({
      title: 'LinkedIn opened',
      description: 'LinkedIn share dialog should open',
    });
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.brand} ${vehicle.name}`,
          text: shareMessage,
          url: vehicleUrl,
        });
        toast({
          title: 'Shared!',
          description: 'Vehicle shared successfully',
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: 'Error',
            description: 'Failed to share',
            variant: 'destructive',
          });
        }
      }
    } else {
      copyToClipboard(shareMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Vehicle
          </DialogTitle>
          <DialogDescription>
            Share this amazing {vehicle.brand} {vehicle.name} with your friends and family
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {vehicleImage && (
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={vehicleImage}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{vehicle.brand} {vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.fuelType}</p>
                  <p className="text-lg font-bold text-primary">₹{vehicle.price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Message */}
          <div className="space-y-2">
            <Label htmlFor="share-message">Share Message</Label>
            <Textarea
              id="share-message"
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-3">
            <Label>Quick Share</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={shareViaNative}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Native
              </Button>
              
              <Button
                variant="outline"
                onClick={() => copyToClipboard(shareMessage)}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Text
              </Button>
              
              <Button
                variant="outline"
                onClick={() => copyToClipboard(vehicleUrl)}
                className="flex items-center gap-2"
              >
                <Link className="h-4 w-4" />
                Copy Link
              </Button>
              
              <Button
                variant="outline"
                onClick={shareViaWhatsApp}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Social Media Share */}
          <div className="space-y-3">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={shareViaFacebook}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={shareViaTwitter}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={shareViaLinkedIn}
                className="flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Email Share */}
          <div className="space-y-3">
            <Label>Share via Email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={shareViaEmail}
                disabled={isSharing || !email}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>

          {/* Direct Link */}
          <div className="space-y-2">
            <Label>Direct Link</Label>
            <div className="flex gap-2">
              <Input
                value={vehicleUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(vehicleUrl)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(vehicleUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
