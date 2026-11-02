import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Goal from '../models/Goal';
import Milestone from '../models/Milestone';
import Task from '../models/Task';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set. Add it to server/.env');
    process.exit(1);
  }

  const isAtlas = uri.includes('mongodb+srv');
  console.log(`Connecting to ${isAtlas ? 'MongoDB Atlas' : 'local MongoDB'}...`);

  await mongoose.connect(uri);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

  await User.deleteMany({});
  await Goal.deleteMany({});
  await Milestone.deleteMany({});
  await Task.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Demo@123', salt);

  const user = await User.create({
    name: 'Demo Student',
    email: 'demo@careerpathr.com',
    password: hashedPassword,
    profile: {
      college: 'Demo Engineering College',
      degree: 'B.Tech',
      branch: 'Computer Science',
      graduationYear: '2027',
      careerInterest: 'Full Stack Development',
      skills: ['HTML', 'CSS', 'JavaScript', 'Python'],
      shortTermGoal: 'Complete React and Node.js courses',
      longTermGoal: 'Become a Full Stack Developer at a top tech company',
    },
  });

  const goal1 = await Goal.create({
    userId: user._id,
    title: 'Become a Full Stack Developer',
    description: 'Master both frontend and backend technologies to become a proficient full stack developer.',
    category: 'Coding',
    priority: 'High',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2026-06-30'),
    status: 'In Progress',
    progress: 33,
  });

  const goal2 = await Goal.create({
    userId: user._id,
    title: 'Prepare for Campus Placements',
    description: 'Prepare for campus placement season with DSA, aptitude, and interview skills.',
    category: 'Placement',
    priority: 'High',
    startDate: new Date('2025-06-01'),
    targetDate: new Date('2026-12-31'),
    status: 'In Progress',
    progress: 20,
  });

  const goal3 = await Goal.create({
    userId: user._id,
    title: 'Learn Data Structures and Algorithms',
    description: 'Master DSA to ace coding interviews and competitive programming.',
    category: 'Skills',
    priority: 'High',
    startDate: new Date('2025-01-01'),
    targetDate: new Date('2026-03-31'),
    status: 'In Progress',
    progress: 25,
  });

  // Milestones for Goal 1
  const ms1 = await Milestone.create({ goalId: goal1._id, userId: user._id, title: 'Learn HTML & CSS', description: 'Master semantic HTML and CSS layout', deadline: new Date('2025-02-28'), status: 'Completed', progress: 100 });
  const ms2 = await Milestone.create({ goalId: goal1._id, userId: user._id, title: 'Learn JavaScript', description: 'Master ES6+ and async programming', deadline: new Date('2025-04-30'), status: 'In Progress', progress: 60 });
  const ms3 = await Milestone.create({ goalId: goal1._id, userId: user._id, title: 'Learn React', description: 'Build dynamic UIs with React', deadline: new Date('2025-07-31'), status: 'Not Started', progress: 0 });
  const ms4 = await Milestone.create({ goalId: goal1._id, userId: user._id, title: 'Learn Backend (Node.js & Express)', description: 'Build REST APIs and connect to databases', deadline: new Date('2025-10-31'), status: 'Not Started', progress: 0 });

  // Milestones for Goal 2
  const ms5 = await Milestone.create({ goalId: goal2._id, userId: user._id, title: 'DSA Preparation', description: 'Solve 200+ LeetCode problems', deadline: new Date('2026-06-30'), status: 'In Progress', progress: 20 });
  const ms6 = await Milestone.create({ goalId: goal2._id, userId: user._id, title: 'Aptitude Practice', description: 'Practice quantitative and logical reasoning', deadline: new Date('2026-09-30'), status: 'Not Started', progress: 0 });

  // Tasks for ms2 (JS milestone)
  await Task.create({ userId: user._id, goalId: goal1._id, milestoneId: ms2._id, title: 'Complete JavaScript fundamentals on freeCodeCamp', dueDate: new Date('2025-03-15'), priority: 'High', status: 'Completed' });
  await Task.create({ userId: user._id, goalId: goal1._id, milestoneId: ms2._id, title: 'Build a calculator app', dueDate: new Date('2025-03-30'), priority: 'Medium', status: 'Completed' });
  await Task.create({ userId: user._id, goalId: goal1._id, milestoneId: ms2._id, title: 'Practice DOM manipulation exercises', dueDate: new Date('2025-04-15'), priority: 'High', status: 'In Progress' });
  await Task.create({ userId: user._id, goalId: goal1._id, milestoneId: ms2._id, title: 'Learn async/await and fetch API', dueDate: new Date('2025-04-25'), priority: 'High', status: 'Todo' });

  // Tasks for ms5 (DSA milestone)
  await Task.create({ userId: user._id, goalId: goal2._id, milestoneId: ms5._id, title: 'Solve 50 array problems on LeetCode', dueDate: new Date('2025-06-30'), priority: 'High', status: 'In Progress' });
  await Task.create({ userId: user._id, goalId: goal2._id, milestoneId: ms5._id, title: 'Solve 30 linked list problems', dueDate: new Date('2025-08-31'), priority: 'Medium', status: 'Todo' });

  // Some standalone tasks for goal 3
  await Task.create({ userId: user._id, goalId: goal3._id, title: 'Read CLRS Chapter 1-3', dueDate: new Date('2025-03-20'), priority: 'Medium', status: 'Completed' });
  await Task.create({ userId: user._id, goalId: goal3._id, title: 'Implement sorting algorithms', dueDate: new Date('2025-04-10'), priority: 'High', status: 'In Progress' });
  await Task.create({ userId: user._id, goalId: goal3._id, title: 'Practice binary search problems', dueDate: new Date('2025-04-20'), priority: 'Medium', status: 'Todo' });
  await Task.create({ userId: user._id, goalId: goal3._id, title: 'Study graph algorithms', dueDate: new Date('2025-06-01'), priority: 'High', status: 'Todo' });

  console.log('\n✓ Seed data created successfully!');
  console.log('  Demo account: demo@careerpathr.com / Demo@123');
  console.log(`  Database: ${mongoose.connection.name}`);
  await mongoose.disconnect();
  console.log('  Disconnected from MongoDB.\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
