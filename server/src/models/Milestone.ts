import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  goalId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  status: string;
  progress: number;
}

const milestoneSchema = new Schema<IMilestone>({
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  deadline: { type: Date },
  status: { type: String, default: 'Not Started', enum: ['Not Started', 'In Progress', 'Completed'] },
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

export default mongoose.model<IMilestone>('Milestone', milestoneSchema);
