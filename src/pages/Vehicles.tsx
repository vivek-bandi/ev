import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '@/contexts/VehicleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelperBot } from '@/components/HelperBot';
import OfferBanner from '@/components/OfferBanner';
import { Battery, Zap, Gauge, Clock, Shield, Star } from 'lucide-react';

const Vehicles = () => {
  const navigate = useNavigate();
  const { vehicles, offers } = useVehicles();
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});

  const getVehicleOffer = (vehicleId: string) => {
    return offers.find((offer) => offer.vehicleId === vehicleId && offer.isActive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Electric Vehicles
              </h1>
              <p className="text-muted-foreground mt-1">Explore our eco-friendly vehicle collection</p>
            </div>
            <Button onClick={() => navigate('/admin')} variant="outline" className="gap-2 hover:scale-105 transition-transform">
              <Shield className="h-4 w-4" />
              Admin Panel
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">All Vehicles</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {vehicles.length} Available
              </Badge>
            </div>
          </div>
          
          {vehicles.length === 0 ? (
            <Card className="shadow-xl animate-scale-in">
              <CardContent className="py-16 text-center">
                <div className="mb-4">
                  <Car className="h-20 w-20 mx-auto text-muted-foreground/50" />
                </div>
                <p className="text-xl text-muted-foreground mb-4">No vehicles available yet</p>
                <p className="text-sm text-muted-foreground mb-6">Check back soon for our latest electric vehicles!</p>
                <Button onClick={() => navigate('/admin')} className="gap-2">
                  <Shield className="h-4 w-4" />
                  Add Vehicles (Admin)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle, index) => {
                const offer = getVehicleOffer(vehicle._id);
                const finalPrice = offer
                  ? (vehicle.price * (100 - offer.discount)) / 100
                  : vehicle.price;

                // Get primary image from colorImages or fallback to general images
                const getPrimaryImage = () => {
                  const firstColorImages = vehicle.colorImages?.[0];
                  return firstColorImages?.primaryImage || firstColorImages?.images?.[0] || vehicle.images?.[0];
                };
                const primaryImage = getPrimaryImage();

                return (
                  <Card 
                    key={vehicle._id} 
                    className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up overflow-hidden cursor-pointer"
                     style={{ animationDelay: `${index * 100}ms` }}
                     onClick={() => navigate(`/user/vehicle/${vehicle._id}`)}
                  >
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {vehicle.name}
                          </CardTitle>
                          <CardDescription className="text-base font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {vehicle.brand}
                          </CardDescription>
                        </div>
                        {offer && (
                          <Badge 
                            variant="destructive" 
                            className="text-lg px-3 py-1 animate-float shadow-lg"
                          >
                            -{offer.discount}%
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    {/* Vehicle Image */}
                    <div className="px-6 pb-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={vehicle.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <>
                            <Car className="h-16 w-16 mx-auto mt-8 text-muted-foreground" />
                            <div className="absolute inset-0 flex items-center justify-center bg-muted" style={{ display: 'none' }}>
                              <Car className="h-16 w-16 text-muted-foreground" />
                            </div>
                          </>
                        )}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="text-center">
                            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No image available</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        {vehicle.chargingTime && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:shadow-md transition-shadow">
                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Charging</p>
                              <p className="text-sm font-bold">{vehicle.chargingTime}</p>
                            </div>
                          </div>
                        )}
                        
                        {vehicle.range && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:shadow-md transition-shadow">
                            <Gauge className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Range</p>
                              <p className="text-sm font-bold">{vehicle.range}</p>
                            </div>
                          </div>
                        )}
                        
                        {vehicle.battery && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:shadow-md transition-shadow">
                            <Battery className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Battery</p>
                              <p className="text-sm font-bold">{vehicle.battery}</p>
                            </div>
                          </div>
                        )}
                        
                        {vehicle.topSpeed && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:shadow-md transition-shadow">
                            <Zap className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">Top Speed</p>
                              <p className="text-sm font-bold">{vehicle.topSpeed}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {vehicle.colors && vehicle.colors.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-3">Available Colors</p>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() =>
                                  setSelectedColors({
                                    ...selectedColors,
                                    [vehicle._id]: color,
                                  })
                                }
                                className={`px-4 py-2 rounded-full text-xs font-medium border-2 transition-all duration-300 ${
                                  selectedColors[vehicle._id] === color
                                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-primary shadow-lg scale-110'
                                    : 'bg-background hover:bg-muted border-gray-300 hover:scale-105'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t-2">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                            ₹{finalPrice.toLocaleString()}
                          </span>
                          {offer && (
                            <span className="text-lg text-muted-foreground line-through">
                              ₹{vehicle.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.fuelType}
                          </p>
                          {offer && (
                            <Badge variant="secondary" className="text-xs">
                              Save ₹{(vehicle.price - finalPrice).toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                      >
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <HelperBot />
    </div>
  );
};

const Car = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 17h14v-5H5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11l2-7h14l2 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="17" r="2" strokeWidth="2"/>
    <circle cx="17" cy="17" r="2" strokeWidth="2"/>
  </svg>
);

export default Vehicles;
