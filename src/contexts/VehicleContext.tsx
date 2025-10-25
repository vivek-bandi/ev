import React, { createContext, useContext, useState, useEffect } from 'react';
import { vehicleAPI, offerAPI, achievementAPI } from '@/services/api';

export interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  price: number;
  year: number;
  fuelType: string;
  chargingTime: string;
  range: string;
  battery: string;
  topSpeed: string;
  colors: string[];
  images?: string[];
  colorImages?: Array<{
    color: string;
    images: string[];
    primaryImage?: string;
  }>;
  featured?: boolean;
  category?: string;
  inventory?: {
    stock: number;
    reserved: number;
    status: string;
  };
  specifications?: {
    acceleration?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
    chargingPort?: string;
  };
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Offer {
  _id: string;
  vehicleId: string;
  title: string;
  description: string;
  discount: number;
  validUntil?: string;
  validFrom?: string;
  type?: string;
  isActive?: boolean;
  usageCount?: number;
  maxUsage?: number;
  createdAt?: string;
  updatedAt?: string;
  vehicle?: Vehicle; // Include vehicle data
}

export interface Achievement {
  _id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  category: 'award' | 'certification' | 'milestone' | 'recognition' | 'partnership';
  icon?: string;
  image?: string;
  date: string;
  issuer?: string;
  location?: string;
  isActive: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  offers: Offer[];
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  addVehicle: (vehicle: Omit<Vehicle, '_id'>) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addOffer: (offer: Omit<Offer, '_id'>) => Promise<void>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  addAchievement: (achievement: Omit<Achievement, '_id'>) => Promise<void>;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  resetContext: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (forceRefresh = false) => {
    // Prevent multiple simultaneous requests
    if (isRefreshing && !forceRefresh) {
      return;
    }

    try {
      setIsRefreshing(true);
      setLoading(true);
      setError(null);
      
      const [vehiclesResponse, offersResponse, achievementsResponse] = await Promise.all([
        vehicleAPI.getAll({ limit: 100 }),
        offerAPI.getAll({ limit: 100 }),
        achievementAPI.getAll({ limit: 100 })
      ]);
      
      const vehiclesData = vehiclesResponse.data.vehicles || vehiclesResponse.data;
      const offersData = offersResponse.data;
      const achievementsData = achievementsResponse.data;
      
      // Enhance offers with vehicle data
      // Attach the matching vehicle object to each offer so UI components (banners, cards)
      // can easily display vehicle details/images without additional lookups.
      // Note: vehiclesData may come as an array when the backend returns { vehicles: [...] }
      const enhancedOffers = offersData.map((offer: Offer) => {
        const vehicle = vehiclesData.find((v: Vehicle) => v._id === offer.vehicleId);
        return {
          ...offer,
          vehicle: vehicle
        };
      });
      
      setVehicles(vehiclesData);
      setOffers(enhancedOffers);
      setAchievements(achievementsData);
      setLastFetchTime(Date.now());
    } catch (err: any) {
      // Improved error handling - more resilient
      if (err.response?.status === 429) {
        console.warn('Rate limited - will retry later');
        setError('Server is busy, please try again later');
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        console.warn('Network error - will retry later');
        setError('Network connection issue, will retry automatically');
      } else {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Re-enabled auto-refresh since rate limiting is now disabled
    const interval = setInterval(() => {
      const now = Date.now();
      // Only refresh if it's been more than 2 minutes since last fetch
      if (now - lastFetchTime > 120000) { // 2 minutes
        fetchData();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []); // Remove lastFetchTime dependency to prevent infinite re-renders

  const addVehicle = async (vehicle: Omit<Vehicle, '_id'>) => {
    try {
      const response = await vehicleAPI.create(vehicle);
      setVehicles((prev) => [...prev, response.data]);
      // Don't auto-refresh to avoid rate limiting
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const updateVehicle = async (id: string, vehicle: Partial<Vehicle>) => {
    try {
      const response = await vehicleAPI.update(id, vehicle);
      setVehicles((prev) => prev.map((v) => (v._id === id ? response.data : v)));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update vehicle');
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehicleAPI.delete(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const addOffer = async (offer: Omit<Offer, '_id'>) => {
    try {
      const response = await offerAPI.create(offer);
      setOffers((prev) => [...prev, response.data]);
      // Don't auto-refresh to avoid rate limiting
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add offer');
    }
  };

  const updateOffer = async (id: string, offer: Partial<Offer>) => {
    try {
      const response = await offerAPI.update(id, offer);
      setOffers((prev) => prev.map((o) => (o._id === id ? response.data : o)));
      // Don't auto-refresh to avoid rate limiting
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update offer');
    }
  };

  const deleteOffer = async (id: string) => {
    try {
      await offerAPI.delete(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete offer');
    }
  };

  const addAchievement = async (achievement: Omit<Achievement, '_id'>) => {
    try {
      const response = await achievementAPI.create(achievement);
      setAchievements((prev) => [...prev, response.data]);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to add achievement');
    }
  };

  const updateAchievement = async (id: string, achievement: Partial<Achievement>) => {
    try {
      const response = await achievementAPI.update(id, achievement);
      setAchievements((prev) => prev.map((a) => (a._id === id ? response.data : a)));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update achievement');
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      await achievementAPI.delete(id);
      setAchievements((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete achievement');
    }
  };

  const refreshData = async () => {
    await fetchData(true); // Force refresh even if already refreshing
  };

  const clearError = () => {
    setError(null);
  };

  const resetContext = () => {
    setError(null);
    setLoading(false);
    setIsRefreshing(false);
    setLastFetchTime(0);
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        offers,
        achievements,
        loading,
        error,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addOffer,
        updateOffer,
        deleteOffer,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        refreshData,
        clearError,
        resetContext,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within VehicleProvider');
  }
  return context;
};
