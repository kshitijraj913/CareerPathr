import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  priority: string;
  startDate: Date;
  targetDate: Date;
  status: string;
  progress: number;
  createdAt: Date;
}

const goalSchema = new Schema<IGoal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Personal', enum: ['Career', 'Academic', 'Coding', 'Internship', 'Placement', 'Skills', 'Personal'] },
  priority: { type: String, default: 'Medium', enum: ['Low', 'Medium', 'High'] },
  startDate: { type: Date, default: Date.now },
  targetDate: { type: Date },
  status: { type: String, default: 'Not Started', enum: ['Not Started', 'In Progress', 'Completed'] },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGoal>('Goal', goalSchema);
