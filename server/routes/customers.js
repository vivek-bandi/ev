import express from 'express';
import { customerStorage } from '../utils/dbStorage.js';
import { body, validationResult } from 'express-validator';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customerStorage.getAll();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await customerStorage.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
});

// Create new customer
router.post('/', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customer = await customerStorage.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
});

// Update customer
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const customer = await customerStorage.update(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
});

// Delete customer
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await customerStorage.delete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
});

// Add purchase to customer
router.post('/:id/purchases', async (req, res) => {
  try {
    const customer = await customerStorage.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const purchase = {
      ...req.body,
      purchaseDate: new Date().toISOString()
    };

    const purchases = customer.purchases || [];
    purchases.push(purchase);

    const updatedCustomer = await customerStorage.update(req.params.id, {
      purchases: purchases
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({ message: 'Error adding purchase', error: error.message });
  }
});

// Schedule test drive
router.post('/:id/test-drives', async (req, res) => {
  try {
    const customer = await customerStorage.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const testDrive = {
      ...req.body,
      scheduledDate: req.body.scheduledDate || new Date().toISOString(),
      status: 'scheduled'
    };

    const testDrives = customer.testDrives || [];
    testDrives.push(testDrive);

    const updatedCustomer = await customerStorage.update(req.params.id, {
      testDrives: testDrives
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error scheduling test drive:', error);
    res.status(500).json({ message: 'Error scheduling test drive', error: error.message });
  }
});

// Update test drive status
router.patch('/:id/test-drives/:testDriveId', async (req, res) => {
  try {
    const customer = await customerStorage.getById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const testDrives = customer.testDrives || [];
    const testDriveIndex = testDrives.findIndex(td => td._id === req.params.testDriveId);
    
    if (testDriveIndex === -1) {
      return res.status(404).json({ message: 'Test drive not found' });
    }

    testDrives[testDriveIndex].status = req.body.status;
    testDrives[testDriveIndex].updatedAt = new Date().toISOString();

    const updatedCustomer = await customerStorage.update(req.params.id, {
      testDrives: testDrives
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating test drive status:', error);
    res.status(500).json({ message: 'Error updating test drive status', error: error.message });
  }
});

// Get customer statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const customers = await customerStorage.getAll();
    
    const stats = {
      total: customers.length,
      totalPurchases: customers.reduce((sum, c) => sum + (c.purchases?.length || 0), 0),
      totalTestDrives: customers.reduce((sum, c) => sum + (c.testDrives?.length || 0), 0),
      averagePurchases: customers.length > 0 ? customers.reduce((sum, c) => sum + (c.purchases?.length || 0), 0) / customers.length : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ message: 'Error fetching customer stats', error: error.message });
  }
});

export default router;