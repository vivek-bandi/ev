import React from 'react';
import { Button } from '@/components/ui/button';
import { useSavedVehicles } from '@/contexts/SavedVehiclesContext';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface SaveButtonProps {
  vehicleId: string;
  vehicleData?: any;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showText?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  vehicleId, 
  vehicleData, 
  variant = 'outline', 
  size = 'sm',
  className = '',
  showText = false
}) => {
  const { isSaved, toggleSave } = useSavedVehicles();
  const saved = isSaved(vehicleId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking save button
    toggleSave(vehicleId, vehicleData);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`${saved ? 'text-primary border-primary bg-primary/10' : ''} ${className}`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          {showText && <span className="ml-2">Saved</span>}
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          {showText && <span className="ml-2">Save</span>}
        </>
      )}
    </Button>
  );
};

export default SaveButton;
