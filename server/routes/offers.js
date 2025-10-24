import express from 'express';
import { offerStorage, vehicleStorage } from '../utils/dbStorage.js';
import { body, validationResult } from 'express-validator';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all offers
router.get('/', async (req, res) => {
  try {
    const { limit = 100, active } = req.query;
    let offers = await offerStorage.getAll();

    // Filter active offers if requested
    if (active === 'true') {
      const now = new Date();
      offers = offers.filter(offer => {
        if (!offer.isActive) return false;
        if (!offer.validUntil) return true;
        return new Date(offer.validUntil) > now;
      });
    }

    // Sort by creation date (newest first)
    offers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply limit
    if (limit) {
      offers = offers.slice(0, parseInt(limit));
    }

    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Error fetching offers', error: error.message });
  }
});

// Get offer by ID
router.get('/:id', async (req, res) => {
  try {
    const offer = await offerStorage.getById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Error fetching offer', error: error.message });
  }
});

// Create new offer
router.post('/', verifyToken, requireRole('admin'), [
  body('title').notEmpty().withMessage('Offer title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('discount').isNumeric().withMessage('Discount must be a number'),
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if vehicle exists
    const vehicle = await vehicleStorage.getById(req.body.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const offerData = {
      ...req.body,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      validFrom: req.body.validFrom || new Date().toISOString(),
      validUntil: req.body.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    const offer = await offerStorage.create(offerData);
    res.status(201).json(offer);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
});

// Update offer
router.put('/:id', verifyToken, requireRole('admin'), [
  body('title').optional().notEmpty().withMessage('Offer title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('discount').optional().isNumeric().withMessage('Discount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const offer = await offerStorage.update(req.params.id, req.body);
    res.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(500).json({ message: 'Error updating offer', error: error.message });
  }
});

// Delete offer
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await offerStorage.delete(req.params.id);
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.status(500).json({ message: 'Error deleting offer', error: error.message });
  }
});

// Toggle offer active status
router.patch('/:id/toggle', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const offer = await offerStorage.getById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const updatedOffer = await offerStorage.update(req.params.id, {
      isActive: !offer.isActive
    });

    res.json(updatedOffer);
  } catch (error) {
    console.error('Error toggling offer:', error);
    res.status(500).json({ message: 'Error toggling offer', error: error.message });
  }
});

// Get active offers for a specific vehicle
router.get('/vehicle/:vehicleId/active', async (req, res) => {
  try {
    const offers = await offerStorage.find({
      vehicleId: req.params.vehicleId,
      isActive: true
    });

    // Filter by validity date
    const now = new Date();
    const activeOffers = offers.filter(offer => {
      if (!offer.validUntil) return true;
      return new Date(offer.validUntil) > now;
    });

    res.json(activeOffers);
  } catch (error) {
    console.error('Error fetching active offers for vehicle:', error);
    res.status(500).json({ message: 'Error fetching active offers', error: error.message });
  }
});

// Get offer statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const offers = await offerStorage.getAll();
    const now = new Date();
    
    const stats = {
      total: offers.length,
      active: offers.filter(o => o.isActive).length,
      expired: offers.filter(o => o.validUntil && new Date(o.validUntil) < now).length,
      averageDiscount: offers.length > 0 ? offers.reduce((sum, o) => sum + (o.discount || 0), 0) / offers.length : 0,
      totalSavings: offers.reduce((sum, o) => {
        const vehicle = offers.find(v => v._id === o.vehicleId);
        return sum + ((vehicle?.price || 0) * (o.discount || 0) / 100);
      }, 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching offer stats:', error);
    res.status(500).json({ message: 'Error fetching offer stats', error: error.message });
  }
});

export default router;