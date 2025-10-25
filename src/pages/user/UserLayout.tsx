import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from '@/components/UserSidebar';
import { useState } from 'react';
import { Menu, X, Home, Car, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shield, Search, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'vehicles', label: 'All Vehicles', icon: Car },
  { id: 'offers', label: 'Special Offers', icon: Tag },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
  { id: 'test-drive', label: 'Book Test Drive', icon: Car },
];

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Mobile drawer */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
          <div className={`fixed inset-0 bg-black/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawerOpen(false)} />
          <div className={`fixed left-0 top-0 bottom-0 w-64 bg-card border-r transform transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-md ml-auto">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col justify-between h-full">
                <div className="p-4">
                  {user ? (
                    <div className="flex flex-col gap-2 mb-4">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => { navigate('/user/home'); setDrawerOpen(false); }}>
                        <User className="h-4 w-4" />
                        {user.name || 'Account'}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { logout(); navigate('/'); setDrawerOpen(false); }}>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mb-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate('/login'); setDrawerOpen(false); }}>
                        Login
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate('/register'); setDrawerOpen(false); }}>
                        Sign up
                      </Button>
                    </div>
                  )}
                  <div className="border-b mb-4"></div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.split('/').pop() === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigate(`/user/${item.id}`);
                            setDrawerOpen(false);
                          }}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <UserSidebar />
      
      <main className="flex-1">
        <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>

              {user ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/user/home')}>
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name || 'Account'}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/login')}>Login</Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/register')}>Sign up</Button>
                </>
              )}

              {user && user.role === 'admin' && (
                <Button onClick={() => navigate('/admin')} variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
