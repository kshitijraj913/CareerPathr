export interface User {
  _id: string;
  name: string;
  email: string;
  profile: UserProfile;
  createdAt: string;
}

export interface UserProfile {
  college: string;
  degree: string;
  branch: string;
  graduationYear: string;
  careerInterest: string;
  skills: string[];
  shortTermGoal: string;
  longTermGoal: string;
}

export interface Goal {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  startDate: string;
  targetDate: string;
  status: string;
  progress: number;
  createdAt: string;
}

export interface Milestone {
  _id: string;
  goalId: string;
  userId: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  progress: number;
}

export interface Task {
  _id: string;
  userId: string;
  goalId: string;
  milestoneId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface Reminder {
  _id: string;
  userId: string;
  title: string;
  message: string;
  dueDate: string;
  isRead: boolean;
}

export interface AnalyticsData {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  overallProgress: number;
  categoryStats: Record<string, { total: number; completed: number }>;
}

export interface AuthResponse {
  token: string;
  user: { _id: string; name: string; email: string };
}
