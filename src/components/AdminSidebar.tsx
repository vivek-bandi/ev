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
  { id: 'settings', label: 'Settings', icon: Settings },
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
    // Note: For mobile, this component is rendered inside a drawer in AdminLayout
    <aside className="flex flex-col h-full bg-card md:w-64 md:border-r md:sticky md:top-0 md:z-30">
      {/* Show logo only in desktop view since mobile has it in drawer header */}
      <div className="hidden md:block p-4 sm:p-6 border-b">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent tracking-tight">
          EV Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Management Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 group",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t md:border-t-0">
        <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg p-4 border border-primary/20">
          <p className="text-sm font-medium">Need Help?</p>
          <p className="text-xs text-muted-foreground my-2">Check our documentation</p>
          <button 
            onClick={() => navigate('/docs')} 
            className="w-full bg-primary text-primary-foreground text-sm py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
};
