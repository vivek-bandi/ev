import express from 'express';
import { achievementStorage } from '../utils/dbStorage.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/achievements - Get all achievements
router.get('/', async (req, res) => {
  try {
    const { limit = 100, category, featured } = req.query;
    let achievements = await achievementStorage.getAll();

    // Filter by category if provided
    if (category && category !== 'all') {
      achievements = achievements.filter(a => a.category === category);
    }

    // Filter by featured if provided
    if (featured === 'true') {
      achievements = achievements.filter(a => a.featured === true);
    }

    // Apply limit
    if (limit) {
      achievements = achievements.slice(0, parseInt(limit));
    }

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// GET /api/achievements/:id - Get single achievement
router.get('/:id', async (req, res) => {
  try {
    const achievement = await achievementStorage.getById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ message: 'Failed to fetch achievement' });
  }
});

// POST /api/achievements - Create new achievement
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const achievementData = {
      ...req.body,
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const achievement = await achievementStorage.create(achievementData);
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ message: 'Failed to create achievement' });
  }
});

// PUT /api/achievements/:id - Update achievement
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const achievementData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const achievement = await achievementStorage.update(req.params.id, achievementData);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ message: 'Failed to update achievement' });
  }
});

// DELETE /api/achievements/:id - Delete achievement
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const success = await achievementStorage.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ message: 'Failed to delete achievement' });
  }
});

export default router;
