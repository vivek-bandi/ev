import express from 'express';
import { vehicleStorage } from '../utils/dbStorage.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all vehicles with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let vehicles = await vehicleStorage.getAll();

    // Apply filters
    if (category) {
      vehicles = vehicles.filter(v => v.category === category);
    }
    if (brand) {
      vehicles = vehicles.filter(v => v.brand === brand);
    }
    if (minPrice) {
      vehicles = vehicles.filter(v => v.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      vehicles = vehicles.filter(v => v.price <= parseFloat(maxPrice));
    }
    if (featured !== undefined) {
      vehicles = vehicles.filter(v => v.featured === (featured === 'true'));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      vehicles = vehicles.filter(v => 
        v.name.toLowerCase().includes(searchLower) ||
        v.brand.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort vehicles
    vehicles.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedVehicles = vehicles.slice(startIndex, endIndex);

    res.json({
      vehicles: paginatedVehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(vehicles.length / limit),
        totalVehicles: vehicles.length,
        hasNextPage: endIndex < vehicles.length,
        hasPrevPage: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await vehicleStorage.getById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
});

// Create new vehicle
router.post('/', verifyToken, requireRole('admin'), [
  body('name').notEmpty().withMessage('Vehicle name is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 2 }).withMessage('Invalid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicleData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      featured: req.body.featured !== undefined ? req.body.featured : false,
      inventory: req.body.inventory || {
        stock: 0,
        reserved: 0,
        status: 'available'
      }
    };

    const vehicle = await vehicleStorage.create(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
});

// Update vehicle
router.put('/:id', verifyToken, requireRole('admin'), [
  body('name').optional().notEmpty().withMessage('Vehicle name cannot be empty'),
  body('brand').optional().notEmpty().withMessage('Brand cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 2 }).withMessage('Invalid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await vehicleStorage.update(req.params.id, req.body);
    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
});

// Delete vehicle
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await vehicleStorage.delete(req.params.id);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
});

// Update vehicle inventory
router.patch('/:id/inventory', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { stock, reserved, status } = req.body;
    const inventoryData = { inventory: { stock, reserved, status } };
    
    const vehicle = await vehicleStorage.update(req.params.id, inventoryData);
    res.json(vehicle);
  } catch (error) {
    console.error('Error updating vehicle inventory:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: 'Error updating vehicle inventory', error: error.message });
  }
});

// Get vehicle statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const vehicles = await vehicleStorage.getAll();
    
    const stats = {
      total: vehicles.length,
      active: vehicles.filter(v => v.isActive).length,
      featured: vehicles.filter(v => v.featured).length,
      categories: {},
      brands: {},
      totalValue: vehicles.reduce((sum, v) => sum + (v.price || 0), 0),
      averagePrice: vehicles.length > 0 ? vehicles.reduce((sum, v) => sum + (v.price || 0), 0) / vehicles.length : 0
    };

    // Count by category
    vehicles.forEach(v => {
      stats.categories[v.category] = (stats.categories[v.category] || 0) + 1;
      stats.brands[v.brand] = (stats.brands[v.brand] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    res.status(500).json({ message: 'Error fetching vehicle stats', error: error.message });
  }
});

export default router;