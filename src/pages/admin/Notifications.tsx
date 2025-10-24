import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, Shield, Database, Server } from 'lucide-react';

const Notifications = () => {
  const notifications: any[] = [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <Bell className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'urgent':
        return <Bell className="h-4 w-4 text-red-500" />;
      case 'success':
        return <Bell className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-500">Warning</Badge>;
      case 'info':
        return <Badge variant="default" className="bg-blue-500">Info</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          <p className="text-muted-foreground mt-1">System alerts and important updates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Mark All Read</Button>
          <Button variant="outline" size="sm">Clear All</Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'urgent').length}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'success').length}</p>
                <p className="text-sm text-muted-foreground">Success</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest system alerts and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Notifications</h3>
                <p className="text-muted-foreground">You're all caught up! No new notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    notification.read ? 'bg-muted/30' : 'bg-background border-primary/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.type)}
                          <span className="text-sm text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">SMS Alerts</h4>
                <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
