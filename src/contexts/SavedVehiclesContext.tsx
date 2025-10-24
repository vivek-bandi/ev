import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedVehicle {
  vehicleId: string;
  savedAt: string;
  vehicle?: any; // Vehicle data for quick access
}

interface SavedVehiclesContextType {
  savedVehicles: SavedVehicle[];
  isSaved: (vehicleId: string) => boolean;
  saveVehicle: (vehicleId: string, vehicleData?: any) => void;
  unsaveVehicle: (vehicleId: string) => void;
  toggleSave: (vehicleId: string, vehicleData?: any) => void;
  clearAllSaved: () => void;
}

const SavedVehiclesContext = createContext<SavedVehiclesContextType | undefined>(undefined);

export const SavedVehiclesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedVehicles, setSavedVehicles] = useState<SavedVehicle[]>([]);

  // Load saved vehicles from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedVehicles');
    if (saved) {
      try {
        setSavedVehicles(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved vehicles:', error);
        localStorage.removeItem('savedVehicles');
      }
    }
  }, []);

  // Save to localStorage whenever savedVehicles changes
  useEffect(() => {
    localStorage.setItem('savedVehicles', JSON.stringify(savedVehicles));
  }, [savedVehicles]);

  const isSaved = (vehicleId: string): boolean => {
    return savedVehicles.some(sv => sv.vehicleId === vehicleId);
  };

  const saveVehicle = (vehicleId: string, vehicleData?: any) => {
    if (!isSaved(vehicleId)) {
      const newSavedVehicle: SavedVehicle = {
        vehicleId,
        savedAt: new Date().toISOString(),
        vehicle: vehicleData
      };
      setSavedVehicles(prev => [...prev, newSavedVehicle]);
    }
  };

  const unsaveVehicle = (vehicleId: string) => {
    setSavedVehicles(prev => prev.filter(sv => sv.vehicleId !== vehicleId));
  };

  const toggleSave = (vehicleId: string, vehicleData?: any) => {
    if (isSaved(vehicleId)) {
      unsaveVehicle(vehicleId);
    } else {
      saveVehicle(vehicleId, vehicleData);
    }
  };

  const clearAllSaved = () => {
    setSavedVehicles([]);
  };

  return (
    <SavedVehiclesContext.Provider
      value={{
        savedVehicles,
        isSaved,
        saveVehicle,
        unsaveVehicle,
        toggleSave,
        clearAllSaved,
      }}
    >
      {children}
    </SavedVehiclesContext.Provider>
  );
};

export const useSavedVehicles = () => {
  const context = useContext(SavedVehiclesContext);
  if (!context) {
    throw new Error('useSavedVehicles must be used within SavedVehiclesProvider');
  }
  return context;
};
