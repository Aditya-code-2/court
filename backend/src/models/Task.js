import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Done'], default: 'Open' },
    dueDate: { type: Date },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
