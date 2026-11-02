import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = 'mongodb://localhost:27017/careerpathr_test';

// Replicate User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  profile: {
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    branch: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
    careerInterest: { type: String, default: '' },
    skills: [{ type: String }],
    shortTermGoal: { type: String, default: '' },
    longTermGoal: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    await User.deleteMany({});

    // Simulate seed
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Demo@123', salt);
    await User.create({
      name: 'Demo Student',
      email: 'demo@careerpathr.com',
      password: hashedPassword,
    });

    console.log('User created successfully');

    // Simulate first login
    let user = await User.findOne({ email: 'demo@careerpathr.com' });
    console.log('User found:', !!user);
    console.log('Password in DB:', user?.password?.substring(0, 10));
    
    let isMatch = await bcrypt.compare('Demo@123', user!.password);
    console.log('First login - password match:', isMatch);

    // Simulate what happens between logins (getMe, etc.)
    // Read user again
    user = await User.findById(user!._id).select('-password');
    console.log('\nAfter getMe (select -password), user:', JSON.stringify(user, null, 2));
    
    // Now try to find user again (simulating second login)
    user = await User.findOne({ email: 'demo@careerpathr.com' });
    console.log('\nSecond login - user found:', !!user);
    console.log('Password in DB:', user?.password?.substring(0, 10));
    
    isMatch = await bcrypt.compare('Demo@123', user!.password);
    console.log('Second login - password match:', isMatch);

    // Simulate updateProfile scenario
    const updatedUser = await User.findByIdAndUpdate(
      user!._id,
      { profile: { college: 'Test' }, name: 'Demo Student' },
      { new: true }
    );
    console.log('\nAfter updateProfile - password:', updatedUser?.password?.substring(0, 10));
    
    // Third login
    user = await User.findOne({ email: 'demo@careerpathr.com' });
    isMatch = await bcrypt.compare('Demo@123', user!.password);
    console.log('Third login - password match:', isMatch);

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (err) {
    console.error('Test failed:', err);
    await mongoose.disconnect();
  }
}

test();
