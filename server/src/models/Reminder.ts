import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  dueDate: Date;
  isRead: boolean;
}

const reminderSchema = new Schema<IReminder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  dueDate: { type: Date },
  isRead: { type: Boolean, default: false },
});

export default mongoose.model<IReminder>('Reminder', reminderSchema);
