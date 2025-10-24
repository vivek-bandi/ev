import express from 'express';
import { vehicleStorage, offerStorage, customerStorage, inquiryStorage } from '../utils/dbStorage.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const [vehicles, offers, customers, inquiries] = await Promise.all([
      vehicleStorage.getAll(),
      offerStorage.getAll(),
      customerStorage.getAll(),
      inquiryStorage.getAll()
    ]);

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const analytics = {
      overview: {
        totalVehicles: vehicles.length,
        activeOffers: offers.filter(o => o.isActive && (!o.validUntil || new Date(o.validUntil) > now)).length,
        totalCustomers: customers.length,
        newInquiries: inquiries.filter(i => i.status === 'new').length
      },
      vehicles: {
        total: vehicles.length,
        active: vehicles.filter(v => v.isActive).length,
        featured: vehicles.filter(v => v.featured).length,
        totalValue: vehicles.reduce((sum, v) => sum + (v.price || 0), 0),
        averagePrice: vehicles.length > 0 ? vehicles.reduce((sum, v) => sum + (v.price || 0), 0) / vehicles.length : 0
      },
      offers: {
        total: offers.length,
        active: offers.filter(o => o.isActive).length,
        expired: offers.filter(o => o.validUntil && new Date(o.validUntil) < now).length,
        averageDiscount: offers.length > 0 ? offers.reduce((sum, o) => sum + (o.discount || 0), 0) / offers.length : 0
      },
      customers: {
        total: customers.length,
        totalPurchases: customers.reduce((sum, c) => sum + (c.purchases?.length || 0), 0),
        totalTestDrives: customers.reduce((sum, c) => sum + (c.testDrives?.length || 0), 0)
      },
      inquiries: {
        total: inquiries.length,
        new: inquiries.filter(i => i.status === 'new').length,
        assigned: inquiries.filter(i => i.status === 'assigned').length,
        responded: inquiries.filter(i => i.status === 'responded').length,
        closed: inquiries.filter(i => i.status === 'closed').length
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics', error: error.message });
  }
});

// Get sales analytics
router.get('/sales', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const customers = await customerStorage.getAll();
    
    // Calculate sales data based on customer purchases
    const salesData = customers.reduce((acc, customer) => {
      const purchases = customer.purchases || [];
      purchases.forEach(purchase => {
        const date = new Date(purchase.purchaseDate);
        const key = period === 'month' ? `${date.getFullYear()}-${date.getMonth() + 1}` : 
                   period === 'year' ? date.getFullYear().toString() : 
                   `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        if (!acc[key]) {
          acc[key] = { date: key, sales: 0, count: 0 };
        }
        acc[key].sales += purchase.amount || 0;
        acc[key].count += 1;
      });
      return acc;
    }, {});

    const sales = Object.values(salesData).sort((a, b) => a.date.localeCompare(b.date));

    res.json(sales);
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ message: 'Error fetching sales analytics', error: error.message });
  }
});

// Get inventory analytics
router.get('/inventory', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const vehicles = await vehicleStorage.getAll();
    
    const inventory = {
      totalStock: vehicles.reduce((sum, v) => sum + (v.inventory?.stock || 0), 0),
      totalReserved: vehicles.reduce((sum, v) => sum + (v.inventory?.reserved || 0), 0),
      available: vehicles.reduce((sum, v) => sum + ((v.inventory?.stock || 0) - (v.inventory?.reserved || 0)), 0),
      lowStock: vehicles.filter(v => (v.inventory?.stock || 0) < 5).length,
      outOfStock: vehicles.filter(v => (v.inventory?.stock || 0) === 0).length,
      byCategory: {},
      byBrand: {}
    };

    // Group by category and brand
    vehicles.forEach(vehicle => {
      const category = vehicle.category || 'Unknown';
      const brand = vehicle.brand || 'Unknown';
      
      inventory.byCategory[category] = (inventory.byCategory[category] || 0) + (vehicle.inventory?.stock || 0);
      inventory.byBrand[brand] = (inventory.byBrand[brand] || 0) + (vehicle.inventory?.stock || 0);
    });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    res.status(500).json({ message: 'Error fetching inventory analytics', error: error.message });
  }
});

// Get customer analytics
router.get('/customers', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const customers = await customerStorage.getAll();
    
    const customerAnalytics = {
      total: customers.length,
      withPurchases: customers.filter(c => c.purchases && c.purchases.length > 0).length,
      withTestDrives: customers.filter(c => c.testDrives && c.testDrives.length > 0).length,
      averagePurchases: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.purchases?.length || 0), 0) / customers.length : 0,
      topCustomers: customers
        .filter(c => c.purchases && c.purchases.length > 0)
        .sort((a, b) => (b.purchases?.length || 0) - (a.purchases?.length || 0))
        .slice(0, 10)
        .map(c => ({
          name: `${c.firstName} ${c.lastName}`,
          email: c.email,
          purchases: c.purchases?.length || 0,
          totalSpent: c.purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
        }))
    };

    res.json(customerAnalytics);
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({ message: 'Error fetching customer analytics', error: error.message });
  }
});

export default router;