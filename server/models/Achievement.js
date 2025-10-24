import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  images: [{ type: String, trim: true }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

achievementSchema.index({ category: 1 });
achievementSchema.index({ featured: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
