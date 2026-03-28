import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    caseType: { type: String, default: 'General' },
    urgencyScore: { type: Number, default: 0 },
    complexityScore: { type: Number, default: 0 },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Filed', 'Under Review', 'Hearing Scheduled', 'Judgment Pending', 'Closed'],
      default: 'Filed'
    },
    summary: { type: String, default: '' },
    tags: [{ type: String }],
    dueDate: { type: Date },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timeline: [
      {
        note: String,
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const Case = mongoose.model('Case', caseSchema);
