import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Mobile: drawer with overlay */}
      <div className="md:hidden">
        <div 
          className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!drawerOpen}
        >
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
              drawerOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className={`fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r shadow-xl transform transition-transform duration-300 ease-in-out ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold tracking-tight">EV Admin</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="p-4 overflow-y-auto">
              <AdminSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-card/95 border-b backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center min-w-0">
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden mr-2" 
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-semibold truncate">
                  EV Management Portal
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Manage your EV business efficiently
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                size="sm" 
                className="hidden sm:inline-flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>View Site</span>
              </Button>

              <Button 
                onClick={() => navigate('/')} 
                variant="ghost" 
                size="icon"
                className="sm:hidden h-8 w-8"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">View Site</span>
              </Button>

              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden sm:block truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm" 
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="hidden sm:inline-flex"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
