import express from 'express';
import { inquiryStorage } from '../utils/dbStorage.js';
import { body, validationResult } from 'express-validator';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await inquiryStorage.getAll();
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
});

// Get inquiry by ID
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await inquiryStorage.getById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
});

// Create new inquiry
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inquiryData = {
      ...req.body,
      status: req.body.status || 'new',
      priority: req.body.priority || 'medium'
    };

    const inquiry = await inquiryStorage.create(inquiryData);
    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Error creating inquiry', error: error.message });
  }
});

// Update inquiry
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const inquiry = await inquiryStorage.update(req.params.id, req.body);
    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(500).json({ message: 'Error updating inquiry', error: error.message });
  }
});

// Add response to inquiry
router.post('/:id/responses', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const inquiry = await inquiryStorage.getById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const response = {
      ...req.body,
      responseDate: new Date().toISOString(),
      responderId: req.body.responderId || 'admin'
    };

    const responses = inquiry.responses || [];
    responses.push(response);

    const updatedInquiry = await inquiryStorage.update(req.params.id, {
      responses: responses,
      status: 'responded'
    });

    res.json(updatedInquiry);
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ message: 'Error adding response', error: error.message });
  }
});

// Assign inquiry
router.patch('/:id/assign', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const inquiry = await inquiryStorage.update(req.params.id, {
      assignedTo: req.body.assignedTo,
      status: 'assigned'
    });

    res.json(inquiry);
  } catch (error) {
    console.error('Error assigning inquiry:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(500).json({ message: 'Error assigning inquiry', error: error.message });
  }
});

// Get inquiry statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const inquiries = await inquiryStorage.getAll();
    
    const stats = {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'new').length,
      assigned: inquiries.filter(i => i.status === 'assigned').length,
      responded: inquiries.filter(i => i.status === 'responded').length,
      closed: inquiries.filter(i => i.status === 'closed').length,
      highPriority: inquiries.filter(i => i.priority === 'high').length,
      averageResponseTime: 0 // Calculate based on response times
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({ message: 'Error fetching inquiry stats', error: error.message });
  }
});

export default router;