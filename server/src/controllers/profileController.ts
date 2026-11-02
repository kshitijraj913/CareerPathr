import { Response } from 'express';
import Goal from '../models/Goal';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await (await import('../models/User')).default.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const User = (await import('../models/User')).default;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profile: req.body.profile, name: req.body.name },
      { new: true }
    ).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.userId });
    const tasks = await Task.find({ userId: req.userId });

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const activeGoals = goals.filter(g => g.status === 'In Progress').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const todoTasks = tasks.filter(t => t.status === 'Todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

    const categoryStats: Record<string, { total: number; completed: number }> = {};
    goals.forEach(g => {
      if (!categoryStats[g.category]) categoryStats[g.category] = { total: 0, completed: 0 };
      categoryStats[g.category].total++;
      if (g.status === 'Completed') categoryStats[g.category].completed++;
    });

    const overallProgress = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals) : 0;

    res.json({
      totalGoals,
      completedGoals,
      activeGoals,
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      overallProgress,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
