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
      {/* Mobile: drawer */}
      <div className="md:hidden">
        <div className={`fixed inset-0 z-40 ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
          <div className={`fixed inset-0 bg-black/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawerOpen(false)} />
          <div className={`fixed left-0 top-0 bottom-0 w-64 bg-card border-r p-4 transform transition-transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">EV Admin</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      </div>

      {/* Desktop/sidebar */}
      <AdminSidebar />
      
      <main className="flex-1">
        <header className="bg-card/95 border-b sticky top-0 z-10 backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">EV Management Portal</h1>
              <p className="text-sm text-muted-foreground">
                Manage your EV business efficiently
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-md" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>

              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                View User Site
              </Button>

              {user ? (
                <>
                  <span className="text-sm">{user.name}</span>
                  <Button variant="ghost" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                  <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
                </>
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

export default AdminLayout;
