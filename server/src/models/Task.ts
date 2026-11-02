import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  goalId: mongoose.Types.ObjectId;
  milestoneId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  status: string;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  milestoneId: { type: Schema.Types.ObjectId, ref: 'Milestone', default: null },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate: { type: Date },
  priority: { type: String, default: 'Medium', enum: ['Low', 'Medium', 'High'] },
  status: { type: String, default: 'Todo', enum: ['Todo', 'In Progress', 'Completed'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>('Task', taskSchema);
