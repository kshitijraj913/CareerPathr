import { Response } from 'express';
import Goal from '../models/Goal';
import Milestone from '../models/Milestone';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGoalById = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.userId });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    await Milestone.deleteMany({ goalId: req.params.id, userId: req.userId });
    await Task.deleteMany({ goalId: req.params.id, userId: req.userId });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMilestones = async (req: AuthRequest, res: Response) => {
  try {
    const milestones = await Milestone.find({ goalId: req.params.goalId, userId: req.userId }).sort({ deadline: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMilestone = async (req: AuthRequest, res: Response) => {
  try {
    const milestone = await Milestone.create({ ...req.body, goalId: req.params.goalId, userId: req.userId });
    await updateGoalProgress(req.params.goalId, req.userId!);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateMilestone = async (req: AuthRequest, res: Response) => {
  try {
    const milestone = await Milestone.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!milestone) {
      res.status(404).json({ message: 'Milestone not found' });
      return;
    }
    await updateGoalProgress(milestone.goalId.toString(), req.userId!);
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMilestone = async (req: AuthRequest, res: Response) => {
  try {
    const milestone = await Milestone.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!milestone) {
      res.status(404).json({ message: 'Milestone not found' });
      return;
    }
    await Task.deleteMany({ milestoneId: req.params.id, userId: req.userId });
    await updateGoalProgress(milestone.goalId.toString(), req.userId!);
    res.json({ message: 'Milestone deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGoalProgress = async (goalId: string, userId: string) => {
  const milestones = await Milestone.find({ goalId, userId });
  if (milestones.length === 0) return;
  
  const completedCount = milestones.filter(m => m.status === 'Completed').length;
  const progress = Math.round((completedCount / milestones.length) * 100);
  
  await Goal.findByIdAndUpdate(goalId, { progress });
};
