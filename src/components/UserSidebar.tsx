import React from 'react';
import { 
  Home, 
  Car, 
  Tag, 
  Users, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock,
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'vehicles', label: 'All Vehicles', icon: Car },
  { id: 'offers', label: 'Special Offers', icon: Tag },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
  { id: 'test-drive', label: 'Book Test Drive', icon: Car },
];

const UserSidebar = ({ activeSection, onSectionChange }: UserSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/').pop() || 'home';
  
  const handleNavigation = (section: string) => {
    navigate(`/user/${section}`);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
  <aside className="hidden md:flex flex-col w-64 bg-card border-r h-screen sticky top-0 z-30">
      <div className="flex flex-col h-full">
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Need Help?</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Contact our support team</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-3 w-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3" />
                <span>123 Green Street</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>Mon-Fri 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { UserSidebar };
