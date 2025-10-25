import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Save, RefreshCw, Globe, Database, Shield, Bell } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteDescription: 'Premium Electric Vehicles for a Sustainable Future',
    currency: 'INR',
    timezone: 'IST',
    language: 'en',
    companyName: 'EV Solutions Inc.',
    address: '123 Green Street, Eco City, EC 12345',
    phone: '+91 (555) 123-4567',
    email: 'info@evsolutions.com',
    taxRate: '18.0',
    shippingCost: '500.00',
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    lowStockAlerts: true,
    newInquiryAlerts: true,
    offerExpiryAlerts: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    auditLogging: true
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    alert('Settings reset to defaults');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in p-4 md:p-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          System Settings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Configure your EV website settings and preferences</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Globe className="h-4 w-4 md:h-5 md:w-5" />
            General Settings
          </CardTitle>
          <CardDescription className="text-sm">Basic website configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="siteDescription" className="text-sm font-medium">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              rows={3}
              placeholder="Enter site description"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone" className="text-sm font-medium">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => handleInputChange('timezone', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IST">Indian Standard Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleInputChange('language', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Database className="h-4 w-4 md:h-5 md:w-5" />
            Business Settings
          </CardTitle>
          <CardDescription className="text-sm">Company information and business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="text-sm font-medium">Business Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
              placeholder="Enter business address"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Business Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter business email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="taxRate" className="text-sm font-medium">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                placeholder="Enter tax rate"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="shippingCost" className="text-sm font-medium">Shipping Cost (₹)</Label>
            <Input
              id="shippingCost"
              type="number"
              value={settings.shippingCost}
              onChange={(e) => handleInputChange('shippingCost', e.target.value)}
              placeholder="Enter shipping cost"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription className="text-sm">Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                onClick={() => handleInputChange('emailNotifications', !settings.emailNotifications)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="pushNotifications" className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Button
                variant={settings.pushNotifications ? "default" : "outline"}
                onClick={() => handleInputChange('pushNotifications', !settings.pushNotifications)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.pushNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="smsAlerts" className="text-sm font-medium">SMS Alerts</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Receive critical alerts via SMS</p>
              </div>
              <Button
                variant={settings.smsAlerts ? "default" : "outline"}
                onClick={() => handleInputChange('smsAlerts', !settings.smsAlerts)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.smsAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="lowStockAlerts" className="text-sm font-medium">Low Stock Alerts</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Get notified when inventory is low</p>
              </div>
              <Button
                variant={settings.lowStockAlerts ? "default" : "outline"}
                onClick={() => handleInputChange('lowStockAlerts', !settings.lowStockAlerts)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.lowStockAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Shield className="h-4 w-4 md:h-5 md:w-5" />
            Security Settings
          </CardTitle>
          <CardDescription className="text-sm">Configure security and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="twoFactorAuth" className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Require 2FA for admin access</p>
              </div>
              <Button
                variant={settings.twoFactorAuth ? "default" : "outline"}
                onClick={() => handleInputChange('twoFactorAuth', !settings.twoFactorAuth)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout" className="text-sm font-medium">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  placeholder="Enter timeout in minutes"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="passwordPolicy" className="text-sm font-medium">Password Policy</Label>
                <Select 
                  value={settings.passwordPolicy} 
                  onValueChange={(value) => handleInputChange('passwordPolicy', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="strong">Strong</SelectItem>
                    <SelectItem value="very-strong">Very Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg gap-3">
              <div className="flex-1">
                <Label htmlFor="auditLogging" className="text-sm font-medium">Audit Logging</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Log all admin activities</p>
              </div>
              <Button
                variant={settings.auditLogging ? "default" : "outline"}
                onClick={() => handleInputChange('auditLogging', !settings.auditLogging)}
                className="w-full sm:w-auto text-xs md:text-sm"
              >
                {settings.auditLogging ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Database className="h-4 w-4 md:h-5 md:w-5" />
            System Information
          </CardTitle>
          <CardDescription className="text-sm">Current system status and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Application Version</h4>
              <p className="text-xs md:text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div className="p-3 md:p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Last Updated</h4>
              <p className="text-xs md:text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="p-3 md:p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Database Status</h4>
              <p className="text-xs md:text-sm text-green-600">Connected</p>
            </div>
            <div className="p-3 md:p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">Server Status</h4>
              <p className="text-xs md:text-sm text-green-600">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
        <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto text-sm md:text-base">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto text-sm md:text-base">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Settings;