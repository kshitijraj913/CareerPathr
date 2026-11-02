import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile: {
    college: string;
    degree: string;
    branch: string;
    graduationYear: string;
    careerInterest: string;
    skills: string[];
    shortTermGoal: string;
    longTermGoal: string;
  };
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
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

export default mongoose.model<IUser>('User', userSchema);
