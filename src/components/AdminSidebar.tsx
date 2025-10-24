import { 
  LayoutDashboard, 
  Car, 
  Tag, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Package,
  Bell,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'offers', label: 'Offers', icon: Tag },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'setin', label: 'Setin', icon: Settings },
];

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  
  const handleNavigation = (section: string) => {
    navigate(`/admin/${section}`);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    // sidebar: hidden on small screens, visible from md+
    <aside className="hidden md:flex md:flex-col w-64 bg-card border-r h-screen sticky top-0 z-30 animate-slide-in-left">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          EV Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Management Portal</p>
      </div>

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

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm font-medium mb-1">Need Help?</p>
          <p className="text-xs text-muted-foreground mb-3">Check our documentation</p>
          <button className="w-full bg-primary text-primary-foreground text-sm py-2 rounded-md hover:bg-primary/90 transition-colors">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
};
