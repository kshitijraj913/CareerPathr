import { Response } from 'express';
import Reminder from '../models/Reminder';
import { AuthRequest } from '../middleware/auth';

export const getReminders = async (req: AuthRequest, res: Response) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markReminderRead = async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' });
      return;
    }
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const generateReminders = async (req: AuthRequest, res: Response) => {
  try {
    const Goal = (await import('../models/Goal')).default;
    const Task = (await import('../models/Task')).default;
    const Milestone = (await import('../models/Milestone')).default;

    await Reminder.deleteMany({ userId: req.userId });

    const goals = await Goal.find({ userId: req.userId, status: { $ne: 'Completed' } });
    const today = new Date();
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    const reminders: any[] = [];

    // Tasks due today
    const tasksDueToday = await Task.find({ userId: req.userId, dueDate: { $lte: threeDaysLater }, status: { $ne: 'Completed' } });
    if (tasksDueToday.length > 0) {
      reminders.push({
        userId: req.userId,
        title: 'Tasks Due Soon',
        message: `You have ${tasksDueToday.length} task(s) due in the next 3 days.`,
        dueDate: today,
      });
    }

    // Milestones due soon
    const milestonesDueSoon = await Milestone.find({ userId: req.userId, deadline: { $lte: threeDaysLater }, status: { $ne: 'Completed' } });
    for (const ms of milestonesDueSoon) {
      reminders.push({
        userId: req.userId,
        title: 'Milestone Due Soon',
        message: `"${ms.title}" milestone is due soon.`,
        dueDate: ms.deadline,
      });
    }

    // Goal progress
    for (const goal of goals) {
      if (goal.progress >= 70) {
        reminders.push({
          userId: req.userId,
          title: 'Goal Almost Complete',
          message: `Your "${goal.title}" goal is ${goal.progress}% complete. Keep going!`,
          dueDate: today,
        });
      }
    }

    const created = await Reminder.insertMany(reminders);
    res.json(created);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
