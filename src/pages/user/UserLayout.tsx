import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserSidebar } from '@/components/UserSidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shield, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';

const UserLayout = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Mobile drawer */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
          <div className={`fixed inset-0 bg-black/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawerOpen(false)} />
          <div className={`fixed left-0 top-0 bottom-0 w-64 bg-card border-r p-4 transform transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">EV Store</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>
            <UserSidebar />
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <UserSidebar />
      
      <main className="flex-1">
        <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                EV Vehicle Store
              </h1>
              <p className="text-sm text-muted-foreground">
                Premium Electric Vehicles for a Sustainable Future
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 rounded-md" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>

              {user ? (
                <>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/user')}>
                    <User className="h-4 w-4" />
                    {user.name || 'Account'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
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
